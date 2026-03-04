import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function Dashboard({ transactions }) {
    // Calculate stats
    const earnings = transactions.filter(t => t.Type === 'Earning').reduce((acc, curr) => acc + Number(curr['Amount (PKR)']), 0);
    const expenses = transactions.filter(t => t.Type === 'Expense').reduce((acc, curr) => acc + Number(curr['Amount (PKR)']), 0);
    const profit = earnings - expenses;

    // Calculate unique days for daily average
    const uniqueDays = new Set(transactions.map(t => t.Date)).size || 1;
    const dailyAvg = earnings / uniqueDays;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-muted">Total Earnings</h3>
                    <TrendingUp className="text-success" size={20} />
                </div>
                <h2 className="text-2xl text-gradient">Rs {earnings.toLocaleString()}</h2>
            </div>

            <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-muted">Total Expenses</h3>
                    <TrendingDown className="text-danger" size={20} />
                </div>
                <h2 className="text-2xl text-gradient">Rs {expenses.toLocaleString()}</h2>
            </div>

            <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-muted">Net Profit</h3>
                    <DollarSign className={profit >= 0 ? "text-success" : "text-danger"} size={20} />
                </div>
                <h2 className="text-2xl text-gradient">Rs {profit.toLocaleString()}</h2>
            </div>

            <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-muted">Daily Avg (Income)</h3>
                    <Activity className="text-accent-primary" size={20} />
                </div>
                <h2 className="text-2xl text-gradient">Rs {Math.round(dailyAvg).toLocaleString()}</h2>
            </div>
        </div>
    );
}
