from pptx import Presentation
from pptx.util import Cm
import os
import time
from dataclasses import dataclass
from typing import List, Dict, Tuple
from app.models.policlinics_model import PoliclinicsDTO
from app.models.population_model import PopulationDTO
from app.utils import PointManager,TextManager,TextReplacer


PAGE_HEIGHT = 297.0

class PptxService:

    async def generate_pptx(self, template_path:str,background_image_path:str, output_path: str, polyclinics:PoliclinicsDTO, population:PopulationDTO,project_area:str = None):

        prs = Presentation(template_path)
        slide = prs.slides[0]

        text_manager = TextManager(slide)
        point_manager = PointManager(slide,PAGE_HEIGHT)

        slide.shapes.add_picture(background_image_path, left=Cm(2.66), top=Cm(6.64), height=Cm(16.65))

        text_manager.update_placeholders(polyclinics,population)

        point_manager.add_points(polyclinics)


        prs.save("result.pptx")