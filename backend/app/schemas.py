from pydantic import BaseModel, Field


class PredictionItem(BaseModel):
    label: str
    confidence: float = Field(ge=0, le=1)


class PredictionResponse(BaseModel):
    label: str
    confidence: float = Field(ge=0, le=1)
    predictions: list[PredictionItem]
    image_width: int
    image_height: int
