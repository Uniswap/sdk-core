import { BaseCurrency } from './baseCurrency'
import { Token } from './token'

/**
 * Represents the native currency of the chain on which it resides, e.g.
 */
export abstract class NativeCurrency extends BaseCurrency {
  public readonly isNative: true = true
  public readonly isToken: false = false

  /**
   * Return the wrapped version of this native currency that can be used with the Uniswap contracts
   */
  public abstract get wrapped(): Token
}
