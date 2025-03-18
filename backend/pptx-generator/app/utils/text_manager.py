from typing import Dict
from app.models.population_model import PopulationDTO
from app.utils.text_replacer import TextReplacer
from app.models.policlinics_model import PoliclinicsDTO


class TextManager:
    def __init__(self, slide):
        self.text_replacer = TextReplacer(slide)

    def calculate_healthcare_capacities(self, polyclinics: PoliclinicsDTO):
        total_adults = 0
        total_kids = 0

        for clinic in polyclinics.policlinics:
            if clinic.within_isochrone: 
                if clinic.design_capacity_adults is not None:
                    total_adults += clinic.design_capacity_adults
                if clinic.design_capacity_kids is not None:
                    total_kids += clinic.design_capacity_kids

        return {
            "exist_adult_capacity": total_adults,
            "exist_child_capacity": total_kids,
        }
    
    def calculate_population_requirements(self, min_zone_population: float, max_zone_population: float):
        return {
            "min_zone_pop_child_req": round(min_zone_population / 1000 * 5.8),
            "min_zone_pop_adult_req": round(min_zone_population / 1000 * 13.2),
            "max_zone_pop_child_req": round(max_zone_population / 1000 * 5.8),
            "max_zone_pop_adult_req": round(max_zone_population / 1000 * 13.2),
        }

    def calculate_total_requirements(self, requirements: dict, capacities:dict):
        total_kids = requirements["min_zone_pop_child_req"] + requirements["max_zone_pop_child_req"] - capacities["exist_child_capacity"]
        total_adults = requirements["min_zone_pop_adult_req"] + requirements["max_zone_pop_adult_req"] - capacities["exist_adult_capacity"]

        return {
            "total_child_req": total_kids,
            "total_adult_req": total_adults
        }

    def update_placeholders(self, polyclinics:PoliclinicsDTO, population_data:PopulationDTO):
        try:
            if population_data:
                min_zone_population,max_zone_population =  population_data.min_zone_population,population_data.max_zone_population

                population_req = self.calculate_population_requirements(min_zone_population,max_zone_population)

                exist_healthcare_capacities = self.calculate_healthcare_capacities(polyclinics)

                total_req = self.calculate_total_requirements(population_req,exist_healthcare_capacities)

                self.text_replacer.replace_text("min_zone_population", str(min_zone_population))
                self.text_replacer.replace_text("max_zone_population", str(max_zone_population))
                self.text_replacer.replace_text("min_zone_pop_child_req", population_req["min_zone_pop_child_req"])
                self.text_replacer.replace_text("min_zone_pop_adult_req", population_req["min_zone_pop_adult_req"])
                self.text_replacer.replace_text("max_zone_pop_child_req", population_req["max_zone_pop_child_req"])
                self.text_replacer.replace_text("max_zone_pop_adult_req", population_req["max_zone_pop_adult_req"])
                self.text_replacer.replace_text("exist_child_capacity", exist_healthcare_capacities["exist_child_capacity"])
                self.text_replacer.replace_text("exist_adult_capacity", exist_healthcare_capacities["exist_adult_capacity"])
                self.text_replacer.replace_text("total_adult_req", total_req["total_adult_req"])
                self.text_replacer.replace_text("total_child_req", total_req["total_child_req"])
                
        except Exception as e:
            print(f"Ошибка обновления текстовых данных: {e}")
            