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