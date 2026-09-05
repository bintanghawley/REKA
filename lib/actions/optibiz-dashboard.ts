"use server";

import { db } from "@/lib/prisma";
import { requireAuth, getCurrentProfile } from "@/lib/auth/session";

export type OptibizDashboardData = {
  welcome: {
    username: string;
    namaUsaha: string;
    daysCount: number;
    email: string;
  };
  omzet: {
    harian: number;
    bulanIniName: string;
    bulanIniTotal: number;
    harianBreakdown: Array<{
      label: string;
      value: number;
      percentage: number;
      color: string;
    }>;
    weeklyBreakdown: Array<{
      label: string;
      value: number;
      percentage: number;
      color: string;
    }>;
    monthlyBreakdown: Array<{
      label: string;
      value: number;
      percentage: number;
      color: string;
    }>;
    yearlyBreakdown: Array<{
      label: string;
      value: number;
      percentage: number;
      color: string;
    }>;
  };
  transaksi: {
    harianCount: number;
    bulanIniName: string;
    harianLines: Array<{
      label: string;
      m1: number;
      m2: number;
      m3: number;
      m4: number;
    }>;
    weeklyLines: Array<{
      day: string;
      m1: number;
      m2: number;
      m3: number;
      m4: number;
    }>;
    monthlyLines: Array<{
      label: string;
      m1: number;
      m2: number;
      m3: number;
      m4: number;
    }>;
    yearlyLines: Array<{
      label: string;
      m1: number;
      m2: number;
      m3: number;
      m4: number;
    }>;
  };
  laba: {
    harian: {
      totalPenghasilan: number;
      hargaProduksi: number;
      labaBersih: number;
    };
    mingguan: {
      totalPenghasilan: number;
      hargaProduksi: number;
      labaBersih: number;
    };
    bulanan: {
      totalPenghasilan: number;
      hargaProduksi: number;
      labaBersih: number;
    };
    tahunan: {
      totalPenghasilan: number;
      hargaProduksi: number;
      labaBersih: number;
    };
  };
  topProducts: Array<{
    nama: string;
    qty: number;
  }>;
};

