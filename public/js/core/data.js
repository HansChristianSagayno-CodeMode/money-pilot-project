let data = {
    records: [
        { id: 1, type: 'income', amount: 25000, category: 'Salary', date: '2023-10-01', desc: 'Monthly Salary' },
        { id: 2, type: 'expense', amount: 1500, category: 'Food', date: '2023-10-02', desc: 'Groceries' },
        { id: 3, type: 'expense', amount: 200, category: 'Transport', date: '2023-10-03', desc: 'Bus Fare' },
        { id: 4, type: 'expense', amount: 4500, category: 'Utilities', date: '2023-10-05', desc: 'Electricity Bill' },
        { id: 5, type: 'income', amount: 5000, category: 'Freelance', date: '2023-10-10', desc: 'Project X' }
    ],

    budgets: [
        { id: 1, name: 'Monthly Food', limit: 8000, period: 'Month', category: 'Food', notify: true }
    ],

    debts: [
        { id: 1, name: 'Credit Card', amount: 15000, date: '2023-12-01' }
    ],

    goals: [
        { id: 1, name: 'New Laptop', target: 60000, date: '2024-01-01', icon: 'fa-laptop' }
    ],

    planner: {
        mainGoal: 50000,
        period: 'Monthly',
        items: [
            { id: 1, name: 'Standing Desk', cost: 15000 }
        ]
    }
};