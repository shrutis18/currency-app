const formatDecimalPoints = require('./utils')
class StockData {
  constructor () {
    this.currencyPairs = []
  }
  populateTableRow (data, table) {
    if (this.isNewCurrency(data)) {
      table.append(this.createNewElement(data))
    } else {
      let id = data.name
      document.getElementById(id).innerHTML = this.updateElement(data)
    }
    this.updateMidPrices(data)
  }

  createNewElement (currencyData) {
    let row = document.createElement('tr')
    row.setAttribute('id', currencyData.name)
    row.innerHTML = this.updateElement(currencyData)
    this.currencyPairs.push(currencyData)
    return row
  }

  updateMidPrices (data) {
    let currencyPair = this.currencyPairs.filter(pair => pair.name === data.name)
    if (currencyPair.length > 0) {
      if (!currencyPair[0].midPrices) {
        currencyPair[0].midPrices = []
      }
      const newMidPrice = (data.bestAsk + data.bestBid) / 2
      currencyPair[0].midPrices = [...(currencyPair[0].midPrices.slice(-(30 - 1))), newMidPrice]
      // currencies[0].midPrices.push((data.bestAsk + data.bestBid) / 2)
    }
  }

  updateElement (currencyData) {
    return `<td>${currencyData.name}</td>
    <td>${formatDecimalPoints(currencyData.bestBid)}</td>
    <td>${formatDecimalPoints(currencyData.bestAsk)}</td>
    <td>${formatDecimalPoints(currencyData.openBid)}</td>
    <td>${formatDecimalPoints(currencyData.openAsk)}</td>
    <td>${formatDecimalPoints(currencyData.lastChangeBid)}</td>
    <td>${formatDecimalPoints(currencyData.lastChangeAsk)}</td>
    <td><span id='sparkLine_${currencyData.name}'></span></td>`
  }

  isNewCurrency (currencyData) {
    return this.currencyPairs.length == 0 || this.currencyPairs.filter(pair => pair.name === currencyData.name).length == 0
  }
}
module.exports = StockData
