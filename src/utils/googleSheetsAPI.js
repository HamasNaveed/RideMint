export const setAppUrl = (url) => localStorage.setItem('INDRIVE_APP_URL', url);
export const getAppUrl = () => localStorage.getItem('INDRIVE_APP_URL');

export const fetchTransactions = async () => {
    const url = getAppUrl();
    if (!url) throw new Error("Google Apps Script URL not configured.");

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const json = await response.json();
        return json.data || [];
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
