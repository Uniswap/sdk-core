import { BigintIsh } from '../../constants'
import { Token } from '../token'
import BaseCurrencyAmount from './baseCurrencyAmount'

export default class TokenAmount extends BaseCurrencyAmount {
  public readonly currency: Token

  public constructor(token: Token, amount: BigintIsh) {
    super(token, amount)
    this.currency = token
  }
}
