from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse, HTMLResponse
from itsdangerous import BadSignature
import sys, os
sys.path.append(os.path.dirname(__file__))
from _lib import (
    signer, ensure_user, set_premium, touch_login, TOKEN_TTL
)

app = FastAPI()

@app.get("/api/auth_verify")
async def handler(token: str):
    try:
        email = signer.loads(token, max_age=TOKEN_TTL)
    except BadSignature:
        return HTMLResponse("<h1>❌ Link kadaluarsa / rusak</h1>", status_code=400)

    ensure_user(email)
    set_premium(email, 1)   # <-- premium di-set saat login
    touch_login(email)

    session = signer.dumps(email)
    resp = RedirectResponse("/dashboard.html", status_code=302)
    resp.set_cookie(
        "session", session,
        httponly=True, samesite="lax", secure=True,
        max_age=60 * 60 * 24 * 30,
        path="/",
    )
    return resp
