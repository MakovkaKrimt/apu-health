from dataclasses import dataclass
from typing import List, Dict, Tuple

@dataclass
class Site:
    row_num: int
    id: int
    inn: str
    name_organization: str
    production_address: str
    revenue_2023: str
    number_2023: str
    salary_2023: float
    taxes_2023: float
    code_okpd2: str
    x: float
    y: float

@dataclass
class SitesDTO:
    points: List[Site]
