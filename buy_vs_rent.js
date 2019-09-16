// Accounts object
function Accounts({
  monthly_expendible_income = 0,
  savings_start = 0,
  savings_interest = 0.07,
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
  this.monthly_expendible_income = monthly_expendible_income;
  this.savings_start = savings_start;
  this.savings_interest = savings_interest;
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

  this.savings_payments =
    monthly_expendible_income - rent_payments - mortgage_payments;

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
}

function test() {
  // Check results match python with some sensible parameters
  let years = 25;
  let initial_investment = 20000;
  let house_value = 200000;
  let mortgage_start = house_value - initial_investment;

  // Rent type account
  let account = new Accounts({
    monthly_expendible_income: 1000,
    rent_payments: 800,
    savings_start: initial_investment
  });
  account.step_n_years(years);
  console.log(account.total_assets);

  // Mortgage type account
  account = new Accounts({
    monthly_expendible_income: 1000,
    mortgage_payments: 800,
    mortgage_start: 20000,
    house_value: house_value
  });
  account.step_n_years(years);
  console.log(account.total_assets);
}

test();
