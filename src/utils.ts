import BN from "bn.js";
import JSBI from "jsbi";

import { TEN } from "./constants";

/**
 * Bigint-like number.
 */
export declare type BigintIsh = JSBI | string | number | bigint | BN;

export function parseBigintIsh(bigintIsh: BigintIsh): JSBI {
  return bigintIsh instanceof JSBI
    ? bigintIsh
    : typeof bigintIsh === "bigint" || BN.isBN(bigintIsh)
    ? JSBI.BigInt(bigintIsh.toString())
    : JSBI.BigInt(bigintIsh);
}

/**
 * Creates the multipler for an amount of decimals.
 * @param decimals
 * @returns
 */
export const makeDecimalMultiplier = (decimals: number): JSBI => {
  return JSBI.exponentiate(TEN, JSBI.BigInt(decimals));
};
