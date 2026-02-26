//--------------------------------------------------
// INIT PLANNER STATE
//--------------------------------------------------




//--------------------------------------------------
// LOAD SAVINGS (temporary in-memory integration)
//--------------------------------------------------

async function loadSavings() {

    if (!window.appData.savings || window.appData.savings.length === 0) {

        window.appData.savings = [
            { id: 1, name: "Standing Desk", cost: 15000 }
        ];

    }

    if (!window.appData.planner) {

        window.appData.planner = {
            mainGoal: 50000,
            period: "Monthly",
            items: []
        };

    }

    window.appData.planner.mainGoal =
        window.appData.planner.mainGoal || 50000;

    window.appData.planner.items = window.appData.savings;

    renderSavings();
}

//--------------------------------------------------
// RENDER (ORIGINAL WORKING LOGIC)
//--------------------------------------------------

function renderSavings() {

    const planner = window.appData.planner;

    if (!planner) return;

    const goal = planner.mainGoal || 0;

    const items = planner.items || [];

    const totalCost =
        items.reduce((sum, item) => sum + item.cost, 0);


    //--------------------------------------------------
    // Goal input
    //--------------------------------------------------

    const goalInput =
        document.getElementById("planner-main-goal");

    if (goalInput &&
        document.activeElement !== goalInput) {

        goalInput.value = goal;

    }


    //--------------------------------------------------
    // Required contribution
    //--------------------------------------------------

    let divisor =
        planner.period === "Daily" ? 365 :
        planner.period === "Weekly" ? 52 :
        planner.period === "Yearly" ? 1 :
        12;

    const perPeriod = goal / divisor;

    const calc =
        document.getElementById("planner-calc-result");

    if (calc) {

        calc.innerHTML =
            `₱${perPeriod.toLocaleString()} / ${planner.period}`;

    }


    //--------------------------------------------------
    // Items list
    //--------------------------------------------------

    const container =
        document.getElementById("planner-items-list");

    if (container) {

        container.innerHTML =
            items.map(item => `

                <div class="planner-list-item">

                    <div>

                        <div style="font-weight:600;">
                            ${item.name}
                        </div>

                        <div style="font-size:0.8rem;">
                            ₱${item.cost.toLocaleString()}
                        </div>

                    </div>

                </div>

            `).join("");

    }


    //--------------------------------------------------
    // Donut graph
    //--------------------------------------------------

    const pct =
        goal > 0
            ? (totalCost / goal) * 100
            : 0;

    const donut =
        document.getElementById("planner-donut");

        if (donut) {

            const color =
                pct > 100
                    ? "#ef4444"
                    : "#22c55e";
        
            donut.style.background =
                `conic-gradient(
                    ${color} 0% ${pct}%,
                    #1f2937 ${pct}% 100%
                )`;
        
        }


    const donutVal =
        document.getElementById("planner-donut-val");

    if (donutVal)
        donutVal.innerText =
            Math.round(pct) + "%";


    //--------------------------------------------------
    // Stats
    //--------------------------------------------------

    const totalGoal =
        document.getElementById("donut-total-goal");

    const allocated =
        document.getElementById("donut-allocated");

    const combined =
        document.getElementById("donut-combined");

    if (totalGoal)
        totalGoal.innerText =
            "₱" + goal.toLocaleString();

    if (allocated)
        allocated.innerText =
            "₱" + totalCost.toLocaleString();

    if (combined)
        combined.innerText =
            "₱" + (goal + totalCost).toLocaleString();

}



//--------------------------------------------------
// INIT
//--------------------------------------------------

(async function initSavings() {

    while (!window.appData) {
        await new Promise(r => setTimeout(r, 50));
    }

    setupPlannerListeners();

    await loadSavings(); // ✅ REQUIRED

})();





//--------------------------------------------------
// INPUT LISTENERS
//--------------------------------------------------

function setupPlannerListeners() {

    const goalInput = document.getElementById("planner-main-goal");
    const periodInput = document.getElementById("planner-period");

    if (!goalInput || !periodInput) return;

    goalInput.addEventListener("input", () => {

        window.appData.planner.mainGoal =
            parseFloat(goalInput.value) || 0;

        renderSavings();
    });

    periodInput.addEventListener("change", () => {

        window.appData.planner.period =
            periodInput.value;

        renderSavings();
    });

}