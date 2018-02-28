const CurrencyPairElement = require('./currencyPairElement')
const Sparkline = require('../site/sparkline')
const MAX_MID_PRICES_COUNT = 30

class StockData {
  constructor () {
    this.currencyPairs = []
  }

  render (data, table) {
    this.currencyPairElement = new CurrencyPairElement(table)
    this.updateCurrencyPairs(data, table)
    this.drawSparkLine(table)
  }

  getCurrencyPairByName (name) {
    return this.currencyPairs.filter(pair => pair.name === name)[0]
  }

  removeCurrencyPair (data) {
    return this.currencyPairs.filter(pair => pair.name !== data.name)
  }

  updateCurrencyPairs (newCurrencyPair) {
    let oldCurrencyPair = this.getCurrencyPairByName(newCurrencyPair.name)
    if (oldCurrencyPair) {
      this.currencyPairs = this.removeCurrencyPair(oldCurrencyPair)
      this.currencyPairElement.removeElement(oldCurrencyPair)
      newCurrencyPair.midPrices = oldCurrencyPair.midPrices
    }
    this.attachCurrencyPairToDom(newCurrencyPair)
    this.currencyPairs.push(newCurrencyPair)
    this.updateMidPrices(newCurrencyPair)
    this.sortCurrencyPairs()
  }

  attachCurrencyPairToDom (newCurrencyPair) {
    let indexToBeAttachedBefore = this.calculateAttachingIndexForNewCurrencyPair(newCurrencyPair)
    this.currencyPairElement.updateTableRow(newCurrencyPair, indexToBeAttachedBefore)
  }

  sortCurrencyPairs () {
    this.currencyPairs.sort((pair1, pair2) => {
      return pair2.lastChangeBid - pair1.lastChangeBid
    })
  }

  updateMidPrices (data) {
    let currencyPair = this.getCurrencyPairByName(data.name)
    if (currencyPair) {
      if (!currencyPair.midPrices) {
        currencyPair.midPrices = []
      }
      const newMidPrice = (data.bestAsk + data.bestBid) / 2
      currencyPair.midPrices = [...(currencyPair.midPrices.slice(-(MAX_MID_PRICES_COUNT - 1))), newMidPrice]
    }
  }

  isNewCurrencyPair (currencyData) {
    return this.currencyPairs.length === 0 || this.currencyPairs.filter(pair => pair.name === currencyData.name).length === 0
  }

  calculateAttachingIndexForNewCurrencyPair (currencyPair) {
    return this.currencyPairs.findIndex(pair => pair.lastChangeBid <= currencyPair.lastChangeBid)
  }

  drawSparkLine () {
    this.currencyPairs.forEach(function (currencyPair) {
      Sparkline.draw(document.getElementById('sparkLine_' + currencyPair.name), currencyPair.midPrices, { width: 250 })
    })
  }
}
module.exports = StockData
