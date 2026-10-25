# Manual Book Aplikasi SPK Hybrid AHP-SAW

## 1. Judul

**Manual Book Aplikasi Sistem Pendukung Keputusan (SPK) Hybrid AHP-SAW**

## 2. Pendahuluan

Aplikasi SPK Hybrid AHP-SAW merupakan aplikasi berbasis web untuk membantu pengguna menentukan peringkat alternatif berdasarkan sejumlah kriteria. Metode **Analytic Hierarchy Process (AHP)** digunakan untuk menghitung bobot kepentingan kriteria melalui perbandingan berpasangan. Selanjutnya, metode **Simple Additive Weighting (SAW)** menggunakan bobot tersebut untuk menghitung skor dan mengurutkan alternatif.

Manual ini menjelaskan kebutuhan teknologi, cara menjalankan aplikasi dari repositori, serta alur penggunaan dasar. Aplikasi memiliki halaman pengelolaan proyek, data kriteria dan alternatif, pengisian nilai evaluasi, pembobotan AHP, dan perhitungan peringkat SAW.

## 3. Spesifikasi Teknologi

| Komponen | Teknologi |
|---|---|
| Backend/API | Python 3.8 atau lebih baru, FastAPI, Uvicorn, SQLAlchemy, Pandas, NumPy |
| Frontend | React 18, Vite, Node.js 18 atau lebih baru, npm |
| Database | SQLite |
| Peramban | Peramban modern yang mendukung aplikasi web |

Database SQLite menggunakan berkas `backend/dss_database.db`. Tabel database dibuat secara otomatis oleh backend saat aplikasi dijalankan.

## 4. Langkah Instalasi

Pastikan Git, Python, Node.js, dan npm telah tersedia pada komputer. Unduh repositori dari GitHub, lalu buka terminal pada folder repositori.

### 4.1 Backend

Jalankan perintah berikut di PowerShell dari folder utama repositori:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
uvicorn main:app --reload
```

Jika PowerShell menolak aktivasi lingkungan virtual karena kebijakan eksekusi, pengguna dapat menjalankan perintah instalasi dengan `python -m pip` tanpa aktivasi. Backend berjalan pada `http://127.0.0.1:8000`. Dokumentasi interaktif API tersedia di `http://127.0.0.1:8000/docs`.

### 4.2 Frontend

Buka terminal baru di folder utama repositori, kemudian jalankan:

```powershell
cd frontend
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan oleh Vite di terminal (umumnya `http://localhost:5173`). Backend harus tetap berjalan selama frontend digunakan.

## 5. Panduan Penggunaan

### 5.1 Membuat studi kasus

1. Buka aplikasi pada alamat frontend.
2. Pada halaman **Beranda Studi Kasus**, masukkan nama studi kasus.
3. Pilih **Buat Project**, lalu pilih **Buka** pada proyek yang akan dikelola.

Setiap proyek menyimpan kriteria, alternatif, nilai evaluasi, dan bobotnya secara terpisah.

### 5.2 Input Kriteria

1. Buka menu **1. Manajemen Data & ETL**.
2. Pada bagian **Kelola Kriteria**, masukkan nama kriteria.
3. Pilih jenis kriteria:
   - **Benefit** jika nilai yang lebih besar lebih diutamakan.
   - **Cost** jika nilai yang lebih kecil lebih diutamakan.
4. Pilih **Tambah**. Ulangi untuk seluruh kriteria yang diperlukan.
5. Pastikan jenis setiap kriteria sudah sesuai sebelum menghitung peringkat.

![Placeholder screenshot Input Kriteria](docs/images/input-kriteria.png)

*Gambar 1. Placeholder tangkapan layar halaman Input Kriteria.*

### 5.3 Input Alternatif dan Nilai Evaluasi

1. Pada halaman **Manajemen Data & ETL**, masukkan nama alternatif di bagian **Kelola Alternatif**, lalu pilih **Tambah**.
2. Tambahkan semua alternatif yang akan dibandingkan.
3. Pada matriks evaluasi, isikan nilai setiap alternatif untuk setiap kriteria. Gunakan nilai numerik sesuai data studi kasus.
4. Pilih **Konfirmasi & Simpan Matriks** setelah pengisian selesai.

Aplikasi juga menyediakan tab unggah data untuk berkas CSV atau Excel. Pada berkas tersebut, kolom pertama digunakan sebagai nama alternatif dan kolom-kolom berikutnya menggunakan nama kriteria. Periksa pratinjau dan transformasi data sebelum menyimpan.

![Placeholder screenshot Input Alternatif](docs/images/input-alternatif.png)

*Gambar 2. Placeholder tangkapan layar halaman Input Alternatif dan matriks evaluasi.*

### 5.4 Menghitung bobot dengan AHP

1. Buka menu **2. Kalibrasi Bobot (AHP)**.
2. Isi nilai perbandingan berpasangan antarkriteria menggunakan skala Saaty yang ditampilkan pada halaman.
3. Pilih **Hitung Rasio Konsistensi & Bobot**.
4. Periksa nilai *Consistency Ratio* (CR). Matriks dinyatakan konsisten apabila CR tidak lebih dari `0,10`.
5. Jika matriks konsisten, pilih **Simpan Bobot ke Database**. Jika belum konsisten, tinjau kembali nilai perbandingan dan hitung ulang.

### 5.5 Melihat hasil perankingan SAW

1. Buka menu **3. Evaluasi & Pemeringkatan (SAW)**.
2. Pilih metode normalisasi yang tersedia: **Linear (Klasik SAW)**, **Min-Max**, atau **Sum**.
3. Pilih **Hitung Peringkat**.
4. Baca tabel hasil. Alternatif dengan peringkat 1 merupakan alternatif dengan skor tertinggi berdasarkan data dan bobot yang dimasukkan.
5. Untuk menyimpan hasil ke berkas, pilih **Download Laporan**. Laporan diunduh dalam format Excel.

![Placeholder screenshot Hasil Perankingan](docs/images/hasil-perankingan.png)

*Gambar 3. Placeholder tangkapan layar grafik dan tabel Hasil Perankingan.*

### 5.6 Catatan penggunaan

- Pastikan setiap kriteria memiliki jenis **Benefit** atau **Cost** yang tepat.
- Lengkapi nilai evaluasi seluruh alternatif sebelum melakukan perhitungan.
- Simpan bobot AHP terlebih dahulu. Perhitungan SAW tidak dapat dilakukan jika total bobot masih nol.
- Hasil peringkat bergantung pada data, jenis kriteria, bobot, dan metode normalisasi yang dipilih.
- Menghapus proyek akan menghapus seluruh data proyek tersebut.
