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

Backend saat ini memakai classifier demo agar proyek bisa langsung berjalan tanpa dataset. Untuk hasil deteksi nominal yang akurat, ganti logic di `backend/app/ml/classifier.py` dengan model TensorFlow/PyTorch/TFLite yang sudah dilatih menggunakan dataset uang kertas Rupiah.

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

Untuk emulator Android biasanya bisa memakai:

```text
http://10.0.2.2:8000
```

## Mengganti ke Model ML Sungguhan

1. Latih model klasifikasi nominal uang kertas Rupiah dengan label `100000`, `50000`, `20000`, `10000`, `5000`, `2000`, `1000`, dan `bukanuang`.
2. Simpan model ke folder backend, misalnya `backend/models/model.tflite` atau `backend/models/model.keras`.
3. Ubah `backend/app/ml/classifier.py` pada fungsi `predict_image`.
4. Pastikan response tetap berbentuk:

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

```text
RupiahVision/
  backend/
    app/
      main.py
      schemas.py
      ml/classifier.py
    requirements.txt
  frontend/
    App.js
    package.json
    src/
      components/
      theme/
```
