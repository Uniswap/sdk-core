import JSBI from 'jsbi'
import { currencyEquals } from '../../utils'
import { Currency } from '../currency'
import invariant from 'tiny-invariant'
import _Big from 'big.js'
import toFormat from 'toformat'

import { BigintIsh, Rounding, MaxUint256 } from '../../constants'
import Fraction from './fraction'

const Big = toFormat(_Big)

export default class BaseCurrencyAmount extends Fraction {
  public readonly currency: Currency

  // amount _must_ be raw, i.e. in the native representation
  protected constructor(currency: Currency, amount: BigintIsh) {
    const parsedAmount = JSBI.BigInt(amount)
    invariant(JSBI.lessThanOrEqual(parsedAmount, MaxUint256), 'AMOUNT')

    super(parsedAmount, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(currency.decimals)))
    this.currency = currency
  }

  public get raw(): JSBI {
    return this.numerator
  }

  public add(other: BaseCurrencyAmount): BaseCurrencyAmount {
    invariant(currencyEquals(this.currency, other.currency), 'TOKEN')
    return new BaseCurrencyAmount(this.currency, JSBI.add(this.raw, other.raw))
  }

  public subtract(other: BaseCurrencyAmount): BaseCurrencyAmount {
    invariant(currencyEquals(this.currency, other.currency), 'TOKEN')
    return new BaseCurrencyAmount(this.currency, JSBI.subtract(this.raw, other.raw))
  }

  public toSignificant(
    significantDigits: number = 6,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    return super.toSignificant(significantDigits, format, rounding)
  }

  public toFixed(
    decimalPlaces: number = this.currency.decimals,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS')
    return super.toFixed(decimalPlaces, format, rounding)
  }

  public toExact(format: object = { groupSeparator: '' }): string {
    Big.DP = this.currency.decimals
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(format)
  }
}
