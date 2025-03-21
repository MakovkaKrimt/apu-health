from pydantic import BaseModel, Field
from pydantic.alias_generators import to_camel
from typing import Optional

# Модель для данных о населении
class PopulationStats(BaseModel):
    population: int
    require_child: Optional[int] = Field(default=None, alias="requireChild")
    require_adult: Optional[int] = Field(default=None, alias="requireAdult")

    class Config:
        alias_generator = to_camel
        populate_by_name = True

# Модель для populationData
class PopulationData(BaseModel):
    total: PopulationStats
    isochrone_min: Optional[PopulationStats] = Field(default=None, alias="isochroneMin")
    isochrone_max: Optional[PopulationStats] = Field(default=None, alias="isochroneMax")

    class Config:
        alias_generator = to_camel
        populate_by_name = True

# Модель для policlinicsData
class PoliclinicsData(BaseModel):
    total_child: Optional[int] = Field(default=None, alias="totalChild")
    total_adult: Optional[int] = Field(default=None, alias="totalAdult")

    class Config:
        alias_generator = to_camel
        populate_by_name = True

# Модель для total
class TotalData(BaseModel):
    require_child: Optional[int] = Field(default=None, alias="totalChild")
    require_adult: Optional[int] = Field(default=None, alias="totalAdult")

    class Config:
        alias_generator = to_camel
        populate_by_name = True

# Основная модель для анализа
class AnalysisModel(BaseModel):
    population_data: PopulationData = Field(default=None, alias="populationData")
    policlinics_data: PoliclinicsData = Field(default=None, alias="policlinicsData")
    total: TotalData

    class Config:
        alias_generator = to_camel
        populate_by_name = True