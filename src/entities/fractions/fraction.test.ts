import { BigNumber } from '@ethersproject/bignumber'
import { Fraction } from './fraction'

describe('Fraction', () => {
  describe('#quotient', () => {
    it('floor division', () => {
      expect(new Fraction(BigNumber.from(8), BigNumber.from(3)).quotient).toEqual(BigNumber.from(2)) // one below
      expect(new Fraction(BigNumber.from(12), BigNumber.from(4)).quotient).toEqual(BigNumber.from(3)) // exact
      expect(new Fraction(BigNumber.from(16), BigNumber.from(5)).quotient).toEqual(BigNumber.from(3)) // one above
    })
  })
  describe('#remainder', () => {
    it('returns fraction after divison', () => {
      expect(new Fraction(BigNumber.from(8), BigNumber.from(3)).remainder).toEqual(
        new Fraction(BigNumber.from(2), BigNumber.from(3))
      )
      expect(new Fraction(BigNumber.from(12), BigNumber.from(4)).remainder).toEqual(
        new Fraction(BigNumber.from(0), BigNumber.from(4))
      )
      expect(new Fraction(BigNumber.from(16), BigNumber.from(5)).remainder).toEqual(
        new Fraction(BigNumber.from(1), BigNumber.from(5))
      )
    })
  })
  describe('#invert', () => {
    it('flips num and denom', () => {
      expect(new Fraction(BigNumber.from(5), BigNumber.from(10)).invert().numerator).toEqual(BigNumber.from(10))
      expect(new Fraction(BigNumber.from(5), BigNumber.from(10)).invert().denominator).toEqual(BigNumber.from(5))
    })
  })
  describe('#add', () => {
    it('multiples denoms and adds nums', () => {
      expect(new Fraction(BigNumber.from(1), BigNumber.from(10)).add(new Fraction(BigNumber.from(4), BigNumber.from(12)))).toEqual(
        new Fraction(BigNumber.from(52), BigNumber.from(120))
      )
    })

    it('same denom', () => {
      expect(new Fraction(BigNumber.from(1), BigNumber.from(5)).add(new Fraction(BigNumber.from(2), BigNumber.from(5)))).toEqual(
        new Fraction(BigNumber.from(3), BigNumber.from(5))
      )
    })
  })
  describe('#subtract', () => {
    it('multiples denoms and subtracts nums', () => {
      expect(
        new Fraction(BigNumber.from(1), BigNumber.from(10)).subtract(new Fraction(BigNumber.from(4), BigNumber.from(12)))
      ).toEqual(new Fraction(BigNumber.from(-28), BigNumber.from(120)))
    })
    it('same denom', () => {
      expect(
        new Fraction(BigNumber.from(3), BigNumber.from(5)).subtract(new Fraction(BigNumber.from(2), BigNumber.from(5)))
      ).toEqual(new Fraction(BigNumber.from(1), BigNumber.from(5)))
    })
  })
  describe('#lessThan', () => {
    it('correct', () => {
      expect(
        new Fraction(BigNumber.from(1), BigNumber.from(10)).lessThan(new Fraction(BigNumber.from(4), BigNumber.from(12)))
      ).toBe(true)
      expect(new Fraction(BigNumber.from(1), BigNumber.from(3)).lessThan(new Fraction(BigNumber.from(4), BigNumber.from(12)))).toBe(
        false
      )
      expect(
        new Fraction(BigNumber.from(5), BigNumber.from(12)).lessThan(new Fraction(BigNumber.from(4), BigNumber.from(12)))
      ).toBe(false)
    })
  })
  describe('#equalTo', () => {
    it('correct', () => {
      expect(new Fraction(BigNumber.from(1), BigNumber.from(10)).equalTo(new Fraction(BigNumber.from(4), BigNumber.from(12)))).toBe(
        false
      )
      expect(new Fraction(BigNumber.from(1), BigNumber.from(3)).equalTo(new Fraction(BigNumber.from(4), BigNumber.from(12)))).toBe(
        true
      )
      expect(new Fraction(BigNumber.from(5), BigNumber.from(12)).equalTo(new Fraction(BigNumber.from(4), BigNumber.from(12)))).toBe(
        false
      )
    })
  })
  describe('#greaterThan', () => {
    it('correct', () => {
      expect(
        new Fraction(BigNumber.from(1), BigNumber.from(10)).greaterThan(new Fraction(BigNumber.from(4), BigNumber.from(12)))
      ).toBe(false)
      expect(
        new Fraction(BigNumber.from(1), BigNumber.from(3)).greaterThan(new Fraction(BigNumber.from(4), BigNumber.from(12)))
      ).toBe(false)
      expect(
        new Fraction(BigNumber.from(5), BigNumber.from(12)).greaterThan(new Fraction(BigNumber.from(4), BigNumber.from(12)))
      ).toBe(true)
    })
  })
  describe('#multiplty', () => {
    it('correct', () => {
      expect(
        new Fraction(BigNumber.from(1), BigNumber.from(10)).multiply(new Fraction(BigNumber.from(4), BigNumber.from(12)))
      ).toEqual(new Fraction(BigNumber.from(4), BigNumber.from(120)))
      expect(
        new Fraction(BigNumber.from(1), BigNumber.from(3)).multiply(new Fraction(BigNumber.from(4), BigNumber.from(12)))
      ).toEqual(new Fraction(BigNumber.from(4), BigNumber.from(36)))
      expect(
        new Fraction(BigNumber.from(5), BigNumber.from(12)).multiply(new Fraction(BigNumber.from(4), BigNumber.from(12)))
      ).toEqual(new Fraction(BigNumber.from(20), BigNumber.from(144)))
    })
  })
  describe('#divide', () => {
    it('correct', () => {
      expect(
        new Fraction(BigNumber.from(1), BigNumber.from(10)).divide(new Fraction(BigNumber.from(4), BigNumber.from(12)))
      ).toEqual(new Fraction(BigNumber.from(12), BigNumber.from(40)))
      expect(
        new Fraction(BigNumber.from(1), BigNumber.from(3)).divide(new Fraction(BigNumber.from(4), BigNumber.from(12)))
      ).toEqual(new Fraction(BigNumber.from(12), BigNumber.from(12)))
      expect(
        new Fraction(BigNumber.from(5), BigNumber.from(12)).divide(new Fraction(BigNumber.from(4), BigNumber.from(12)))
      ).toEqual(new Fraction(BigNumber.from(60), BigNumber.from(48)))
    })
  })
  describe('#asFraction', () => {
    it('returns an equivalent but not the same reference fraction', () => {
      const f = new Fraction(1, 2)
      expect(f.asFraction).toEqual(f)
      expect(f === f.asFraction).toEqual(false)
    })
  })
})
