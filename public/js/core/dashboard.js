

const navItems = document.querySelectorAll(".nav__item");
const tabs = document.querySelectorAll(".tab");
const pageTitle = document.querySelector(".page-title");

navItems.forEach(item => {

    item.addEventListener("click", e => {

        e.preventDefault();

        const target = item.dataset.tab;

        navItems.forEach(i => i.classList.remove("active"));
        tabs.forEach(t => t.classList.remove("active"));

        item.classList.add("active");

        const tab = document.getElementById(target);

        if (tab) {
            tab.classList.add("active");
        }

        pageTitle.textContent = item.textContent;

    });

});

// Ensure global state exists to prevent crashes
window.appData = window.appData || {};

// Add temporary mock records if none exist so the chart isn't empty
if (!window.appData.records || window.appData.records.length === 0) {
    window.appData.records = [
        { id: 1, type: 'income', amount: 35000, category: 'Salary', date: '2023-10-01', desc: 'Monthly Salary' },
        { id: 2, type: 'expense', amount: 1500, category: 'Food', date: '2023-10-02', desc: 'Groceries' },
        { id: 3, type: 'expense', amount: 200, category: 'Transport', date: '2023-10-03', desc: 'Bus Fare' },
        { id: 4, type: 'expense', amount: 4500, category: 'Utilities', date: '2023-10-05', desc: 'Electricity Bill' },
        { id: 5, type: 'income', amount: 8000, category: 'Freelance', date: '2023-10-10', desc: 'Project X' }
    ];
}

const expenseCats = ['Food', 'Transport', 'Utilities', 'Shopping', 'Health', 'Education', 'Entertainment'];
const incomeCats = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift'];

let chartState = { points: [], layout: {}, ctx: null, cvs: null, data: [] };
const chartConfig = [
    { key: 'balance', label: 'Balance', color: '#10B981', type: 'line' },
    { key: 'income', label: 'Income', color: '#10B981', type: 'dot' },
    { key: 'expense', label: 'Expense', color: '#EF4444', type: 'dot' },
    { key: 'debt', label: 'Debt', color: '#7F1D1D', type: 'dot' },
    { key: 'goal', label: 'Goal', color: '#8B5CF6', type: 'dot' },
    { key: 'planner', label: 'Planner', color: '#F97316', type: 'dot' }
];

// Utiltities
function formatPHP(num) {
    return '₱' + parseFloat(num).toLocaleString('en-PH', {minimumFractionDigits: 2});
}
function formatCompactPHP(number) {
    const fmt = new Intl.NumberFormat('en-PH', { notation: "compact", compactDisplay: "short", maximumFractionDigits: 1 }).format(number);
    return '₱' + fmt;
}
function formatDate(str) {
    if(!str) return '';
    return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function getIcon(cat) {
    const map = { 'Food': 'fa-utensils', 'Transport': 'fa-bus', 'Utilities': 'fa-bolt', 'Shopping': 'fa-bag-shopping', 'Health': 'fa-heart-pulse', 'Education': 'fa-book', 'Entertainment': 'fa-film', 'Salary': 'fa-money-bill-wave', 'Freelance': 'fa-laptop-code' };
    return map[cat] || 'fa-circle';
}

// Global hook execution loop (Runs after scripts are loaded)
const dashInitLoop = setInterval(() => {
    if (window.appData) {
        clearInterval(dashInitLoop);
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('recDate');
        if(dateInput) dateInput.value = today;
        window.updateCategories();
        window.renderStats();
    }
}, 50);

// Global Functions
window.updateCategories = function() {
    const typeEl = document.getElementById('recType');
    const select = document.getElementById('recCategory');
    if(!typeEl || !select) return;

    select.innerHTML = '';
    const list = typeEl.value === 'expense' ? expenseCats : incomeCats;
    list.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.innerText = c;
        select.appendChild(opt);
    });
};

window.toggleFab = function() {
    const menu = document.getElementById('fabMenu');
    const main = document.getElementById('fabMain');
    if(menu) menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    if(main) main.classList.toggle('active');
};

const originalOpenModal = window.openModal;
window.openModal = function(id, type) {
    if(type && id === 'recordModal') { 
        document.getElementById('recType').value = type; 
        window.updateCategories(); 
        window.toggleFab(); 
    }
    if (originalOpenModal) { originalOpenModal(id); } 
    else { document.getElementById(id).style.display = 'flex'; }
};

window.closeModal = window.closeModal || function(id) {
    document.getElementById(id).style.display = 'none';
};

