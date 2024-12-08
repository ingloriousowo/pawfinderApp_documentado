from fastapi import FastAPI
from routes.user import user
from routes.Login import login
from routes.SignUp import signup
from routes.petReport import reporteMascota
from routes.AdoptRegister import adoptRegister
import firebase_admin 
from firebase_admin import credentials, storage

cred = credentials.Certificate('pawfinder-aa1a9-firebase-adminsdk-t1bwy-562848a9e0.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'pawfinder-aa1a9.firebasestorage.app'
})

app = FastAPI(
    title="PawFinder", 
    version="1.0", 
    description="Api centralizada para el manejo de datos dentro de la aplicacion PawFinder"
    )

app.include_router(user)
app.include_router(login)
app.include_router(signup)
app.include_router(reporteMascota)
app.include_router(adoptRegister)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://localhost:8100"],  # O el dominio donde esté tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)