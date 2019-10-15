function calcSave() {
  let savings = +document.getElementById("savings").value
  let interest = +document.getElementById("savings-interest").value
  let result = savings * interest
  let total = savings += result
  savingsInterestYr.innerHTML = result
  savingsTotalYr.innerHTML = total
}

function calcRent() {
  let rent = +document.getElementById("rent").value
  let bills = +document.getElementById("bills").value
  let rbMonth = rent += bills
  let resultRent = rbMonth * 12
  owner1yr.innerHTML = resultRent
}

function calcMort() {
  let houseUpkeek = +document.getElementById("upkeep-costs").value
  let mortgageMonth = +document.getElementById("mortgage-monthly").value
  let bills = +document.getElementById("bills").value
  let ownerMonth = mortgageMonth += bills
  let resultMortgage = ownerMonth * 12
  owner1yr.innerHTML = resultMortgage += houseUpkeek
}