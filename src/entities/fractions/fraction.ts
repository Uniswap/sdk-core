import JSBI from 'jsbi'
import invariant from 'tiny-invariant'
import _Decimal from 'decimal.js-light'
import _Big, { RoundingMode } from 'big.js'
import toFormat from 'toformat'

import { BigintIsh, BigintIshNonJSBI, Rounding } from '../../constants'

const Decimal = toFormat(_Decimal)
const Big = toFormat(_Big)

const toSignificantRounding = {
  [Rounding.ROUND_DOWN]: Decimal.ROUND_DOWN,
  [Rounding.ROUND_HALF_UP]: Decimal.ROUND_HALF_UP,
  [Rounding.ROUND_UP]: Decimal.ROUND_UP,
}

const toFixedRounding = {
  [Rounding.ROUND_DOWN]: RoundingMode.RoundDown,
  [Rounding.ROUND_HALF_UP]: RoundingMode.RoundHalfUp,
  [Rounding.ROUND_UP]: RoundingMode.RoundUp,
}

export class Fraction {
  public get numerator(): JSBI {
    return JSBI.BigInt(this._numerator.toString(10))
  }
  public get denominator(): JSBI {
    return JSBI.BigInt(this._denominator.toString(10))
  }
  public readonly _numerator: bigint
  public readonly _denominator: bigint

  public constructor(numerator: BigintIsh, denominator: BigintIsh = 1n) {
    this._numerator = BigInt(numerator.toString(10))

    this._denominator = BigInt(denominator.toString(10))
  }

  private static tryParseFraction(fractionish: BigintIsh | Fraction): Fraction {
    if (
      (typeof fractionish === 'object' && fractionish.constructor === JSBI) ||
      typeof fractionish === 'bigint' ||
      typeof fractionish === 'number' ||
      typeof fractionish === 'string'
    ) {
      return new Fraction(fractionish)
    }

    if ('numerator' in fractionish && 'denominator' in fractionish) return fractionish
    throw new Error('Could not parse fraction')
  }

  // performs floor division
  public get quotient(): JSBI {
    return JSBI.divide(this.numerator, this.denominator)
  }
  public get quotientBigInt(): bigint {
    return this._numerator / this._denominator
  }

  // remainder after floor division
  public get remainder(): Fraction {
    return new Fraction(this._numerator % this._denominator, this._denominator)
  }

  public invert(): Fraction {
    return new Fraction(this._denominator, this._numerator)
  }

  public add(other: Fraction | BigintIsh): Fraction {
    const otherParsed = Fraction.tryParseFraction(other)
    if (this._denominator === otherParsed._denominator) {
      return new Fraction(this._numerator + otherParsed._numerator, this.denominator)
    }
    return new Fraction(
      this._numerator * otherParsed._denominator + otherParsed._numerator * this._denominator,
      this._denominator * otherParsed._denominator
    )
  }

  public subtract(other: Fraction | BigintIsh): Fraction {
    const otherParsed = Fraction.tryParseFraction(other)
    if (this._denominator === otherParsed._denominator) {
      return new Fraction(this._numerator - otherParsed._numerator, this._denominator)
    }
    return new Fraction(
      this._numerator * otherParsed._denominator - otherParsed._numerator * this._denominator,
      this._denominator * otherParsed._denominator
    )
  }

  public lessThan(other: Fraction | BigintIsh): boolean {
    const otherParsed = Fraction.tryParseFraction(other)
    return this._numerator * otherParsed._denominator < otherParsed._numerator * this._denominator
  }

  public equalTo(other: Fraction | BigintIsh): boolean {
    const otherParsed = Fraction.tryParseFraction(other)
    return this._numerator * otherParsed._denominator === otherParsed._numerator * this._denominator
  }

  public greaterThan(other: Fraction | BigintIsh): boolean {
    const otherParsed = Fraction.tryParseFraction(other)
    return this._numerator * otherParsed._denominator > otherParsed._numerator * this._denominator
  }

  public multiply(other: Fraction | BigintIsh): Fraction {
    const otherParsed = Fraction.tryParseFraction(other)
    return new Fraction(this._numerator * otherParsed._numerator, this._denominator * otherParsed._denominator)
  }

  public divide(other: Fraction | BigintIsh): Fraction {
    const otherParsed = Fraction.tryParseFraction(other)
    return new Fraction(this._numerator * otherParsed._denominator, this._denominator * otherParsed._numerator)
  }

  public toSignificant(
    significantDigits: number,
    format: object = { groupSeparator: '' },
    rounding: Rounding = Rounding.ROUND_HALF_UP
  ): string {
    invariant(Number.isInteger(significantDigits), `${significantDigits} is not an integer.`)
    invariant(significantDigits > 0, `${significantDigits} is not positive.`)

    Decimal.set({ precision: significantDigits + 1, rounding: toSignificantRounding[rounding] })
    const quotient = new Decimal(this._numerator.toString())
      .div(this._denominator.toString())
      .toSignificantDigits(significantDigits)
    return quotient.toFormat(quotient.decimalPlaces(), format)
  }

  public toFixed(
    decimalPlaces: number,
    format: object = { groupSeparator: '' },
    rounding: Rounding = Rounding.ROUND_HALF_UP
  ): string {
    invariant(Number.isInteger(decimalPlaces), `${decimalPlaces} is not an integer.`)
    invariant(decimalPlaces >= 0, `${decimalPlaces} is negative.`)

    Big.DP = decimalPlaces
    Big.RM = toFixedRounding[rounding]
    return new Big(this._numerator.toString()).div(this._denominator.toString()).toFormat(decimalPlaces, format)
  }

  /**
   * Helper method for converting any super class back to a fraction
   */
  public get asFraction(): Fraction {
    return new Fraction(this._numerator, this._denominator)
  }
}
