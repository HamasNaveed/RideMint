export const setAppUrl = (url) => localStorage.setItem('INDRIVE_APP_URL', url);
export const getAppUrl = () => localStorage.getItem('INDRIVE_APP_URL');

export const fetchTransactions = async () => {
    const url = getAppUrl();
    if (!url) throw new Error("Google Apps Script URL not configured.");

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const json = await response.json();

        // Format dates correctly from string dates that might come from google, turning things like '2026-02-18T19:00:00.000Z' into '18-Feb'
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const formattedData = (json.data || []).map(tx => {
            let formattedDate = tx.Date;
            if (formattedDate && typeof formattedDate === 'string' && formattedDate.includes('T')) {
                const d = new Date(formattedDate);
                const day = String(d.getDate()).padStart(2, '0');
                const month = months[d.getMonth()];
                formattedDate = `${day}-${month}`;
            }
            return {
                ...tx,
                Date: formattedDate
            };
        });

        return formattedData;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
};

export const addTransaction = async (transaction) => {
    const url = getAppUrl();
    if (!url) throw new Error("Google Apps Script URL not configured.");

    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(transaction),
        });
        const json = await response.json();
        if (!json.success) throw new Error(json.error || "Failed to add transaction");
        return json;
    } catch (error) {
        console.error("Error adding transaction:", error);
        throw error;
    }
};
