import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { setAppUrl, getAppUrl } from '../utils/googleSheetsAPI';

export default function ConfigModal({ onSave }) {
    const [isOpen, setIsOpen] = useState(!getAppUrl());
    const [url, setLocalUrl] = useState(getAppUrl() || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url) return;
        setAppUrl(url);
        setIsOpen(false);
        onSave();
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn btn-outline"
                title="Settings"
            >
                <Settings size={20} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in" style={{ zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
                    <div className="glass-panel w-full max-w-md relative">
                        <h3 className="mb-4 text-gradient">Configuration</h3>
                        <p className="text-muted mb-4 text-sm">
                            Please enter your Google Apps Script Web App URL below to connect to your Google Sheet.
                        </p>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setLocalUrl(e.target.value)}
                                className="form-input"
                                placeholder="https://script.google.com/macros/s/.../exec"
                                required
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                {getAppUrl() && (
                                    <button type="button" onClick={() => setIsOpen(false)} className="btn btn-outline">
                                        Cancel
                                    </button>
                                )}
                                <button type="submit" className="btn btn-primary">
                                    <Save size={18} /> Save Connection
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
