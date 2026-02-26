


function formatPHP(num) {
    return '₱' + parseFloat(num).toLocaleString('en-PH', { minimumFractionDigits: 2 });
}

function formatDate(str) {
    if (!str) return '';

    const d = new Date(str);

    return d.toLocaleDateString(
        'en-US',
        {
            month: 'short',
            day: 'numeric'
        }
    );
}

function getEmptyState(msg, action, btnText) {
    return `
        <div class="empty-state">

            <div class="empty-icon">
                <i class="fa-solid fa-clipboard-list"></i>
            </div>

            <p style="margin-bottom:1rem;">
                ${msg}
            </p>

            ${
                action
                ? `<button class="btn btn-primary" onclick="${action}">
                        ${btnText}
                   </button>`
                : ''
            }

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

            data.planner.items =
                data.planner.items.filter(i => i.id !== id);

        } else {

            data[type] =
                data[type].filter(item => item.id !== id);

        }

        renderDebts();
    }

}

async function loadDebts() {

    const { data: debts, error } =
        await window.supabase
            .from('debts')
            .select('*')
            .order('created_at', { ascending: false });

    if (error) {
        console.error("Load debts error:", error);
        return;
    }

    // store in global appData
    window.appData.debts = debts || [];

    renderDebts();
}
function renderDebts() {

    const container =
        document.getElementById('debt-container');

    if (!container) return;

    const debts = window.appData.debts || [];

    if (debts.length === 0) {

        container.innerHTML =
            getEmptyState(
                'No debts',
                'openModal(\'debtModal\')',
                'Add Debt'
            );

        container.style.display = 'block';
        return;
    }

    container.style.display = 'grid';

    container.innerHTML =
        debts.map(d => `
        
            <div class="card"
                 style="border-left:4px solid var(--danger);">

                <div style="display:flex; justify-content:space-between;">

                    <span style="font-weight:700;">
                        ${d.name}
                    </span>

                    <span class="filter-badge"
                          style="background:#FEE2E2;
                                 color:var(--danger);
                                 border:none;">

                        Due ${formatDate(d.due_date)}

                    </span>

                </div>

                <h3 style="margin:10px 0;">
                    ${formatPHP(d.amount)}
                </h3>

                <button class="btn btn-outline"
                        style="font-size:0.8rem; padding:6px;"
                        onclick="deleteDebt('${d.id}')">

                    Paid

                </button>

            </div>

        `).join('');
}

async function addDebt(e) {

    e.preventDefault();

    const name =
        document.getElementById('debtName').value;

    const amount =
        parseFloat(
            document.getElementById('debtAmount').value
        );

    const dueDate =
        document.getElementById('debtDate').value;

    const newDebt = {
        name: name,
        amount: amount,
        interest: 0,
        due_date: dueDate
    };

    const { data, error } =
        await window.supabase
            .from('debts')
            .insert([newDebt])
            .select();

    if (error) {

        console.error(error);

        alert("Failed to save debt");

        return;
    }

    await loadDebts();

    closeModal('debtModal');
}


async function deleteDebt(id) {

    if (!confirm("Mark this debt as paid?")) return;

    const { error } =
        await window.supabase
            .from('debts')
            .delete()
            .eq('id', id);

    if (error) {
        console.error("Delete error:", error);
        alert("Failed to delete debt");
        return;
    }

    await loadDebts();
}



async function initializeDebts() {

    while (!window.supabase || !window.appData) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    await loadDebts();
}


initializeDebts();

window.onclick = function(e) {

    if (e.target.classList.contains('modal'))

        e.target.style.display = 'none';
};