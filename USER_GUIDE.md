<p align="center">
  <img src="https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/assets/logo-rupiahvision-horizontal.png" alt="RupiahVision Logo" width="480"/>
</p>

# Panduan Penggunaan Aplikasi RupiahVision

> **Versi Dokumen:** 1.1 | **Platform:** Android | **Emisi:** Rupiah 2016

---

> **Demo Visual:** Tonton video dokumentasi lengkap aplikasi RupiahVision di sini →
> [▶ dokumentasi-aplikasi.mp4](https://github.com/RupiahVision/RupiahVision/raw/main/frontend/rilis/v1.1/video/dokumentasi-aplikasi.mp4)

---

## Daftar Isi

1. [Tentang RupiahVision](#1-tentang-rupiahvision)
2. [Persyaratan Sistem](#2-persyaratan-sistem)
3. [Instalasi Aplikasi](#3-instalasi-aplikasi)
4. [Tampilan Antarmuka Utama](#4-tampilan-antarmuka-utama)
5. [Cara Menggunakan Fitur Deteksi](#5-cara-menggunakan-fitur-deteksi)
6. [Tips Pengambilan Foto yang Baik](#6-tips-pengambilan-foto-yang-baik)
7. [Memahami Hasil Prediksi](#7-memahami-hasil-prediksi)
8. [Fitur Tab Hasil](#8-fitur-tab-hasil)
9. [Nominal Uang yang Didukung](#9-nominal-uang-yang-didukung)
10. [Troubleshooting](#10-troubleshooting)
11. [Informasi Teknis](#11-informasi-teknis)

---

## 1. Tentang RupiahVision

**RupiahVision** adalah aplikasi mobile berbasis kecerdasan buatan (AI) yang dirancang untuk mengenali dan mengklasifikasikan nominal uang kertas Rupiah Indonesia emisi tahun 2016 secara otomatis melalui foto.

Aplikasi ini dikembangkan sebagai alat bantu edukasi, khususnya untuk pengalaman museum, agar pengguna dapat dengan mudah mengidentifikasi uang kertas Rupiah sekaligus mempelajari informasi historis di balik setiap pecahan.

**Kemampuan utama:**
- Deteksi 7 nominal uang kertas Rupiah emisi 2016
- Menampilkan tingkat keyakinan (*confidence score*) hasil prediksi
- Menolak otomatis gambar yang bukan uang kertas (deteksi OOD)
- Menampilkan informasi historis setiap pecahan uang

---

## 2. Persyaratan Sistem

| Komponen | Persyaratan |
|---|---|
| Platform | Android |
| Versi Android | Android 8.0 (Oreo) atau lebih baru |
| Koneksi Internet | Diperlukan (untuk memproses prediksi) |
| Izin Aplikasi | Kamera dan Galeri/Penyimpanan |
| Ruang Penyimpanan | ± 50 MB |

> **Catatan:** Aplikasi memerlukan koneksi internet aktif karena proses analisis gambar dilakukan oleh server backend RupiahVision.

---

## 3. Instalasi Aplikasi

### Langkah-langkah Instalasi

**Langkah 1 — Aktifkan sumber aplikasi tidak dikenal**

Karena aplikasi didistribusikan di luar Google Play Store, Anda perlu mengizinkan instalasi dari sumber lain terlebih dahulu.

1. Buka **Pengaturan** di perangkat Android Anda
2. Pilih **Keamanan** atau **Privasi** (nama menu dapat berbeda tergantung merek perangkat)
3. Aktifkan opsi **Instal aplikasi dari sumber tidak dikenal** atau **Izinkan dari sumber ini**

---

**Langkah 2 — Unduh file APK**

Unduh APK RupiahVision versi terbaru (v1.1) langsung melalui tautan berikut:

> **[⬇ Unduh RupiahVision.apk (v1.1)](https://github.com/RupiahVision/RupiahVision/raw/main/frontend/rilis/v1.1/apps/RupiahVision.apk)**

Ketuk tautan di atas dari browser perangkat Android Anda untuk langsung mengunduh file APK.

---

**Langkah 3 — Instal APK**

Setelah unduhan selesai, ikuti langkah berikut:

1. Buka panel notifikasi dan ketuk file APK yang baru diunduh
   — atau —
   Buka aplikasi **File Manager** / **Pengelola File**, lalu cari file `RupiahVision.apk` di folder **Unduhan**
2. Ketuk file APK tersebut
3. Pada layar konfirmasi instalasi, ketuk **Instal**
4. Tunggu hingga proses instalasi selesai
5. Ketuk **Buka** untuk langsung membuka aplikasi, atau ketuk **Selesai** jika ingin membukanya nanti

Setelah terinstal, ikon aplikasi RupiahVision akan muncul di layar utama atau laci aplikasi perangkat Anda:

![Ikon Aplikasi RupiahVision](https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/rilis/v1.1/screenshot/0-Icon-Aplikasi.PNG)

---

**Langkah 4 — Berikan izin aplikasi**

Saat pertama kali digunakan, aplikasi akan meminta izin akses. Pastikan Anda memberikan izin berikut:

- **Kamera** — untuk mengambil foto uang secara langsung
- **Foto / Galeri / Media** — untuk memilih foto dari penyimpanan perangkat

Ketuk **Izinkan** pada setiap dialog izin yang muncul.

---

## 4. Tampilan Antarmuka Utama

Setelah aplikasi dibuka, Anda akan melihat tampilan utama RupiahVision:

![Halaman Utama RupiahVision](https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/rilis/v1.1/screenshot/1-Halaman-Utama.PNG)

| Bagian | Keterangan |
|---|---|
| **Logo RupiahVision** | Terletak di bagian atas layar |
| **Area Pratinjau Gambar** | Kotak besar di tengah layar untuk menampilkan foto yang dipilih atau diambil |
| **Tombol Kamera** | Mengambil foto langsung menggunakan kamera perangkat |
| **Tombol Galeri** | Memilih foto yang sudah ada di penyimpanan perangkat |
| **Area Hasil Prediksi** | Muncul di bawah tombol setelah foto berhasil dianalisis |

---

## 5. Cara Menggunakan Fitur Deteksi

### Metode 1: Menggunakan Kamera

**Langkah 1 — Buka aplikasi RupiahVision**

Cari ikon aplikasi RupiahVision di layar utama atau laci aplikasi perangkat Anda, lalu ketuk untuk membuka.

---

**Langkah 2 — Ketuk tombol "Kamera"**

Pada layar utama, ketuk tombol **Kamera** yang berada di sisi kiri bawah area pratinjau gambar.

---

**Langkah 3 — Berikan izin kamera (jika diminta)**

Jika ini pertama kali Anda menggunakan fitur kamera, akan muncul dialog permintaan izin. Ketuk **Izinkan** untuk melanjutkan.

---

**Langkah 4 — Arahkan kamera ke uang kertas dan ambil foto**

Kamera perangkat akan terbuka. Arahkan kamera ke uang kertas yang ingin diidentifikasi, lalu ketuk tombol rana untuk mengambil foto.

Pastikan:
- Uang kertas terlihat jelas dan tidak buram
- Seluruh bagian uang masuk dalam bingkai kamera
- Pencahayaan cukup terang

![Tampilan Kamera saat Mengambil Gambar Uang](https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/rilis/v1.1/screenshot/2-Ambil-Gambar.PNG)

---

**Langkah 5 — Tunggu proses analisis**

Setelah foto diambil, gambar akan tampil di area pratinjau dan aplikasi secara otomatis akan mengirimkan gambar ke server untuk dianalisis. Akan muncul indikator pemuatan bertuliskan **"Memproses gambar di backend..."**

Proses ini memerlukan waktu beberapa detik hingga maksimal 45 detik tergantung kecepatan koneksi internet Anda.

![Pratinjau Foto dan Proses Analisis](https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/rilis/v1.1/screenshot/3-Hasil-Foto.PNG)

---

**Langkah 6 — Lihat hasil prediksi**

Setelah analisis selesai, hasil prediksi akan muncul di bagian bawah layar dalam tiga tab: **Hasil**, **Prediksi**, dan **Histori**.

![Hasil Prediksi Nominal Uang](https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/rilis/v1.1/screenshot/4-Hasil-Prediksi.PNG)

---

### Metode 2: Menggunakan Galeri

**Langkah 1 — Ketuk tombol "Galeri"**

Pada layar utama, ketuk tombol **Galeri** yang berada di sisi kanan bawah area pratinjau.

---

**Langkah 2 — Pilih foto dari galeri**

Galeri foto perangkat Anda akan terbuka. Navigasi ke folder yang berisi foto uang kertas, lalu ketuk foto yang ingin dianalisis.

---

**Langkah 3 — Tunggu dan lihat hasil**

Sama seperti Metode 1, aplikasi akan memproses gambar secara otomatis dan menampilkan hasil prediksi.

---

### Mengulang Deteksi

Jika Anda ingin menganalisis uang kertas yang berbeda setelah mendapatkan hasil, gunakan tombol yang tersedia:

- **Foto Ulang** — Membuka kamera untuk mengambil foto baru
- **Ganti Gambar** — Membuka galeri untuk memilih foto lain

---

## 6. Tips Pengambilan Foto yang Baik

Kualitas foto sangat mempengaruhi ketepatan hasil prediksi. Ikuti panduan berikut untuk mendapatkan hasil terbaik.

### Pencahayaan

| Kondisi | Rekomendasi |
|---|---|
| **Baik** | Ruangan terang dengan cahaya alami atau lampu putih |
| **Hindari** | Cahaya redup, malam hari tanpa pencahayaan cukup |
| **Hindari** | Cahaya langsung dari lampu yang memantul ke uang (glare) |
| **Hindari** | Foto di bawah sinar matahari langsung yang terlalu terik |

**Tips:** Gunakan cahaya dari arah samping (bukan dari depan langsung) agar tidak ada pantulan cahaya di permukaan uang.

---

### Posisi dan Jarak Kamera

1. **Posisikan uang secara horizontal** — letakkan uang kertas mendatar di permukaan datar seperti meja
2. **Kamera tegak lurus** — arahkan kamera dari atas, sejajar dengan permukaan uang (sudut 90°)
3. **Jarak ideal** — sekitar 15–25 cm dari uang kertas, pastikan seluruh uang terlihat dalam bingkai
4. **Tidak perlu zoom** — hindari penggunaan zoom digital yang dapat mengurangi kualitas gambar

![Contoh Posisi dan Framing Pengambilan Foto yang Baik](https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/rilis/v1.1/screenshot/2-Ambil-Gambar.PNG)

---

### Kondisi Uang Kertas

| Kondisi | Dampak terhadap Deteksi |
|---|---|
| Uang bersih dan tidak terlipat | Hasil terbaik |
| Uang sedikit kusut | Masih bisa terdeteksi |
| Uang sangat kusut / terlipat banyak | Dapat mengurangi akurasi |
| Uang dengan coretan atau sobek parah | Dapat terdeteksi sebagai "Bukan Uang" |

---

### Framing (Pembingkaian)

- Pastikan **seluruh bagian uang** masuk dalam bingkai foto
- Hindari memotret **sebagian uang** saja (hanya sisi kiri atau kanan)
- Berikan sedikit ruang di tepi bingkai — jangan terlalu rapat ke pinggir
- Latar belakang sebaiknya **polos dan kontras** dengan warna uang (misal: meja kayu atau kain putih)

---

### Checklist Sebelum Foto

Sebelum mengambil foto, pastikan:

- [ ] Pencahayaan cukup terang dan merata
- [ ] Uang kertas diletakkan mendatar di permukaan datar
- [ ] Kamera diarahkan tegak lurus dari atas
- [ ] Seluruh bagian uang terlihat dalam bingkai
- [ ] Gambar tidak buram (fokus kamera sudah terkunci)
- [ ] Tidak ada bayangan tangan atau benda lain menutupi uang

---

## 7. Memahami Hasil Prediksi

Setelah gambar berhasil dianalisis, hasil akan ditampilkan dalam panel di bawah area pratinjau. Terdapat tiga komponen informasi utama:

### Nominal

Menampilkan nilai pecahan uang kertas yang terdeteksi oleh sistem AI.

Contoh tampilan: **Rp50.000,00**

Jika gambar tidak dikenali sebagai uang kertas, akan tampil: **Tidak dikenali**

---

### Confidence Score (Tingkat Keyakinan)

Menunjukkan seberapa yakin sistem AI terhadap hasil prediksinya, dinyatakan dalam persentase (0%–100%).

| Rentang Confidence | Interpretasi |
|---|---|
| **80% – 100%** | Sangat yakin — hasil prediksi sangat dapat diandalkan |
| **60% – 79%** | Cukup yakin — hasil prediksi kemungkinan besar benar |
| **40% – 59%** | Kurang yakin — coba ulangi dengan foto yang lebih baik |
| **Di bawah 40%** | Tidak yakin — kualitas foto perlu ditingkatkan |

> **Tips:** Jika confidence score rendah, coba ambil foto ulang dengan pencahayaan lebih baik dan posisi kamera yang lebih tegak lurus.

![Tampilan Hasil Prediksi: Nominal, Confidence, dan Status](https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/rilis/v1.1/screenshot/4-Hasil-Prediksi.PNG)

---

### Status

Menampilkan kategori hasil deteksi:

| Status | Arti |
|---|---|
| **Uang kertas Indonesia** | Gambar berhasil dikenali sebagai uang kertas Rupiah |
| **Bukan uang kertas** | Sistem mendeteksi gambar bukan merupakan uang kertas (lihat penjelasan OOD di bawah) |

---

### Deteksi OOD (Out-of-Distribution)

**OOD** adalah singkatan dari *Out-of-Distribution*, yaitu kondisi ketika gambar yang difoto tidak termasuk dalam kategori uang kertas Rupiah yang dikenali sistem.

Sistem akan menampilkan status **"Bukan uang kertas"** apabila:

- Foto yang diambil bukan uang kertas (misalnya: foto wajah, benda, pemandangan)
- Foto uang dari negara lain (bukan Rupiah)
- Foto uang Rupiah emisi selain tahun 2016
- Foto terlalu buram atau gelap sehingga sistem tidak dapat mengenali pola apapun
- Uang kertas rusak parah atau sebagian besar tidak terlihat

> **Catatan:** Ini adalah fitur keamanan yang disengaja. Sistem RupiahVision dirancang hanya untuk mendeteksi uang kertas Rupiah emisi 2016. Input di luar kategori tersebut akan secara otomatis ditolak dan dikategorikan sebagai "Bukan Uang".

---

## 8. Fitur Tab Hasil

Setelah prediksi berhasil, panel hasil menampilkan tiga tab yang dapat dipilih:

### Tab "Hasil"

Tab pertama menampilkan ringkasan utama prediksi:

- **Nominal** — Pecahan uang yang terdeteksi
- **Confidence** — Persentase keyakinan prediksi
- **Status** — Kategori hasil (uang kertas / bukan uang kertas)

![Tab Hasil: Nominal, Confidence Score, dan Status](https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/rilis/v1.1/screenshot/4-Hasil-Prediksi.PNG)

---

### Tab "Prediksi"

Tab kedua menampilkan **daftar prediksi teratas** dari semua kelas yang dianalisis, beserta visualisasi bar chart persentasenya.

Ini berguna untuk melihat apakah model AI benar-benar yakin atau masih ragu antara beberapa kelas nominal.

Contoh tampilan:
```
Rp50.000,00   ████████████████░░  87%
Rp20.000,00   ██░░░░░░░░░░░░░░░░   8%
Rp100.000,00  █░░░░░░░░░░░░░░░░░   3%
...
```

---

### Tab "Histori"

Tab ketiga menampilkan **informasi historis dan edukatif** tentang pecahan uang yang terdeteksi. Informasi dibagi dalam tiga tampilan yang dapat di-scroll:

**Ringkasan dan Gambar Uang:**

![Tampilan Histori - Ringkasan Uang Kertas](https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/rilis/v1.1/screenshot/5a-Histori-Gambar.PNG)

**Deskripsi Mendalam — Sejarah Desain Depan dan Belakang:**

![Tampilan Histori - Deskripsi Mendalam](https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/rilis/v1.1/screenshot/5b-Histori-Mendalam.PNG)

**Tabel Informasi Lengkap Uang Kertas:**

![Tampilan Histori - Tabel Detail Uang Kertas](https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/rilis/v1.1/screenshot/5c-Histori-Tabel.PNG)

Informasi yang tersedia pada tab Histori mencakup:

- Tokoh pahlawan nasional yang tergambar pada uang
- Tanggal penerbitan
- Ukuran dan warna dominan uang
- Deskripsi desain sisi depan dan belakang
- Informasi budaya dan sejarah terkait desain uang

---

## 9. Nominal Uang yang Didukung

RupiahVision mendukung 7 pecahan uang kertas Rupiah **Seri Pahlawan Nasional Emisi 2016**:

| Nominal | Tokoh Depan | Warna Dominan |
|---|---|---|
| **Rp 1.000,00** | Tjut Meutia | Hijau |
| **Rp 2.000,00** | Mohammad Hoesni Thamrin | Abu-abu |
| **Rp 5.000,00** | Dr. K.H. Idham Chalid | Cokelat |
| **Rp 10.000,00** | Frans Kaisiepo | Ungu |
| **Rp 20.000,00** | Dr. G.S.S.J. Ratulangi | Hijau |
| **Rp 50.000,00** | Ir. H. Djuanda Kartawidjaja | Biru |
| **Rp 100.000,00** | Soekarno & Mohammad Hatta | Merah |

> **Penting:** Aplikasi ini **hanya** mendukung uang kertas Rupiah emisi 2016. Uang kertas emisi lama atau emisi lainnya tidak akan dikenali dengan benar dan akan dikategorikan sebagai "Bukan Uang".

---

## 10. Troubleshooting

Berikut adalah masalah umum yang mungkin Anda temui beserta solusinya:

---

### Masalah Koneksi Backend

**Gejala:** Muncul pesan error *"Tidak bisa menghubungi backend RupiahVision. Pastikan koneksi internet aktif dan coba lagi."*

**Penyebab:** Perangkat tidak terhubung ke internet, atau server backend sedang tidak aktif.

**Solusi:**
1. Pastikan perangkat terhubung ke jaringan Wi-Fi atau data seluler
2. Coba buka halaman web lain untuk memverifikasi koneksi internet aktif
3. Tunggu beberapa menit lalu coba lagi — server backend mungkin sedang memulai ulang (*cold start*)
4. Jika masalah berlanjut, coba matikan dan hidupkan kembali Wi-Fi atau data seluler

---

### Backend Terlalu Lama Merespons

**Gejala:** Muncul pesan error *"Backend terlalu lama merespons. Pastikan service Render sudah Live, lalu coba lagi."*

**Penyebab:** Server backend RupiahVision mungkin sedang dalam keadaan *sleep* (tidak aktif karena tidak ada permintaan dalam waktu lama). Server biasanya perlu waktu 30–60 detik untuk aktif kembali.

**Solusi:**
1. Tunggu 1–2 menit
2. Coba lagi dengan menekan tombol **Foto Ulang** atau **Ganti Gambar** dan kirimkan gambar kembali
3. Jika sudah 3 kali gagal, periksa status koneksi internet Anda

---

### Foto Tidak Terdeteksi sebagai Uang (OOD)

**Gejala:** Status menampilkan *"Bukan uang kertas"* padahal foto yang diambil adalah uang Rupiah.

**Penyebab dan Solusi:**

| Kemungkinan Penyebab | Solusi |
|---|---|
| Foto terlalu gelap | Pindah ke tempat lebih terang atau nyalakan lampu |
| Foto buram / tidak fokus | Tahan posisi kamera lebih stabil, tunggu fokus otomatis mengunci |
| Uang terpotong dalam bingkai | Mundurkan kamera agar seluruh uang terlihat |
| Uang sangat kusut / terlipat | Luruskan uang terlebih dahulu sebelum difoto |
| Latar belakang terlalu ramai | Letakkan uang di atas permukaan polos |
| Emisi uang bukan tahun 2016 | Aplikasi hanya mendukung uang emisi 2016 |

---

### Confidence Score Rendah

**Gejala:** Nominal terdeteksi namun confidence score di bawah 60%.

**Solusi:**
1. Ambil foto ulang dengan pencahayaan yang lebih baik
2. Pastikan kamera tegak lurus (tidak miring) terhadap permukaan uang
3. Bersihkan lensa kamera dari noda atau debu
4. Pastikan seluruh bagian uang terlihat jelas dalam bingkai

---

### Aplikasi Meminta Izin Berulang

**Gejala:** Setiap kali membuka kamera atau galeri, aplikasi selalu meminta izin.

**Solusi:**
1. Buka **Pengaturan** perangkat
2. Pilih **Aplikasi** → **RupiahVision**
3. Pilih **Izin**
4. Aktifkan izin **Kamera** dan **Foto/Media/File** secara permanen

---

### Aplikasi Tiba-tiba Berhenti

**Gejala:** Aplikasi crash atau berhenti mendadak.

**Solusi:**
1. Tutup aplikasi sepenuhnya dari daftar aplikasi yang berjalan
2. Buka kembali aplikasi
3. Jika masalah berulang, coba restart perangkat Anda
4. Pastikan memori penyimpanan perangkat tidak penuh

---

### Gambar Gagal Dibuka dari Galeri

**Gejala:** Muncul pesan *"Gagal membuka gambar. Coba pilih gambar lain dari Galeri."*

**Penyebab:** Format file gambar yang tidak didukung, atau file gambar rusak.

**Solusi:**
1. Pastikan foto yang dipilih dalam format JPEG, PNG, atau WEBP
2. Coba pilih foto lain dari galeri
3. Jika foto baru diambil dari kamera lain, coba kirimkan ke perangkat dan pilih kembali

---

## 11. Informasi Teknis

| Komponen | Detail |
|---|---|
| **Nama Aplikasi** | RupiahVision |
| **Versi** | v1.1 |
| **Platform** | Android (React Native + Expo) |
| **Backend** | FastAPI — `https://rupiahvision.onrender.com` |
| **Model AI** | MobileNetV2 (TFLite) |
| **Emisi Uang Didukung** | Bank Indonesia Seri Pahlawan Nasional 2016 |
| **Timeout Koneksi** | 45 detik |
| **Format Gambar Diterima** | JPEG, PNG, WEBP |
| **Kode Sumber** | https://github.com/RupiahVision/ |

---

*© 2026 RupiahVision. Dokumen ini merupakan panduan resmi penggunaan aplikasi RupiahVision versi Android.*
