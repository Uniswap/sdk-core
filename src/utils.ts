import BN from "bn.js";
import JSBI from "jsbi";

import { TEN } from "./constants";

/**
 * Bigint-like number.
 */
export declare type BigintIsh = JSBI | string | number | bigint | BN;

/**
 * Parses a {@link BigintIsh} into a {@link JSBI}.
 * @param bigintIsh
 * @returns
 */
export function parseBigintIsh(bigintIsh: BigintIsh): JSBI {
  return bigintIsh instanceof JSBI
    ? bigintIsh
    : typeof bigintIsh === "bigint" || BN.isBN(bigintIsh)
    ? JSBI.BigInt(bigintIsh.toString())
    : JSBI.BigInt(bigintIsh);
}

const decimalMultipliersCache: JSBI[] = [];

/**
 * Creates the multiplier for an amount of decimals.
 * @param decimals
 * @returns
 */
export const makeDecimalMultiplier = (decimals: number): JSBI => {
  const cached = decimalMultipliersCache[decimals];
  if (cached) {
    return cached;
  }
  if (decimals <= 18) {
    return (decimalMultipliersCache[decimals] = JSBI.BigInt(10 ** decimals));
  }
  return (decimalMultipliersCache[decimals] = JSBI.exponentiate(
    TEN,
    JSBI.BigInt(decimals)
  ));
};
