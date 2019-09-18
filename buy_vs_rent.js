// Accounts object
function Accounts({
  savings_start = 0,
  savings_interest = 0.07,
  savings_payments = 0,
  expendible_income_increase = 0,
  rent_payments = 0,
  rent_growth = 0,
  mortgage_start = 0,
  mortgage_interest = 0.025,
  mortgage_payments = 0,
  house_value = 0,
  house_growth = 0.03
} = {}) {
  // set up default values
  this.savings_start = savings_start;
  this.savings_interest = savings_interest;
  this.savings_payments = savings_payments;
  this.expendible_income_increase = expendible_income_increase;
  this.rent_payments = rent_payments;
  this.rent_growth = rent_growth;
  this.mortgage_start = mortgage_start;
  this.mortgage_interest = mortgage_interest;
  this.mortgage_payments = mortgage_payments;
  this.house_value = house_value;
  this.house_growth = house_growth;

  this.savings = savings_start;
  this.savings_paid = 0;
  this.mortgage = mortgage_start;
  this.mortgage_paid = 0;

  // set up the object methods
  this.step = function() {
    // Step a single year
    one_off_savings = 0;

    // Step 1 month at a time, as savings often compound monthly
    for (i = 0; i < 12; i++) {
      ///// MORTGAGE
      // Calculate mortage interest
      m_interest = this.mortgage * (this.mortgage_interest / 12);
      this.mortgage += m_interest;

      // Subtract payments
      this.mortgage -= this.mortgage_payments;
      this.mortgage_paid += this.mortgage_payments;

      // The month the mortgage is paid off, put everything into savings
      if ((this.mortgage <= 0) & (this.mortgage_payments != 0)) {
        one_off_savings = -this.mortgage;
        this.savings_payments += this.mortgage_payments;
        this.mortgage_payments = 0;
        this.mortgage = 0;
      }

      /// SAVINGS
      // Add savings interest
      s_interest = this.savings * (this.savings_interest / 12);
      this.savings += s_interest;

      // Monthly contribution + leftovers in case mortgage was paid
      this.savings += this.savings_payments + one_off_savings;
      this.savings_paid += this.savings_payments + one_off_savings;
      one_off_savings = 0;
    }

    // Update house price (annually, it doesn't compound)
    house_value_accrued = this.house_value * this.house_growth;
    this.house_value += house_value_accrued;

    // Update total assets
    this.update_total_assets();
  };

  this.update_total_assets = function() {
    total_assets = 0;

    if (this.mortgage_paid > 0) {
      house_fraction_owned =
        1 - this.mortgage / (this.mortgage + this.mortgage_paid);
      this.house_percent_owned = house_fraction_owned * 100;

      total_assets += house_fraction_owned * this.house_value;
    }

    total_assets += this.savings - this.mortgage;
    this.total_assets = total_assets;
  };

  this.step_n_years = function(years) {
    for (year = 0; year < years; year++) {
      this.step();
    }
  };

  this.pretty_print = function() {
    let to_print = ["mortgage", "savings", "total_assets"];

    console.log("*".repeat(70));
    for (let k of to_print) {
      // Format v
      let v = this[k];
      v = v.toFixed(2).toLocaleString();
      v = v.toString().padStart(20, " ");

      // Format k
      k = k.padEnd(50, " ");
      let info = `${k}${v}`;
      console.log(info);
    }
  };
}

function test() {
  // Check results match python with some sensible parameters
  let years = 25;
  let initial_investment = 50000;
  let house_value = 400000;
  let mortgage_start = house_value - initial_investment;

  // Rent type account
  let account = new Accounts({
    savings_payments: 800,
    rent_payments: 1200,
    savings_start: initial_investment
  });
  account.step_n_years(years);
  account.pretty_print();

  // Mortgage type account
  account = new Accounts({
    savings_payments: 800,
    mortgage_payments: 1200,
    mortgage_start: mortgage_start,
    house_value: house_value
  });
  account.step_n_years(years);
  account.pretty_print();
}

test();
