import json
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import StreamingResponse
from app.models.policlinics_model import PoliclinicsDTO
from app.models.population_model import PopulationDTO
from app.services.pptx_service import PptxService
import os
import tempfile

app = FastAPI()

TEMPLATE_PATH = "./templates/template.pptx"

@app.post("/generate-pptx")
async def create_pptx(
    image: UploadFile = File(...), 
    polyclinics: str = Form(...),  
    populationData:str = Form(...),
    projectArea: str = Form(None)     
):

    temp_image_path = None
    temp_pptx_path = None
    try:
        try:
            polyclinics_data = json.loads(polyclinics)
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=400, detail=f"Ошибка парсинга polyclinics: {e}")
        
        policlinics_dto = PoliclinicsDTO(policlinics=polyclinics_data)


        try:
            population_data = json.loads(populationData)
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=400, detail=f"Ошибка парсинга polyclinics: {e}")
        

        # print('population exts',population_data)

        population_dto = PopulationDTO(
            min_zone_population=population_data[0]['total_population_isochrone_min'],
            max_zone_population=population_data[0]['total_population_isochrone_max'] 
        )
        # print('populationData',population_dto)


        project_area = None
        if projectArea:
            try:
                project_area = json.loads(projectArea)
            except json.JSONDecodeError as e:
                raise HTTPException(status_code=400, detail=f"Ошибка парсинга projectArea: {e}")
            

            
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp_image:
            temp_image.write(await image.read())
            temp_image_path = temp_image.name

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pptx") as temp_pptx:
            temp_pptx_path = temp_pptx.name

        pptx_service = PptxService()
        await pptx_service.generate_pptx(TEMPLATE_PATH, temp_image_path, temp_pptx_path,policlinics_dto,population_dto,project_area)

        print('Complete!')

        file_stream = open(temp_pptx_path, mode="rb")
        response = StreamingResponse(
            file_stream,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers={"Content-Disposition": f"attachment; filename=result.pptx"},
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if temp_pptx_path and os.path.exists(temp_pptx_path):
            try:
                os.remove(temp_pptx_path)
            except PermissionError:
                pass
        if temp_image_path and os.path.exists(temp_image_path):
            os.remove(temp_image_path)