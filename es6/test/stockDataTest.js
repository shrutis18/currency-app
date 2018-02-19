var chai = require('chai')
var expect = chai.expect
const StockData = require('../stockData')

describe('#stockData', () => {
  const data = {
    name: 'eurjpy',
    bestBid: 110.2345678,
    bestAsk: 108.3456789,
    openBid: 111.1234567,
    openAsk: 109.4567890,
    lastChangeBid: 1.3423456,
    lastChangeAsk: -0.3452897
  }
  let stockData
  beforeEach(function () {
    stockData = new StockData()
    stockData.currencyPairs.push(data)
  })

  it('creates a mid prices for a currency pair', () => {
    // given
    stockData.currencyPairs.push(data)
    let currencyPair = stockData.currencyPairs.filter(pair => pair.name === data.name)[0]
    // when
    stockData.updateMidPrices(data)
    // then
    expect(currencyPair.midPrices).to.be.eql([(data.bestBid + data.bestAsk) / 2])
  })

  describe('update data', () => {
    let updatedData

    beforeEach(() => {
      updatedData = {
        name: 'eurjpy',
        bestBid: 115.2345678,
        bestAsk: 112.3456789,
        openBid: 116.1234567,
        openAsk: 110.4567890,
        lastChangeBid: 2.3423456,
        lastChangeAsk: -1.3452897
      }
    })

    describe('when mid prices length is less than 30', () => {
      it('updates the currency pair and add the new mid price at the end', () => {
        // given
        stockData.currencyPairs.push(updatedData)
        let currencyPair = stockData.currencyPairs.filter(pair => pair.name === data.name)[0]
        // when
        stockData.updateMidPrices(updatedData)
        // then
        expect(currencyPair.midPrices).to.be.eql([(data.bestBid + data.bestAsk) / 2, (updatedData.bestBid + updatedData.bestAsk) / 2])
      })
    })

    describe('when mid prices length is equal to 30', () => {
      it('updates the currency pair and remove the first mid price and add the new mid price at the end', () => {
        stockData.currencyPairs.push(updatedData)
        let currencyPair = stockData.currencyPairs.filter(pair => pair.name === data.name)[0]
        currencyPair.midPrices = []
        let i = 1
        while (i <= 30) {
          currencyPair.midPrices.push(i++)
        }
        stockData.updateMidPrices(updatedData)
        const updatedMidPrices = []
        let j = 2
        while (j <= 30) {
          updatedMidPrices.push(j++)
        }
        expect(currencyPair.midPrices).to.be.eql([...updatedMidPrices, (updatedData.bestBid + updatedData.bestAsk) / 2])
      })
    })
  })
})