export async function getOptibizDashboardDataAction(): Promise<OptibizDashboardData> {
  const user = await requireAuth();
  const profile = await getCurrentProfile();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const startOfToday = new Date(currentYear, currentMonth, now.getDate(), 0, 0, 0, 0);
  const endOfToday = new Date(currentYear, currentMonth, now.getDate(), 23, 59, 59, 999);

  const startOf3DaysAgo = new Date(currentYear, currentMonth, now.getDate() - 3, 0, 0, 0, 0);
  const startOf7DaysAgo = new Date(currentYear, currentMonth, now.getDate() - 6, 0, 0, 0, 0);
  const startOfMonth = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);
  const startOf4MonthsAgo = new Date(currentYear, currentMonth - 3, 1, 0, 0, 0, 0);
  const startOfYear = new Date(currentYear, 0, 1, 0, 0, 0, 0);
  const startOf4YearsAgo = new Date(currentYear - 3, 0, 1, 0, 0, 0, 0);

  const monthNamesIndo = [
    "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI",
    "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
  ];
  const monthNamesShortIndo = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Ags", "Sep", "Okt", "Nov", "Des"
  ];
  const bulanIniName = monthNamesIndo[currentMonth];

  const profileCreatedAt = profile?.created_at ? new Date(profile.created_at) : now;
  const diffTime = Math.abs(now.getTime() - profileCreatedAt.getTime());
  const daysCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Query all user transactions from up to 4 years ago
  const allTrx = await db.transaksi.findMany({
    where: {
      user_id: user.id,
      waktu: { gte: startOf4YearsAgo, lte: endOfToday },
    },
    include: {
      produk: { select: { nama: true } },
    },
    orderBy: { waktu: "asc" },
  });

  // Query all user expenses from up to 4 years ago
  const allExpenses = await db.pengeluaranDadakan.findMany({
    where: {
      user_id: user.id,
      tanggal: { gte: startOf4YearsAgo, lte: endOfToday },
    },
    select: { nominal: true, tanggal: true },
  });

  // --- 1. HARIAN (TODAY) STATS ---
  let todayOmzet = 0;
  let todayHpp = 0;
  let todayTrxCount = 0;
  const todayProductQtyMap: Record<string, number> = {};

  // --- 2. MINGGUAN (LAST 7 DAYS) STATS ---
  let week7Omzet = 0;
  let week7Hpp = 0;

  // --- 3. BULANAN (THIS MONTH) STATS ---
  let monthOmzet = 0;
  let monthHpp = 0;

  // --- 4. TAHUNAN (THIS YEAR) STATS ---
  let yearOmzet = 0;
  let yearHpp = 0;

  // --- MATRICES FOR TREN TRANSAKSI ---
  // Harian: 7 time slots x 4 days (0=Hari ini, 1=Kemarin, 2=2 Hari lalu, 3=3 Hari lalu)
  const harianMatrix: number[][] = Array.from({ length: 7 }, () => [0, 0, 0, 0]);
  const harianOmzet: number[] = [0, 0, 0, 0];

  // Mingguan: 7 days of week x 4 weeks of current month (0=Mg1, 1=Mg2, 2=Mg3, 3=Mg4)
  const weeklyMatrix: number[][] = Array.from({ length: 7 }, () => [0, 0, 0, 0]);
  const weekOmzet: number[] = [0, 0, 0, 0];

  // Bulanan: 4 weeks of month x 4 months (0=Bulan ini, 1=1 Bln lalu, 2=2 Bln lalu, 3=3 Bln lalu)
  const monthlyMatrix: number[][] = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
  const monthOmzetList: number[] = [0, 0, 0, 0];

  // Tahunan: 12 months x 4 years (0=Tahun ini, 1=1 Thn lalu, 2=2 Thn lalu, 3=3 Thn lalu)
  const yearlyMatrix: number[][] = Array.from({ length: 12 }, () => [0, 0, 0, 0]);
  const yearOmzetList: number[] = [0, 0, 0, 0];

  for (const t of allTrx) {
    const qty = Number(t.qty);
    const hargaJual = Number(t.harga_jual_saat_transaksi);
    const hpp = Number(t.hpp_saat_transaksi);
    const omzetTrx = hargaJual * qty;
    const hppTrx = hpp * qty;
    const trxTime = t.waktu;

    // Helper start of day for t.waktu
    const tStartOfDay = new Date(trxTime.getFullYear(), trxTime.getMonth(), trxTime.getDate(), 0, 0, 0, 0);

    // Check Today
    if (trxTime >= startOfToday && trxTime <= endOfToday) {
      todayOmzet += omzetTrx;
      todayHpp += hppTrx;
      todayTrxCount += qty;

      const prodName = t.produk?.nama || "Produk";
      todayProductQtyMap[prodName] = (todayProductQtyMap[prodName] || 0) + qty;
    }

    // Check Last 7 Days
    if (trxTime >= startOf7DaysAgo && trxTime <= endOfToday) {
      week7Omzet += omzetTrx;
      week7Hpp += hppTrx;
    }

    // Check This Month
    if (trxTime >= startOfMonth && trxTime <= endOfToday) {
      monthOmzet += omzetTrx;
      monthHpp += hppTrx;
    }

    // Check This Year
    if (trxTime >= startOfYear && trxTime <= endOfToday) {
      yearOmzet += omzetTrx;
      yearHpp += hppTrx;
    }

    // --- 1. HARIAN MATRIX (0..3 days ago) ---
    if (trxTime >= startOf3DaysAgo && trxTime <= endOfToday) {
      const dayDiff = Math.floor((startOfToday.getTime() - tStartOfDay.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff >= 0 && dayDiff < 4) {
        harianOmzet[dayDiff] += omzetTrx;
        const h = trxTime.getHours();
        let slotIdx = 0;
        if (h < 9) slotIdx = 0;
        else if (h < 11) slotIdx = 1;
        else if (h < 13) slotIdx = 2;
        else if (h < 15) slotIdx = 3;
        else if (h < 17) slotIdx = 4;
        else if (h < 19) slotIdx = 5;
        else slotIdx = 6;

        harianMatrix[slotIdx][dayDiff] += qty;
      }
    }

    // --- 2. MINGGUAN MATRIX (Current Month) ---
    if (trxTime >= startOfMonth && trxTime <= endOfToday) {
      const dayOfMonth = trxTime.getDate();
      let weekIdx = Math.floor((dayOfMonth - 1) / 7);
      if (weekIdx > 3) weekIdx = 3;
      weekOmzet[weekIdx] += omzetTrx;

      const dayOfWeek = trxTime.getDay();
      const dayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      weeklyMatrix[dayIdx][weekIdx] += qty;
    }

    // --- 3. BULANAN MATRIX (Last 4 Months) ---
    if (trxTime >= startOf4MonthsAgo && trxTime <= endOfToday) {
      const monthDiff = (currentYear - trxTime.getFullYear()) * 12 + (currentMonth - trxTime.getMonth());
      if (monthDiff >= 0 && monthDiff < 4) {
        monthOmzetList[monthDiff] += omzetTrx;
        const dayOfMonth = trxTime.getDate();
        let weekIdx = Math.floor((dayOfMonth - 1) / 7);
        if (weekIdx > 3) weekIdx = 3;
        monthlyMatrix[weekIdx][monthDiff] += qty;
      }
    }

    // --- 4. TAHUNAN MATRIX (Last 4 Years) ---
    if (trxTime >= startOf4YearsAgo && trxTime <= endOfToday) {
      const yearDiff = currentYear - trxTime.getFullYear();
      if (yearDiff >= 0 && yearDiff < 4) {
        yearOmzetList[yearDiff] += omzetTrx;
        const monthIdx = trxTime.getMonth();
        yearlyMatrix[monthIdx][yearDiff] += qty;
      }
    }
  }

  // Calculate expenses for each period
  let todayExpensesTotal = 0;
  let week7ExpensesTotal = 0;
  let monthExpensesTotal = 0;
  let yearExpensesTotal = 0;

  for (const exp of allExpenses) {
    const nom = Number(exp.nominal);
    const expTime = exp.tanggal;
    if (expTime >= startOfToday && expTime <= endOfToday) {
      todayExpensesTotal += nom;
    }
    if (expTime >= startOf7DaysAgo && expTime <= endOfToday) {
      week7ExpensesTotal += nom;
    }
    if (expTime >= startOfMonth && expTime <= endOfToday) {
      monthExpensesTotal += nom;
    }
    if (expTime >= startOfYear && expTime <= endOfToday) {
      yearExpensesTotal += nom;
    }
  }

  const todayLabaBersih = todayOmzet - todayHpp - todayExpensesTotal;
  const week7LabaBersih = week7Omzet - week7Hpp - week7ExpensesTotal;
  const monthLabaBersih = monthOmzet - monthHpp - monthExpensesTotal;
  const yearLabaBersih = yearOmzet - yearHpp - yearExpensesTotal;

  // Build chart lines
  const harianTimeLabels = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
  const harianLines = harianTimeLabels.map((label, idx) => ({
    label,
    m1: harianMatrix[idx][0],
    m2: harianMatrix[idx][1],
    m3: harianMatrix[idx][2],
    m4: harianMatrix[idx][3],
  }));

  const daysLabel = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const weeklyLines = daysLabel.map((day, idx) => ({
    day,
    m1: weeklyMatrix[idx][0],
    m2: weeklyMatrix[idx][1],
    m3: weeklyMatrix[idx][2],
    m4: weeklyMatrix[idx][3],
  }));

  const weekNames = ["Mg 1", "Mg 2", "Mg 3", "Mg 4"];
  const monthlyLines = weekNames.map((label, idx) => ({
    label,
    m1: monthlyMatrix[idx][0],
    m2: monthlyMatrix[idx][1],
    m3: monthlyMatrix[idx][2],
    m4: monthlyMatrix[idx][3],
  }));

  const yearlyLines = monthNamesShortIndo.map((label, idx) => ({
    label,
    m1: yearlyMatrix[idx][0],
    m2: yearlyMatrix[idx][1],
    m3: yearlyMatrix[idx][2],
    m4: yearlyMatrix[idx][3],
  }));

  // Build Omzet Donut Breakdowns
  const buildBreakdown = (
    items: Array<{ label: string; value: number }>,
    total: number,
    colors: string[]
  ) => {
    return items.map((item, idx) => ({
      label: item.label,
      value: item.value,
      percentage: total > 0 ? Math.round((item.value / total) * 100) : 0,
      color: colors[idx % colors.length],
    }));
  };

  const DONUT_COLORS = ["#f35b22", "#8bc5f3", "#88d2c3", "#c678dd"];

  const harianTotalOmzetSum = harianOmzet.reduce((a, b) => a + b, 0);
  const harianBreakdown = buildBreakdown(
    [
      { label: "Hari Ini", value: harianOmzet[0] },
      { label: "Kemarin", value: harianOmzet[1] },
      { label: "2 Hari Lalu", value: harianOmzet[2] },
      { label: "3 Hari Lalu", value: harianOmzet[3] },
    ],
    harianTotalOmzetSum,
    DONUT_COLORS
  );

  const weeklyBreakdown = buildBreakdown(
    [
      { label: "Minggu ke - 1", value: weekOmzet[0] },
      { label: "Minggu ke - 2", value: weekOmzet[1] },
      { label: "Minggu ke - 3", value: weekOmzet[2] },
      { label: "Minggu ke - 4", value: weekOmzet[3] },
    ],
    monthOmzet,
    DONUT_COLORS
  );

  const monthlyTotalOmzetSum = monthOmzetList.reduce((a, b) => a + b, 0);
  const monthlyBreakdown = buildBreakdown(
    [
      { label: "Bulan Ini", value: monthOmzetList[0] },
      { label: "1 Bulan Lalu", value: monthOmzetList[1] },
      { label: "2 Bulan Lalu", value: monthOmzetList[2] },
      { label: "3 Bulan Lalu", value: monthOmzetList[3] },
    ],
    monthlyTotalOmzetSum,
    DONUT_COLORS
  );

  const yearlyTotalOmzetSum = yearOmzetList.reduce((a, b) => a + b, 0);
  const yearlyBreakdown = buildBreakdown(
    [
      { label: `Tahun ${currentYear}`, value: yearOmzetList[0] },
      { label: `Tahun ${currentYear - 1}`, value: yearOmzetList[1] },
      { label: `Tahun ${currentYear - 2}`, value: yearOmzetList[2] },
      { label: `Tahun ${currentYear - 3}`, value: yearOmzetList[3] },
    ],
    yearlyTotalOmzetSum,
    DONUT_COLORS
  );

  // Top Products: Ranked strictly from real today sales data (or all-time if today is 0)
  const topProductsMap = Object.keys(todayProductQtyMap).length > 0 ? todayProductQtyMap : {};
  if (Object.keys(topProductsMap).length === 0) {
    for (const t of allTrx) {
      const prodName = t.produk?.nama || "Produk";
      topProductsMap[prodName] = (topProductsMap[prodName] || 0) + Number(t.qty);
    }
  }

  const topProducts = Object.entries(topProductsMap)
    .map(([nama, qty]) => ({ nama, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 4);

  return {
    welcome: {
      username: (profile?.nama_usaha || user.email?.split("@")[0] || "USER").toUpperCase(),
      namaUsaha: profile?.nama_usaha || "REKA UMKM",
      daysCount: String(daysCount).padStart(3, "0") as unknown as number,
      email: user.email || "user@reka.com",
    },
    omzet: {
      harian: todayOmzet,
      bulanIniName,
      bulanIniTotal: monthOmzet,
      harianBreakdown,
      weeklyBreakdown,
      monthlyBreakdown,
      yearlyBreakdown,
    },
    transaksi: {
      harianCount: todayTrxCount,
      bulanIniName,
      harianLines,
      weeklyLines,
      monthlyLines,
      yearlyLines,
    },
    laba: {
      harian: {
        totalPenghasilan: todayOmzet,
        hargaProduksi: todayHpp,
        labaBersih: todayLabaBersih,
      },
      mingguan: {
        totalPenghasilan: week7Omzet,
        hargaProduksi: week7Hpp,
        labaBersih: week7LabaBersih,
      },
      bulanan: {
        totalPenghasilan: monthOmzet,
        hargaProduksi: monthHpp,
        labaBersih: monthLabaBersih,
      },
      tahunan: {
        totalPenghasilan: yearOmzet,
        hargaProduksi: yearHpp,
        labaBersih: yearLabaBersih,
      },
    },
    topProducts,
  };
}

