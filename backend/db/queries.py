from typing import List, Dict, Any
from datetime import date, datetime
from .supabase_client import get_pool

async def get_profile(user_id: str) -> Dict[str, Any]:
    pool = get_pool()
    query = "SELECT * FROM public.profiles WHERE id = $1 LIMIT 1"
    row = await pool.fetchrow(query, user_id)
    return dict(row) if row else {}

async def get_vehicle(user_id: str) -> Dict[str, Any]:
    pool = get_pool()
    query = "SELECT * FROM public.vehicles WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1"
    row = await pool.fetchrow(query, user_id)
    return dict(row) if row else {}

async def get_current_month_summary(user_id: str) -> Dict[str, Any]:
    pool = get_pool()
    query = """
        SELECT * FROM public.v_monthly_summary 
        WHERE user_id = $1 AND month = DATE_TRUNC('month', CURRENT_DATE)
        LIMIT 1
    """
    row = await pool.fetchrow(query, user_id)
    return dict(row) if row else {}

async def get_latest_maintenance(user_id: str) -> Dict[str, Any]:
    pool = get_pool()
    query = "SELECT * FROM public.maintenance WHERE user_id = $1 ORDER BY service_date DESC LIMIT 1"
    row = await pool.fetchrow(query, user_id)
    return dict(row) if row else {}

async def get_daily_earnings(user_id: str, days: int = 90) -> List[Dict[str, Any]]:
    pool = get_pool()
    query = """
        SELECT date, earnings FROM public.daily_logs
        WHERE user_id = $1 AND date >= CURRENT_DATE - $2::integer
        ORDER BY date ASC
    """
    rows = await pool.fetch(query, user_id, days)
    return [dict(row) for row in rows]

async def get_all_daily_earnings(user_id: str) -> List[Dict[str, Any]]:
    pool = get_pool()
    query = "SELECT date, earnings FROM public.daily_logs WHERE user_id = $1 ORDER BY date ASC"
    rows = await pool.fetch(query, user_id)
    return [dict(row) for row in rows]

async def get_daily_expense_totals(user_id: str, days: int = 90) -> List[Dict[str, Any]]:
    pool = get_pool()
    query = """
        SELECT dl.date, COALESCE(SUM(e.amount), 0) + dl.fuel_cost AS total
        FROM public.daily_logs dl
        LEFT JOIN public.expenses e ON e.daily_log_id = dl.id
        WHERE dl.user_id = $1 AND dl.date >= CURRENT_DATE - $2::integer
        GROUP BY dl.id, dl.date, dl.fuel_cost
        ORDER BY dl.date ASC
    """
    rows = await pool.fetch(query, user_id, days)
    return [dict(row) for row in rows]

FINANCIAL_QUERIES = {
    "monthly_summary": """
        SELECT 
            DATE_TRUNC('month', dl.date) AS month,
            SUM(dl.earnings) AS total_earnings,
            SUM(dl.fuel_cost) AS total_fuel,
            SUM(e.amount) FILTER (WHERE e.category = 'InDrive Cost') AS indrive_cost,
            SUM(e.amount) FILTER (WHERE e.category = 'Package Cost') AS package_cost,
            SUM(dl.earnings) - COALESCE(SUM(e.amount), 0) AS net_profit,
            COUNT(DISTINCT dl.date) FILTER (WHERE dl.earnings > 0) AS working_days,
            AVG(dl.earnings) FILTER (WHERE dl.earnings > 0) AS avg_earning_day
        FROM public.daily_logs dl
        LEFT JOIN public.expenses e ON e.daily_log_id = dl.id
        WHERE dl.user_id = $1 AND dl.date BETWEEN $2 AND $3
        GROUP BY DATE_TRUNC('month', dl.date)
        ORDER BY month DESC
    """,
    "expense_by_category": """
        SELECT 
            e.category,
            SUM(e.amount) AS total,
            ROUND(SUM(e.amount) / NULLIF(SUM(dl.earnings), 0) * 100, 2) AS pct_of_earnings
        FROM public.expenses e
        JOIN public.daily_logs dl ON dl.id = e.daily_log_id
        WHERE e.user_id = $1 AND dl.date BETWEEN $2 AND $3
        GROUP BY e.category ORDER BY total DESC
    """,
    "best_days": """
        SELECT date, earnings, fuel_cost, earnings - fuel_cost AS net
        FROM public.daily_logs
        WHERE user_id = $1 AND earnings > 0
        ORDER BY earnings DESC LIMIT $2
    """,
}