window.addRecord = function(e) {
    e.preventDefault();
    const rec = {
        id: Date.now(),
        type: document.getElementById('recType').value,
        amount: parseFloat(document.getElementById('recAmount').value),
        date: document.getElementById('recDate').value,
        category: document.getElementById('recCategory').value,
        desc: document.getElementById('recNote').value
    };
    window.appData.records.unshift(rec);
    window.renderStats();
    window.closeModal('recordModal');
};

window.deleteItem = window.deleteItem || function(type, id) {
    if(confirm('Delete this item?')) {
        if(type === 'planner' && window.appData.planner) {
            window.appData.planner.items = window.appData.planner.items.filter(i => i.id !== id);
        } else if (window.appData[type]) {
            window.appData[type] = window.appData[type].filter(item => item.id !== id);
        }
        
        if (window.renderStats) window.renderStats();
        if (window.renderPlannerPage) window.renderPlannerPage();
    }
};

// Main Dashboard Render
window.renderStats = function() {
    if (!window.appData || !window.appData.records) return;

    const totalIncome = window.appData.records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = window.appData.records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
    const balance = totalIncome - totalExpense;
    
    const balEl = document.getElementById('balance-total');
    if(balEl) balEl.innerText = formatPHP(balance);
    
    const trendEl = document.getElementById('balance-trend-pct');
    if(trendEl) {
        trendEl.innerText = balance >= 0 ? 'Healthy' : 'Deficit';
        trendEl.className = balance >= 0 ? 'text-success' : 'text-danger';
        trendEl.style.color = balance >= 0 ? 'var(--success)' : 'var(--danger)';
    }

    renderExpenseSection();

    const listEl = document.getElementById('recent-list');
    if(listEl) {
        const sortedRecords = [...window.appData.records].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,5);
        if (sortedRecords.length === 0) {
            listEl.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding: 20px;">No transactions yet</div>';
        } else {
            listEl.innerHTML = sortedRecords.map(r => `
                <div class="record-item" style="display:flex; justify-content:space-between; padding:12px; margin-bottom:8px; border-radius:var(--radius-md); background:var(--bg-body);">
                    <div style="display:flex; gap:12px; align-items:center;">
                        <div style="width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:${r.type==='income'?'#D1FAE5':'#FEE2E2'}; color:${r.type==='income'?'var(--success)':'var(--danger)'}">
                            <i class="fa-solid ${getIcon(r.category)}"></i>
                        </div>
                        <div style="display:flex; flex-direction:column;">
                            <span style="font-weight:600;">${r.category}</span>
                            <span style="font-size:0.75rem; color:var(--text-muted);">${formatDate(r.date)}</span>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="font-weight:700; color:${r.type==='income'?'var(--success)':'var(--text-main)'}">
                            ${r.type==='income'?'+':'-'} ${formatPHP(r.amount)}
                        </div>
                        <i class="fa-solid fa-trash" style="color:#cbd5e1; cursor:pointer; font-size:0.8rem;" onclick="window.deleteItem('records', ${r.id})"></i>
                    </div>
                </div>
            `).join('');
        }
    }

    requestAnimationFrame(drawTrendChart);
};



