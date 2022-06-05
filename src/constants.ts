import { default as JSBI } from "jsbi";

/**
 * Zero bigint.
 */
export const ZERO = JSBI.BigInt(0);

/**
 * One bigint.
 */
export const ONE = JSBI.BigInt(1);

/**
 * 10 bigint.
 */
export const TEN = JSBI.BigInt(10);

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

export const MAX_U64 = JSBI.BigInt("0xffffffffffffffff");
export const MAX_U256 = JSBI.BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
