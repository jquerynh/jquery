from fastapi import FastAPI
from fastapi.responses import RedirectResponse

app = FastAPI()

@app.get("/api/logout")
async def handler():
    resp = RedirectResponse("/", status_code=302)
    resp.delete_cookie("session", path="/")
    return resp
