import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEMO_ACCOUNTS = [
  {
    email: 'kuliner@reka.id',
    password: 'demo123',
    nama_usaha: 'Warung Makan Mbak Sri',
    jenis_usaha: 'Kuliner & Makanan Basah',
    products: [
      { nama: 'Ayam Geprek Sambal Bawang + Nasi', harga_jual: 18000, hpp: 9500, kategori: 'Makanan Berat', foto: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&auto=format&fit=crop&q=80' },
      { nama: 'Nasi Goreng Spesial Telur', harga_jual: 16000, hpp: 8000, kategori: 'Makanan Berat', foto: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&auto=format&fit=crop&q=80' },
      { nama: 'Mie Nyemek Pedas Gurih', harga_jual: 14000, hpp: 6500, kategori: 'Makanan Berat', foto: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&auto=format&fit=crop&q=80' },
      { nama: 'Es Teh Manis Melati Jumbo', harga_jual: 4000, hpp: 1200, kategori: 'Minuman Segar', foto: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&auto=format&fit=crop&q=80' },
      { nama: 'Es Jeruk Peras Murni', harga_jual: 6000, hpp: 2500, kategori: 'Minuman Segar', foto: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=200&auto=format&fit=crop&q=80' },
      { nama: 'Tahu & Tempe Goreng Krispi (Isi 4)', harga_jual: 5000, hpp: 2000, kategori: 'Lauk & Camilan', foto: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=200&auto=format&fit=crop&q=80' },
    ],
    expenses: [
      { kategori: 'Bahan Baku', nominal: 145000, deskripsi: 'Belanja ayam potong 5kg & cabai rawit pasar' },
      { kategori: 'Operasional', nominal: 22000, deskripsi: 'Isi ulang tabung Gas Elpiji 3kg' },
      { kategori: 'Operasional', nominal: 12000, deskripsi: 'Beli balok es batu kristal 2 kantong' },
      { kategori: 'Kemasan', nominal: 25000, deskripsi: 'Kertas bungkus cokelat & kantong kresek' },
    ],
    trxHours: [12, 13, 13, 14, 18, 19, 19, 20], // Puncak makan siang & makan malam
  },
  {
    email: 'kopi@reka.id',
    password: 'demo123',
    nama_usaha: 'Kopi Titik Temu',
    jenis_usaha: 'Kedai Kopi & Minuman Kekinian',
    products: [
      { nama: 'Kopi Susu Gula Aren Signature', harga_jual: 18000, hpp: 6500, kategori: 'Kopi Susu', foto: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80' },
      { nama: 'Iced Americano Arabica', harga_jual: 15000, hpp: 4000, kategori: 'Manual Brew & Espresso', foto: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=200&auto=format&fit=crop&q=80' },
      { nama: 'Creamy Matcha Latte', harga_jual: 22000, hpp: 8500, kategori: 'Non-Coffee', foto: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=200&auto=format&fit=crop&q=80' },
      { nama: 'Butter Croissant Flaky', harga_jual: 16000, hpp: 7500, kategori: 'Pastry & Bakery', foto: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&auto=format&fit=crop&q=80' },
      { nama: 'Kentang Goreng Keju Mayo', harga_jual: 15000, hpp: 5500, kategori: 'Snack & Makanan Ringan', foto: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&auto=format&fit=crop&q=80' },
    ],
    expenses: [
      { kategori: 'Bahan Baku', nominal: 95000, deskripsi: 'Susu UHT Fresh Milk 5 liter' },
      { kategori: 'Bahan Baku', nominal: 120000, deskripsi: 'Biji kopi blend arabika robusta 1kg' },
      { kategori: 'Kemasan', nominal: 45000, deskripsi: 'Cup plastik sablon 100 pcs & sedotan kertas' },
      { kategori: 'Listrik & Utilitas', nominal: 50000, deskripsi: 'Token listrik kedai' },
    ],
    trxHours: [15, 16, 17, 18, 19, 20, 21], // Jam santai sore hingga malam nongkrong
  },
  {
    email: 'sembako@reka.id',
    password: 'demo123',
    nama_usaha: 'Toko Sembako Barokah',
    jenis_usaha: 'Toko Kelontong & Sembako',
    products: [
      { nama: 'Beras Ramos Super 5 Kg', harga_jual: 74000, hpp: 67000, kategori: 'Sembako Pokok', foto: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&auto=format&fit=crop&q=80' },
      { nama: 'Minyak Goreng Sawit 2 Liter', harga_jual: 36000, hpp: 32500, kategori: 'Minyak & Bumbu', foto: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&auto=format&fit=crop&q=80' },
      { nama: 'Telur Ayam Negeri 1 Kg', harga_jual: 28000, hpp: 24500, kategori: 'Sembako Pokok', foto: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&auto=format&fit=crop&q=80' },
      { nama: 'Gula Pasir Putih 1 Kg', harga_jual: 17500, hpp: 15500, kategori: 'Sembako Pokok', foto: 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=200&auto=format&fit=crop&q=80' },
      { nama: 'Paket Mi Instan Kuah / Goreng (Isi 5)', harga_jual: 16000, hpp: 14000, kategori: 'Makanan Instan', foto: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=200&auto=format&fit=crop&q=80' },
      { nama: 'Sabun Pencuci Piring Cair 750ml', harga_jual: 13500, hpp: 11000, kategori: 'Kebutuhan Rumah Tangga', foto: 'https://images.unsplash.com/photo-1585670210693-e7fdd16b142e?w=200&auto=format&fit=crop&q=80' },
    ],
    expenses: [
      { kategori: 'Operasional', nominal: 35000, deskripsi: 'Beli kantong kresek ukuran 15, 24, dan 28' },
      { kategori: 'Operasional', nominal: 20000, deskripsi: 'Ongkos kuli angkut beras' },
      { kategori: 'Lainnya', nominal: 15000, deskripsi: 'Buku nota kasbon & bolpoin toko' },
    ],
    trxHours: [7, 8, 9, 10, 11, 15, 16, 17], // Ramai pagi belanja emak-emak & sore
  },
  {
    email: 'fashion@reka.id',
    password: 'demo123',
    nama_usaha: 'Reka Threads & Apparel',
    jenis_usaha: 'Fashion & Pakaian Jadi',
    products: [
      { nama: 'Kaos Polos Heavyweight 24s', harga_jual: 85000, hpp: 42000, kategori: 'Kaos & T-Shirt', foto: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80' },
      { nama: 'Kemeja Flanel Casual Lengan Panjang', harga_jual: 145000, hpp: 78000, kategori: 'Kemeja', foto: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&auto=format&fit=crop&q=80' },
      { nama: 'Celana Chino Slim Fit Stretch', harga_jual: 175000, hpp: 95000, kategori: 'Celana', foto: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200&auto=format&fit=crop&q=80' },
      { nama: 'Hoodie Fleece Pullover Streetwear', harga_jual: 195000, hpp: 110000, kategori: 'Jaket & Outerwear', foto: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&auto=format&fit=crop&q=80' },
      { nama: 'Topi Baseball Twill Katun', harga_jual: 45000, hpp: 20000, kategori: 'Aksesoris', foto: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&auto=format&fit=crop&q=80' },
    ],
    expenses: [
      { kategori: 'Kemasan', nominal: 65000, deskripsi: 'Plastik ziplock kemasan pakaian tebal' },
      { kategori: 'Pemasaran', nominal: 40000, deskripsi: 'Cetak stiker logo clothing & label hangtag' },
      { kategori: 'Operasional', nominal: 35000, deskripsi: 'Lakban cokelat & bubble wrap packing' },
    ],
    trxHours: [13, 14, 16, 17, 18, 19, 20], // Ramai siang, sore, dan malam belanja outfit
  },
];

async function seed() {
  console.log('🚀 Mulai proses seeding akun demo berbagai jenis UMKM...');

  const passwordHash = await bcrypt.hash('demo123', 12);
  const now = Date.now();

  for (const account of DEMO_ACCOUNTS) {
    console.log(`\n📦 Menyinkronkan akun: ${account.email} (${account.nama_usaha})...`);

    // 1. Upsert User
    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: { password_hash: passwordHash },
      create: {
        email: account.email,
        password_hash: passwordHash,
      },
    });

    // 2. Upsert Profile
    await prisma.profile.upsert({
      where: { id: user.id },
      update: {
        nama_usaha: account.nama_usaha,
        jenis_usaha: account.jenis_usaha,
      },
      create: {
        id: user.id,
        nama_usaha: account.nama_usaha,
        jenis_usaha: account.jenis_usaha,
      },
    });

    // 3. Bersihkan transaksi, pengeluaran, dan produk lama akun ini (agar data selalu fresh & presisi)
    await prisma.transaksi.deleteMany({ where: { user_id: user.id } });
    await prisma.pengeluaranDadakan.deleteMany({ where: { user_id: user.id } });
    await prisma.produk.deleteMany({ where: { user_id: user.id } });

    // 4. Masukkan Produk
    const createdProducts = [];
    for (const prod of account.products) {
      const p = await prisma.produk.create({
        data: {
          user_id: user.id,
          nama: prod.nama,
          harga_jual: prod.harga_jual,
          hpp: prod.hpp,
          kategori: prod.kategori,
          status: 'Tersedia',
          foto: prod.foto,
        },
      });
      createdProducts.push(p);
    }
    console.log(`  ✓ Berhasil membuat ${createdProducts.length} produk katalog.`);

    // 5. Masukkan Transaksi 7 Hari Terakhir
    let totalTrxCount = 0;
    // Buat 16 transaksi tersebar dalam 6 hari terakhir hingga hari ini
    for (let dayOffset = 5; dayOffset >= 0; dayOffset--) {
      // 2 - 4 transaksi per hari
      const dailyTrxCount = (dayOffset % 2 === 0 ? 3 : 2) + Math.floor(Math.random() * 2);

      for (let t = 0; t < dailyTrxCount; t++) {
        // Pilih jam sesuai pola usaha
        const targetHour = account.trxHours[Math.floor(Math.random() * account.trxHours.length)];
        const targetMinute = Math.floor(Math.random() * 50);

        const trxDate = new Date(now - dayOffset * 24 * 60 * 60 * 1000);
        trxDate.setHours(targetHour, targetMinute, 0, 0);

        // Pilih produk acak (1 sampai 2 item per transaksi)
        const selectedProd = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        const qty = Math.random() > 0.6 ? 2 : 1;

        await prisma.transaksi.create({
          data: {
            user_id: user.id,
            produk_id: selectedProd.id,
            qty,
            harga_jual_saat_transaksi: selectedProd.harga_jual,
            hpp_saat_transaksi: selectedProd.hpp,
            waktu: trxDate,
          },
        });
        totalTrxCount++;
      }
    }
    console.log(`  ✓ Berhasil membuat ${totalTrxCount} riwayat transaksi riil 7 hari terakhir.`);

    // 6. Masukkan Pengeluaran Operasional
    for (let i = 0; i < account.expenses.length; i++) {
      const exp = account.expenses[i];
      const expDayOffset = i % 4; // 0 sampai 3 hari lalu
      const expDate = new Date(now - expDayOffset * 24 * 60 * 60 * 1000);
      expDate.setHours(10 + i * 2, 30, 0, 0);

      await prisma.pengeluaranDadakan.create({
        data: {
          user_id: user.id,
          kategori: exp.kategori,
          nominal: exp.nominal,
          tanggal: expDate,
        },
      });
    }
    console.log(`  ✓ Berhasil membuat ${account.expenses.length} catatan pengeluaran.`);
  }

  console.log('\n🎉 SEMUA AKUN DEMO BERBAGAI JENIS UMKM BERHASIL DI-SEED KE DATABASE!');
}

seed()
  .catch((err) => {
    console.error('❌ Gagal seed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
