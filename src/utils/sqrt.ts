import { BigNumber } from '@ethersproject/bignumber';
import invariant from 'tiny-invariant'

export const MAX_SAFE_INTEGER = BigNumber.from(Number.MAX_SAFE_INTEGER.toString())

const ZERO = BigNumber.from(0)
const ONE = BigNumber.from(1)
const TWO = BigNumber.from(2)

/**
 * Computes floor(sqrt(value))
 * @param value the value for which to compute the square root, rounded down
 */
export function sqrt(value: BigNumber): BigNumber {
  invariant(value.gte(ZERO), 'NEGATIVE')

  // rely on built in sqrt if possible
  if (value.lt(MAX_SAFE_INTEGER)) {
    return BigNumber.from(Math.floor(Math.sqrt(value.toNumber())))
  }

  let z: BigNumber
  let x: BigNumber
  z = value
  x = value.div(TWO).add(ONE)
  while (x.lt(z)) {
    z = x
    x = value.div(x).add(x).div(TWO)
  }
  return z
}
