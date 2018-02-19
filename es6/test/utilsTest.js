var chai = require('chai')
var expect = chai.expect
const {formatDecimalPoints, formatName} = require('../utils')
describe('utils', () => {
  describe('#formatDecimalPoints', () => {
    it('fix the decimal points to 4', () => {
      expect(formatDecimalPoints(4.23456)).to.be.eql('4.2346')
    })
  })

  describe('#formatName', () => {
    it('splits the string into two halves', () => {
      expect(formatName('abcdef')).to.be.equal('ABC - DEF')
    })
  })
})
