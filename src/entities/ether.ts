import invariant from 'tiny-invariant'
import { Currency } from './currency'
import { NativeCurrency } from './nativeCurrency'
import { Token } from './token'

/**
 * Ether is the main usage of a 'native' currency, i.e. for Ethereum mainnet and all testnets
 */
export class Ether extends NativeCurrency {
  private _address: string

  protected constructor(chainId: number, address: string) {
    super(chainId, 18, 'ETH', 'Ether')
    this._address = address
  }

  public get wrapped(): Token {
    const weth9 = new Token(this.chainId, this._address, 18, 'WETH', 'Wrapped Ether')
    invariant(!!weth9, 'WRAPPED')
    return weth9
  }

  private static _etherCache: { [chainId: number]: Ether } = {}

  public static onChain(chainId: number, address: string): Ether {
    return this._etherCache[chainId] ?? (this._etherCache[chainId] = new Ether(chainId, address))
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}
