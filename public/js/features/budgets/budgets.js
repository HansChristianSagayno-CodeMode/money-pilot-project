

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

function deleteItem(type, id) {
    if (confirm('Delete this item?')) {
        if (type === 'planner') {
            data.planner.items = data.planner.items.filter(i => i.id !== id);
        } else {
            data[type] = data[type].filter(item => item.id !== id);
        }

        renderAll();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    renderBudgets();
});

function renderBudgets() {
    const container = document.getElementById('budget-container');

    if (!container) return;

    if (data.budgets.length === 0) {
        container.innerHTML = getEmptyState(
            'No budgets created',
            'openModal(\'budgetModal\')',
            'Create Budget'
        );

        container.style.display = 'block';

        return;
    }

    container.style.display = 'grid';

    container.innerHTML = data.budgets.map(b => {

        const spent = data.records
            .filter(r =>
                r.type === 'expense' &&
                (b.category === 'All' || r.category === b.category)
            )
            .reduce((sum, r) => sum + r.amount, 0);

        const pct = Math.min(100, (spent / b.limit) * 100);

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

                            background:${spent > b.limit
                                ? 'var(--danger)'
                                : 'var(--primary)'
                            };
                        ">
                        </div>
                    </div>

                    <div style="font-size:0.8rem; margin-top:5px; display:flex; justify-content:space-between;">
                        <span>${formatPHP(spent)} spent</span>
                        <span>${formatPHP(b.limit)}</span>
                    </div>

                </div>

                <button
                    class="btn-text"
                    onclick="deleteItem('budgets', ${b.id})"
                    style="color:var(--danger); font-size:0.8rem;"
                >
                    Remove
                </button>

            </div>
        `;
    }).join('');
}

function addBudget(e) {

    e.preventDefault();

    data.budgets.push({

        id: Date.now(),

        name: document.getElementById('budgetName').value,

        limit: parseFloat(
            document.getElementById('budgetLimit').value
        ),

        period: document.getElementById('budgetPeriod').value,

        category: document.getElementById('budgetCategory').value,

        notify: document.getElementById('budgetNotify').checked
    });

    renderBudgets();

    closeModal('budgetModal');
}

document.addEventListener('DOMContentLoaded', () => {
    renderAll();
});

window.onclick = function(e) {

    if (e.target.classList.contains('modal')) {

        e.target.style.display = 'none';
    }
};