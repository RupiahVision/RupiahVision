from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import UnidentifiedImageError

from app.ml.classifier import predict_image
from app.schemas import PredictionResponse


app = FastAPI(
    title="RupiahVision API",
    description="Backend API untuk klasifikasi gambar dari aplikasi React Native.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)) -> dict:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File harus berupa gambar.")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="File gambar kosong.")

    try:
        return predict_image(image_bytes)
    except UnidentifiedImageError as exc:
        raise HTTPException(status_code=400, detail="Gambar tidak valid.") from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Gagal memproses gambar.") from exc
