import JSBI from "jsbi";

export const ZERO = JSBI.BigInt(0);
export const ONE = JSBI.BigInt(1);
export const TEN = JSBI.BigInt(10);

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT,
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

export const MAX_U64 = JSBI.BigInt("0xffffffffffffffff");
export const MAX_U256 = JSBI.BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
