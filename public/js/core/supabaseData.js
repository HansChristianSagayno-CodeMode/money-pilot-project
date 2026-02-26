window.appData = {
    budgets: [],
    debts: [],
    goals: []
  };
  
  window.loadAllData = async function () {
  
    const supabase = window.supabase;
  
    if (!supabase) {
      console.error("Supabase not initialized");
      return;
    }
  
    const { data: budgets } = await supabase
      .from("budgets")
      .select("*");
  
    const { data: debts } = await supabase
      .from("debts")
      .select("*");
  
    const { data: goals } = await supabase
      .from("goals")
      .select("*");
  
    window.appData.budgets = budgets || [];
    window.appData.debts = debts || [];
    window.appData.goals = goals || [];
  
    console.log("Supabase data loaded:", window.appData);
  };

  window.appData = {

    budgets: [],
    debts: [],
    goals: [],
    savings: [],
    records: [],
  
    planner: {
      mainGoal: 50000,
      period: "Monthly",
      items: [
        {
          id: 1,
          name: "Standing Desk",
          cost: 15000
        }
      ]
    }
  
  };