
import os
from typing import List, Tuple
from dataclasses import dataclass
from pptx.util import Mm, Pt, Cm
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR_TYPE
from pptx.enum.text import PP_ALIGN

from app.models.project_site_model import ProjectSiteModel


class TextboxCreator:
    def __init__(self, slide, font_name='Century Gothic', font_color=[0, 0, 0]):
        self.slide = slide
        self.font_name = font_name
        self.font_color = font_color

    def create_text(self, point_data: ProjectSiteModel):
        pass

    def generate_description(self, point_data: ProjectSiteModel) -> str:
        if point_data.type == 'Смешанная':
            total_capacity = point_data.capacity_child + point_data.capacity_adult
            description = (
                f"Смешанная поликлиника на {total_capacity} мест\n"
                f"(Детские: {point_data.capacity_child} мест, Взрослые: {point_data.capacity_adult} мест)"
            )
        elif point_data.type == 'Детская':
            description = f"Детская поликлиника на {point_data.capacity_child} мест"
        elif point_data.type == 'Взрослая':
            description = f"Взрослая поликлиника на {point_data.capacity_adult} мест"
        else:
            description = "Тип поликлиники не указан"
        return description

    def add_textbox(self, point_data: ProjectSiteModel, point_emu: Tuple[float, float], textbox_width: float, textbox_height: float, top: float, left: float):
        try:
            textbox = self.slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, textbox_width, textbox_height)

            textbox.fill.solid()
            textbox.fill.fore_color.rgb = RGBColor(255, 255, 255)
            textbox.line.color.rgb = RGBColor(255, 179, 8)
            textbox.line.width = Pt(1.5)

            text_frame = textbox.text_frame
            text_frame.word_wrap = True
            text_frame.auto_size = True

            print('Text data', point_data)

            if point_data.address:
                text_frame.text = point_data.address
                paragraph = text_frame.paragraphs[0]
                paragraph.alignment = PP_ALIGN.CENTER
                paragraph.font.name = self.font_name
                paragraph.font.size = Pt(14)
                paragraph.font.color.rgb = RGBColor(*self.font_color)
                paragraph.font.italic = False
                paragraph.font.bold = True

            description = self.generate_description(point_data)
            if description:
                paragraph = text_frame.add_paragraph()
                paragraph.text = description
                paragraph.alignment = PP_ALIGN.CENTER
                paragraph.font.name = self.font_name
                paragraph.font.size = Pt(12)
                paragraph.font.color.rgb = RGBColor(*self.font_color)
                paragraph.font.italic = False
                paragraph.font.bold = True
                paragraph.font.underline  = True

            return textbox
        except Exception as e:
            print(f"Ошибка при добавлении текстбокса на слайд: {e}")
            return None