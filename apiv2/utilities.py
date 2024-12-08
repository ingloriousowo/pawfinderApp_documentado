from firebase_admin import storage

def upload_image_to_firebase(file_path, file_name, folder):
    full_path = f"{folder}/{file_name}"
    bucket = storage.bucket()
    blob = bucket.blob(full_path)
    blob.upload_from_filename(file_path)
    blob.make_public()
    return blob.public_url

def delete_image_from_firebase(file_name, folder):
    full_path = f"{folder}/{file_name}"
    bucket = storage.bucket()
    blob = bucket.blob(full_path)
    if blob.exists():
        blob.delete()
        return True
    return False