# RupiahVision

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
│   │   └── v1.0/
│   │       ├── app-release.aab
│   │       └── app-release.apk
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
└── README.md
```
