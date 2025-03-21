from typing import List, Optional
from pydantic import BaseModel


class Policlinic(BaseModel):
    type: str
    x: float
    y: float
                            
class PoliclinicsModel(BaseModel):
    policlinics: List[Policlinic]