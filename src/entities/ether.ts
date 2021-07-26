import { Currency } from './currency'
import { NativeCurrency } from './nativeCurrency'
import { Token } from './token'

/**
 * Ether is the main usage of a 'native' currency, i.e. for Ethereum mainnet and all testnets
 */
export class Ether extends NativeCurrency {
  private _wrappedEtherAddress: string
  private _wrappedEther: Token | undefined

  protected constructor(chainId: number, address: string) {
    super(chainId, 18, 'ETH', 'Ether')
    this._wrappedEtherAddress = address
  }

  public get wrapped(): Token {
    if (this._wrappedEther) {
      return this._wrappedEther
    }

    this._wrappedEther = new Token(this.chainId, this._wrappedEtherAddress, 18, 'WETH', 'Wrapped Ether')
    return this._wrappedEther
  }

  public static onChain(chainId: number, address: string): Ether {
    return new Ether(chainId, address)
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}
