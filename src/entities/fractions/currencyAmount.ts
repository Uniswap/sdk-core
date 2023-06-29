import invariant from 'tiny-invariant'
import JSBI from 'jsbi'
import { Currency } from '../currency'
import { Token } from '../token'
import { Fraction } from './fraction'
import _Big from 'big.js'

import toFormat from 'toformat'
import { BigintIsh, Rounding, MaxUint256BigInt } from '../../constants'

const Big = toFormat(_Big)

export class CurrencyAmount<T extends Currency> extends Fraction {
  public readonly currency: T
  public get decimalScale(): JSBI {
    return JSBI.BigInt(this._decimalScale.toString(10))
  }
  public readonly _decimalScale: bigint

  /**
   * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
   * @param currency the currency in the amount
   * @param rawAmount the raw token or ether amount
   */
  public static fromRawAmount<T extends Currency>(currency: T, rawAmount: BigintIsh): CurrencyAmount<T> {
    return new CurrencyAmount(currency, rawAmount)
  }

  /**
   * Construct a currency amount with a denominator that is not equal to 1
   * @param currency the currency
   * @param numerator the numerator of the fractional token amount
   * @param denominator the denominator of the fractional token amount
   */
  public static fromFractionalAmount<T extends Currency>(
    currency: T,
    numerator: BigintIsh,
    denominator: BigintIsh
  ): CurrencyAmount<T> {
    return new CurrencyAmount(currency, numerator, denominator)
  }

  protected constructor(currency: T, numerator: BigintIsh, denominator?: BigintIsh) {
    super(numerator, denominator)
    invariant(this.quotientBigInt <= MaxUint256BigInt, 'AMOUNT')
    this.currency = currency
    this._decimalScale = 10n ** BigInt(currency.decimals)
  }

  public add(other: CurrencyAmount<T>): CurrencyAmount<T> {
    invariant(this.currency.equals(other.currency), 'CURRENCY')
    const added = super.add(other)
    return CurrencyAmount.fromFractionalAmount(this.currency, added._numerator, added._denominator)
  }

  public subtract(other: CurrencyAmount<T>): CurrencyAmount<T> {
    invariant(this.currency.equals(other.currency), 'CURRENCY')
    const subtracted = super.subtract(other)
    return CurrencyAmount.fromFractionalAmount(this.currency, subtracted._numerator, subtracted._denominator)
  }

  public multiply(other: Fraction | BigintIsh): CurrencyAmount<T> {
    const multiplied = super.multiply(other)
    return CurrencyAmount.fromFractionalAmount(this.currency, multiplied._numerator, multiplied._denominator)
  }

  public divide(other: Fraction | BigintIsh): CurrencyAmount<T> {
    const divided = super.divide(other)
    return CurrencyAmount.fromFractionalAmount(this.currency, divided._numerator, divided._denominator)
  }

  public toSignificant(
    significantDigits: number = 6,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    return super.divide(this._decimalScale).toSignificant(significantDigits, format, rounding)
  }

  public toFixed(
    decimalPlaces: number = this.currency.decimals,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS')
    return super.divide(this._decimalScale).toFixed(decimalPlaces, format, rounding)
  }

  public toExact(format: object = { groupSeparator: '' }): string {
    Big.DP = this.currency.decimals
    return new Big(this.quotientBigInt.toString()).div(this._decimalScale.toString()).toFormat(format)
  }

  public get wrapped(): CurrencyAmount<Token> {
    if (this.currency.isToken) return this as CurrencyAmount<Token>
    return CurrencyAmount.fromFractionalAmount(this.currency.wrapped, this._numerator, this._denominator)
  }
}
