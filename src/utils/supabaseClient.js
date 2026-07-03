import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IlN1cGFiYXNlLVRyYWNrZXIiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNjQ0MTYwMCwiZXhwIjoyMDQyMDc2ODAwfQ.placeholder';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const HAMAS_USER_ID = '9f69bafe-f2dd-48a7-a7a9-b56f00973450';

export const ensureAuthenticated = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        throw new Error("No active session. Please log in.");
    }
};

export const getCurrentUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("No active user session.");
    }
    return user.id;
};

export const signInUser = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
};

export const signUpUser = async (email, password) => {
    return await supabase.auth.signUp({ email, password });
};

export const signOutUser = async () => {
    return await supabase.auth.signOut();
};

export const checkEmailExists = async (email) => {
    const { data, error } = await supabase.rpc('email_exists', { email_to_check: email });
    if (error) {
        console.error("Error checking if email exists:", error);
        throw error;
    }
    return data; // boolean
};

export const resetPassword = async (email) => {
    return await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
    });
};

export const fetchTransactionsFromSupabase = async () => {
    try {
        await ensureAuthenticated();
        const userId = await getCurrentUserId();
        // 1. Fetch daily logs
        const { data: logs, error: logsError } = await supabase
            .from('daily_logs')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: true });

        if (logsError) throw logsError;

        // 2. Fetch expenses
        const { data: expenses, error: expensesError } = await supabase
            .from('expenses')
            .select('*')
            .eq('user_id', userId);

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
        await ensureAuthenticated();
        const userId = await getCurrentUserId();
        // 1. Find if a daily log exists for this date and user
        const { data: existingLogs, error: fetchLogError } = await supabase
            .from('daily_logs')
            .select('*')
            .eq('user_id', userId)
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
                user_id: userId,
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
                    user_id: userId,
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
