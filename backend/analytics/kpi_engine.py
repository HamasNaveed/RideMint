from backend.db import queries

def compute_monthly_kpis(current: dict, prev: dict) -> dict:
    """Computes KPIs given monthly summary data."""
    total_earnings = current.get("total_earnings") or 0
    total_fuel_cost = current.get("total_fuel_cost") or 0
    total_other_expenses = current.get("total_other_expenses") or 0
    net_profit = current.get("net_profit") or 0
    working_days = current.get("working_days") or 0

    prev_earnings = prev.get("total_earnings") or 0
    prev_expenses = (prev.get("total_fuel_cost") or 0) + (prev.get("total_other_expenses") or 0)
    prev_profit = prev.get("net_profit") or 0
    
    total_expenses = total_fuel_cost + total_other_expenses
    profit_margin = (net_profit / total_earnings * 100) if total_earnings > 0 else 0
    fuel_ratio = (total_fuel_cost / total_earnings * 100) if total_earnings > 0 else 0
    avg_daily_earnings = (total_earnings / working_days) if working_days > 0 else 0

    revenue_mom_change = ((total_earnings - prev_earnings) / prev_earnings) if prev_earnings > 0 else 0
    expense_mom_change = ((total_expenses - prev_expenses) / prev_expenses) if prev_expenses > 0 else 0
    profit_mom_change = ((net_profit - prev_profit) / prev_profit) if prev_profit > 0 else 0

    return {
        "total_earnings": float(total_earnings),
        "total_expenses": float(total_expenses),
        "net_profit": float(net_profit),
        "profit_margin": float(profit_margin),
        "fuel_ratio": float(fuel_ratio),
        "working_days": int(working_days),
        "avg_daily_earnings": float(avg_daily_earnings),
        "revenue_mom_change": float(revenue_mom_change),
        "expense_mom_change": float(expense_mom_change),
        "profit_mom_change": float(profit_mom_change),
    }

async def compute_metric(user_id: str, metric: str, period: str = "this_month") -> dict:
    if metric == "profit_margin":
        curr = await queries.get_current_month_summary(user_id)
        earn = curr.get("total_earnings") or 0
        prof = curr.get("net_profit") or 0
        margin = (prof / earn * 100) if earn > 0 else 0
        return {"metric": "profit_margin", "value": margin, "period": period}
    
    elif metric == "fuel_ratio":
        curr = await queries.get_current_month_summary(user_id)
        earn = curr.get("total_earnings") or 0
        fuel = curr.get("total_fuel_cost") or 0
        ratio = (fuel / earn * 100) if earn > 0 else 0
        return {"metric": "fuel_ratio", "value": ratio, "period": period}
        
    elif metric == "avg_daily_earnings":
        curr = await queries.get_current_month_summary(user_id)
        earn = curr.get("total_earnings") or 0
        days = curr.get("working_days") or 0
        avg = (earn / days) if days > 0 else 0
        return {"metric": "avg_daily_earnings", "value": avg, "period": period}
        
    return {"error": f"Metric {metric} not implemented fully yet."}
