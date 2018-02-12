import {format} from './utils'
const Sparkline = require('../site/sparkline')
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
    let currencies = this.currencyPairs.filter(pair => pair.name === data.name)
    if (currencies.length > 0) {
      if (!currencies[0].midPrices) {
        currencies[0].midPrices = []
      }
      currencies[0].midPrices.push((data.bestAsk + data.bestBid) / 2)
    }
  }

  updateElement (currencyData) {
    return `<td >${format(currencyData.name)}</td> 
    <td>${format(currencyData.bestBid)}</td>
    <td>${format(currencyData.bestAsk)}</td>
    <td>${format(currencyData.openBid)}</td>
    <td>${format(currencyData.openAsk)}</td>
    <td>${format(currencyData.lastChangeBid)}</td>
    <td>${format(currencyData.lastChangeAsk)}</td>
    <td><span id='sparkLine_${currencyData.name}'></span></td>`
  }

isNewCurrency (currencyData) {
    return this.currencyPairs.length == 0 || this.currencyPairs.filter(pair => pair.name === currencyData.name).length == 0
  }
}
module.exports = StockData
