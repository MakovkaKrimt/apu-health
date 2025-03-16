from pydantic import BaseModel
from typing import List, Optional

class PopulationDTO(BaseModel):
    min_zone_population: Optional[int] = None
    max_zone_population: Optional[int] = None