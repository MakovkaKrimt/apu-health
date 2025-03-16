from pydantic import BaseModel
from typing import List, Optional

class Policlinic(BaseModel):
    id: int
    type: str
    design_capacity_adults: Optional[int] = None 
    design_capacity_kids: Optional[int] = None
    x: float
    y: float
    within_isochrone: bool
                            
class PoliclinicsDTO(BaseModel):
    policlinics: List[Policlinic]