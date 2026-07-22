import numpy as np
from backend.db import queries

class AnomalyDetector:
    async def detect(self, user_id: str) -> list[dict]:
        anomalies = []
        
        # Z-score anomaly on earnings (last 90 days)
        earnings_records = await queries.get_daily_earnings(user_id, days=90)
        if len(earnings_records) >= 14:
            values = np.array([float(r["earnings"]) for r in earnings_records])
            mean, std = values.mean(), values.std()
            
            for record in earnings_records[-7:]:  # Check last 7 days
                if std > 0:
                    z = (float(record["earnings"]) - mean) / std
                    if abs(z) > 2.0:
                        anomalies.append({
                            "type": "alert",
                            "priority": 2 if z < 0 else 1,
                            "title": "Unusual Earnings Day",
                            "body": f"On {record['date']}, earnings were PKR {record['earnings']} (Average: PKR {int(mean)}).",
                            "data": {
                                "date": str(record["date"]),
                                "value": float(record["earnings"]),
                                "z_score": float(z)
                            }
                        })
        
        # IQR spike detection on expenses
        expense_records = await queries.get_daily_expense_totals(user_id, days=90)
        if len(expense_records) >= 14:
            values = np.array([float(r["total"]) for r in expense_records if r["total"] > 0])
            if len(values) > 5:
                q1, q3 = np.percentile(values, 25), np.percentile(values, 75)
                iqr = q3 - q1
                upper_fence = q3 + 1.5 * iqr
                
                for record in expense_records[-14:]:
                    if float(record["total"]) > upper_fence:
                        anomalies.append({
                            "type": "alert",
                            "priority": 3,
                            "title": "Expense Spike Detected",
                            "body": f"Unusually high expenses on {record['date']}: PKR {record['total']}.",
                            "data": {
                                "date": str(record["date"]),
                                "value": float(record["total"]),
                                "upper_fence": float(upper_fence)
                            }
                        })
        
        return anomalies

anomaly_detector = AnomalyDetector()
