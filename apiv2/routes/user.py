from fastapi import APIRouter, Response, status
from config.db import conn
from schemas.user import userEntity, usersEntity
from models.user import User
from bson import ObjectId
from starlette.status import HTTP_204_NO_CONTENT
from passlib.context import CryptContext
from fastapi import HTTPException

user = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

@user.get("/users", response_model=list[User], tags=["users"])
def get_all_Users():
    return usersEntity(conn.pawfinder.user.find())

@user.get("/users/{id}", response_model=User, tags=["users"])
def get_User(id: str):
    return userEntity(conn.pawfinder.user.find_one({"_id": ObjectId(id)}))

@user.post("/users", response_model=User, tags=["users"])
def create_User(user: User):
    new_user = dict(user)
    del new_user["id"]

    new_user["password"] = hash_password(new_user["password"])
    
    id = conn.pawfinder.user.insert_one(new_user).inserted_id
    user = conn.pawfinder.user.find_one({"_id": id})

    return userEntity(user)

@user.put("/users/{id}", response_model=User, tags=["users"])
def update_User(id: str, user: User):
    conn.pawfinder.user.find_one_and_update({"_id": ObjectId(id)}, {"$set": dict(user)})
    return userEntity(conn.pawfinder.user.find_one({"_id": ObjectId(id)}))

@user.delete("/users/{id}", status_code=status.HTTP_204_NO_CONTENT, tags=["users"])
def delete_User(id: str):
    try:
        deleted_user = conn.pawfinder.user.find_one_and_delete({"_id": ObjectId(id)})
        if not deleted_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {id} not found"
            )
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )