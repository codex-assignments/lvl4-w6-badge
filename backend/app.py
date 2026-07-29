import os
from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client, Client
load_dotenv()
app = Flask(__name__)
# specify origin of frontend requests
CORS(app, origins=[os.getenv("ORIGIN","http://localhost:*")])

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

TABLE = "test_user_table"

# healthcheck
@app.get("/")
def health():
    return {"status": "ok"}

# read
@app.get("/api/users")
def get_resources():
    res = supabase.table(TABLE).select("*").execute()
    return res.data, 200

# create
@app.post("/api/users")
def create_item():
    data = request.get_json()
    if not data.get("first_name") or not data.get("last_name") or not data.get("username"):
        return {"error": "All fields required."}, 400
    newItem= {
        "first_name": data.get("first_name"),
        "last_name": data.get("last_name"),
        "username": data.get("username"),
    }
    res = supabase.table(TABLE).insert(newItem).execute()
    return res.data[0], 200

# update
@app.route("/api/users/<int:app_id>", methods=["PATCH"])
def update_item(app_id):
    data = request.get_json()
    res = supabase.table(TABLE).update(data).eq('id', app_id).execute()
    return res.data[0], 200

# delete
@app.delete("/api/users/<int:app_id>")
def delete_item(app_id):
    res = supabase.table(TABLE).delete().eq("id", app_id).execute()
    return {"message": "Deleted successfully."}, 200


if __name__ == '__main__': 
    app.run(debug=True)