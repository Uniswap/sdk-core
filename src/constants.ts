import JSBI from 'jsbi'

// exports for external consumption
export type BigintIsh = bigint | JSBI | string | number
export type BigintIshNonJSBI = bigint | string | number

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT,
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

export const MaxUint256 = JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
export const MaxUint256BigInt = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
