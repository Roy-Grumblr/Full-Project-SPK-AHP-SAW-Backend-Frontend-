# CineDecision: SPK Rekomendasi Penerima Beasiswa Hybrid AHP-SAW

## Identitas Mahasiswa

| Keterangan | Data |
|---|---|
| Nama | Royan Alfa Rezza |
| NIM | 231011450102 |
| Kelas | Isi Kelas Lo (misal: 06TPLE004) |
| Mata Kuliah | Sistem Pendukung Keputusan (SPK) |
| Universitas | Universitas Pamulang |
| Fakultas | Fakultas Ilmu Komputer |
| Program Studi | Teknik Informatika |

## Deskripsi Proyek

CineDecision merupakan tugas Ujian Tengah Semester (UTS) mata kuliah Sistem Pendukung Keputusan (SPK). Aplikasi ini membantu proses rekomendasi penerima beasiswa dengan mengolah sejumlah kriteria dan alternatif secara terstruktur menggunakan metode Hybrid AHP-SAW.

Metode **AHP (Analytic Hierarchy Process)** digunakan untuk menentukan bobot kriteria serta menguji konsistensinya. Bobot tersebut kemudian digunakan oleh **SAW (Simple Additive Weighting)** untuk menghitung nilai akhir dan mengurutkan kandidat penerima beasiswa. Aplikasi dibangun dengan **React.js** sebagai antarmuka pengguna dan **FastAPI** sebagai backend/API.

## Teknologi

- **Frontend:** React.js, Vite, Axios, Recharts, KaTeX
- **Backend:** Python, FastAPI, SQLAlchemy, Pandas, NumPy
- **Database:** SQLite

## Fitur

- Pengelolaan data kriteria dan alternatif, termasuk impor data Excel/CSV.
- Perhitungan bobot kriteria menggunakan AHP dan pemeriksaan rasio konsistensi.
- Pemeringkatan kandidat menggunakan SAW dengan beberapa pilihan normalisasi.
- Visualisasi hasil dan panduan metode Hybrid AHP-SAW.
- **Modern Dark Mode Dashboard UI** untuk tampilan dashboard yang modern dan nyaman.

## Panduan Instalasi dan Menjalankan Aplikasi

Pastikan **Python 3.8 atau lebih baru** dan **Node.js 18 atau lebih baru** sudah terpasang. Jalankan backend dan frontend di dua terminal terpisah.

### 1. Backend

Dari direktori utama proyek, jalankan:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

API berjalan di `http://127.0.0.1:8000`.

### 2. Frontend

Buka terminal kedua dari direktori utama proyek, lalu jalankan:

```powershell
cd frontend
npm install
npm run dev
```

Buka alamat yang ditampilkan oleh Vite di terminal (umumnya `http://localhost:5173`).

## Credit

Dikembangkan oleh **Royan Alfa Rezza**.
