import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IlN1cGFiYXNlLVRyYWNrZXIiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNjQ0MTYwMCwiZXhwIjoyMDQyMDc2ODAwfQ.placeholder';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const HAMAS_USER_ID = 'd7b6f63a-867c-4735-97ad-e0d47346dd99';

// Seed data fallback in case local Supabase is not running/accessible
const FALLBACK_SEED_DATA = [
    { Date: '16-Feb', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 220, rawDate: '2026-02-16' },
    { Date: '17-Feb', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 860, rawDate: '2026-02-17' },
    { Date: '18-Feb', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 770, rawDate: '2026-02-18' },
    { Date: '19-Feb', Type: 'Expense', Description: 'Fuel', 'Amount (PKR)': 2000, rawDate: '2026-02-19' },
    { Date: '19-Feb', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 900, rawDate: '2026-02-19' },
    { Date: '27-Feb', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 840, rawDate: '2026-02-27' },
    { Date: '28-Feb', Type: 'Expense', Description: 'Fuel', 'Amount (PKR)': 1900, rawDate: '2026-02-28' },
    { Date: '28-Feb', Type: 'Expense', Description: 'InDrive Cost', 'Amount (PKR)': 370, rawDate: '2026-02-28' },
    { Date: '01-Mar', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 670, rawDate: '2026-03-01' },
    { Date: '01-Mar', Type: 'Expense', Description: 'Package Cost', 'Amount (PKR)': 37, rawDate: '2026-03-01' },
    { Date: '01-Mar', Type: 'Expense', Description: 'Package Cost', 'Amount (PKR)': 17, rawDate: '2026-03-01' },
    { Date: '03-Mar', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 416, rawDate: '2026-03-03' },
    { Date: '03-Mar', Type: 'Expense', Description: 'Package Cost', 'Amount (PKR)': 17, rawDate: '2026-03-03' },
    { Date: '04-Mar', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 320, rawDate: '2026-03-04' },
    { Date: '04-Mar', Type: 'Expense', Description: 'Package Cost', 'Amount (PKR)': 17, rawDate: '2026-03-04' },
    { Date: '05-Mar', Type: 'Expense', Description: 'Package Cost', 'Amount (PKR)': 27, rawDate: '2026-03-05' },
    { Date: '05-Mar', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 320, rawDate: '2026-03-05' },
    { Date: '05-Mar', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 350, rawDate: '2026-03-05' },
    { Date: '09-Mar', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 400, rawDate: '2026-03-09' },
    { Date: '09-Mar', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 400, rawDate: '2026-03-09' },
    { Date: '05-Mar', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 250, rawDate: '2026-03-05' },
    { Date: '12-Mar', Type: 'Expense', Description: 'Fuel', 'Amount (PKR)': 2650, rawDate: '2026-03-12' },
    { Date: '16-Mar', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 400, rawDate: '2026-03-16' },
    { Date: '06-Apr', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 660, rawDate: '2026-04-06' },
    { Date: '06-Apr', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 450, rawDate: '2026-04-06' },
    { Date: '06-Apr', Type: 'Expense', Description: 'Package Cost', 'Amount (PKR)': 20, rawDate: '2026-04-06' },
    { Date: '26-Apr', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 1000, rawDate: '2026-04-26' },
    { Date: '27-Apr', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 500, rawDate: '2026-04-27' },
    { Date: '27-Apr', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 500, rawDate: '2026-04-27' },
    { Date: '28-Apr', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 350, rawDate: '2026-04-28' },
    { Date: '29-Apr', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 600, rawDate: '2026-04-29' },
    { Date: '30-Apr', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 1050, rawDate: '2026-04-30' },
    { Date: '30-Apr', Type: 'Expense', Description: 'Package Cost', 'Amount (PKR)': 20, rawDate: '2026-04-30' },
    { Date: '30-Apr', Type: 'Expense', Description: 'InDrive Cost', 'Amount (PKR)': 350, rawDate: '2026-04-30' },
    { Date: '30-Apr', Type: 'Expense', Description: 'Fuel', 'Amount (PKR)': 4960, rawDate: '2026-04-30' },
    { Date: '04-May', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 900, rawDate: '2026-05-04' },
    { Date: '04-May', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 230, rawDate: '2026-05-04' },
    { Date: '04-May', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 240, rawDate: '2026-05-04' },
    { Date: '05-May', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 400, rawDate: '2026-05-05' },
    { Date: '05-May', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 450, rawDate: '2026-05-05' },
    { Date: '06-May', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 860, rawDate: '2026-05-06' },
    { Date: '06-May', Type: 'Expense', Description: 'InDrive Cost', 'Amount (PKR)': 350, rawDate: '2026-05-06' },
    { Date: '08-May', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 400, rawDate: '2026-05-08' },
    { Date: '08-May', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 300, rawDate: '2026-05-08' },
    { Date: '11-May', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 1100, rawDate: '2026-05-11' },
    { Date: '11-May', Type: 'Expense', Description: 'Package Cost', 'Amount (PKR)': 300, rawDate: '2026-05-11' },
    { Date: '12-May', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 500, rawDate: '2026-05-12' },
    { Date: '13-May', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 1000, rawDate: '2026-05-13' },
    { Date: '07-Jun', Type: 'Expense', Description: 'Fuel', 'Amount (PKR)': 4400, rawDate: '2026-06-07' },
    { Date: '15-Jun', Type: 'Earning', Description: 'Ride Income', 'Amount (PKR)': 550, rawDate: '2026-06-15' }
];

const getLocalStorageTransactions = () => {
    const saved = localStorage.getItem('HAMAS_SUPABASE_MOCK_TXS');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('HAMAS_SUPABASE_MOCK_TXS', JSON.stringify(FALLBACK_SEED_DATA));
    return FALLBACK_SEED_DATA;
};

const saveLocalStorageTransaction = (newTx) => {
    const txs = getLocalStorageTransactions();
    txs.push(newTx);
    txs.sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
    localStorage.setItem('HAMAS_SUPABASE_MOCK_TXS', JSON.stringify(txs));
};

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
        console.warn("Supabase fetch failed, falling back to mock localStorage data:", e);
        return getLocalStorageTransactions();
    }
};

export const addTransactionToSupabase = async (transaction) => {
    const isEarning = transaction.Type === 'Earning';
    const amount = Number(transaction['Amount (PKR)']);
    const desc = transaction.Description;
    let dbDate = transaction.rawDate || new Date().toISOString().split('T')[0];

    // Format Date for mock fallback
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date(dbDate);
    const formattedDay = String(d.getDate()).padStart(2, '0');
    const formattedMonth = months[d.getMonth()];
    const formattedDate = `${formattedDay}-${formattedMonth}`;

    const newMockTx = {
        Date: formattedDate,
        Type: transaction.Type,
        Description: desc,
        'Amount (PKR)': amount,
        rawDate: dbDate
    };

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
        console.warn("Supabase insert failed, falling back to mock localStorage save:", e);
        saveLocalStorageTransaction(newMockTx);
    }
};
