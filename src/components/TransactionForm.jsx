import React, { useState } from 'react';
import { format } from 'date-fns';
import { PlusCircle } from 'lucide-react';

export default function TransactionForm({ onAdd, loading }) {
    const [formData, setFormData] = useState({
        Date: format(new Date(), 'dd-MMM'),
        Type: 'Earning',
        Description: 'Ride Income',
        'Amount (PKR)': ''
    });

    const categories = {
        Earning: ['Ride Income'],
        Expense: ['Fuel', 'InDrive Cost', 'Package Cost', 'Other']
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'Type' ? { Description: categories[value][0] } : {})
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData['Amount (PKR)']) return;

        onAdd({
            ...formData,
            'Amount (PKR)': Number(formData['Amount (PKR)'])
        });

        // Reset form mostly but keep Type and Description
        setFormData(prev => ({
            ...prev,
            'Amount (PKR)': ''
        }));
    };

    return (
        <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <h3 className="mb-4 text-gradient">Add New Entry</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="form-group mb-0">
                    <label className="form-label">Date</label>
                    <input
                        type="text"
                        name="Date"
                        value={formData.Date}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="e.g., 04-Mar"
                        required
                    />
                </div>

                <div className="form-group mb-0">
                    <label className="form-label">Type</label>
                    <select name="Type" value={formData.Type} onChange={handleChange} className="form-select">
                        <option value="Earning">Earning</option>
                        <option value="Expense">Expense</option>
                    </select>
                </div>

                <div className="form-group mb-0">
                    <label className="form-label">Description</label>
                    <select name="Description" value={formData.Description} onChange={handleChange} className="form-select">
                        {categories[formData.Type].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group mb-0">
                    <label className="form-label">Amount (PKR)</label>
                    <input
                        type="number"
                        name="Amount (PKR)"
                        value={formData['Amount (PKR)']}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="e.g., 500"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary h-[50px] w-full" disabled={loading}>
                    {loading ? 'Saving...' : <><PlusCircle size={20} /> Add</>}
                </button>
            </form>
        </div>
    );
}
