const CurrencyPairElement = require('./currencyPairElement')
const Sparkline = require('../site/sparkline')
const MAX_MID_PRICES_COUNT = 30

class StockData {
  // let currencyPairs = []
  constructor () {
    this.currencyPairs = []
  }

  render (data, table) {
    this.currencyPairElement = new CurrencyPairElement(table)
    this.updateCurrencyPairs(data, table)
    this.drawSparkLine(table)
  }

  getCurrencyPairByName (name, currencyPairs) {
    return currencyPairs.filter(pair => pair.name === name)[0]
  }

  removeCurrencyPair (data) {
    return this.currencyPairs.filter(pair => pair.name !== data.name)
  }

  updateCurrencyPairs (newCurrencyPair) {
    let oldCurrencyPair = this.getCurrencyPairByName(newCurrencyPair.name, this.currencyPairs)
    if (oldCurrencyPair) {
      this.currencyPairs = this.removeCurrencyPair(oldCurrencyPair)
      newCurrencyPair.midPrices = oldCurrencyPair.midPrices
      this.currencyPairElement.removeElement(oldCurrencyPair).then(() => {
        this.attachCurrencyPairToDom(newCurrencyPair).then((newCurrencyPair) => {
          this.updateMidPrices(newCurrencyPair).then((currencyPairs) => {
            this.sortCurrencyPairs(currencyPairs)
          })
        })
      })
    } else {
      this.attachCurrencyPairToDom(newCurrencyPair).then((newCurrencyPair) => {
        this.updateMidPrices(newCurrencyPair).then((currencyPairs) => {
          this.sortCurrencyPairs(currencyPairs)
        })
      })
    }
  }

  updateCurrencyPairAndSort (newCurrencyPair) {
    this.attachCurrencyPairToDom(newCurrencyPair)
    this.updateMidPrices(newCurrencyPair, this.sortCurrencyPairs())
  }

  attachCurrencyPairToDom (newCurrencyPair) {
    let currencyPairElement = this.currencyPairElement
    let currencyPairs = this.currencyPairs
    return new Promise(function (resolve, reject) {
      let indexToBeAttachedBefore = currencyPairs.findIndex(pair => pair.lastChangeBid <= newCurrencyPair.lastChangeBid)
      currencyPairElement.updateTableRow(newCurrencyPair, indexToBeAttachedBefore)
      resolve(newCurrencyPair)
    })
  }

  sortCurrencyPairs (currencyPairs) {
    currencyPairs.sort((pair1, pair2) => {
      return pair2.lastChangeBid - pair1.lastChangeBid
    })
    this.currencyPairs = currencyPairs
  }

  updateMidPrices (newCurrencyPair) {
    let currencyPairs = this.currencyPairs
    // let getCurrencyPairByName = this.getCurrencyPairByName
    return new Promise(function (resolve, reject) {
      currencyPairs.push(newCurrencyPair)
      let currencyPair = newCurrencyPair
      if (currencyPair) {
        if (!currencyPair.midPrices) {
          currencyPair.midPrices = []
        }
        const newMidPrice = (newCurrencyPair.bestAsk + newCurrencyPair.bestBid) / 2
        currencyPair.midPrices = [...(currencyPair.midPrices.slice(-(MAX_MID_PRICES_COUNT - 1))), newMidPrice]
      }
      resolve(currencyPairs)
    })
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
