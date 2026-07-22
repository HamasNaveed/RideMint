from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class Profile(BaseModel):
    id: str
    full_name: Optional[str]
    created_at: datetime

class Vehicle(BaseModel):
    id: str
    user_id: str
    brand: Optional[str]
    model: Optional[str]
    year: Optional[int]
    fuel_type: Optional[str]
    mileage: Optional[int]
    name: Optional[str]
    avg_consumption: Optional[float]
    total_km: Optional[int]
    created_at: datetime

class DailyLog(BaseModel):
    id: str
    user_id: str
    date: date
    earnings: float
    fuel_cost: float
    distance_km: float
    notes: Optional[str]
    created_at: datetime

class Expense(BaseModel):
    id: str
    daily_log_id: str
    user_id: str
    category: str
    amount: float
    description: Optional[str]
    created_at: datetime

class Maintenance(BaseModel):
    id: str
    user_id: str
    vehicle_id: str
    service_type: str
    cost: float
    odometer: Optional[int]
    service_date: date
    next_due_km: Optional[int]
    notes: Optional[str]
    created_at: datetime
