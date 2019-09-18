function calcSave() {
  let savings = +document.getElementById("savings").value
  let interest = +document.getElementById("savInt").value
  let result = savings * interest
  let total = savings += result
  savInt1yr.innerHTML = result
  total1yr.innerHTML = total
}

function calcRent() {
  let rent = +document.getElementById("rent").value
  let bills = +document.getElementById("bills").value
  let rbMonth = rent += bills
  let resultRent = rbMonth * 12
  rentbills1yr.innerHTML = resultRent
}

function calcMort() {
  let huc = +document.getElementById("hup").value
  let mortPay = +document.getElementById("mpay").value
  let bills = +document.getElementById("bills").value
  let mtMonth = mortPay += bills
  let resultMort = mtMonth * 12
  mortbills1yr.innerHTML = resultMort += huc
}