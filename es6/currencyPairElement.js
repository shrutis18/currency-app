const {formatDecimalPoints, formatName} = require('./utils')

class CurrencyPairElement {
  constructor (table) {
    this.table = table
  }

  removeElement (oldCurrencyPair) {
    this.table.removeChild(document.getElementById(oldCurrencyPair.name))
  }

  updateTableRow (data, indexToBeAttachedBefore) {
    (indexToBeAttachedBefore === -1) ? this.table.append(this.createRow(data))
     : this.table.insertBefore(this.createRow(data), this.table.children[indexToBeAttachedBefore])
  }

  createRow (currencyData) {
    let row = document.createElement('tr')
    row.setAttribute('id', currencyData.name)
    row.innerHTML = this.createRowData(currencyData)
    return row
  }

  createRowData (currencyData) {
    return `<td>${formatName(currencyData.name)}</td>
    <td>${formatDecimalPoints(currencyData.bestBid)}</td>
    <td>${formatDecimalPoints(currencyData.bestAsk)}</td>
    <td>${formatDecimalPoints(currencyData.openBid)}</td>
    <td>${formatDecimalPoints(currencyData.openAsk)}</td>
    ${this.getStyledRowData(currencyData.lastChangeBid)}
    ${this.getStyledRowData(currencyData.lastChangeAsk)}
    <td><span id='sparkLine_${currencyData.name}'></span></td>`
  }

  getStyledRowData (value) {
    return `<td class = value-${value > 0 ? 'positive' : 'negative'}>
              ${(formatDecimalPoints(value))}
            </td>`
  }
}

module.exports = CurrencyPairElement
