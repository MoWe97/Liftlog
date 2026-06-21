import os
import httpx
import jwt
from jwt.algorithms import RSAAlgorithm
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()

CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL")
_jwks: dict | None = None
bearer = HTTPBearer()


async def _fetch_jwks(force: bool = False) -> dict:
    global _jwks
    if _jwks is None or force:
        async with httpx.AsyncClient() as client:
            resp = await client.get(CLERK_JWKS_URL)
            resp.raise_for_status()
            _jwks = resp.json()
    return _jwks


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer)) -> str:
    token = credentials.credentials
    try:
        kid = jwt.get_unverified_header(token)["kid"]
        jwks = await _fetch_jwks()
        key_data = next((k for k in jwks["keys"] if k["kid"] == kid), None)
        if not key_data:
            jwks = await _fetch_jwks(force=True)
            key_data = next((k for k in jwks["keys"] if k["kid"] == kid), None)
        if not key_data:
            raise ValueError("Signing key not found")
        public_key = RSAAlgorithm.from_jwk(key_data)
        payload = jwt.decode(token, public_key, algorithms=["RS256"], options={"verify_aud": False})
        return payload["sub"]
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
