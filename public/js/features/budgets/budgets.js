


function renderAll() {
    renderBudgets();
}


function formatPHP(num) {
    return '₱' + parseFloat(num).toLocaleString('en-PH', { minimumFractionDigits: 2 });
}

function getEmptyState(msg, action, btnText) {
    return `
        <div class="empty-state">
            <div class="empty-icon"><i class="fa-solid fa-clipboard-list"></i></div>
            <p style="margin-bottom:1rem;">${msg}</p>
            ${action ? `<button class="btn btn-primary" onclick="${action}">${btnText}</button>` : ''}
        </div>
    `;
}

function openModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

async function deleteItem(type, id)  {
    if (confirm('Delete this item?')) {
        if (type === 'planner') {
            data.planner.items = data.planner.items.filter(i => i.id !== id);
        } else {
            if (type === 'budgets') {

                const { error } =
                    await window.supabase
                        .from("budgets")
                        .delete()
                        .eq("id", id);
            
                if (error) {
            
                    console.error(error);
            
                    return;
                }
            
                await loadBudgets();
            
                return;
            }
        }

        renderAll();
    }
}

(async function initBudgets() {

    while (!window.supabase || !window.appData) {

        await new Promise(r => setTimeout(r, 50));
    }

    await loadBudgets();

})();

function renderBudgets() {
    const container = document.getElementById('budget-container');

    if (!container) return;

    if (window.appData.budgets.length === 0) {
        container.innerHTML = getEmptyState(
            'No budgets created',
            'openModal(\'budgetModal\')',
            'Create Budget'
        );

        container.style.display = 'block';

        return;
    }

    container.style.display = 'grid';

    container.innerHTML = window.appData.budgets.map(b => {

        const spent = window.appData.records
        ? window.appData.records
            .filter(r =>
                r.type === 'expense' &&
                (b.category === 'All' || r.category === b.category)
            )
            .reduce((sum, r) => sum + r.amount, 0)
        : 0;
    
    const pct = b.limit_amount > 0
        ? Math.min(100, (spent / b.limit_amount) * 100)
        : 0;
        return `
            <div class="card">

                <div style="display:flex; justify-content:space-between;">
                    <div style="font-weight:700;">
                        ${b.name}
                    </div>

                    <div style="font-size:0.8rem; color:var(--text-muted);">
                        ${b.period} • ${b.category}
                    </div>
                </div>

                <div style="margin:15px 0;">

                    <div style="height:8px; background:var(--bg-body); border-radius:10px; overflow:hidden;">
                        <div style="
                            height:100%;
                            width:${pct}%;

                   background:${spent > b.limit_amount
                                ? 'var(--danger)'
                                : 'var(--primary)'
                            };
                        ">
                        </div>
                    </div>

                    <div style="font-size:0.8rem; margin-top:5px; display:flex; justify-content:space-between;">
                        <span>${formatPHP(spent)} spent</span>
                        <span>${formatPHP(b.limit_amount)}</span>
                    </div>

                </div>

                <button
                    class="btn-text"
                    onclick="deleteItem('budgets', '${b.id}')"
                    style="color:var(--danger); font-size:0.8rem;"
                >
                    Remove
                </button>

            </div>
        `;
    }).join('');
}

async function addBudget(e) {
    console.log("budgets.js loaded");

    e.preventDefault();

    const newBudget = {

        name: document.getElementById('budgetName').value,

        limit_amount: parseFloat(
            document.getElementById('budgetLimit').value
        ),

        category: document.getElementById('budgetCategory').value
    };

    const { error } =
        await window.supabase
            .from("budgets")
            .insert([newBudget]);

    if (error) {

        console.error(error);

        alert(error.message);

        return;
    }

    await loadBudgets();

    e.target.reset();   // ← THIS FIXES YOUR ISSUE

    closeModal('budgetModal');
}


window.onclick = function(e) {

    if (e.target.classList.contains('modal')) {

        e.target.style.display = 'none';
    }
};

async function loadBudgets() {

    const { data, error } =
        await window.supabase
            .from("budgets")
            .select("*")
            .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        return;
    }

    window.appData.budgets = data || [];

    renderBudgets();
}