# RideMint - Project Documentation

## Project Overview

RideMint is a SaaS web application built for ride-hailing drivers (InDrive, Uber, Careem, etc.) to track earnings, expenses, profitability, and business performance.

The goal is to transform a simple expense calculator into an AI-powered business assistant that helps drivers understand and improve their profits.

This project is also being developed as a portfolio-quality application demonstrating professional software engineering practices including:

* Feature branching
* Pull Requests
* Conventional Commits
* CI/CD
* Database migrations
* Authentication
* Secure backend architecture
* AI integration
* Production deployment

---

# Current Status

## Current Phase

🚧 Phase 2 - Backend Migration

### Current Task

Move application data from Google Sheets to Supabase.

Status: In Progress

---

# Previous MVP

The existing application allows a single user to manually enter:

* Daily earnings
* Fuel expenses
* Other expenses

The application calculates:

* Total expenses
* Daily profit

Current storage:

Google Sheets

Limitation:

No authentication, no multi-user support, no secure backend.

---

# Project Vision

RideMint should become a complete operating system for ride-hailing drivers.

Eventually it should provide:

* Secure user accounts
* Vehicle management
* Expense tracking
* Profit analytics
* Maintenance reminders
* AI financial assistant
* Reports
* Charts
* Fleet support

---

# Tech Stack

Frontend

* Next.js
* React
* TypeScript

Backend

* Supabase

Database

* PostgreSQL

Authentication

* Supabase Auth

Storage

* Supabase Storage

Charts

* Recharts

Deployment

* Vercel

AI

* OpenAI
* LangGraph

Version Control

* Git
* GitHub

CI/CD

* GitHub Actions
* Vercel Deployment

---

# Git Workflow

Main branch

main

Every feature must be developed inside a feature branch.

Example:

feature/setup-supabase

Workflow

Issue

↓

Feature Branch

↓

Development

↓

Testing

↓

Pull Request

↓

Merge into main

---

# Commit Convention

Use Conventional Commits.

Examples:

feat: add Supabase authentication

feat: create daily logs table

fix: correct fuel calculation

refactor: simplify database queries

docs: update project roadmap

chore: configure GitHub Actions

---

# Folder Structure

RideMint/

app/

components/

lib/

hooks/

types/

public/

supabase/

migrations/

seed.sql

config.toml

.github/

workflows/

README.md

PROJECT.md

ROADMAP.md

package.json

---

# Database Design

## profiles

Purpose

Stores user information.

Fields

id

full_name

created_at

---

## vehicles

Purpose

Stores user vehicles.

Fields

id

user_id

brand

model

year

fuel_type

mileage

created_at

---

## daily_logs

Purpose

Stores each working day.

Fields

id

user_id

date

earnings

fuel_cost

distance_km

notes

created_at

---

## expenses

Purpose

Stores expense breakdown.

Fields

id

daily_log_id

user_id

category

amount

description

created_at

---

## maintenance

Purpose

Tracks vehicle servicing.

Fields

id

user_id

vehicle_id

service_type

cost

odometer

service_date

next_due_km

notes

---

# Security

Authentication

Supabase Auth

Authorization

Row Level Security (RLS)

Every user can only access their own data.

No user should ever see another user's information.

---

# Planned Features

## Phase 1

MVP

* Expense tracking
* Profit calculation

Status

Completed

---

## Phase 2

Backend

* Supabase integration
* Database migration
* Authentication
* Multi-user support

Status

In Progress

---

## Phase 3

Dashboard

* Daily analytics
* Weekly analytics
* Monthly analytics
* Charts
* Goals

Status

Not Started

---

## Phase 4

Vehicle Management

* Vehicle profile
* Mileage
* Fuel type
* Multiple vehicles

Status

Not Started

---

## Phase 5

Maintenance

* Oil change reminders
* Tire replacement
* Brake servicing
* Maintenance history

Status

Not Started

---

## Phase 6

Reports

* Weekly report
* Monthly report
* Yearly report
* Export PDF
* Export Excel

Status

Not Started

---

## Phase 7

AI Assistant

Natural language chat.

Examples

"How much profit did I make this month?"

"How much did I spend on fuel last week?"

"What was my best earning day?"

"How can I increase my profits?"

AI should query the database and generate personalized insights.

Potential implementation:

LangGraph

OpenAI

Supabase

---

## Phase 8

Production

* CI/CD
* GitHub Actions
* Automated testing
* Production deployment
* Monitoring
* Error logging

Status

Not Started

---

# Future Ideas

* Fleet management
* Tax estimation
* Fuel price tracker
* OCR receipt scanner
* Voice expense entry
* WhatsApp expense logging
* GPS trip tracking
* AI trip recommendations
* AI expense forecasting
* Driver leaderboard
* Referral program

---

# Development Rules

1. Never commit directly to main.

2. Every feature gets its own branch.

3. Every merge requires testing.

4. Every feature updates PROJECT.md.

5. Every database change uses migrations.

6. Every new feature updates ROADMAP.md.

7. Every completed milestone updates README screenshots.

---

# Current Milestone

Milestone

Setup Supabase

Checklist

* [x] Create Supabase project
* [x] Enable Row Level Security
* [x] Connect GitHub
* [x] Initialize Supabase CLI
* [x] Create database schema
* [x] Create migration
* [x] Test CRUD operations
* [x] Migrate Google Sheets data
* [ ] Open Pull Request
* [ ] Merge into main

---

# Long-Term Goal

RideMint should become a production-ready SaaS application that demonstrates:

* Full-stack development
* Database design
* Authentication
* Secure backend architecture
* CI/CD
* AI integration
* Professional Git workflow
* Clean project architecture

The project should be suitable for showcasing in a software engineering or AI engineering portfolio and reflect real-world development practices rather than being only a demonstration application.
