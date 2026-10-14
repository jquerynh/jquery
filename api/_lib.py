import os
import time
import redis
from itsdangerous import URLSafeTimedSerializer, BadSignature
import aiosmtplib
from email.message import EmailMessage

SECRET = os.environ["SECRET"]
BASE_URL = os.environ.get("BASE_URL", "https://example.vercel.app")
SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ["SMTP_USER"]
SMTP_PASS = os.environ["SMTP_PASS"]
FROM_EMAIL = os.environ.get("FROM_EMAIL", SMTP_USER)
TOKEN_TTL = 900  # 15 menit

signer = URLSafeTimedSerializer(SECRET, salt="magic-login")

_r = redis.from_url(os.environ["REDIS_URL"], decode_responses=True)

def kv():
    return _r

def ensure_user(email: str):
    key = f"user:{email}"
    if not _r.exists(key):
        _r.hset(key, mapping={
            "email": email,
            "premium": "0",
            "created_at": int(time.time()),
            "last_login": "0",
        })

def set_premium(email: str, val: int = 1):
    _r.hset(f"user:{email}", "premium", str(val))

def touch_login(email: str):
    _r.hset(f"user:{email}", "last_login", str(int(time.time())))

def get_user(email: str) -> dict | None:
    data = _r.hgetall(f"user:{email}")
    return data or None

def parse_session(cookie: str | None) -> str | None:
    if not cookie:
        return None
    try:
        return signer.loads(cookie, max_age=60 * 60 * 24 * 30)
    except BadSignature:
        return None

async def send_magic_link(email: str, token: str):
    link = f"{BASE_URL}/api/auth_verify?token={token}"
    msg = EmailMessage()
    msg["From"] = FROM_EMAIL
    msg["To"] = email
    msg["Subject"] = "Link login kamu"
    msg.set_content(
        f"Link login (berlaku 15 menit):\n\n{link}\n\nKalau bukan kamu, abaikan."
    )
    msg.add_alternative(f"""\
<html><body style="font-family:system-ui;background:#0d0d0d;color:#eee;padding:32px">
<h2>Login Link</h2>
<p>Link berlaku 15 menit:</p>
<p><a href="{link}" style="background:#4f8cff;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">Masuk</a></p>
<p style="color:#666;font-size:12px">{link}</p>
</body></html>""", subtype="html")

    await aiosmtplib.send(
        msg,
        hostname=SMTP_HOST,
        port=SMTP_PORT,
        start_tls=True,
        username=SMTP_USER,
        password=SMTP_PASS,
    )
