import json
from langchain.tools import BaseTool
from pydantic import BaseModel, Field
from backend.analytics import kpi_engine

class AnalyticsInput(BaseModel):
    metric: str = Field(description="Metric to compute e.g. profit_margin, fuel_ratio, avg_daily_earnings")
    period: str = Field(default="this_month")

class AnalyticsTool(BaseTool):
    name = "compute_business_kpis"
    description = "Compute business KPIs: profit_margin, fuel_ratio, avg_daily_earnings, etc. Specify metric and period."
    args_schema = AnalyticsInput
    _user_id: str = ""
    
    def __init__(self, user_id: str, **kwargs):
        super().__init__(**kwargs)
        self._user_id = user_id
    
    async def _arun(self, metric: str, period: str = "this_month") -> str:
        ALLOWED_METRICS = {
            "profit_margin", "fuel_ratio", "avg_daily_earnings", "revenue_trend",
            "expense_trend", "working_day_frequency", "earnings_consistency",
            "best_weekday", "total_all_time"
        }
        if metric not in ALLOWED_METRICS:
            return f"Error: Unknown metric '{metric}'"
        
        result = await kpi_engine.compute_metric(self._user_id, metric, period)
        return json.dumps(result, default=str)
