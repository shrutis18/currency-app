const formatDecimalPoints = (value) => {
  return parseFloat(value).toFixed(4)
}

const formatName = (currencyPairName) => {
  const str = currencyPairName.toUpperCase(),
    halfLength = str.length / 2

  return `${str.substring(0, halfLength)} - ${str.substring(halfLength)}`
}
module.exports = { formatDecimalPoints, formatName }
