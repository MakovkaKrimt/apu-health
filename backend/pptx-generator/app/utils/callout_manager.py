
import os
from typing import List, Dict
from dataclasses import dataclass
from pptx.util import Mm, Pt, Cm
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR_TYPE
from pptx.enum.text import PP_ALIGN

from app.models.project_site_model import ProjectSiteModel


class CalloutManager:
    def __init__(self, slide, slide_height_mm: float):
        self.slide = slide
        self.slide_height_mm = slide_height_mm
        self._point_creator = None
        self._textbox_creator = None
        self._connector_creator = None

    @property
    def point_creator(self):
        if self._point_creator is None:
            from app.utils import PointCreator
            self._point_creator = PointCreator(self.slide)
        return self._point_creator

    @property
    def textbox_creator(self):
        if self._textbox_creator is None:
            from app.utils import TextboxCreator
            self._textbox_creator = TextboxCreator(self.slide)
        return self._textbox_creator

    @property
    def connector_creator(self):
        if self._connector_creator is None:
            from app.utils import ConnectorCreator
            self._connector_creator = ConnectorCreator(self.slide)
        return self._connector_creator

    def add_callout(self, site:ProjectSiteModel):
        try:
            point_emu = (Mm(site.x),Mm(self.slide_height_mm - site.y))

            point = self.point_creator.add_site(point_emu,MSO_SHAPE.RECTANGLE,Mm(5.0), Mm(5.0))

            textbox = self.textbox_creator.add_textbox(site, point_emu, Mm(166.1), Mm(26.1), Mm(38.9),Mm(26.6))

            #     connector = self.connector_creator.add_connector(pin, textbox)

            #     textboxes.append(textbox)
            #     connectors.append(connector)


            # group_shape = self.slide.shapes.add_group_shape([pin, *textboxes, *connectors])
            # group_shape.name = f"Callout_{point.inn}"
        except Exception as e:
            print(f"Ошибка при добавлении проектной точки на слайд: {e}")