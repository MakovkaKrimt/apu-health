from pydantic import BaseModel, Field
from pydantic.alias_generators import to_snake
from typing import List, Optional

class ProjectSiteModel(BaseModel):
    type:str
    address:str
    capacity_child: Optional[int] = Field(default=None, alias="capacityChild")
    capacity_adult: Optional[int] = Field(default=None, alias="capacityAdult")
    x: float
    y: float 

    class Config:
        alias_generator = to_snake
        populate_by_name = True