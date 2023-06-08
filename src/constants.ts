import JSBI from 'jsbi'

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  SEPOLIA = 11155111,
  KOVAN = 42,
  OPTIMISM = 10,
  OPTIMISM_GOERLI = 420,
  OPTIMISTIC_KOVAN = 69,
  ARBITRUM_ONE = 42161,
  ARBITRUM_RINKEBY = 421611,
  ARBITRUM_GOERLI = 421613,
  POLYGON = 137,
  POLYGON_MUMBAI = 80001,
  CELO = 42220,
  CELO_ALFAJORES = 44787,
  GNOSIS = 100,
  MOONBEAM = 1284,
  BNB = 56,
}

export const SUPPORTED_CHAINS = [
  ChainId.MAINNET,
  ChainId.RINKEBY,
  ChainId.ROPSTEN,
  ChainId.KOVAN,
  ChainId.OPTIMISM,
  ChainId.OPTIMISM_GOERLI,
  ChainId.OPTIMISTIC_KOVAN,
  ChainId.ARBITRUM_ONE,
  ChainId.ARBITRUM_RINKEBY,
  ChainId.ARBITRUM_GOERLI,
  ChainId.POLYGON,
  ChainId.POLYGON_MUMBAI,
  ChainId.GOERLI,
  ChainId.SEPOLIA,
  ChainId.CELO_ALFAJORES,
  ChainId.CELO,
  ChainId.BNB,
] as const
export type SupportedChainsType = typeof SUPPORTED_CHAINS[number]

// exports for external consumption
export type BigintIsh = JSBI | string | number

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP
}

export const MaxUint256 = JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
