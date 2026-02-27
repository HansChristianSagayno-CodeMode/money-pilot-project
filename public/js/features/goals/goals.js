

function renderAll() {
    renderGoals();
}

function formatPHP(num) {
    return '₱' + parseFloat(num).toLocaleString('en-PH', { minimumFractionDigits: 2 });
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

async function deleteItem(type, id) {

    if (confirm('Delete this item?')) {

        if (type === 'planner') {

            data.planner.items =
                data.planner.items.filter(i => i.id !== id);

        } else {

            if (type === "goals") {

                const { error } =
                    await window.supabase
                        .from("goals")
                        .delete()
                        .eq("id", id);
            
                if (error) {
            
                    console.error(error);
            
                    alert(error.message);
            
                    return;
                }
            
                await loadGoals();
            
                return;
            };

        }

        renderAll();
    }
}

function renderGoals() {
    const container = document.getElementById('goal-container');
    if (!container) return;

    if (!window.appData.goals || window.appData.goals.length === 0) {
        container.innerHTML = getEmptyState('No goals', 'openModal(\'goalModal\')', 'Add Goal');
        container.style.display = 'block';
        return;
    }

    // STRICT LAYOUT ENFORCEMENT: Restore exactly to 2-column grid
    container.style.display = 'grid';
    container.style.gridTemplateColumns = '1fr 1fr';
    container.style.gap = '24px';

    const income = window.appData.records
        ? window.appData.records.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0)
        : 0;

    const expense = window.appData.records
        ? window.appData.records.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0)
        : 0;

    const savings = Math.max(0, income - expense);

    container.innerHTML = window.appData.goals.map(g => {
        const pct = g.target > 0 ? Math.min(100, (savings / g.target) * 100) : 0;
        
        // Safely format the date if it exists
        const formattedDate = g.date 
            ? new Date(g.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            : null;
        
        return `
            <div class="card" style="padding: 1.5rem;">
                <div style="display:flex; align-items:center; justify-content:space-between; gap:15px; width:100%;">

                    <div style="width:50px; height:50px; background:var(--primary-light); color:var(--primary); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.5rem; flex-shrink:0;">
                        <i class="fa-solid ${g.icon || 'fa-star'}"></i>
                    </div>

                    <div style="flex:1;">
                        <div style="font-weight:700; font-size:1rem;">${g.name}</div>
                        
                        <div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">Target: ${formatPHP(g.target)}</div>
                        
                        ${formattedDate ? `<div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">Due: ${formattedDate}</div>` : ''}
                        
                        <div style="margin-top:10px; height:8px; background:var(--bg-body); border-radius:10px; overflow:hidden;">
                            <div style="height:100%; width:${pct}%; background:var(--success); border-radius:10px;"></div>
                        </div>
                    </div>

                    <i class="fa-solid fa-trash"
                       style="color:#cbd5e1; cursor:pointer; font-size:1.2rem; flex-shrink:0; padding:5px;"
                       onclick="deleteItem('goals', '${g.id}')">
                    </i>

                </div>
            </div>
        `;
    }).join('');
}


async function addGoal(e) {

    e.preventDefault();

    const icon = "fa-star";

    const newGoal = {

        name: document.getElementById('goalName').value,

        target: parseFloat(
            document.getElementById('goalTarget').value
        ),

        date: document.getElementById('goalDate').value,

        icon: icon
    };

    const { error } =
        await window.supabase
            .from("goals")
            .insert([newGoal]);

    if (error) {

        console.error(error);

        alert(error.message);

        return;
    }

    await loadGoals();

    closeModal('goalModal');
}



function fillGoal(name, target) {

    document.getElementById('goalName').value =
        name;

    document.getElementById('goalTarget').value =
        target;

    calculateGoalAI();
}

function calculateGoalAI() {

    const target =
        parseFloat(
            document.getElementById('goalTarget').value
        );

    const dateStr =
        document.getElementById('goalDate').value;

    const preview =
        document.getElementById('goalAIPreview');
    
    if (target && dateStr) {

        const months =
            (new Date(dateStr) - new Date()) /
            (1000 * 60 * 60 * 24 * 30);

        if (months <= 0) {

            preview.innerText =
                "Please choose a future date.";

            preview.style.color =
                "var(--danger)";

            return;
        }

        const monthly =
            target / months;

        preview.innerHTML =
            `To reach this, save <strong style="color:var(--primary)">${formatPHP(monthly)}</strong> per month.`;

        preview.style.color =
            "var(--text-main)";
    }
}

document.addEventListener(
    'DOMContentLoaded',
    () => {
        renderAll();
    }
);

window.onclick =
    function(e) {

        if (
            e.target.classList.contains('modal')
        )

            e.target.style.display = 'none';
    };



    async function loadGoals() {

        const { data, error } =
            await window.supabase
                .from("goals")
                .select("*")
                .order("created_at", { ascending: false });
    
        if (error) {
    
            console.error(error);
    
            return;
        }
    
        window.appData.goals = data || [];
    
        renderGoals();
    }
    
    
    (async function initGoals() {
    
        while (!window.supabase || !window.appData) {
    
            await new Promise(r => setTimeout(r, 50));
        }
    
        await loadGoals();
    
    })();