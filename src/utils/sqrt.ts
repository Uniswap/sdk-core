import JSBI from 'jsbi'
import invariant from 'tiny-invariant'

export const MAX_SAFE_INTEGER = JSBI.BigInt(Number.MAX_SAFE_INTEGER)
export const MAX_SAFE_INTEGER_BIGINT = BigInt(Number.MAX_SAFE_INTEGER)

/**
 * Computes floor(sqrt(value))
 * @param value the value for which to compute the square root, rounded down
 */
export function sqrt<T extends JSBI | bigint>(value: T): T {
  let bigIntValue: bigint
  if (typeof value === 'bigint') {
    bigIntValue = value
  } else {
    bigIntValue = BigInt(value.toString(10))
  }

  invariant(bigIntValue >= 0n, 'NEGATIVE')

  // rely on built in sqrt if possible
  if (bigIntValue < MAX_SAFE_INTEGER_BIGINT) {
    if (typeof value === 'bigint') {
      return BigInt(Math.floor(Math.sqrt(Number(bigIntValue)))) as T
    } else {
      return JSBI.BigInt(Math.floor(Math.sqrt(Number(bigIntValue)))) as T
    }
  }

  let z: bigint
  let x: bigint
  z = bigIntValue
  x = bigIntValue / 2n + 1n
  while (x < z) {
    z = x
    x = (bigIntValue / x + x) / 2n
  }

  if (typeof value === 'bigint') {
    return z as T
  } else {
    return JSBI.BigInt(z.toString(10)) as T
  }
}
