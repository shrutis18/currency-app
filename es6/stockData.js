const CurrencyPairElement = require('./currencyPairElement')
class StockData {
  constructor () {
    this.currencyPairs = []
  }

  render (data, table) {
    console.log('inside render')
    this.currencyPairElement = new CurrencyPairElement(table)
    this.updateCurrencyPairs(data, table)
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
      return (pair1.lastChangeBid >= pair2.lastChangeBid) ? -1 : 1
    })
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

  isNewCurrencyPair (currencyData) {
    return this.currencyPairs.length === 0 || this.currencyPairs.filter(pair => pair.name === currencyData.name).length === 0
  }

  calculateAttachingIndexForNewCurrencyPair (currencyPair) {
    return this.currencyPairs.findIndex(pair => pair.lastChangeBid <= currencyPair.lastChangeBid)
  }
}
module.exports = StockData
