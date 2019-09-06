#!/usr/bin/env python3
years = 25
initial_investment = 50000
monthly_total = 1800
rent_payments = 1250
mortgage_payments = 1250
house_value = 400000

savings_interest = 0.07
mortgage_interest = 0.03
house_growth = 0.03


def calc_net_assets(
    years,
    savings_start,
    savings_interest,
    savings_payments,
    mortgage_start=0,
    mortgage_interest=0,
    mortgage_payments=0,
    house_value=0,
    house_yearly_growth=0,
):

    info = dict(
        savings_start=savings_start,
        savings_payments=savings_payments,
        mortgage_start=mortgage_start,
        mortgage_payments=mortgage_payments,
        mortgage=mortgage_start,
        mortgage_paid=house_value - mortgage_start,
        savings=savings_start,
        savings_paid=savings_start,
        house_value=house_value,
    )
    one_off_savings = 0

    for year in range(years):
        # Compound monthly
        for month in range(12):

            ## Calculate mortgage value
            m_interest = info["mortgage"] * (mortgage_interest / 12)
            info["mortgage"] += m_interest

            # Subtract payments
            info["mortgage"] -= mortgage_payments
            info["mortgage_paid"] += mortgage_payments

            # The month the mortgage is paid off, put everything into savings
            if info["mortgage"] <= 0 and mortgage_payments != 0:
                one_off_savings = -info["mortgage"]
                savings_payments += mortgage_payments
                mortgage_payments = 0
                info["mortgage"] = 0
                info["mortage paid off year"] = year

            ## Calculate savings value
            # Add savings interest
            s_interest = info["savings"] * (savings_interest / 12)
            info["savings"] += s_interest

            # Add savings
            info["savings"] += savings_payments + one_off_savings
            info["savings_paid"] += savings_payments + one_off_savings
            one_off_savings = 0

        # Update house price (annually, it doesn't compound)
        house_value_accrued = info["house_value"] * house_growth
        info["house_value"] += house_value_accrued

    info["total_assets"] = 0

    if info["mortgage_paid"] > 0:
        house_fraction_owned = 1 - (
            info["mortgage"] / (info["mortgage"] + info["mortgage_paid"])
        )
        info["house_percent_owned"] = house_fraction_owned * 100

        info["total_assets"] += house_fraction_owned * info["house_value"]

    info["total_assets"] += info["savings"] - info["mortgage"]
    return info


def print_info(info):
    print("*" * 50)
    for k, v in info.items():
        v = round(v)
        text = f"{k: <50}{v:,}"
        print(text)


## Calculate the savings total
info = calc_net_assets(
    years, initial_investment, savings_interest, monthly_total - rent_payments
)
print_info(info)

## Calculate the house buying + savings total

info = calc_net_assets(
    years,
    0,
    savings_interest,
    monthly_total - mortgage_payments,
    house_value - initial_investment,
    mortgage_interest,
    mortgage_payments,
    house_value,
    house_growth,
)

print_info(info)


## Less in mortgage
house_deposit = 50000
info = calc_net_assets(
    years,
    initial_investment - house_deposit,
    savings_interest,
    monthly_total - mortgage_payments,
    house_value - house_deposit,
    mortgage_interest,
    mortgage_payments,
    house_value,
    house_growth,
)

print_info(info)
