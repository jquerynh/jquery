from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from mangum import Mangum  # opsional; Vercel python runtime udah handle
import re
import sys, os
sys.path.append(os.path.dirname(__file__))
from _lib import signer, ensure_user, send_magic_link

app = FastAPI()

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

@app.post("/api/auth_request")
async def handler(request: Request):
    data = await request.json()
    email = (data.get("email") or "").strip().lower()
    if not EMAIL_RE.match(email):
        return JSONResponse({"error": "email tidak valid"}, status_code=400)

    ensure_user(email)
    token = signer.dumps(email)
    try:
        await send_magic_link(email, token)
    except Exception as e:
        return JSONResponse({"error": f"gagal kirim email: {e}"}, status_code=500)
    return {"ok": True, "message": "Link terkirim, cek inbox."}

# Vercel butuh variabel `handler`
handler = Mangum(app)
