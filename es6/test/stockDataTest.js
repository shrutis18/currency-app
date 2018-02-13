var chai = require('chai')
var jsdom = require('jsdom')
const { JSDOM } = jsdom
var expect = chai.expect
const StockData = require('../stockData')

describe('#stockData', () => {
  const { document } = (new JSDOM('')).window
  global.document = document
  const data = {
    name: 'eurjpy',
    bestBid: 110.2345678,
    bestAsk: 108.3456789,
    openBid: 111.1234567,
    openAsk: 109.4567890,
    lastChangeBid: 1.3423456,
    lastChangeAsk: -0.3452897
  }

  const rowElement =
    `<td>eurjpy</td>
    <td>110.2346</td>
    <td>108.3457</td>
    <td>111.1235</td>
    <td>109.4568</td>
    <td>1.3423</td>
    <td>-0.3453</td>
    <td><span id="sparkLine_eurjpy"></span></td>`

  it('should be able to create a table row element', () => {
        // given
    let stockData = new StockData()
        // when
    let actual = stockData.createNewElement(data)
        // then
    expect(actual.innerHTML).to.be.equal(rowElement)
  })

   it('should be able to update the element', () => {
    // given
     let stockData = new StockData()
     let rowElement = stockData.createNewElement(data)
     document.body.appendChild(rowElement)
     const updatedElement =
     `<td>eurjpy</td>
    <td>110.2346</td>
    <td>106.3457</td>
    <td>101.1235</td>
    <td>119.4568</td>
    <td>1.3423</td>
    <td>-0.3453</td>
    <td><span id="sparkLine_eurjpy"></span></td>`

     const updatedData = {
       name: 'eurjpy',
       bestBid: 110.2345678,
       bestAsk: 106.3456789,
       openBid: 101.1234567,
       openAsk: 119.4567890,
       lastChangeBid: 1.3423456,
       lastChangeAsk: -0.3452897
     }
     // when
     document.getElementById(data.name).innerHTML = stockData.updateElement(updatedData)
     // then
     expect(document.getElementById(data.name).innerHTML).to.be.equal(updatedElement)
   })
})
