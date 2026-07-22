import json
from datetime import date, datetime
from langchain.tools import BaseTool
from pydantic import BaseModel, Field
from backend.db import queries
from backend.db.supabase_client import get_pool

ALLOWED_QUERY_TYPES = frozenset({
    "earnings_summary", "expense_breakdown", "best_days", 
    "monthly_summary", "expense_by_category"
})

class SQLQueryInput(BaseModel):
    query_type: str = Field(description="Must be one of: monthly_summary, expense_by_category, best_days")
    start_date: str = Field(description="Start date as YYYY-MM-DD or 'earliest'")
    end_date: str = Field(description="End date as YYYY-MM-DD or 'today'")
    limit: int = Field(default=10, ge=1, le=100)

class SQLTool(BaseTool):
    name = "query_financial_data"
    description = (
        "Query the driver's financial database. Returns earnings, expenses, profit data. "
        "IMPORTANT: query_type must be from the allowed list. "
    )
    args_schema = SQLQueryInput
    _user_id: str = ""
    
    def __init__(self, user_id: str, **kwargs):
        super().__init__(**kwargs)
        self._user_id = user_id
    
    async def _arun(self, query_type: str, start_date: str, end_date: str, limit: int = 10) -> str:
        if query_type not in ALLOWED_QUERY_TYPES:
            return f"Error: Invalid query_type '{query_type}'. Allowed: {list(ALLOWED_QUERY_TYPES)}"
        
        start = self._resolve_date(start_date)
        end = self._resolve_date(end_date)
        if start > end:
            return "Error: start_date must be before end_date"
            
        sql = queries.FINANCIAL_QUERIES.get(query_type)
        if not sql:
            return f"Error: Query {query_type} not found in library."
            
        pool = get_pool()
        rows = await pool.fetch(sql, self._user_id, start, end)
        if limit:
            rows = rows[:limit]
            
        results = [dict(r) for r in rows]
        for r in results:
            for k, v in r.items():
                if isinstance(v, (date, datetime)):
                    r[k] = v.isoformat()
        return json.dumps(results, default=str)
        
    def _resolve_date(self, date_str: str) -> date:
        if date_str == "today":
            return date.today()
        elif date_str == "earliest":
            return date(2020, 1, 1)
        else:
            return datetime.strptime(date_str[:10], "%Y-%m-%d").date()
