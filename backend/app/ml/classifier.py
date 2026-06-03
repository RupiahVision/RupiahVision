from io import BytesIO

import numpy as np
from PIL import Image


LABELS = [
    "100000",
    "50000",
    "20000",
    "10000",
    "5000",
    "2000",
    "1000",
    "bukanuang",
]


def _normalize_scores(scores: dict[str, float]) -> list[dict[str, float]]:
    total = sum(max(value, 0.0) for value in scores.values()) or 1.0
    normalized = [
        {"label": label, "confidence": round(max(scores[label], 0.0) / total, 4)}
        for label in LABELS
    ]
    return sorted(normalized, key=lambda item: item["confidence"], reverse=True)


def predict_image(image_bytes: bytes) -> dict:
    """Demo classifier.

    Replace this function with TensorFlow/PyTorch/TFLite inference for a trained model.
    Keep the return shape stable so the mobile app does not need to change.
    """
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    resized = image.resize((224, 224))
    pixels = np.asarray(resized, dtype=np.float32) / 255.0

    channel_mean = pixels.mean(axis=(0, 1))
    contrast = float(pixels.std())
    brightness = float(channel_mean.mean())
    red, green, blue = [float(value) for value in channel_mean]

    scores = {
        "100000": red * 0.45 + brightness * 0.35 + contrast * 0.20,
        "50000": blue * 0.45 + contrast * 0.35 + brightness * 0.20,
        "20000": green * 0.45 + brightness * 0.25 + contrast * 0.30,
        "10000": red * 0.25 + green * 0.35 + contrast * 0.40,
        "5000": green * 0.30 + blue * 0.35 + (1.0 - brightness) * 0.35,
        "2000": blue * 0.30 + (1.0 - brightness) * 0.45 + contrast * 0.25,
        "1000": red * 0.20 + green * 0.20 + blue * 0.20 + contrast * 0.40,
        "bukanuang": max(0.0, 0.45 - contrast) + abs(brightness - 0.5) * 0.30,
    }
    predictions = _normalize_scores(scores)
    top = predictions[0]

    return {
        "label": top["label"],
        "confidence": top["confidence"],
        "predictions": predictions,
        "image_width": image.width,
        "image_height": image.height,
    }
