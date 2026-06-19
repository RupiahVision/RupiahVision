# RupiahVision

<p align="center">
  <img src="https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/assets/logo-rupiahvision-horizontal.png" alt="RupiahVision Logo" width="480"/>
</p>

![Version](https://img.shields.io/badge/versi-v1.1-blue) ![Platform](https://img.shields.io/badge/platform-Android-green) ![Backend](https://img.shields.io/badge/backend-FastAPI-009688) ![Model](https://img.shields.io/badge/model-MobileNetV2-orange)

RupiahVision adalah aplikasi frontend dan backend untuk mendeteksi nominal mata uang kertas Rupiah dari gambar. Pengguna dapat mengambil atau memilih foto uang kertas, lalu aplikasi mengirim gambar tersebut ke backend machine learning untuk mendapatkan prediksi nominal.

Aplikasi ini berisi:

- `frontend`: React Native/Expo untuk memilih gambar, preview uang kertas, mengirim gambar ke backend, dan menampilkan hasil prediksi.
- `backend`: FastAPI untuk menerima gambar uang kertas dan mengembalikan hasil deteksi nominal.

Label nominal yang digunakan backend:

- `100000`
- `50000`
- `20000`
- `10000`
- `5000`
- `2000`
- `1000`
- `bukanuang`

Backend memakai model TFLite `backend/models/rupiahvision_mobilenet2_float32.tflite` untuk mendeteksi nominal uang kertas Rupiah.

## Screenshot Aplikasi

<table>
  <tr>
    <td align="center">
      <img src="https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/rilis/v1.1/screenshot/0-Icon-Aplikasi.PNG" width="200" alt="Ikon Aplikasi"/><br/>
      <sub><b>Ikon Aplikasi</b></sub>
    </td>
    <td align="center">
      <img src="https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/rilis/v1.1/screenshot/1-Halaman-Utama.PNG" width="200" alt="Halaman Utama"/><br/>
      <sub><b>Halaman Utama</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/rilis/v1.1/screenshot/2-Ambil-Gambar.PNG" width="200" alt="Ambil Gambar"/><br/>
      <sub><b>Ambil Gambar</b></sub>
    </td>
    <td align="center">
      <img src="https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/rilis/v1.1/screenshot/3-Hasil-Foto.PNG" width="200" alt="Hasil Foto"/><br/>
      <sub><b>Pratinjau Foto</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/rilis/v1.1/screenshot/4-Hasil-Prediksi.PNG" width="200" alt="Hasil Prediksi"/><br/>
      <sub><b>Hasil Prediksi</b></sub>
    </td>
    <td align="center">
      <img src="https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/rilis/v1.1/screenshot/5a-Histori-Gambar.PNG" width="200" alt="Histori Uang"/><br/>
      <sub><b>Histori Uang</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/rilis/v1.1/screenshot/5b-Histori-Mendalam.PNG" width="200" alt="Histori Mendalam"/><br/>
      <sub><b>Histori Mendalam</b></sub>
    </td>
    <td align="center">
      <img src="https://raw.githubusercontent.com/RupiahVision/RupiahVision/main/frontend/rilis/v1.1/screenshot/5c-Histori-Tabel.PNG" width="200" alt="Histori Tabel"/><br/>
      <sub><b>Tabel Detail Uang</b></sub>
    </td>
  </tr>
</table>

## Demo Video

Tonton demo lengkap penggunaan aplikasi RupiahVision:

▶ [dokumentasi-aplikasi.mp4](https://github.com/RupiahVision/RupiahVision/raw/main/frontend/rilis/v1.1/video/dokumentasi-aplikasi.mp4)

## Download & Instalasi

### Unduh APK (v1.1)

> **[⬇ Download RupiahVision.apk](https://github.com/RupiahVision/RupiahVision/raw/main/frontend/rilis/v1.1/apps/RupiahVision.apk)**

APK ini siap install langsung di perangkat Android tanpa Play Store.

### Langkah Instalasi di Android

1. Aktifkan **Sumber tidak dikenal** di Pengaturan → Keamanan
2. Unduh APK melalui tautan di atas menggunakan browser Android
3. Buka file APK dari notifikasi atau folder Unduhan
4. Ketuk **Instal** dan tunggu hingga selesai
5. Buka aplikasi dan berikan izin **Kamera** serta **Galeri** saat diminta

Untuk panduan lengkap, lihat [USER_GUIDE.md](./USER_GUIDE.md).

## Menjalankan Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate (Windowns)
source .venv/bin/activate (MacBook)
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload (jika tidak bisa gunakan python app/main.py)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

```

Cek API:

```bash
curl http://localhost:8000/health
```

Outputnya akan menghasilkan:
```
{"status":"ok"}
```

## Menjalankan Frontend

```bash
cd frontend
npm install
npx expo install expo-asset
npm start
```

Di perangkat fisik, gunakan URL IP komputer untuk backend, contoh:

```text
http://192.168.1.10:8000
```

Catatan: default Android `http://10.0.2.2:8000` hanya berlaku untuk emulator. Jika APK sudah diinstall di HP fisik, isi kolom Backend API dengan IP komputer/server backend yang bisa dijangkau HP dan pastikan HP berada di jaringan yang sama.

Untuk emulator Android biasanya bisa memakai:

```text
http://10.0.2.2:8000
```

## Membuat APK Release

Metode build APK yang sudah berhasil disimpan sebagai script:

```bash
cd frontend
npm run build:apk
```

Output default akan dibuat di:

```text
RupiahVision-release-arm64-v8a.apk
```

Script `frontend/scripts/build-release-apk.ps1` otomatis menyiapkan kebutuhan build yang sebelumnya menyebabkan error, yaitu:

- memakai JDK 17 portable dari folder `work/jdk` atau fallback `work/apk-build-tools`;
- memakai Node.js 20 portable dari folder `work/node20` atau fallback `work/apk-build-tools`;
- memakai Android SDK command-line tools terbaru;
- menerima Android SDK licenses;
- menjalankan `expo prebuild` jika folder `frontend/android` belum ada;
- menerapkan patch kompatibilitas Kotlin dan native Expo;
- memakai drive pendek sementara, default `R:`, untuk menghindari masalah path panjang Windows;
- membatasi worker dan memory Gradle/CMake agar build tidak mudah gagal karena kehabisan memory;
- membuat APK khusus arsitektur `arm64-v8a`.

APK yang dibuat cocok untuk uji coba/manual install di Android. Untuk rilis produksi di Play Store, gunakan konfigurasi signing key release milik sendiri.

## Model ML

Model utama disimpan di:

```text
backend/models/rupiahvision_mobilenet2_float32.tflite
```

Backend membaca model tersebut lewat `backend/app/ml/classifier.py`. Response tetap berbentuk:

```json
{
  "label": "100000",
  "confidence": 0.92,
  "predictions": [
    { "label": "100000", "confidence": 0.92 },
    { "label": "50000", "confidence": 0.04 },
    { "label": "bukanuang", "confidence": 0.01 }
  ]
}
```

## Releases

### v1.1 — 2026-06-18

- Tambah tab **Histori** dengan informasi edukatif setiap pecahan uang (tokoh, desain, sejarah)
- Tambah komponen `BanknoteInsightCard` dengan data lengkap 7 nominal
- Tambah tab **Prediksi** dengan visualisasi bar chart confidence semua kelas
- Perbaikan UI: unifikasi tema warna, layout hasil prediksi lebih ringkas
- Patch kompatibilitas Expo plugin untuk build Xcode 16
- Tambah `expo-dev-client` untuk debugging perangkat fisik
- **[Download APK v1.1](https://github.com/RupiahVision/RupiahVision/raw/main/frontend/rilis/v1.1/apps/RupiahVision.apk)**

### v1.0 — Rilis Awal

- Deteksi nominal uang kertas Rupiah emisi 2016 via foto (kamera / galeri)
- 7 kelas: Rp1.000, Rp2.000, Rp5.000, Rp10.000, Rp20.000, Rp50.000, Rp100.000 + `bukanuang`
- Backend FastAPI dengan model MobileNetV2 TFLite
- Deteksi OOD — gambar bukan uang otomatis ditolak
- Menampilkan confidence score hasil prediksi

## Struktur

```bash
RupiahVision/
├── backend/
│   ├── app/
│   │   ├── ml/
│   │   │   └── classifier.py
│   │   ├── main.py
│   │   └── schemas.py
│   ├── models/
│   │   └── rupiahvision_mobilenet2_float32.tflite
│   └── requirements.txt
├── frontend/
│   ├── assets/
│   │   ├── adaptive-icon.png
│   │   ├── icon.png
│   │   └── logo-rupiahvision-horizontal.png
│   ├── rilis/
│   │   ├── v1.0/
│   │   │   ├── app-release.aab
│   │   │   └── app-release.apk
│   │   └── v1.1/
│   │       ├── apps/
│   │       │   └── RupiahVision.apk
│   │       ├── screenshot/
│   │       │   ├── 0-Icon-Aplikasi.PNG
│   │       │   ├── 1-Halaman-Utama.PNG
│   │       │   ├── 2-Ambil-Gambar.PNG
│   │       │   ├── 3-Hasil-Foto.PNG
│   │       │   ├── 4-Hasil-Prediksi.PNG
│   │       │   ├── 5a-Histori-Gambar.PNG
│   │       │   ├── 5b-Histori-Mendalam.PNG
│   │       │   └── 5c-Histori-Tabel.PNG
│   │       └── video/
│   │           └── dokumentasi-aplikasi.mp4
│   ├── scripts/
│   │   └── build-release-apk.ps1
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActionButton.js
│   │   │   ├── BanknoteInsightCard.js
│   │   │   └── PredictionList.js
│   │   ├── data/
│   │   │   └── banknoteDetails.js
│   │   ├── theme/
│   │   │   └── colors.js
│   │   └── utils/
│   │       └── labels.js
│   ├── App.js
│   ├── app.json
│   ├── babel.config.js
│   ├── eas.json
│   ├── package-lock.json
│   └── package.json
├── ml/
│   ├── model/
│   └── notebook/
│       ├── RupiahVision.ipynb
│       └── RV_Dataset_Validation.ipynb
├── .gitignore
├── README.md
└── USER_GUIDE.md
```
