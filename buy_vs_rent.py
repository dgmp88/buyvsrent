#!/usr/bin/env python3

"""
- Capital gains tax/stamp duty
- Rent increase
- House upkeep
- Salary increase
"""

from dataclasses import dataclass


@dataclass
class Accounts:
    savings_start: float = 0
    savings_interest: float = 0.07
    savings_payments: float = 0
    expendible_income_increase: float = 0
    rent_payments: float = 0
    rent_growth: float = 0
    mortgage_start: float = 0
    mortgage_interest: float = 0.025
    mortgage_payments: float = 0
    house_value: float = 0
    house_growth: float = 0.03

    def __post_init__(self):
        self.savings = self.savings_start
        self.savings_paid = 0
        self.mortgage = self.mortgage_start
        self.mortgage_paid = 0

    def step(self):
        """Do a single step"""
        one_off_savings = 0

        for month in range(12):
            ## Calculate mortgage value
            m_interest = self.mortgage * (self.mortgage_interest / 12)
            self.mortgage += m_interest

            # Subtract payments
            self.mortgage -= self.mortgage_payments
            self.mortgage_paid += self.mortgage_payments

            # The month the mortgage is paid off, put everything into savings

            if self.mortgage <= 0 and self.mortgage_payments != 0:
                one_off_savings = -self.mortgage
                self.savings_payments += self.mortgage_payments
                self.mortgage_payments = 0
                self.mortgage = 0
                # self.mortage_year_paid_off = year

            ## Calculate savings value
            # Add savings interest
            s_interest = self.savings * (self.savings_interest / 12)
            self.savings += s_interest

            # Add savings
            self.savings += self.savings_payments + one_off_savings
            self.savings_paid += self.savings_payments + one_off_savings
            one_off_savings = 0

        # Update house price (annually, it doesn't compound)
        house_value_accrued = self.house_value * self.house_growth
        self.house_value += house_value_accrued

        self.update_total_assets()

    def update_total_assets(self):
        total_assets = 0

        if self.mortgage_paid > 0:
            house_fraction_owned = 1 - (
                self.mortgage / (self.mortgage + self.mortgage_paid)
            )
            self.house_percent_owned = house_fraction_owned * 100

            total_assets += house_fraction_owned * self.house_value

        total_assets += self.savings - self.mortgage
        self.total_assets = total_assets

    def step_n_years(self, years):
        for year in range(years):
            self.step()

    def pretty_print(self):
        print("*" * 70)
        to_print = [
            "mortgage",
            "mortgage_paid",
            "mortgage_payments",
            "savings",
            "total_assets",
        ]
        for k in to_print:
            v = getattr(self, k)
            v = f"{round(v, 2):,}"
            info = f"{k: <50}{v: >20}"
            print(info)


def print_info(info):
    print("*" * 50)
    for k, v in info.items():
        v = round(v)
        text = f"{k: <50}{v:,}"
        print(text)


years = 25
initial_investment = 50000

account = Accounts(
    rent_payments=1200, savings_start=initial_investment, savings_payments=800
)

account.step_n_years(years)
account.pretty_print()

house_value = 400000
mortgage_start = house_value - initial_investment

account = Accounts(
    mortgage_payments=1200,
    mortgage_start=mortgage_start,
    house_value=house_value,
    savings_payments=800,
)

account.step_n_years(years)
account.pretty_print()
