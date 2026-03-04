
function calculateTotals() {

    const planner = window.appData.planner;

    const goal = Number(planner.mainGoal) || 0;

    const allocated =
        planner.items.reduce(
            (sum, item) => sum + (Number(item.cost) || 0),
            0
        );

    planner.allocated = allocated;

    planner.percentage =
        goal > 0 ? (allocated / goal) * 100 : 0;

}

function recalculateSavings() {
    calculateTotals();
    renderSavings();
}




async function loadSavings() {

    if (!window.appData.planner) {
        window.appData.planner = {
            mainGoal: 50000,
            period: "Monthly",
            items: []
        };
    }

    await loadItems(); 

}

  





function renderSavings() {

    const planner = window.appData.planner;

    if (!planner) return;

    const goal = planner.mainGoal || 0;

    const items = planner.items || [];


const itemsHeader = document.getElementById("planner-items-header");

if (itemsHeader) {
    const totalItems = items.length;
    const maxItems = 3; // keep your current limit

    itemsHeader.innerText =
        `Items to Buy ${totalItems} / ${maxItems} Items`;
}

    const totalCost =
    items.reduce((sum, item) => sum + Number(item.cost || 0), 0);




    const goalInput =
        document.getElementById("planner-main-goal");

    if (goalInput &&
        document.activeElement !== goalInput) {

        goalInput.value = goal;

    }

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



    const container =
        document.getElementById("planner-items-list");

    if (container) {

        container.innerHTML =
        items.map(item => `
            <div class="planner-list-item">
    
                <input 
    value="${item.name}" 
    data-id="${item.id}"
    data-field="name"
    class="planner-input"
/>
    
               <input 
    type="number"
    value="${item.cost}" 
    data-id="${item.id}"
    data-field="cost"
    class="planner-input"
/>
    
            </div>
        `).join("");

    }




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
            
            
            // Attach listeners after rendering
            document.querySelectorAll(".planner-input").forEach(input => {

                input.onchange = (e) => {
            
                    const id = e.target.dataset.id; // ← FIXED
                    const field = e.target.dataset.field;
                    const value = e.target.value;
            
                    window.updatePlannerItem(id, field, value);
            
                };
            
            });

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
    
        recalculateSavings();
    });

    periodInput.addEventListener("change", () => {

        window.appData.planner.period =
            periodInput.value;

        renderSavings();
    });

}

//--------------------------------------------------
// ADD PLANNER ITEM
//--------------------------------------------------

async function addPlannerItem(name, cost) {
    const numericCost = Number(cost);

    if (!name || !numericCost || numericCost <= 0) return;

    const { data, error } = await window.supabase
        .from("savings_items")
        .insert([
            {
                name: name.trim(),
                cost: numericCost
            }
        ])
        .select();

    if (error) {
        console.error("Add Savings Item Error:", error);
        return;
    }

    // Push returned row into global state
    window.appData.planner.items.push(data[0]);

    recalculateSavings();
}

// Expose globally for React button
window.addPlannerItem = addPlannerItem;

async function updatePlannerItem(id, field, value) {

    const updateData = {};

    if (field === "name") {
        updateData.name = value.trim();
    }

    if (field === "cost") {
        updateData.cost = Number(value) || 0;
    }
    console.log("Updating item:", id, field, value);

    const { data, error } = await window.supabase
        .from("savings_items")
        .update(updateData)
        .eq("id", id)
        .select();

    if (error) {
        console.error("Update Savings Item Error:", JSON.stringify(error, null, 2));
        return;
    }

    const index =
        window.appData.planner.items.findIndex(i => i.id === id);

    if (index !== -1) {
        window.appData.planner.items[index] = data[0];
    }

    recalculateSavings();
}





window.updatePlannerItem = updatePlannerItem;

async function loadItems() {
    const { data, error } = await window.supabase
        .from("savings_items")
        .select("*")
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Load Savings Items Error:", error);
        return;
    }

    window.appData.planner.items = data || [];

    recalculateSavings();
}

async function deletePlannerItem(id) {
    const { error } = await window.supabase
        .from("savings_items")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Delete Savings Item Error:", error);
        return;
    }

    // Remove locally
    window.appData.planner.items =
        window.appData.planner.items.filter(item => item.id !== id);

        recalculateSavings();
}










