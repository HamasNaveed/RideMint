CREATE OR REPLACE VIEW public.v_monthly_summary AS
SELECT
    dl.user_id,
    DATE_TRUNC('month', dl.date) AS month,
    SUM(dl.earnings) AS total_earnings,
    SUM(dl.fuel_cost) AS total_fuel_cost,
    COALESCE(SUM(e.amount), 0) AS total_other_expenses,
    SUM(dl.earnings) - SUM(dl.fuel_cost) - COALESCE(SUM(e.amount), 0) AS net_profit,
    COUNT(DISTINCT dl.date) FILTER (WHERE dl.earnings > 0) AS working_days
FROM public.daily_logs dl
LEFT JOIN public.expenses e ON e.daily_log_id = dl.id AND e.category != 'Fuel'
GROUP BY dl.user_id, DATE_TRUNC('month', dl.date);

CREATE OR REPLACE VIEW public.v_expense_by_category AS
SELECT
    e.user_id,
    DATE_TRUNC('month', dl.date) AS month,
    e.category,
    SUM(e.amount) AS total,
    COUNT(*) AS transaction_count
FROM public.expenses e
JOIN public.daily_logs dl ON dl.id = e.daily_log_id
GROUP BY e.user_id, DATE_TRUNC('month', dl.date), e.category;
