# Angular Workspace 🅰️

A collection of Angular applications and experiments

## Overview

This repository is an **Angular workspace** designed to host multiple Angular-based applications and experiments over time.  
Each project in this workspace focuses on different concepts, architectures, and real-world use cases built using Angular.

At the moment, the workspace contains **one primary project**:

# FinBuddy 💸

A Personal Finance & Monthly Budgeting Application

## Overview

**FinBuddy** is a personal finance and budgeting application built using **Angular, TypeScript, and Angular Material**.  
The app helps users plan monthly budgets, track expenses by category, and understand their spending patterns in a structured and intuitive way.

The focus of this project is on **clean architecture**, **scalable design**, and **practical real-world finance use cases**.

---

## Key Features

### 1. Authentication

- Secure **JWT-based login**
- User-specific data isolation (each user sees only their own budgets and categories)

### 2. Categories

- Users manage their own list of spending categories
- Categories are reusable across months
- Categories can be activated or archived (instead of deleted)

### 3. Monthly Budgets

- Budgets are created per month (`YYYY-MM`)
- Each month includes:
  - Monthly income
  - Optional savings target
  - Spending limits per category

### 4. Expense Tracking (Items)

- Users can add expenses for each month
- Each expense includes:
  - Date of purchase
  - Category
  - Amount
  - Item name
  - Optional merchant and notes
- Expenses are used to calculate category-wise and monthly totals

---

## Planned Enhancements (Work in Progress)

### 1. AI-Powered Monthly Insights

- Generate monthly summaries based on spending behavior
- Provide AI-driven suggestions on savings and spending habits

### 2. AI Chat Interface

- Chat-style interface to ask questions such as:
  - “How did I do this month?”
  - “Where am I overspending?”
  - “How can I plan better next month?”

### 3. Receipt Upload & Auto-Expense Creation

- Upload receipt images directly
- Extract expense details from receipts
- Automatically create expense entries in the database

---

## Tech Stack

### Frontend

- Angular
- TypeScript
- Angular Material
- Reactive Forms
- Angular Signals

### Backend

- Node.js
- REST APIs
- JWT Authentication
- Prisma ORM
- PostgreSQL

> The backend implementation and database schema are available in the GitHub repository: https://github.com/Devadharshini-Nagarajan/FinBuddy-NestJS

---

## Architecture Highlights

- Strong separation between **frontend models** and **database schema**
- Typed APIs and state management
- Scalable structure suitable for future features like AI integration
- Designed with real-world budgeting workflows in mind

---

## Repository

Backend and related services can be found in the GitHub repository associated with this project.

---

## Steps to Explore the Application

### Prerequisites

- Node.js (v18+ recommended)
- npm
- Angular CLI

### 1. Clone the Repository

```bash
git clone <repository-url>
cd angular-workspace
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the FinBuddy Application

```bash
npm run start:finbuddy
```

### 4. Access the Application

```bash
http://localhost:4200
```
