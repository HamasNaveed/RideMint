import os
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

bearer_scheme = HTTPBearer()

async def get_current_user(credentials=Depends(bearer_scheme)) -> str:
    token = credentials.credentials
    secret = os.getenv("SUPABASE_JWT_SECRET")
    
    if not secret:
        raise HTTPException(status_code=500, detail="SUPABASE_JWT_SECRET not configured")
        
    try:
        payload = jwt.decode(
            token,
            key=secret,
            algorithms=["HS256"],
            audience="authenticated",
            options={"verify_exp": True}
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="No user ID in token")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")
