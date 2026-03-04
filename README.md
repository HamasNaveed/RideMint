# Indrive Tracker App

A stunning, fast, and 100% free web app to track your Indrive earnings and expenses using Google Sheets as a database!

## How to Set Up Your Google Sheet Database

Since you want the app accessible anywhere for free, it uses a Google Sheet to store your data.

1. Create a new [Google Sheet](https://sheets.new).
2. Name the first tab **Sheet1**.
3. *Optional but recommended*: Open your existing `Indrive - Sheet1.csv`, copy the data, and paste it directly into this new Sheet.
4. From the top menu, go to **Extensions > Apps Script**.
5. Delete any code there, and paste the code found in `src/utils/APPS_SCRIPT.js`.
6. Click the blue **Deploy** button at the top right, then **New deployment**.
7. Click the gear icon next to "Select type" and choose **Web app**.
8. Fill in:
   - Description: `Indrive API`
   - Execute as: `Me`
   - Who has access: `Anyone`
9. Click **Deploy** (you may need to "Authorize Access").
10. Copy the **Web app URL** it gives you. You're done!

## Running the App

### Local Development
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser. Click the **Settings (Gear Icon)** at the top right, and paste your **Web app URL**. The app will instantly download your data!

### Deployment (Vercel or GitHub Pages)
Because this app saves data to Google Sheets, you don't need a backend server.
1. Push this entire folder to a **GitHub Repository**.
2. Go to [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repository.
4. Let Vercel build it (it will run `npm run build` automatically).
5. Click **Deploy**. Your app is now live on the internet!
