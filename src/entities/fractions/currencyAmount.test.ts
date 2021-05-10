import JSBI from 'jsbi'
import { ChainId, MaxUint256 } from '../../constants'
import { ETHER } from '../ether'
import { Token } from '../token'
import CurrencyAmount from './currencyAmount'
import Percent from './percent'

describe('CurrencyAmount', () => {
  const ADDRESS_ONE = '0x0000000000000000000000000000000000000001'

  describe('constructor', () => {
    it('works', () => {
      const token = new Token(ChainId.MAINNET, ADDRESS_ONE, 18)
      const amount = CurrencyAmount.fromRawAmount(token, 100)
      expect(amount.quotient).toEqual(JSBI.BigInt(100))
    })
  })

  describe('#raw', () => {
    it('returns the amount after scaling up to decimals', () => {
      const token = new Token(ChainId.MAINNET, ADDRESS_ONE, 18)
      const amount = CurrencyAmount.fromRawAmount(token, 100).multiply(new Percent(15, 100))
      expect(amount.quotient).toEqual(JSBI.BigInt(15))
    })
  })

  describe('#ether', () => {
    it('produces ether amount', () => {
      const amount = CurrencyAmount.ether(100)
      expect(amount.quotient).toEqual(JSBI.BigInt(100))
      expect(amount.currency).toEqual(ETHER)
    })
  })

  it('token amount can be max uint256', () => {
    const amount = CurrencyAmount.fromRawAmount(new Token(ChainId.MAINNET, ADDRESS_ONE, 18), MaxUint256)
    expect(amount.quotient).toEqual(MaxUint256)
  })
})
