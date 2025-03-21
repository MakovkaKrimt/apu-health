
from typing import List, Dict
from dataclasses import dataclass
from pptx.util import Mm, Pt, Cm
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR_TYPE
from pptx.enum.text import PP_ALIGN
from app.models.policlinics_model import PoliclinicsModel
from app.utils.point_creator import PointCreator



class PointManager:
    def __init__(self, slide, slide_height_mm: float):
        self.slide = slide
        self.slide_height_mm = slide_height_mm
        self.pin_creator = PointCreator(slide)


    def add_policlinics(self, polyclinics: PoliclinicsModel):

        for point in polyclinics.policlinics:
            try:
                point_emu = (Mm(point.x), Mm(self.slide_height_mm - point.y))

                if (point.type == 'детская'):
                    mso_shape_type = MSO_SHAPE.RECTANGLE
                elif (point.type == 'взрослая'): 
                    mso_shape_type = MSO_SHAPE.OVAL
                else:
                    continue 

                point = self.pin_creator.add_policlinic(point_emu, mso_shape_type, Mm(5.0), Mm(5.0))

            except Exception as e:
                print(f"Ошибка при добавлении точки на слайд: {e}")
                continue