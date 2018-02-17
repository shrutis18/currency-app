const formatDecimalPoints = require('./utils')
class StockData {
  constructor () {
    this.currencyPairs = []
  }
  populateTableRow (data, table) {
    this.updateCurrencyPairs(data, table)
  }

  getCurrencyPairByName (name) {
    return this.currencyPairs.filter(pair => pair.name === name)[0]
  }

  removeCurrencyPair (data) {
    return this.currencyPairs.filter(pair => pair.name !== data.name)
  }

  updateCurrencyPairs (newCurrencyPair, table) {
    let oldCurrencyPair = this.getCurrencyPairByName(newCurrencyPair.name)
    if (oldCurrencyPair) {
      this.currencyPairs = this.removeCurrencyPair(oldCurrencyPair)
      table.removeChild(document.getElementById(oldCurrencyPair.name))
      newCurrencyPair.midPrices = oldCurrencyPair.midPrices
    }
    let indexToBeAttachedBefore = this.calculateAttachingIndexForNewCurrencyPair(newCurrencyPair)
    this.updateTableRow(table, newCurrencyPair, indexToBeAttachedBefore)

    this.currencyPairs.push(newCurrencyPair)
    this.updateMidPrices(newCurrencyPair)
    this.sortCurrencyPairs()
  }

  sortCurrencyPairs () {
    this.currencyPairs.sort(function (a, b) {
      if (a.lastChangeBid >= b.lastChangeBid) {
        return -1
      } else {
        return 1
      }
    })
  }
  updateTableRow (table, data, indexToBeAttachedBefore) {
    if (indexToBeAttachedBefore === -1) {
      table.append(this.createRow(data))
    } else {
      table.insertBefore(this.createRow(data), table.children[indexToBeAttachedBefore])
    }
  }

  createRow (currencyData) {
    let row = document.createElement('tr')
    row.setAttribute('id', currencyData.name)
    row.innerHTML = this.createRowData(currencyData)
    return row
  }

  updateMidPrices (data) {
    let currencyPair = this.getCurrencyPairByName(data.name)
    if (currencyPair) {
      if (!currencyPair.midPrices) {
        currencyPair.midPrices = []
      }
      const newMidPrice = (data.bestAsk + data.bestBid) / 2
      currencyPair.midPrices = [...(currencyPair.midPrices.slice(-(30 - 1))), newMidPrice]
    }
  }

  createRowData (currencyData) {
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
    return this.currencyPairs.length === 0 || this.currencyPairs.filter(pair => pair.name === currencyData.name).length === 0
  }

  calculateAttachingIndexForNewCurrencyPair (data) {
    return this.currencyPairs.findIndex(pair => pair.lastChangeBid <= data.lastChangeBid)
  }
}
module.exports = StockData
