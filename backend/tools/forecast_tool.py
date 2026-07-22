import json
import pandas as pd
from prophet import Prophet
from langchain.tools import BaseTool
from pydantic import BaseModel, Field
from backend.db import queries

class ForecastInput(BaseModel):
    forecast_days: int = Field(default=30, description="Days to forecast")

class ForecastTool(BaseTool):
    name = "forecast_earnings"
    description = "Predict future earnings using historical data. Specify forecast_days (7|14|30|90)."
    args_schema = ForecastInput
    _user_id: str = ""
    
    def __init__(self, user_id: str, **kwargs):
        super().__init__(**kwargs)
        self._user_id = user_id
    
    async def _arun(self, forecast_days: int = 30) -> str:
        records = await queries.get_all_daily_earnings(self._user_id)
        if len(records) < 7:
            return f"Insufficient data for forecasting. Only {len(records)} points. Need 7."
        
        df = pd.DataFrame(records).rename(columns={"date": "ds", "earnings": "y"})
        df["ds"] = pd.to_datetime(df["ds"])
        df = df[df["y"] > 0]
        
        model = Prophet(
            daily_seasonality=False,
            weekly_seasonality=True if len(df) >= 14 else False,
            changepoint_prior_scale=0.05,
            uncertainty_samples=200
        )
        model.fit(df)
        
        future = model.make_future_dataframe(periods=forecast_days)
        forecast = model.predict(future)
        
        cutoff = df["ds"].max()
        future_preds = forecast[forecast["ds"] > cutoff][["ds", "yhat", "yhat_lower", "yhat_upper"]].copy()
        
        future_preds["yhat"] = future_preds["yhat"].clip(lower=0)
        future_preds["yhat_lower"] = future_preds["yhat_lower"].clip(lower=0)
        
        total = float(future_preds["yhat"].sum())
        avg_daily = float(future_preds["yhat"].mean())
        
        daily = []
        for _, row in future_preds.head(30).iterrows():
            daily.append({
                "ds": row["ds"].strftime("%Y-%m-%d"),
                "yhat": round(row["yhat"], 0)
            })
            
        return json.dumps({
            "forecast_days": forecast_days,
            "total_predicted_pkr": round(total, 0),
            "avg_daily_predicted_pkr": round(avg_daily, 0),
            "confidence_lower_pkr": round(float(future_preds["yhat_lower"].sum()), 0),
            "confidence_upper_pkr": round(float(future_preds["yhat_upper"].sum()), 0),
            "data_points_used": len(df),
            "daily_predictions": daily,
            "model": "Prophet"
        }, default=str)
