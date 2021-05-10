import { BigintIsh } from '../../constants'
import { ETHER, Ether } from '../ether'
import BaseCurrencyAmount from './baseCurrencyAmount'

/**
 * An amount of Ether
 */
export default class EtherAmount extends BaseCurrencyAmount {
  public readonly currency: Ether = ETHER

  public constructor(amount: BigintIsh) {
    super(ETHER, amount)
  }
}
