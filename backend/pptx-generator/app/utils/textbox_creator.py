
import os
from typing import List, Tuple
from dataclasses import dataclass
from pptx.util import Mm, Pt, Cm
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR_TYPE
from pptx.enum.text import PP_ALIGN

from models import Site



class TextboxCreator:
    def __init__(self, slide):
        self.slide = slide

    def add_number_textbox(self, label:str, point_emu: Tuple[float, float], textbox_width: float, textbox_height: float, image_height:float):
        try:
            left = point_emu[0] - textbox_width / 2
            top = point_emu[1] - image_height + Mm(1.4)
            textbox = self.slide.shapes.add_shape(MSO_SHAPE.OVAL, left, top, textbox_width, textbox_height)

            textbox.fill.solid()
            textbox.fill.fore_color.rgb = RGBColor(255, 255, 255)
            textbox.line.color.rgb = RGBColor(62, 140, 189)
            textbox.line.width = Pt(1.25)

            text_frame = textbox.text_frame

            text_frame.margin_left = 0
            text_frame.margin_right = 0
            text_frame.margin_top = 0
            text_frame.margin_bottom = 0

            text_frame.text = label

            paragraph = text_frame.paragraphs[0]
            paragraph.alignment = PP_ALIGN.CENTER
            run = paragraph.runs[0]  
            run.font.bold = True
            run.font.name = 'TT Moscow Economy ExtraBold' 
            run.font.color.rgb = RGBColor(0, 0, 0) 
            run.font.size = Pt(7.0)  

            return textbox
        except Exception as e:
            print(f"Ошибка при добавлении текстбокса на слайд: {e}")
            return None        


    def add_textbox(self, point_data: Site, point_emu: Tuple[float, float], textbox_width: float, textbox_height: float, top_offset:float ,left_offset:float):
        try:
            left = point_emu[0] + Mm(left_offset)
            top = point_emu[1] - Mm(top_offset)
            textbox = self.slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, textbox_width, textbox_height)

            textbox.fill.solid()
            textbox.fill.fore_color.rgb = RGBColor(255, 255, 255)
            textbox.line.color.rgb = RGBColor(5, 55, 83)
            textbox.line.width = Pt(0.5)

            text_frame = textbox.text_frame
            text_frame.word_wrap = True
            text_frame.auto_size = True

            font_color = RGBColor(29, 51, 107)

            if point_data.name_organization:
                text_frame.text = point_data.name_organization
                paragraph = text_frame.paragraphs[0]
                paragraph.alignment = PP_ALIGN.LEFT
                paragraph.font.name = 'TT Moscow Economy ExtraBold'
                paragraph.font.size = Pt(13.6)
                paragraph.font.color.rgb = font_color
                paragraph.font.italic = False
                paragraph.font.bold = True

            if point_data.code_okpd2:
                paragraph = text_frame.add_paragraph()
                paragraph.text = point_data.code_okpd2
                paragraph.alignment = PP_ALIGN.LEFT
                paragraph.font.name = 'TT Moscow Economy Medium'
                paragraph.font.size = Pt(11.2)
                paragraph.font.color.rgb = font_color
                paragraph.font.italic = True
                paragraph.font.bold = False

            if point_data.revenue_2023:
                paragraph = text_frame.add_paragraph()
                run1 = paragraph.add_run()
                run1.text = "Выручка - "
                run1.font.bold = False
                run1.font.italic = False
                run1.font.name = "TT Moscow Economy"
                run1.font.size = Pt(11.2)
                run1.font.color.rgb = font_color

                run2 = paragraph.add_run()
                run2.text = point_data.revenue_2023
                run2.font.bold = True
                run2.font.italic = False
                run2.font.name = "TT Moscow Economy"
                run2.font.size = Pt(11.2)
                run2.font.color.rgb = font_color

                run3 = paragraph.add_run()
                run3.text = " млн руб."
                run3.font.bold = True
                run3.font.italic = False
                run3.font.name = "TT Moscow Economy"
                run3.font.size = Pt(11.2)
                run3.font.color.rgb = font_color

            if point_data.number_2023:
                paragraph = text_frame.add_paragraph()
                run1 = paragraph.add_run()
                run1.text = "Численность - "
                run1.font.bold = False
                run1.font.italic = False
                run1.font.name = "TT Moscow Economy"
                run1.font.size = Pt(11.2)
                run1.font.color.rgb = font_color

                run2 = paragraph.add_run()
                run2.text = point_data.number_2023
                run2.font.bold = True
                run2.font.italic = False
                run2.font.name = "TT Moscow Economy"
                run2.font.size = Pt(11.2)
                run2.font.color.rgb = font_color

            if point_data.salary_2023:
                paragraph = text_frame.add_paragraph()
                run1 = paragraph.add_run()
                run1.text = "Средняя з/п - "
                run1.font.bold = False
                run1.font.italic = False
                run1.font.name = "TT Moscow Economy"
                run1.font.size = Pt(11.2)
                run1.font.color.rgb = font_color

                run2 = paragraph.add_run()
                run2.text = str(point_data.salary_2023)
                run2.font.bold = True
                run2.font.italic = False
                run2.font.name = "TT Moscow Economy"
                run2.font.size = Pt(11.2)
                run2.font.color.rgb = font_color

                run3 = paragraph.add_run()
                run3.text = " тыc. руб."
                run3.font.bold = True
                run3.font.italic = False
                run3.font.name = "TT Moscow Economy"
                run3.font.size = Pt(11.2)
                run3.font.color.rgb = font_color

            if point_data.taxes_2023:
                paragraph = text_frame.add_paragraph()
                run1 = paragraph.add_run()
                run1.text = "Налоги - "
                run1.font.bold = False
                run1.font.italic = False
                run1.font.name = "TT Moscow Economy"
                run1.font.size = Pt(11.2)
                run1.font.color.rgb = font_color

                run2 = paragraph.add_run()
                run2.text = str(point_data.taxes_2023)
                run2.font.bold = True
                run2.font.italic = False
                run2.font.name = "TT Moscow Economy"
                run2.font.size = Pt(11.2)
                run2.font.color.rgb = font_color

                run3 = paragraph.add_run()
                run3.text = " млн руб."
                run3.font.bold = True
                run3.font.italic = False
                run3.font.name = "TT Moscow Economy"
                run3.font.size = Pt(11.2)
                run3.font.color.rgb = font_color

            return textbox
        except Exception as e:
            print(f"Ошибка при добавлении текстбокса на слайд: {e}")
            return None
