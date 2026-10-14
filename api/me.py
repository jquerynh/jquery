from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import sys, os
sys.path.append(os.path.dirname(__file__))
from _lib import parse_session, get_user

app = FastAPI()

@app.get("/api/me")
async def handler(request: Request):
    email = parse_session(request.cookies.get("session"))
    if not email:
        return JSONResponse({"error": "unauthorized"}, status_code=401)
    u = get_user(email)
    if not u:
        return JSONResponse({"error": "user tidak ada"}, status_code=404)
    return {
        "email": u["email"],
        "premium": u["premium"] == "1",
        "created_at": int(u["created_at"]),
        "last_login": int(u["last_login"]),
    }
