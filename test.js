var arr = [
  { value: 1200, name: 'Industries' },
  { value: 240, name: 'Technology' },
  { value: 149, name: 'Forex' },
  { value: 100, name: 'Gold' },
  { value: 591, name: 'Forecasts1' },
  { value: 592, name: 'Forecasts2' },
  { value: 593, name: 'Forecasts3' },
  { value: 594, name: 'Forecasts4' }
]

function getDataName(arr) {
  const newArr = [...arr]
  newArr.forEach((item, index) => {
    newArr[index] = item.name
  })
  return newArr
}

console.log(getDataName(arr))
console.log(arr)
