def build_daily_log_doc(row: dict) -> str:
    date_str = str(row.get("date", ""))
    earn = row.get("earnings", 0)
    fuel = row.get("fuel_cost", 0)
    dist = row.get("distance_km", 0)
    notes = row.get("notes") or ""
    
    doc = f"Daily work log for {date_str}. Total earnings: PKR {earn}. Fuel cost: PKR {fuel}."
    if dist > 0:
        doc += f" Distance driven: {dist} km."
    if notes:
        doc += f" Notes: {notes}."
    
    return doc

def build_expense_doc(row: dict) -> str:
    cat = row.get("category", "Unknown")
    amt = row.get("amount", 0)
    desc = row.get("description") or ""
    date_str = str(row.get("created_at", ""))[:10]
    
    doc = f"Expense record on {date_str}. Category: {cat}. Amount: PKR {amt}."
    if desc:
        doc += f" Description: {desc}."
    return doc
    
def build_maintenance_doc(row: dict) -> str:
    stype = row.get("service_type", "Unknown")
    cost = row.get("cost", 0)
    sdate = str(row.get("service_date", ""))
    odo = row.get("odometer") or "Unknown"
    ndue = row.get("next_due_km") or "Unknown"
    notes = row.get("notes") or ""
    
    doc = f"Vehicle maintenance: {stype} on {sdate}. Cost: PKR {cost}. Odometer at service: {odo} km. Next service due at: {ndue} km."
    if notes:
        doc += f" Notes: {notes}."
    return doc