function renderExpenseSection() {
    const donutTotalEl = document.getElementById('donut-total-text');
    const donutEl = document.getElementById('expense-donut');
    if(!donutEl || !donutTotalEl) return;

    const donutWrapper = donutEl.parentElement;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRecords = window.appData.records.filter(r => new Date(r.date) >= thirtyDaysAgo);
    const recentExpense = recentRecords.filter(r => r.type === 'expense').reduce((s,r) => s + r.amount, 0);

    let listContainer = document.getElementById('expense-breakdown-list');
    if(!listContainer) {
        listContainer = document.createElement('div');
        listContainer.id = 'expense-breakdown-list';
        listContainer.style.marginTop = '20px';
        listContainer.style.width = '100%';
        donutWrapper.parentNode.appendChild(listContainer);
    }
    listContainer.innerHTML = '';

    if (recentExpense > 0) {
        donutTotalEl.innerText = formatPHP(recentExpense);
        const cats = {};
        recentRecords.filter(r => r.type === 'expense').forEach(r => {
            cats[r.category] = (cats[r.category] || 0) + r.amount;
        });
        
        let colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#EC4899', '#8B5CF6'];
        let gradientStr = [];
        let start = 0; let i = 0;

        const sortedCats = Object.entries(cats).sort((a,b) => b[1] - a[1]);
        sortedCats.forEach(([catName, amount]) => {
            const pct = (amount / recentExpense) * 100;
            const color = colors[i % colors.length];
            gradientStr.push(`${color} ${start}% ${start + pct}%`);
            start += pct;

            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.justifyContent = 'space-between';
            row.style.alignItems = 'center';
            row.style.marginBottom = '8px';
            row.style.fontSize = '0.9rem';
            row.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="width:10px; height:10px; border-radius:50%; background:${color};"></span>
                    <span style="color:var(--text-main); font-weight:500;">${catName}</span>
                </div>
                <div style="text-align:right;">
                    <span style="font-weight:600;">${formatPHP(amount)}</span>
                    <span style="font-size:0.75rem; color:var(--text-muted); margin-left:5px;">(${Math.round(pct)}%)</span>
                </div>
            `;
            listContainer.appendChild(row);
            i++;
        });
        donutEl.style.background = `conic-gradient(${gradientStr.join(', ')})`;
    } else {
        // Correctly placed empty state with the Add Record button
        donutTotalEl.innerText = "No Data";
        donutEl.style.background = `var(--border)`;
        listContainer.innerHTML = `
            <div style="text-align:center;">
                <button class="expense-add-record-btn" onclick="window.openModal('recordModal', 'expense')">+ Add Record</button>
                <div style="color:var(--text-muted); font-size:0.85rem; margin-top: 12px;">No expenses in last 30 days</div>
            </div>
        `;
    }
}



function drawTrendChart() {
    const cvs = document.getElementById('trendCanvas');
    if (!cvs) return;
    
    const ctx = cvs.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = cvs.getBoundingClientRect();
    
    if (cvs.width !== rect.width * dpr || cvs.height !== rect.height * dpr) {
        cvs.width = rect.width * dpr;
        cvs.height = rect.height * dpr;
    }
    
    ctx.setTransform(1, 0, 0, 1, 0, 0); 
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const timeline = prepareChartData();
    if (timeline.length === 0) {
        ctx.fillStyle = "#94A3B8";
        ctx.font = "500 14px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("No financial activity yet.", rect.width/2, rect.height/2);
        return;
    }

    const padding = { top: 60, right: 30, bottom: 40, left: 60 };
    const width = rect.width - padding.left - padding.right;
    const height = rect.height - padding.top - padding.bottom;

    const values = timeline.map(t => t.balance);
    let minData = Math.min(...values);
    let maxData = Math.max(...values);
    let range = maxData - minData;
    if (range === 0) range = Math.abs(maxData) || 100;

    const buffer = range * 0.2; 
    let maxVal = maxData + buffer;
    let minVal = minData - buffer;
    if (minData >= 0 && minVal < 0) minVal = 0;

    const points = timeline.map((t, i) => ({
        x: padding.left + (i / (timeline.length - 1)) * width,
        y: padding.top + height - ((t.balance - minVal) / (maxVal - minVal)) * height,
        data: t
    }));

    chartState = { points, layout: { padding, width, height, rect, minVal, maxVal }, ctx, cvs };

    drawGridAndAxes(ctx, chartState.layout, timeline);
    drawSmoothLine(ctx, points, chartState.layout);
    drawMarkers(ctx, points);

    if (!cvs.dataset.listening) {
        cvs.addEventListener('mousemove', (e) => handleChartHover(e));
        cvs.addEventListener('mouseleave', () => requestAnimationFrame(drawTrendChart));
        cvs.dataset.listening = "true";
    }
}

function prepareChartData() {
    let timeline = [];
    if(window.appData.records) {
        window.appData.records.forEach(r => timeline.push({
            date: new Date(r.date), amount: r.type === 'income' ? r.amount : -r.amount, type: r.type, name: r.desc || r.category
        }));
    }
    if(window.appData.debts) {
        window.appData.debts.forEach(d => timeline.push({ date: new Date(d.date), amount: -d.amount, type: 'debt', name: d.name }));
    }
    if(window.appData.goals) {
        window.appData.goals.forEach(g => timeline.push({ date: new Date(g.date), amount: -g.target, type: 'goal', name: g.name }));
    }
    if(window.appData.planner && window.appData.planner.items) {
        window.appData.planner.items.forEach(i => timeline.push({ date: new Date(), amount: -i.cost, type: 'planner', name: i.name }));
    }

    timeline.sort((a, b) => a.date - b.date);

    let runningBalance = 0;
    return timeline.map(item => {
        runningBalance += item.amount;
        return { ...item, balance: runningBalance };
    });
}

function drawGridAndAxes(ctx, layout, timeline) {
    const { padding, width, height, minVal, maxVal } = layout;
    ctx.font = "500 10px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.lineWidth = 1;
    
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
        const ratio = i / steps;
        const val = minVal + ratio * (maxVal - minVal);
        const y = padding.top + height - (ratio * height);
        
        ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(padding.left + width, y);
        ctx.strokeStyle = Math.abs(val) < (maxVal-minVal)*0.01 ? "#94A3B8" : "#F1F5F9"; 
        ctx.stroke();
        ctx.fillStyle = "#94A3B8"; ctx.fillText(formatCompactPHP(val), padding.left - 15, y);
    }

    ctx.textAlign = "center"; ctx.fillStyle = "#94A3B8";
    const count = timeline.length;
    const maxLabels = Math.floor(width / 60); 
    const skip = Math.ceil(count / maxLabels);
    timeline.forEach((item, i) => {
        if (i % skip === 0 || i === count - 1) {
            const x = padding.left + (i / (count - 1)) * width;
            ctx.fillText(item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), x, padding.top + height + 25);
        }
    });
}

function drawSmoothLine(ctx, points, layout) {
    if (points.length < 2) return;
    const { padding, height } = layout;

    ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i]; const next = points[i+1];
        const midX = (curr.x + next.x) / 2; const midY = (curr.y + next.y) / 2;
        if (i === 0) ctx.lineTo(curr.x, curr.y);
        ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
    }
    ctx.lineTo(points[points.length-1].x, points[points.length-1].y);
    ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = 3;
    ctx.strokeStyle = "var(--primary)"; 
    ctx.stroke();

    ctx.lineTo(points[points.length-1].x, padding.top + height);
    ctx.lineTo(points[0].x, padding.top + height); ctx.closePath();
    const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + height);
    grad.addColorStop(0, "rgba(16, 185, 129, 0.15)");
    grad.addColorStop(1, "rgba(16, 185, 129, 0)");
    ctx.fillStyle = grad; ctx.fill();
}

function drawMarkers(ctx, points) {
    points.forEach(p => {
        const config = chartConfig.find(c => c.key === p.data.type) || {};
        ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = config.color || '#64748B'; ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = "#FFFFFF"; ctx.stroke();
    });
}

function handleChartHover(e) {
    const { points, layout, ctx, cvs } = chartState;
    if (!points || points.length === 0) return;

    const rect = cvs.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (cvs.width / rect.width);
    
    let closest = null; let minDist = Infinity;
    points.forEach(p => {
        const dist = Math.abs(p.x - mouseX);
        if (dist < minDist) { minDist = dist; closest = p; }
    });

    drawTrendChart();
    if (closest && minDist < 50) {
        const { x, y, data } = closest;
        const { padding, height } = layout;

        ctx.beginPath(); ctx.moveTo(x, padding.top); ctx.lineTo(x, padding.top + height);
        ctx.strokeStyle = "#CBD5E1"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);

        const boxW = 160; const boxH = 90; const pad = 12;
        let tx = x + 15; if (tx + boxW > cvs.width) tx = x - boxW - 15;
        let ty = y - 45; if (ty < 10) ty = 10;

        ctx.shadowColor = "rgba(0,0,0,0.15)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4;
        ctx.fillStyle = "#1E293B"; ctx.beginPath(); ctx.roundRect(tx, ty, boxW, boxH, 8); ctx.fill();
        ctx.shadowColor = "transparent";

        ctx.textAlign = "left"; ctx.fillStyle = "#94A3B8"; ctx.font = "500 10px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), tx + pad, ty + 20);

        ctx.fillStyle = "#FFFFFF"; ctx.font = "600 12px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(data.name.length > 18 ? data.name.substring(0, 16) + '...' : data.name, tx + pad, ty + 38);

        const config = chartConfig.find(c => c.key === data.type) || {};
        ctx.fillStyle = config.color || '#fff'; ctx.font = "500 11px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(`${data.type.charAt(0).toUpperCase() + data.type.slice(1)}: ${formatPHP(Math.abs(data.amount))}`, tx + pad, ty + 56);

        ctx.fillStyle = "#FFFFFF"; ctx.fillText(`Bal: ${formatPHP(data.balance)}`, tx + pad, ty + 74);
        
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fillStyle = "#FFFFFF"; ctx.fill();
        ctx.strokeStyle = config.color || 'var(--primary)'; ctx.lineWidth = 2; ctx.stroke();
    }
}