from typing import List, Tuple, Dict, Optional
from dataclasses import dataclass

@dataclass
class PolygonData:
    """Структура данных для хранения полигона с отверстиями"""
    exterior: List[Tuple[float, float]]
    holes: List[List[Tuple[float, float]]]
