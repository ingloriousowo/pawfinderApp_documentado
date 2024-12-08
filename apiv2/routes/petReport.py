from fastapi import APIRouter, Form, Response, status, File, UploadFile, HTTPException
from config.db import conn
from schemas.petReport import reporteMascotaEntity, reportesMascotaEntity
from models.petReport import ReporteMascota
from bson import ObjectId
from utilities import upload_image_to_firebase, delete_image_from_firebase
import os

reporteMascota = APIRouter()

@reporteMascota.get("/reportes", response_model=list[ReporteMascota], tags=["reportes"])
def get_all_reportes():
    return reportesMascotaEntity(conn.pawfinder.reporteMascota.find())

@reporteMascota.get("/reportes/{id}", response_model=ReporteMascota, tags=["reportes"])
def get_reporte(id: str):
    return reporteMascotaEntity(conn.pawfinder.reporteMascota.find_one({"_id": ObjectId(id)}))

@reporteMascota.get("/reportes/email/{emailContacto}", response_model=list[ReporteMascota], tags=["reportes"])
def get_reportes_by_email(emailContacto: str):
    reportes = conn.pawfinder.reporteMascota.find({"emailContacto": emailContacto})
    reportes_list = reportesMascotaEntity(reportes)
    if not reportes_list:
        raise HTTPException(status_code=404, detail="No se encontraron reportes para este correo")
    return reportes_list

@reporteMascota.post("/reportes", tags=["reportes"])
async def create_reporte(
    tipo_mascota: str = Form(...),
    nombre_mascota: str = Form(...),
    descripcion: str = Form(...),
    emailContacto: str = Form(...),
    raza: str = Form(...),
    edad: str = Form(...),
    color: str = Form(...),
    direccion: str = Form(...),
    fechaUltimaVista: str = Form(...),
    recompensa: bool = Form(...),
    montoRecompensa: float = Form(None),
    ubicacion_lat: float = Form(...),
    ubicacion_lng: float = Form(...),
    telefonoContacto: str = Form(...),
    urlImagenMascota: UploadFile = File(None)
    ):
    new_reporte = {
        "tipo_mascota": tipo_mascota,
        "nombre_mascota": nombre_mascota,
        "descripcion": descripcion,
        "emailContacto": emailContacto,
        "raza": raza,
        "edad": edad,
        "color": color,
        "direccion": direccion,
        "fechaUltimaVista": fechaUltimaVista,
        "recompensa": recompensa,
        "montoRecompensa": montoRecompensa,
        "ubicacion": {"lat": ubicacion_lat, "lng": ubicacion_lng},
        "telefonoContacto": telefonoContacto
    }
    reporte_id = conn.pawfinder.reporteMascota.insert_one(new_reporte).inserted_id
    create_reporte = conn.pawfinder.reporteMascota.find_one({"_id": reporte_id})

    if urlImagenMascota:
        os.makedirs("Reportes", exist_ok=True)
        _,file_extension = os.path.splitext(urlImagenMascota.filename)
        filename = f"{reporte_id}{file_extension}"
        file_path = f"Reportes/{filename}"

        with open(file_path, "wb") as buffer:
            buffer.write(urlImagenMascota.file.read())

        try:
            imageUrl = upload_image_to_firebase(file_path, filename, "Reportes")
            conn.pawfinder.reporteMascota.update_one({"_id": reporte_id}, {"$set": {"urlImagenMascota": imageUrl}})
            create_reporte["urlImagenMascota"] = imageUrl
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al subir imagen: {e}")
        
    create_reporte["id"] = str(create_reporte["_id"])
    del create_reporte["_id"]

    return {
        "message": "Reporte creado exitosamente",
        "reporte": create_reporte
    }

@reporteMascota.delete("/reportes/{id}", status_code=status.HTTP_204_NO_CONTENT, tags=["reportes"])
def delete_reporte(id: str):
    reporte = conn.pawfinder.reporteMascota.find_one({"_id": ObjectId(id)})
    if not reporte:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")

    if "urlImagenMascota" in reporte:
        image_url = reporte["urlImagenMascota"]
        file_name = image_url.split("/")[-1]
        delete_image_from_firebase(file_name, "Reportes")

    conn.pawfinder.reporteMascota.delete_one({"_id": ObjectId(id)})
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@reporteMascota.put("/reportes/{id}", response_model=ReporteMascota, tags=["reportes"])
async def update_reporte(
    id: str,
    tipo_mascota: str = Form(...),
    nombre_mascota: str = Form(...),
    descripcion: str = Form(...),
    raza: str = Form(...),
    edad: str = Form(...),
    color: str = Form(...),
    direccion: str = Form(...),
    fechaUltimaVista: str = Form(...),
    recompensa: bool = Form(...),
    montoRecompensa: float = Form(None),
    ubicacion_lat: float = Form(...),
    ubicacion_lng: float = Form(...),
    telefonoContacto: str = Form(...),
    urlImagenMascota: UploadFile = File(None)
):
    reporte = conn.pawfinder.reporteMascota.find_one({"_id": ObjectId(id)})
    if not reporte:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")

    updated_data = {
        "tipo_mascota": tipo_mascota,
        "nombre_mascota": nombre_mascota,
        "descripcion": descripcion,
        "raza": raza,
        "edad": edad,
        "color": color,
        "direccion": direccion,
        "fechaUltimaVista": fechaUltimaVista,
        "recompensa": recompensa,
        "montoRecompensa": montoRecompensa,
        "ubicacion": {"lat": ubicacion_lat, "lng": ubicacion_lng},
        "telefonoContacto": telefonoContacto
    }

    if urlImagenMascota:
        os.makedirs("Reportes", exist_ok=True)
        _, file_extension = os.path.splitext(urlImagenMascota.filename)
        filename = f"{id}{file_extension}"
        file_path = f"Reportes/{filename}"

        with open(file_path, "wb") as buffer:
            buffer.write(await urlImagenMascota.read())

        try:
            if "urlImagenMascota" in reporte:
                old_image_url = reporte["urlImagenMascota"]
                old_file_name = old_image_url.split("/")[-1]
                delete_image_from_firebase(old_file_name, "Reportes")

            image_url = upload_image_to_firebase(file_path, filename, "Reportes")
            updated_data["urlImagenMascota"] = image_url
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al subir la nueva imagen: {e}")

    conn.pawfinder.reporteMascota.find_one_and_update({"_id": ObjectId(id)}, {"$set": updated_data})
    updated_reporte = conn.pawfinder.reporteMascota.find_one({"_id": ObjectId(id)})

    return reporteMascotaEntity(updated_reporte)