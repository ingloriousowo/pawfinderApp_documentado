from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from pydantic import BaseModel
from config.db import conn
import jwt
from datetime import datetime, timedelta
import os

login = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class LoginData(BaseModel):
    correo: str
    password: str

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "tu_clave_secreta")  # Usa una variable de entorno
ALGORITHM = "HS256"

@login.post("/login", tags=["auth"])
def loginDB(login_data: LoginData):
    user = conn.pawfinder.user.find_one({"correo": login_data.correo})
    if not user:
        raise HTTPException(status_code=404, detail="El usuario no existe")
    
    if not pwd_context.verify(login_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Contraseña incorrecta")
    
    # Crear token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user["correo"]}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "nombre": user["nombre"],
            "apellido": user["apellido"],
            "telefono": user["telefono"],
            "correo": user["correo"],
            "genero": str(user["genero"]),
            "rut": user["rut"],
            "dv": str(user["dv"]),
            "urlFotoPerfil": user["urlFotoPerfil"]
        }
    }

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt