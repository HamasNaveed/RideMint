import numpy as np
from backend.db import queries

async def detect_all(user_id: str) -> list[dict]:
    trends = []
    
    earnings = await queries.get_daily_earnings(user_id, days=30)
    if len(earnings) >= 7:
        values = [float(r["earnings"]) for r in earnings]
        x = np.arange(len(values))
        y = np.array(values)
        slope, _ = np.polyfit(x, y, 1)
        
        if slope > 50:
            trends.append({
                "type": "trend",
                "title": "Positive Earnings Trend",
                "body": f"Your daily earnings are growing by roughly PKR {int(slope)} per day on average.",
                "priority": 1
            })
        elif slope < -50:
            trends.append({
                "type": "trend",
                "title": "Negative Earnings Trend",
                "body": f"Your daily earnings are decreasing by roughly PKR {abs(int(slope))} per day on average.",
                "priority": 2
            })

    return trends
