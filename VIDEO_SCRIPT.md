# 🎬 Smart Expense Sharing Application - Demo Video Script

**Target Duration**: 3 - 5 Minutes
**Target Audience**: Technical Reviewers / Judges / Hiring Managers

---

## Part 1: Introduction & Working Demo (Est. 1.5 mins)

**[Visual: Screen recording of the application’s Dashboard page.]**
**Speaker**: 
"Hello everyone! This is the demo for **Smart Expense Sharing Application**, a full-stack expense tracking and settlement application designed to make group finances effortless. Let's dive right into how it works."

**[Visual: Click on 'Manage Users' and quickly add a friend. Show the list updating.]**
**Speaker**: 
"First, we manage our group members. Here, I have a few users already set up, and I can seamlessly add new participants into the mix. These are the people we will be splitting our transactions with."

**[Visual: Navigate to 'Add Expense'. Fill out a form for a 'Group Dinner' for ₹1000.]**
**Speaker**: 
"Let's add a new expense. Say we went out for a group dinner that cost ₹1000. I can record who actually paid the bill, and then choose how we want to split it. Smart Expense Sharing Application supports both equal cuts—where the system calculates exact fractions for us—or custom, unequal splits if someone had a more expensive meal."

**[Visual: Submit the expense, then navigate to 'All Expenses' to show the item in the list, then to the 'Dashboard' or 'Current Balances'.]**
**Speaker**: 
"Once submitted, the expense is globally recorded. On the Balances page, we can instantly see a high-level overview of who owes whom. The app dynamically tracks every debt based on who paid and who was included in the split."

---

## Part 2: Explanation of Logic - The Settlement Algorithm (Est. 1.5 mins)

**[Visual: Navigate to the 'Optimized Settlements' page. Highlight the generated payments list.]**
**Speaker**: 
"Now, let's talk about the core logic of the app, specifically the **Settlement Generation**. As a group travels or dines together, the web of debts can become extremely complicated—Alice owes Bob, Bob owes Charlie, Charlie owes Alice. 

Instead of forcing users to pay exactly who paid for each individual bill, Smart Expense Sharing Application uses a **Greedy Two-Pointer Optimization Algorithm** to simplify the debt network into the fewest possible transactions."

**[Visual: Optional - Switch to a simple slide or just highlight the specific numbers on the screen to show how debts were crushed down.]**
**Speaker**: 
"Here is how it works under the hood:
1. **Net Balance Calculation**: First, the system aggregates all raw debts to calculate a single 'Net Balance' for every individual. If your Net Balance is positive, you are a *Creditor* (you get money back). If it's negative, you are a *Debtor* (you owe money).
2. **Sorting**: We then split users into a 'Debtors' array and a 'Creditors' array, sorting both by the largest amounts first.
3. **Two-Pointer Resolution**: We use two pointers—one at the biggest Debtor, one at the biggest Creditor. The algorithm systematically settles the maximum possible amount between the two, immediately reducing the balances. If a person's balance hits zero, the pointer moves to the next person. 
4. This repeats until all balances are completely cleared. This guarantees the absolute minimum number of transactions required to settle the entire group!"

---

## Part 3: Brief Code Walkthrough (Est. 1 min)

**[Visual: Open the Code Editor (VS Code). Show the folder structure: `/frontend` and `/backend`.]**
**Speaker**: 
"Moving into the codebase, the project is structured as a modern standard full-stack monorepo: a React/Vite frontend and a Node.js/Express backend, backed by MongoDB."

**[Visual: Open `backend/src/services/expenses.service.ts` and briefly scroll to `getOptimizedSettlements`]**
**Speaker**: 
"In the backend, we use service-oriented architecture. Here in `expenses.service.ts`, you can see the concrete implementation of the algorithm I just described. We use MongoDB aggregation pipelines heavily to group and match sums at the database level, ensuring high performance before passing net balances into our greedy algorithm."

**[Visual: Switch to `frontend/src/components/Layout.jsx`]**
**Speaker**: 
"On the frontend, we use React Router for smooth Single-Page Application navigation. We fetch data centrally at the routing layer so our state remains highly synchronized across all views. We designed the UI to be responsive and intuitive, using clean, color-coded visual cues so users instantly understand their financial standing."

**[Visual: Switch back to the Application Dashboard.]**
**Speaker**: 
"And that's Smart Expense Sharing Application! It takes the anxiety and math out of shared bills, backed by an efficient algorithm and a clean, scalable codebase. Thanks for watching!"
