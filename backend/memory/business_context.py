import json
from backend.db import queries
from .redis_client import redis_client

async def load_business_context(user_id: str) -> dict:
    cache_key = f"business_context:{user_id}"
    cached = await redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    profile = await queries.get_profile(user_id)
    vehicle = await queries.get_vehicle(user_id)
    month_summary = await queries.get_current_month_summary(user_id)
    latest_maint = await queries.get_latest_maintenance(user_id)

    ctx = {
        "user_name": profile.get("full_name", "Driver"),
        "vehicle": {
            "name": vehicle.get("name") if vehicle else None,
            "avg_consumption": float(vehicle.get("avg_consumption")) if vehicle.get("avg_consumption") else None,
            "total_km": int(vehicle.get("total_km")) if vehicle.get("total_km") else None,
        },
        "current_month": {k: float(v) if isinstance(v, str) else v for k, v in month_summary.items()},
        "next_service": {
            "type": latest_maint.get("service_type") if latest_maint else None,
            "due_km": int(latest_maint.get("next_due_km")) if latest_maint and latest_maint.get("next_due_km") else None,
        }
    }
    
    await redis_client.setex(cache_key, 3600, json.dumps(ctx))
    return ctx
