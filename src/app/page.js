"use client";

import { useEffect } from "react";
import supabase from "@/lib/supabaseClient";

export default function Home() {

  useEffect(() => {

    // expose Supabase globally
    window.supabase = supabase;

    // load scripts
    const scripts = [
      "/js/core/supabaseData.js",
      "/js/core/dashboard.js",
      "/js/features/budgets/budgets.js",
      "/js/features/debts/debts.js",
      "/js/features/goals/goals.js"
    ];

    scripts.forEach((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      document.body.appendChild(script);
    });

  }, []);

  return (
    <main>
 <link rel="stylesheet" href="/css/features/core_dash_board_design/core.css" />

<link rel="stylesheet" href="/css/features/budgets/budgets.css" />

<link rel="stylesheet" href="/css/features/debts/debts.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<div className="app-layout">

  <aside className="sidebar">

    <div className="sidebar__top">

      <div className="logo">
      <img src="/icons/logo/logo.png" alt="Money Pilot Logo" />
      </div>

      <nav className="nav">

        <a href="#" className="nav__item active" data-tab="dashboard">
          Dashboard
        </a>

        <a href="#" className="nav__item" data-tab="budgets">
          Budgets
        </a>

        <a href="#" className="nav__item" data-tab="savings">
          Savings Planner
        </a>

        <a href="#" className="nav__item" data-tab="debts">
          Debts
        </a>

        <a href="#" className="nav__item" data-tab="goals">
          Goals
        </a>

      </nav>

    </div>

    <div className="sidebar__bottom">

      <button className="ai-button">
        Money Pilot AI
      </button>

    </div>

  </aside>

  {/* MAIN CONTENT */}
  <main className="main">

    <header className="main__header">

      <h1 className="page-title">
        Dashboard
      </h1>

      <div className="profile-avatar"></div>

    </header>

    <section className="main__content">

      {/* DASHBOARD TAB */}
      <div className="tab active" id="dashboard">

        <div className="card trend_card">

          <div className="card__header">

            <span className="card__title">
              Balance Trend
            </span>

            <span className="filter_badge">
              2025
            </span>

          </div>

          <div className="trend_value">

            <h2 id="balance_total">
              ₱0.00
            </h2>

            <p>
              <span id="balance_trend_pct">
                +0%
              </span>
              vs last month
            </p>

          </div>

          <div className="trend_chart_container">

            <canvas id="balance_trend_chart"></canvas>

          </div>

        </div>

      </div>

      <div className="tab" id="budgets">

        <section id="view-budgets" className="view-section">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Your Budgets</h3>
            
            <button className="btn btn-primary" onClick={() => openModal('budgetModal')}>
              <i className="fa-solid fa-plus"></i> New Budget
            </button>
          </div>
          
          <div id="budget-container" className="grid-2"></div>
          
        </section>
        
      </div>

      {/* SAVINGS TAB */}
      <div className="tab" id="savings"></div>

      {/* DEBTS TAB */}
      <div className="tab" id="debts">

        <section id="view-debts" className="view-section">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            
            <h3>Debt Tracker</h3>
            
            <button className="btn btn-primary" onClick={() => openModal('debtModal')}>
              <i className="fa-solid fa-plus"></i> Add Debt
            </button>
            
          </div>
          
          <div id="debt-container" className="grid-2"></div>
          
        </section>
        
      </div>

      {/* GOALS TAB */}
      {/* GOALS TAB */}
      <div className="tab" id="goals">

        <section id="view-goals" className="view-section">

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>

            <h3>Savings Goals</h3>

            <button className="btn btn-primary" onClick={() => openModal('goalModal')}>
              <i className="fa-solid fa-plus"></i> New Goal
            </button>

          </div>

          <div id="goal-container" className="grid-2"></div>

        </section>

      </div>

    </section>

  </main>

</div>

{/* BUDGET MODAL */}
<div id="budgetModal" className="modal">

  <div className="modal-content">

    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
      <h3>Create New Budget</h3>

      <i className="fa-solid fa-xmark"
         onClick={() => closeModal('budgetModal')}
         style={{ cursor: 'pointer', fontSize: '1.2rem' }}>
      </i>
    </div>

    <form onSubmit={(event) => addBudget(event)}>

      <div className="form-group">
        <label>Budget Name</label>
        <input type="text" id="budgetName" placeholder="e.g. Weekly Groceries" required />
      </div>

      <div className="form-grid-2">

        <div className="form-group">
          <label>Period</label>

          <select id="budgetPeriod">
            <option value="Month">Monthly</option>
            <option value="Week">Weekly</option>
          </select>
        </div>

        <div className="form-group">
          <label>Currency</label>

          <select disabled>
            <option>PHP (₱)</option>
          </select>
        </div>

      </div>

      <div className="form-group">
        <label>Limit Amount</label>

        <input type="number"
               id="budgetLimit"
               required
               placeholder="0.00"
               step="0.01" />
      </div>

      <div className="form-grid-2">

        <div className="form-group">
          <label>Category</label>

          <select id="budgetCategory">
            <option value="All">All Categories</option>
            <option value="Food">Food & Dining</option>
            <option value="Transport">Transport</option>
            <option value="Utilities">Utilities</option>
            <option value="Shopping">Shopping</option>
          </select>
        </div>

        <div className="form-group">
          <label>Account</label>

          <select id="budgetAccount">
            <option value="All">All Accounts</option>
            <option value="Cash">Cash Wallet</option>
            <option value="Bank">Bank Account</option>
          </select>
        </div>

      </div>

      <div className="toggle-wrapper">

        <label style={{ margin: 0 }}>Notify when exceeded</label>

        <label className="switch">
          <input type="checkbox" id="budgetNotify" defaultChecked />
          <span className="slider"></span>
        </label>

      </div>

      <button className="btn btn-primary" style={{ width: '100%' }}>
        Create Budget
      </button>

    </form>

  </div>

</div>

{/* DEBT MODAL */}
<div id="debtModal" className="modal">

  <div className="modal-content">

    <span className="close-modal"
          onClick={() => closeModal('debtModal')}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', cursor: 'pointer' }}>
      <i className="fa-solid fa-xmark"></i>
    </span>

    <h3>Add Debt</h3>

    <form onSubmit={(event) => addDebt(event)}>

      <div className="form-group">
        <label>Description</label>
        <input type="text" id="debtName" required />
      </div>

      <div className="form-group">
        <label>Amount Owed</label>
        <input type="number" id="debtAmount" required />
      </div>

      <div className="form-group">
        <label>Due Date</label>
        <input type="date" id="debtDate" required />
      </div>

      <button className="btn btn-primary" style={{ width: '100%' }}>
        Save Debt
      </button>

    </form>

  </div>

</div>

{/* GOAL MODAL */}
<div id="goalModal" className="modal">

  <div className="modal-content">

    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <h3>New Savings Goal</h3>

      <i className="fa-solid fa-xmark"
         onClick={() => closeModal('goalModal')}
         style={{ cursor: 'pointer', fontSize: '1.2rem' }}>
      </i>
    </div>
    
    <form onSubmit={(event) => addGoal(event)}>

      <label style={{ textAlign: 'center', marginBottom: '10px' }}>
        Select Goal Type
      </label>

      <div className="goal-icons-grid">

        <label>
          <input type="radio" name="goalIcon" value="fa-car" className="goal-radio" />
          <div className="goal-icon-label">
            <i className="fa-solid fa-car"></i>
          </div>
        </label>

        <label>
          <input type="radio" name="goalIcon" value="fa-house" className="goal-radio" />
          <div className="goal-icon-label">
            <i className="fa-solid fa-house"></i>
          </div>
        </label>

        <label>
          <input type="radio" name="goalIcon" value="fa-graduation-cap" className="goal-radio" />
          <div className="goal-icon-label">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
        </label>

        <label>
          <input type="radio" name="goalIcon" value="fa-plane" className="goal-radio" />
          <div className="goal-icon-label">
            <i className="fa-solid fa-plane"></i>
          </div>
        </label>

        <label>
          <input type="radio" name="goalIcon" value="fa-star" className="goal-radio" defaultChecked />
          <div className="goal-icon-label">
            <i className="fa-solid fa-star"></i>
          </div>
        </label>

      </div>

      <div className="form-group">

        <label>Goal Name</label>

        <input type="text"
               id="goalName"
               placeholder="e.g. New Laptop"
               required />

      </div>

      <div className="form-grid-2">

        <div className="form-group">

          <label>Target Amount</label>

          <input type="number"
                 id="goalTarget"
                 required
                 onInput={() => calculateGoalAI()} />

        </div>

        <div className="form-group">

          <label>Target Date</label>

          <input type="date"
                 id="goalDate"
                 required
                 onChange={() => calculateGoalAI()} />

        </div>

      </div>

      <div className="card"
           style={{ background: 'var(--primary-light)',
                    border: '1px solid var(--primary)',
                    padding: '12px',
                    marginBottom: '1rem',
                    borderRadius: '8px' }}>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>

          <i className="fa-solid fa-robot"
             style={{ color: 'var(--primary)', marginTop: '3px' }}>
          </i>

          <div>

            <div style={{ fontWeight: 700,
                          color: 'var(--primary)',
                          fontSize: '0.85rem' }}>

              AI Estimation

            </div>

            <div id="goalAIPreview"
                 style={{ fontSize: '0.85rem',
                          color: 'var(--text-main)' }}>

              Enter details to see savings plan.

            </div>

          </div>

        </div>

      </div>

      <button className="btn btn-primary" style={{ width: '100%' }}>
        Create Goal
      </button>

    </form>

  </div>

</div>
    </main>
  );
}

