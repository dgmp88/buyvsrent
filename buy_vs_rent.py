#!/usr/bin/env python3
years = 25
initial_investment = 150000
monthly_total = 1800
rent_payments = 1250
mortgage_payments = 1250
house_price = 400000

savings_interest = 0.07
mortgage_interest = 0.03
house_growth = 0.03


def calc_compound_interest(
    start_sum, interest_rate, years, step_add=0, compounding_steps=12
):
    total = start_sum
    total_added = start_sum
    for _ in range(years):
        for _ in range(compounding_steps):
            # Add interest
            interest = total * (interest_rate / compounding_steps)
            total += interest

            # Add extra investment
            total += step_add
            total_added += step_add
    return total, total_added


def print_row(name, val):
    val = round(val)
    text = f"{name: <50}{val:,}"
    print(text)


## Calculate the savings total
monthly_savings = monthly_total - rent_payments

savings_total, total_saved = calc_compound_interest(
    initial_investment, savings_interest, years, step_add=monthly_savings
)


print_row("Total value of savings: ", savings_total)
print_row("Total value of assets: ", savings_total)
print_row("Total saved: ", total_saved)

## Calculate the house buying + savings total

mortgage = house_price - initial_investment
total_mortgage_paid = initial_investment

monthly_savings = monthly_total - mortgage_payments
savings_total = 0
savings_added = 0
one_off_add = 0
current_house_price = house_price


for _ in range(years):
    for _ in range(12):
        # Add interest
        interest = mortgage * (mortgage_interest / 12)
        mortgage += interest

        # Subtract payments
        mortgage -= mortgage_payments
        total_mortgage_paid += mortgage_payments

        # The month the mortgage is paid off, put everything int savings
        if mortgage < 0:
            one_off_add = -mortgage
            mortgage_payments = 0
            mortgage = 0
            monthly_savings = monthly_total

        # Add savings interest
        interest = savings_total * (savings_interest / 12)
        savings_total += interest

        # Add savings
        savings_total += monthly_savings + one_off_add
        savings_added += monthly_savings + one_off_add

        one_off_add = 0

        # Update house price
        house_value_accrued = current_house_price * (house_growth / 12)
        current_house_price += house_value_accrued

print("*" * 50)
print_row("Total value of savings: ", savings_total)
print_row("Total value of house: ", current_house_price)
print_row("Total value of assets: ", current_house_price + savings_total)
print_row("Total saved: ", total_saved)
