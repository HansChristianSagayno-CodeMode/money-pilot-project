"use client";

import { useEffect } from "react";
import supabase from "@/lib/supabaseClient";

export default function Home() {

  useEffect(() => {
    async function loadScriptsSequentially() {
      // expose Supabase globally FIRST
      window.supabase = supabase;
  
      const scripts = [
        "/js/core/supabaseData.js",
        "/js/core/dashboard.js",
        "/js/features/budgets/budgets.js",
        "/js/features/debts/debts.js",
        "/js/features/goals/goals.js",
        "/js/features/savings/savings.js" 
      ];
  
      for (const src of scripts) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }
    }
    loadScriptsSequentially();
  }, []);

  return (
    <main>
      <link rel="stylesheet" href="/css/features/core_dash_board_design/core.css" />
      <link rel="stylesheet" href="/css/features/budgets/budgets.css" />
      <link rel="stylesheet" href="/css/features/debts/debts.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <link rel="stylesheet" href="/css/features/savings/savings.css" />

      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar__top">
            <div className="logo">
              <img src="/icons/logo/logo.png" alt="Money Pilot Logo" />
            </div>
            <nav className="nav">
              <a href="#" className="nav__item active" data-tab="dashboard">Dashboard</a>
              <a href="#" className="nav__item" data-tab="budgets">Budgets</a>
              <a href="#" className="nav__item" data-tab="savings">Savings Planner</a>
              <a href="#" className="nav__item" data-tab="debts">Debts</a>
              <a href="#" className="nav__item" data-tab="goals">Goals</a>
            </nav>
          </div>
          <div className="sidebar__bottom">
            <button className="ai-button">Money Pilot AI</button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main">
          <header className="main__header">
            <h1 className="page-title">Dashboard</h1>
            <div className="profile-avatar"></div>
          </header>

          <section className="main__content">
            
            {/* ---------------- DASHBOARD TAB ---------------- */}
          {/* ---------------- DASHBOARD TAB ---------------- */}
          <div className="tab active" id="dashboard">
              <section id="view-stats" className="view-section">
                <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
                  
                  {/* 1. Balance Trend Card (KEPT VISIBLE) */}
                  <div className="card">
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span className="card-title" style={{ fontWeight: 700 }}>Balance Trend</span>
                      <span className="filter-badge" style={{ background: 'var(--bg-body)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', border: '1px solid var(--border)' }}>Current Year</span>
                    </div>
                    <h2 id="balance-total" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>₱0.00</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      <span id="balance-trend-pct" className="text-success" style={{ fontWeight: 600 }}>+0%</span> vs past period
                    </p>
                    <div className="chart-wrapper" style={{ height: '350px', position: 'relative', width: '100%' }}>
                      <canvas id="trendCanvas" style={{ width: '100%', height: '100%' }}></canvas>
                    </div>
                  </div>

                  {/* 2. Expense Structure Donut (COMMENTED OUT AS REQUESTED)
                  <div className="card">
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span className="card-title" style={{ fontWeight: 700 }}>Expense Structure</span>
                      <span className="filter-badge" style={{ background: 'var(--bg-body)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', border: '1px solid var(--border)' }}>Last 30 Days</span>
                    </div>
                    <div className="donut-wrapper" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div className="donut-chart" id="expense-donut" style={{ width: '180px', height: '180px', borderRadius: '50%', background: 'conic-gradient(var(--border) 0% 100%)', position: 'relative', marginBottom: '1rem' }}>
                        <div className="donut-inner" style={{ width: '130px', height: '130px', background: 'var(--bg-card)', borderRadius: '50%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="donut-total" id="donut-total-text" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>₱0</span>
                          <span className="donut-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Out</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  */}
                  
                  {/* 3. Recent Activity List (COMMENTED OUT AS REQUESTED)
                  <div className="card">
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span className="card-title" style={{ fontWeight: 700 }}>Recent Activity</span>
                      <span className="filter-badge" style={{ background: 'var(--bg-body)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', border: '1px solid var(--border)' }}>Last 30 Days</span>
                    </div>
                    <div id="recent-list" style={{ minHeight: '200px' }}></div>
                    <button className="btn btn-outline" style={{ width: '100%', marginTop: '10px', borderStyle: 'dashed', padding: '12px', borderRadius: 'var(--radius-md)', background: 'transparent', color: 'var(--text-muted)' }} onClick={() => window.openModal('recordModal')}>
                      Add Record
                    </button>
                  </div>
                  */}

                </div>
              </section>
            </div>

            {/* ---------------- BUDGETS TAB ---------------- */}
            <div className="tab" id="budgets">
              <section id="view-budgets" className="view-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3>Your Budgets</h3>
                  <button className="btn btn-primary" onClick={() => window.openModal('budgetModal')}>
                    <i className="fa-solid fa-plus"></i> New Budget
                  </button>
                </div>
                <div id="budget-container" className="grid-2"></div>
              </section>
            </div>

            {/* ---------------- SAVINGS TAB ---------------- */}
            <div className="tab" id="savings">
              <section id="view-planner" className="view-section">
                <div className="grid-2">
                  <div className="planner-stat-card">
                    <label style={{color:"rgba(255,255,255,0.8)"}}>Total Savings Goal</label>
                    <div style={{display:"flex", gap:"10px", marginTop:"5px"}}>
                      <input id="planner-main-goal" type="number" className="planner-input" style={{fontSize:"1.5rem", fontWeight:"700", width:"180px"}} />
                      <select id="planner-period" className="planner-input" defaultValue="Monthly">
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                    </div>
                    <div className="planner-required">
                      Required contribution: <span id="planner-calc-result"></span>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <span className="card-title">Allocation Breakdown</span>
                    </div>
                    <div className="planner-chart-container">
                      <div id="planner-donut" className="planner-donut">
                        <div className="planner-donut-hole">
                          <span id="planner-donut-val">0%</span>
                          <span>Allocated</span>
                        </div>
                      </div>
                    </div>
                    <div className="planner-chart-legend">
                      <div style={{display:"flex", justifyContent:"space-between"}}>
                        <span>Total Goal:</span><span id="donut-total-goal"></span>
                      </div>
                      <div style={{display:"flex", justifyContent:"space-between"}}>
                        <span>Allocated:</span><span id="donut-allocated"></span>
                      </div>
                      <div style={{display:"flex", justifyContent:"space-between"}}>
                        <span>Combined:</span><span id="donut-combined"></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Items to Buy</span>
                    <span id="planner-count-badge" className="filter_badge">0 / 3 Items</span>
                  </div>
                  <div id="planner-items-list"></div>
                  <div className="planner-input-row">
                    <input id="new-item-name" placeholder="Item Name" />
                    <input id="new-item-cost" type="number" placeholder="Cost" />
                    <button className="btn btn-primary" onClick={() => window.addPlannerItem()}>Add Item</button>
                  </div>
                </div>
              </section>
            </div>

            {/* ---------------- DEBTS TAB ---------------- */}
            <div className="tab" id="debts">
              <section id="view-debts" className="view-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3>Debt Tracker</h3>
                  <button className="btn btn-primary" onClick={() => window.openModal('debtModal')}>
                    <i className="fa-solid fa-plus"></i> Add Debt
                  </button>
                </div>
                <div id="debt-container" className="grid-2"></div>
              </section>
            </div>

            {/* ---------------- GOALS TAB ---------------- */}
            <div className="tab" id="goals">
              <section id="view-goals" className="view-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3>Savings Goals</h3>
                  <button className="btn btn-primary" onClick={() => window.openModal('goalModal')}>
                    <i className="fa-solid fa-plus"></i> New Goal
                  </button>
                </div>
                <div id="goal-container" className="grid-2"></div>
              </section>
            </div>

          </section>
        </main>
      </div>

      {/* ---------------- MODALS & FAB ---------------- */}
      
      {/* FAB CONTAINER */}
      <div className="fab-container" style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
        <div className="fab-menu" id="fabMenu" style={{ display: 'none', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
          <div className="fab-item" onClick={() => window.openModal('recordModal', 'income')} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '10px 16px', borderRadius: '30px', boxShadow: 'var(--shadow-md)', cursor: 'pointer', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
            <span>Add Income</span>
            <div className="fab-icon" style={{ width: '32px', height: '32px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-arrow-down"></i></div>
          </div>
          
          {/* COMMENTED OUT EXPENSE BUTTON AS REQUESTED
          <div className="fab-item" onClick={() => window.openModal('recordModal', 'expense')} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '10px 16px', borderRadius: '30px', boxShadow: 'var(--shadow-md)', cursor: 'pointer', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
            <span>Add Expense</span>
            <div className="fab-icon" style={{ width: '32px', height: '32px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-arrow-up"></i></div>
          </div>
          */}
        </div>
        <div className="fab-main" id="fabMain" onClick={() => window.toggleFab()} style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', color: 'white', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-float)', cursor: 'pointer', transition: 'transform 0.3s' }}>
          <i className="fa-solid fa-plus"></i>
        </div>
      </div>

      <div id="recordModal" className="modal">
        <div className="modal-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 id="recordModalTitle">Add Transaction</h3>
            <i className="fa-solid fa-xmark" onClick={() => window.closeModal('recordModal')} style={{ cursor: 'pointer', fontSize: '1.2rem' }}></i>
          </div>
          <form onSubmit={(event) => window.addRecord(event)}>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Type</label>
                <select id="recType" onChange={() => window.updateCategories()}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" id="recDate" required />
              </div>
            </div>
            <div className="form-group">
              <label>Amount (PHP)</label>
              <input type="number" id="recAmount" required placeholder="0.00" step="0.01" style={{ fontSize: '1.2rem', fontWeight: 700 }} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select id="recCategory"></select>
            </div>
            <div className="form-group">
              <label>Note (Optional)</label>
              <input type="text" id="recNote" placeholder="e.g. Lunch with team" />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }}>Save Record</button>
          </form>
        </div>
      </div>

      <div id="budgetModal" className="modal">
        <div className="modal-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3>Create New Budget</h3>
            <i className="fa-solid fa-xmark" onClick={() => window.closeModal('budgetModal')} style={{ cursor: 'pointer', fontSize: '1.2rem' }}></i>
          </div>
          <form onSubmit={(event) => window.addBudget(event)}>
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
                <select disabled><option>PHP (₱)</option></select>
              </div>
            </div>
            <div className="form-group">
              <label>Limit Amount</label>
              <input type="number" id="budgetLimit" required placeholder="0.00" step="0.01" />
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
            <button className="btn btn-primary" style={{ width: '100%' }}>Create Budget</button>
          </form>
        </div>
      </div>

      <div id="debtModal" className="modal">
        <div className="modal-content">
          <span className="close-modal" onClick={() => window.closeModal('debtModal')} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', cursor: 'pointer' }}>
            <i className="fa-solid fa-xmark"></i>
          </span>
          <h3>Add Debt</h3>
          <form onSubmit={(event) => window.addDebt(event)}>
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
            <button className="btn btn-primary" style={{ width: '100%' }}>Save Debt</button>
          </form>
        </div>
      </div>

      <div id="goalModal" className="modal">
        <div className="modal-content">
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:"1rem"}}>
            <h3>New Savings Goal</h3>
            <i className="fa-solid fa-xmark" onClick={() => window.closeModal('goalModal')} style={{cursor:"pointer", fontSize:"1.2rem"}}></i>
          </div>
          <form onSubmit={(event) => window.addGoal(event)}>
            <div className="form-group">
              <label>Goal Name</label>
              <input type="text" id="goalName" placeholder="e.g. New Laptop" required />
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Target Amount</label>
                <input type="number" id="goalTarget" required />
              </div>
              <div className="form-group">
                <label>Target Date</label>
                <input type="date" id="goalDate" required />
              </div>
            </div>
            <button className="btn btn-primary" style={{width:"100%"}}>Create Goal</button>
          </form>
        </div>
      </div>

    </main>
  );
}