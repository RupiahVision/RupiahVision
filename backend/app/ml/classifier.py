from functools import lru_cache
from io import BytesIO
from pathlib import Path

import numpy as np
from PIL import Image


try:
    from tflite_runtime.interpreter import Interpreter
except ImportError:  # pragma: no cover - fallback for local TensorFlow installs
    from tensorflow.lite.python.interpreter import Interpreter


MODEL_PATH = (
    Path(__file__).resolve().parents[2]
    / "models"
    / "rupiahvision_mobilenet2_float32.tflite"
)

API_LABELS = [
    "100000",
    "50000",
    "20000",
    "10000",
    "5000",
    "2000",
    "1000",
    "bukanuang",
]

MODEL_LABELS = [
    "1000",
    "10000",
    "100000",
    "2000",
    "20000",
    "5000",
    "50000",
    "bukanuang",
]

IMAGE_SIZE = (224, 224)
IMAGENET_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
IMAGENET_STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)


@lru_cache(maxsize=1)
def _get_interpreter() -> Interpreter:
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model TFLite tidak ditemukan: {MODEL_PATH}")

    interpreter = Interpreter(model_path=str(MODEL_PATH), num_threads=1)
    interpreter.allocate_tensors()
    return interpreter


def _preprocess_image(image: Image.Image, input_details: dict) -> np.ndarray:
    image = image.convert("RGB").resize(IMAGE_SIZE)
    pixels = np.asarray(image, dtype=np.float32) / 255.0
    pixels = (pixels - IMAGENET_MEAN) / IMAGENET_STD

    input_shape = tuple(int(dim) for dim in input_details["shape"])
    input_dtype = input_details["dtype"]

    if len(input_shape) != 4:
        raise ValueError(f"Shape input model tidak didukung: {input_shape}")

    if input_shape[1] == 3:
        tensor = np.transpose(pixels, (2, 0, 1))[np.newaxis, ...]
    elif input_shape[-1] == 3:
        tensor = pixels[np.newaxis, ...]
    else:
        raise ValueError(f"Format input model tidak dikenali: {input_shape}")

    if input_dtype == np.float32:
        return tensor.astype(np.float32)

    if input_dtype == np.uint8:
        quantization_scale, quantization_zero = input_details["quantization"]
        if not quantization_scale:
            return np.clip(tensor * 255.0, 0, 255).astype(np.uint8)
        return np.clip((tensor / quantization_scale) + quantization_zero, 0, 255).astype(np.uint8)

    return tensor.astype(input_dtype)


def _softmax(values: np.ndarray) -> np.ndarray:
    values = values.astype(np.float32)
    values = values - np.max(values)
    exp_values = np.exp(values)
    return exp_values / np.sum(exp_values)


def _extract_scores(output: np.ndarray) -> np.ndarray:
    scores = np.squeeze(output).astype(np.float32)

    if scores.ndim != 1:
        raise ValueError(f"Shape output model tidak didukung: {output.shape}")

    if scores.size != len(MODEL_LABELS):
        raise ValueError(
            f"Jumlah output model {scores.size} tidak sama dengan jumlah label {len(MODEL_LABELS)}"
        )

    if np.any(scores < 0.0) or not np.isclose(float(np.sum(scores)), 1.0, atol=0.05):
        scores = _softmax(scores)

    return scores


def _format_predictions(scores: np.ndarray) -> list[dict[str, float]]:
    score_by_label = {
        label: float(scores[index])
        for index, label in enumerate(MODEL_LABELS)
    }

    predictions = [
        {
            "label": label,
            "confidence": round(score_by_label[label], 4),
        }
        for label in API_LABELS
    ]
    return sorted(predictions, key=lambda item: item["confidence"], reverse=True)


def predict_image(image_bytes: bytes) -> dict:
    image = Image.open(BytesIO(image_bytes))
    original_width, original_height = image.size

    interpreter = _get_interpreter()
    input_details = interpreter.get_input_details()[0]
    output_details = interpreter.get_output_details()[0]

    input_tensor = _preprocess_image(image, input_details)
    interpreter.set_tensor(input_details["index"], input_tensor)
    interpreter.invoke()

    output_tensor = interpreter.get_tensor(output_details["index"])
    scores = _extract_scores(output_tensor)
    predictions = _format_predictions(scores)
    top = predictions[0]

    return {
        "label": top["label"],
        "confidence": top["confidence"],
        "predictions": predictions,
        "image_width": original_width,
        "image_height": original_height,
    }
