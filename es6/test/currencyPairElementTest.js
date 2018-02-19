var chai = require('chai')
var jsdom = require('jsdom')
const { JSDOM } = jsdom
var expect = chai.expect
const CurrencyPairElement = require('../currencyPairElement')

describe('#currencyPairElement', () => {
  beforeEach(function () {
    const { document } = (new JSDOM('')).window
    global.document = document
  })
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
    `<td>EUR - JPY</td>
    <td>110.2346</td>
    <td>108.3457</td>
    <td>111.1235</td>
    <td>109.4568</td>
    <td class="value-positive">
              1.3423
            </td>
    <td class="value-negative">
              -0.3453
            </td>
    <td><span id="sparkLine_eurjpy"></span></td>`

  it('should be able to create a table row element', () => {
        // given
    let currencyPairElement = new CurrencyPairElement()
        // when
    let actual = currencyPairElement.createRow(data)
        // then
    expect(actual.innerHTML).to.be.equal(rowElement)
  })

   it('should be able to create table row data', () => {
    // given
     let currencyPairElement = new CurrencyPairElement()
     let rowElement = currencyPairElement.createRow(data)
     document.body.appendChild(rowElement)
     const rowData =
     `<td>EUR - JPY</td>
    <td>110.2346</td>
    <td>106.3457</td>
    <td>101.1235</td>
    <td>119.4568</td>
    <td class="value-positive">
              1.3423
            </td>
    <td class="value-negative">
              -0.3453
            </td>
    <td><span id="sparkLine_eurjpy"></span></td>`

     const newData = {
       name: 'eurjpy',
       bestBid: 110.2345678,
       bestAsk: 106.3456789,
       openBid: 101.1234567,
       openAsk: 119.4567890,
       lastChangeBid: 1.3423456,
       lastChangeAsk: -0.3452897
     }
     // when
     document.getElementById(data.name).innerHTML = currencyPairElement.createRowData(newData)
     // then
     expect(document.getElementById(data.name).innerHTML).to.be.equal(rowData)
   })

   it('should be able to remove a row element', () => {
    // given
     let currencyPairElement = new CurrencyPairElement(document.body)
     let rowElement = currencyPairElement.createRow(data)
     document.body.appendChild(rowElement)
    // when
     currencyPairElement.removeElement(data)
    // then
     expect(document.getElementById(data.name)).to.be.equal(null)
   })

   it('should be able to insert a row element at a position', () => {
    // given
    const newData = {
      name: 'eurcad',
      bestBid: 110.2345678,
      bestAsk: 106.3456789,
      openBid: 101.1234567,
      openAsk: 119.4567890,
      lastChangeBid: 1.3423456,
      lastChangeAsk: -0.3452897
    }
    const expectedElement =
    `<tr id="eurcad"><td>EUR - CAD</td>
    <td>110.2346</td>
    <td>106.3457</td>
    <td>101.1235</td>
    <td>119.4568</td>
    <td class="value-positive">
              1.3423
            </td>
    <td class="value-negative">
              -0.3453
            </td>
    <td><span id="sparkLine_eurcad"></span></td></tr><tr id="eurjpy"><td>EUR - JPY</td>
    <td>110.2346</td>
    <td>108.3457</td>
    <td>111.1235</td>
    <td>109.4568</td>
    <td class="value-positive">
              1.3423
            </td>
    <td class="value-negative">
              -0.3453
            </td>
    <td><span id="sparkLine_eurjpy"></span></td></tr>`
     let indexToBeAttached = 0
     let currencyPairElement = new CurrencyPairElement(document.body)
     let rowElement = currencyPairElement.createRow(data)
     document.body.appendChild(rowElement)
    // when
     currencyPairElement.updateTableRow(newData, indexToBeAttached)
    // then
     expect(document.body.innerHTML).to.be.equal(expectedElement)
   })
})
