

function calcSave() {
  let savings = document.getElementById("savings").value
  let interest = document.getElementById("savInt").value
  let result = savings * interest
  console.log('interest is', interest)
  console.log('deposit is', savings)
  console.log('result is', result)
}