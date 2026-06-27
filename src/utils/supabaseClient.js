import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IlN1cGFiYXNlLVRyYWNrZXIiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNjQ0MTYwMCwiZXhwIjoyMDQyMDc2ODAwfQ.placeholder';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const HAMAS_USER_ID = 'd7b6f63a-867c-4735-97ad-e0d47346dd99';

export const fetchTransactionsFromSupabase = async () => {
    try {
        // 1. Fetch daily logs
        const { data: logs, error: logsError } = await supabase
            .from('daily_logs')
            .select('*')
            .eq('user_id', HAMAS_USER_ID)
            .order('date', { ascending: true });

        if (logsError) throw logsError;

        // 2. Fetch expenses
        const { data: expenses, error: expensesError } = await supabase
            .from('expenses')
            .select('*')
            .eq('user_id', HAMAS_USER_ID);

        if (expensesError) throw expensesError;

        // Format dates correctly from YYYY-MM-DD to DD-MMM
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formatDate = (dateStr) => {
            if (!dateStr) return '';
            const [year, month, day] = dateStr.split('-');
            const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            const formattedDay = String(d.getDate()).padStart(2, '0');
            const formattedMonth = months[d.getMonth()];
            return `${formattedDay}-${formattedMonth}`;
        };

        const transactions = [];

        // Map daily log earnings to transactions
        logs.forEach(log => {
            const formattedDate = formatDate(log.date);
            if (log.earnings > 0) {
                transactions.push({
                    id: `earning-${log.id}`,
                    Date: formattedDate,
                    Type: 'Earning',
                    Description: log.notes || 'Ride Income',
                    'Amount (PKR)': Number(log.earnings),
                    rawDate: log.date
                });
            }
        });

        // Map expenses to transactions
        expenses.forEach(exp => {
            const matchingLog = logs.find(log => log.id === exp.daily_log_id);
            const dateStr = matchingLog ? matchingLog.date : exp.created_at.split('T')[0];
            const formattedDate = formatDate(dateStr);
            transactions.push({
                id: `expense-${exp.id}`,
                Date: formattedDate,
                Type: 'Expense',
                Description: exp.category,
                'Amount (PKR)': Number(exp.amount),
                rawDate: dateStr
            });
        });

        transactions.sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
        return transactions;
    } catch (e) {
        console.error("Supabase fetch failed:", e);
        throw new Error("Supabase is not running or unreachable. Please start your local Supabase database or ensure connection settings are correct.");
    }
};

export const addTransactionToSupabase = async (transaction) => {
    const isEarning = transaction.Type === 'Earning';
    const amount = Number(transaction['Amount (PKR)']);
    const desc = transaction.Description;
    let dbDate = transaction.rawDate || new Date().toISOString().split('T')[0];

    try {
        // 1. Find if a daily log exists for this date and user
        const { data: existingLogs, error: fetchLogError } = await supabase
            .from('daily_logs')
            .select('*')
            .eq('user_id', HAMAS_USER_ID)
            .eq('date', dbDate);

        if (fetchLogError) throw fetchLogError;

        let dailyLogId;
        let existingLog = existingLogs && existingLogs[0];

        if (existingLog) {
            dailyLogId = existingLog.id;
            const updateData = {};
            if (isEarning) {
                updateData.earnings = Number(existingLog.earnings) + amount;
            } else if (desc === 'Fuel') {
                updateData.fuel_cost = Number(existingLog.fuel_cost) + amount;
            }

            if (Object.keys(updateData).length > 0) {
                const { error: updateLogError } = await supabase
                    .from('daily_logs')
                    .update(updateData)
                    .eq('id', dailyLogId);
                if (updateLogError) throw updateLogError;
            }
        } else {
            const insertData = {
                user_id: HAMAS_USER_ID,
                date: dbDate,
                earnings: isEarning ? amount : 0,
                fuel_cost: (!isEarning && desc === 'Fuel') ? amount : 0,
                distance_km: 0,
                notes: 'Web Entry'
            };

            const { data: newLog, error: createLogError } = await supabase
                .from('daily_logs')
                .insert(insertData)
                .select()
                .single();

            if (createLogError) throw createLogError;
            dailyLogId = newLog.id;
        }

        if (!isEarning) {
            const { error: createExpenseError } = await supabase
                .from('expenses')
                .insert({
                    daily_log_id: dailyLogId,
                    user_id: HAMAS_USER_ID,
                    category: desc,
                    amount: amount,
                    description: desc
                });

            if (createExpenseError) throw createExpenseError;
        }
    } catch (e) {
        console.error("Supabase insert failed:", e);
        throw new Error("Supabase insert failed. Please ensure your local database is running and connected.");
    }
};
