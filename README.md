# RideMint

A premium, fast, and feature-rich SaaS web application built for ride-hailing drivers (InDrive, Uber, Careem, etc.) to track earnings, expenses, profitability, and business performance.

RideMint turns manual calculations into clear, actionable financial insights with secure accounts, vehicle profiles, and automatic data synchronization.

---

## Features

- 👤 **Secure Authentication & Multi-User Support**: Individual accounts with email-password sign-in and sign-up powered by Supabase Auth.
- 🚗 **Vehicle & Profile Management**: Track vehicle model, brand, year, mileage, and fuel type.
- 💰 **Earnings & Expenses Tracker**: Log daily earnings, fuel costs, maintenance, and other expenses.
- 📈 **Performance Dashboard**: Real-time summary of total earnings, total expenses, net profit, and clean visual representation.
- ☁️ **Supabase Cloud Database**: Fully secure data storage using Row-Level Security (RLS) policies so you only see your own data.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A [Supabase](https://supabase.com/) account

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/HamasNaveed/RideMint.git
   cd RideMint
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and fill in your Supabase project URL and Anon key.

4. **Initialize the Database Schema**
   Run the SQL migration scripts located in [supabase/migrations](file:///e:/Indrive-app%20Idea/supabase/migrations) on your Supabase SQL Editor:
   - `20260626143418_create_transactions_table.sql`
   - `20260702223700_add_email_exists_rpc.sql`
   - `20260703154500_update_vehicles_schema.sql`

5. **Run Locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Deployment (Vercel or Netlify)

1. Push your code to your GitHub Repository.
2. Link the repository to [Vercel](https://vercel.com/) or Netlify.
3. Configure the environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in your hosting provider's dashboard.
4. Deploy! The application will build automatically using `npm run build`.
