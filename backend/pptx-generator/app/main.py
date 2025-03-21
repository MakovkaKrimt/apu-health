import json
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import StreamingResponse
from app.models.analysis_model import AnalysisModel
from app.models.policlinics_model import PoliclinicsModel
from app.models.population_model import PopulationDTO
from app.models.project_site_model import ProjectSiteModel
from app.services.pptx_service import PptxService
import os
import tempfile
import traceback

app = FastAPI()

TEMPLATE_PATH = "./templates/template.pptx"

@app.get("/")
async def health_check():
    return {
        "healthy":1
    }


@app.post("/generate-pptx")
async def create_pptx(
    image: UploadFile = File(...), 
    projectSite: str = Form(...),
    analysisData:str = Form(...),
    policlinics:str=Form(...)
):

    temp_image_path = None
    temp_pptx_path = None
    try:
        project_site = json.loads(projectSite)
        project_site_model = ProjectSiteModel(**project_site)

        analysis_data = json.loads(analysisData)
        analysis_model = AnalysisModel(**analysis_data)

        policlinics_data = json.loads(policlinics)
        policlinics_model = PoliclinicsModel(policlinics=policlinics_data)

        # print('Policlinics',policlinics_model)
            
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp_image:
            temp_image.write(await image.read())
            temp_image_path = temp_image.name

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pptx") as temp_pptx:
            temp_pptx_path = temp_pptx.name

        pptx_service = PptxService()
        await pptx_service.generate_pptx(TEMPLATE_PATH, temp_image_path, temp_pptx_path,analysis_model,policlinics_model,project_site_model)

        print('Complete!')

        file_stream = open(temp_pptx_path, mode="rb")
        response = StreamingResponse(
            file_stream,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers={"Content-Disposition": f"attachment; filename=result.pptx"},
        )
        return response
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if temp_pptx_path and os.path.exists(temp_pptx_path):
            try:
                os.remove(temp_pptx_path)
            except PermissionError:
                pass
        if temp_image_path and os.path.exists(temp_image_path):
            os.remove(temp_image_path)