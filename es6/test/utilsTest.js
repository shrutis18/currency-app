var chai = require('chai')
var expect = chai.expect
const formatDecimalPoints = require('../utils')
describe('utils', () => {
  describe('#formatDecimalPoints', () => {
    it('fix the decimal points to 4', () => {
      expect(formatDecimalPoints(4.23456)).to.be.eql('4.2346')
    })
  })
})
