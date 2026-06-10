# 📱 SDIT Al-Furqon – Aplikasi Manajemen Digital

Aplikasi manajemen sekolah berbasis web yang bisa diakses dari HP maupun komputer.

---

## 🚀 Cara Deploy ke Vercel (Gratis, Tanpa Coding)

### Langkah 1 – Buat akun GitHub
1. Buka [github.com](https://github.com) → klik **Sign up**
2. Daftar pakai email (gratis)

### Langkah 2 – Upload project ke GitHub
1. Login ke GitHub
2. Klik tombol **+** (pojok kanan atas) → **New repository**
3. Nama repository: `sdit-alfurqon-app`
4. Pilih **Public** → klik **Create repository**
5. Di halaman repository yang baru, klik **uploading an existing file**
6. **Drag & drop seluruh isi folder ini** ke halaman GitHub
7. Klik **Commit changes**

### Langkah 3 – Deploy ke Vercel
1. Buka [vercel.com](https://vercel.com) → klik **Sign Up**
2. Pilih **Continue with GitHub** → izinkan akses
3. Klik **Add New Project**
4. Pilih repository `sdit-alfurqon-app` → klik **Import**
5. Biarkan semua pengaturan default → klik **Deploy**
6. Tunggu 1-2 menit ✅

### Langkah 4 – Akses dari HP
- Vercel akan memberikan link seperti: `https://sdit-alfurqon-app.vercel.app`
- Bagikan link ini ke semua guru dan orang tua
- Bisa langsung dibuka di browser HP (Chrome / Safari)

---

## 📲 Cara Install ke Homescreen HP (Opsional)

### Android (Chrome):
1. Buka link aplikasi di Chrome
2. Ketuk ikon **⋮** (tiga titik) di kanan atas
3. Pilih **"Add to Home screen"**
4. Ketuk **Add** → selesai, ada ikon di layar utama!

### iPhone (Safari):
1. Buka link di Safari
2. Ketuk ikon **Share** (kotak dengan panah ke atas)
3. Scroll ke bawah → pilih **"Add to Home Screen"**
4. Ketuk **Add** → selesai!

---

## 🗂️ Struktur Folder

```
sdit-alfurqon-app/
├── public/
│   ├── index.html       ← Halaman utama
│   └── manifest.json    ← Konfigurasi PWA (icon di homescreen)
├── src/
│   ├── index.js         ← Entry point React
│   └── App.jsx          ← Aplikasi utama (semua fitur ada di sini)
├── package.json         ← Daftar library yang digunakan
└── vercel.json          ← Konfigurasi Vercel
```

---

## ✨ Fitur Aplikasi

| Fitur | Deskripsi |
|-------|-----------|
| 📊 Dashboard | Ringkasan data kehadiran, SPP, guru & siswa |
| ✅ Presensi | Absensi guru dan siswa per kelas |
| 📒 Buku Penghubung | Pesan antara guru dan orang tua |
| 📝 Penilaian | Input dan rekap nilai siswa |
| 🌙 Tahfidz & Ibadah | Monitoring hafalan Quran dan ibadah harian |
| 💰 Keuangan | Rekap SPP dan daftar tunggakan |
| 👨‍👩‍👦 Dashboard Ortu | Tampilan khusus untuk orang tua |

---

Dibuat dengan ❤️ untuk SDIT Al-Furqon
