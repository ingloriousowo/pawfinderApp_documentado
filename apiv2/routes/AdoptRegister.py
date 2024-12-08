from fastapi import APIRouter, Form, Response, status, File, UploadFile, HTTPException
from schemas.AdoptRegister import adoptRegisterEntity, adoptRegistersEntity
from models.AdoptRegister import AdoptRegister
from config.db import conn
from bson import ObjectId
from utilities import upload_image_to_firebase, delete_image_from_firebase
import os

adoptRegister = APIRouter()

@adoptRegister.post("/adopts", tags=["adopts"])
async def create_adopt(
    petName: str = Form(...),
    petType: str = Form(...),
    breed: str = Form(...),
    age: str = Form(...),
    gender: str = Form(...),
    description: str = Form(...),
    healthStatus: str = Form(...),
    contactName: str = Form(...),
    contactPhone: str = Form(...),
    contactEmail: str = Form(...),
    imageUrl: UploadFile = File(None)
):
    new_adopt = {
        "petName": petName,
        "petType": petType,
        "breed": breed,
        "age": age,
        "gender": gender,
        "description": description,
        "healthStatus": healthStatus,
        "contactName": contactName,
        "contactPhone": contactPhone,
        "contactEmail": contactEmail
    }

    adopt_id = conn.pawfinder.adoptRegister.insert_one(new_adopt).inserted_id
    created_adopt = conn.pawfinder.adoptRegister.find_one({"_id": adopt_id})

    if imageUrl:
        os.makedirs("Adopciones", exist_ok=True)
        _, file_extension = os.path.splitext(imageUrl.filename)
        filename = f"{adopt_id}{file_extension}"
        file_path = f"Adopciones/{filename}"

        with open(file_path, "wb") as buffer:
            buffer.write(imageUrl.file.read())

        try:
            image_url = upload_image_to_firebase(file_path, filename, "Adopciones")
            conn.pawfinder.adoptRegister.update_one({"_id": adopt_id}, {"$set": {"imageUrl": image_url}})
            created_adopt["imageUrl"] = image_url
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al subir imagen: {e}")

    created_adopt["id"] = str(created_adopt["_id"])
    del created_adopt["_id"]

    return {
        "message": "Adopción registrada exitosamente",
        "adopt": created_adopt
    }

@adoptRegister.get("/adopts", response_model=list[AdoptRegister], tags=["adopts"])
def get_all_adopts():
    return adoptRegistersEntity(conn.pawfinder.adoptRegister.find())

@adoptRegister.get("/adopts/{id}", response_model=AdoptRegister, tags=["adopts"])
def get_adopt(id: str):
    return adoptRegisterEntity(conn.pawfinder.adoptRegister.find_one({"_id": ObjectId(id)}))

@adoptRegister.get("/adopts/email/{contactEmail}", response_model=list[AdoptRegister], tags=["adopts"])
def get_adopts_by_email(contactEmail: str):
    adopts = conn.pawfinder.adoptRegister.find({"contactEmail": contactEmail})
    adopt_list = adoptRegistersEntity(adopts)
    if not adopt_list:
        raise HTTPException(status_code=404, detail="No se encontraron adopciones para este correo")
    return adopt_list

@adoptRegister.delete("/adopts/{id}", status_code=status.HTTP_204_NO_CONTENT, tags=["adopts"])
def delete_adopt(id: str):
    adopt = conn.pawfinder.adoptRegister.find_one({"_id": ObjectId(id)})
    if not adopt:
        raise HTTPException(status_code=404, detail="Adopción no encontrada")

    if "imageUrl" in adopt:
        image_url = adopt["imageUrl"]
        file_name = image_url.split("/")[-1]
        delete_image_from_firebase(file_name, "Adopciones")

    conn.pawfinder.adoptRegister.delete_one({"_id": ObjectId(id)})
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@adoptRegister.put("/adopts/{id}", response_model=AdoptRegister, tags=["adopts"])
async def update_adopt(
    id: str,
    petName: str = Form(...),
    petType: str = Form(...),
    breed: str = Form(...),
    age: str = Form(...),
    gender: str = Form(...),
    description: str = Form(...),
    healthStatus: str = Form(...),
    contactName: str = Form(...),
    contactPhone: str = Form(...),
    contactEmail: str = Form(...),
    imageUrl: UploadFile = File(None)
):
    adopt = conn.pawfinder.adoptRegister.find_one({"_id": ObjectId(id)})
    if not adopt:
        raise HTTPException(status_code=404, detail="Adopción no encontrada")

    updated_data = {
        "petName": petName,
        "petType": petType,
        "breed": breed,
        "age": age,
        "gender": gender,
        "description": description,
        "healthStatus": healthStatus,
        "contactName": contactName,
        "contactPhone": contactPhone,
        "contactEmail": contactEmail
    }

    if imageUrl:
        os.makedirs("Adopciones", exist_ok=True)
        _, file_extension = os.path.splitext(imageUrl.filename)
        filename = f"{id}{file_extension}"
        file_path = f"Adopciones/{filename}"

        with open(file_path, "wb") as buffer:
            buffer.write(await imageUrl.read())

        try:
            if "imageUrl" in adopt:
                old_image_url = adopt["imageUrl"]
                old_file_name = old_image_url.split("/")[-1]
                delete_image_from_firebase(old_file_name, "Adopciones")

            image_url = upload_image_to_firebase(file_path, filename, "Adopciones")
            updated_data["imageUrl"] = image_url
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al subir la nueva imagen: {e}")

    conn.pawfinder.adoptRegister.find_one_and_update({"_id": ObjectId(id)}, {"$set": updated_data})
    updated_adopt = conn.pawfinder.adoptRegister.find_one({"_id": ObjectId(id)})

    return adoptRegisterEntity(updated_adopt)

