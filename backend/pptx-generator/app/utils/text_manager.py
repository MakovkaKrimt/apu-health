from typing import Dict
from app.models.analysis_model import AnalysisModel, PopulationData
from app.models.population_model import PopulationDTO
from app.models.project_site_model import ProjectSiteModel
from app.utils.text_replacer import TextReplacer
from app.models.policlinics_model import PoliclinicsModel
import traceback


class TextManager:
    def __init__(self, slide):
        self.text_replacer = TextReplacer(slide)

    def update_analysis_placeholders(self, analysis_model:AnalysisModel):
        try:

            population_data = analysis_model.population_data
            policlinics_data = analysis_model.policlinics_data
            total_data = analysis_model.total

            min_zone_data = population_data.isochrone_min
            max_zone_data = population_data.isochrone_max

            self.text_replacer.replace_text("min_zone_population", str(min_zone_data.population))
            self.text_replacer.replace_text("max_zone_population", str(max_zone_data.population))
            self.text_replacer.replace_text("min_zone_pop_child_req", str(min_zone_data.require_child))
            self.text_replacer.replace_text("min_zone_pop_adult_req", str(min_zone_data.require_adult))
            self.text_replacer.replace_text("max_zone_pop_child_req", str(max_zone_data.require_child))
            self.text_replacer.replace_text("max_zone_pop_adult_req", str(max_zone_data.require_adult))


            self.text_replacer.replace_text("exist_child_capacity", str(policlinics_data.total_child))
            self.text_replacer.replace_text("exist_adult_capacity", str(policlinics_data.total_adult))
            self.text_replacer.replace_text("total_adult_req", total_data.require_adult)
            self.text_replacer.replace_text("total_child_req", total_data.require_child)
                
        except Exception as e:
            print(f"Ошибка обновления текстовых данных: {e}")
            