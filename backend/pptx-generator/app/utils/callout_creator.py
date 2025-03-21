import os
from typing import List, Tuple
from dataclasses import dataclass
from pptx.util import Mm, Pt, Cm
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR_TYPE
from pptx.enum.text import PP_ALIGN



class ConnectorCreator:
    def __init__(self, slide):
        self.slide = slide

    def add_connector(self, point, textbox):
        try:
            connector = self.slide.shapes.add_connector(MSO_CONNECTOR_TYPE.ELBOW, Cm(2), Cm(2), Cm(2), Cm(2))
            connector.begin_connect(point, 0)
            connector.end_connect(textbox, 2)
            connector.line.color.rgb = RGBColor(255, 179, 8)
            connector.line.width = Pt(1.75)
            return connector
        except Exception as e:
            print(f"Ошибка при добавлении соединителя на слайд: {e}")
            return None
