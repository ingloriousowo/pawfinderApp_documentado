from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from config.db import conn
from models.user import User
from utilities import upload_image_to_firebase
from bson import ObjectId
from passlib.context import CryptContext
import os

signup = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

@signup.post("/signup", tags=["auth"])
async def register_user(
    nombre: str = Form(...),
    apellido: str = Form(...),
    telefono: str = Form(...),
    correo: str = Form(...),
    genero: int = Form(...),
    rut: str = Form(...),
    dv: int = Form(...),
    password: str = Form(...),
    urlFotoPerfil: UploadFile = File(None) 
):
    new_user = {
        "nombre": nombre,
        "apellido": apellido,
        "telefono": telefono,
        "correo": correo,
        "genero": genero,
        "rut": rut,
        "dv": dv,
        "password": hash_password(password),
    }

    user_id = conn.pawfinder.user.insert_one(new_user).inserted_id
    created_user = conn.pawfinder.user.find_one({"_id": user_id})

    if urlFotoPerfil:
        os.makedirs("Usuarios", exist_ok=True)
        _, file_extension = os.path.splitext(urlFotoPerfil.filename)
        filename= f"{user_id}{file_extension}"

        file_path = f"Usuarios/{filename}"
        with open(file_path, "wb") as buffer:
            buffer.write(await urlFotoPerfil.read())

        try:
            image_url = upload_image_to_firebase(file_path, filename, "Usuarios")
            conn.pawfinder.user.update_one({"_id": user_id}, {"$set": {"urlFotoPerfil": image_url}})
            created_user["urlFotoPerfil"] = image_url
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al subir imagen: {e}")
        
    # Convertir el ObjectId a str en la respuesta
    created_user["id"] = str(created_user["_id"])
    del created_user["_id"]

    return {
        "message": "Usuario registrado exitosamente",
        "user": created_user
    }
