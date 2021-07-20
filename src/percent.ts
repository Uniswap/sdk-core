import JSBI from "jsbi";

import { Rounding } from "./constants";
import { Fraction, NumberFormat } from "./fraction";
import { BigintIsh } from "./utils";

const ONE_HUNDRED = new Fraction(JSBI.BigInt(100));

/**
 * Converts a fraction to a percent
 * @param fraction the fraction to convert
 */
function toPercent(fraction: Fraction): Percent {
  return new Percent(fraction.numerator, fraction.denominator);
}

export class Percent extends Fraction {
  /**
   * This boolean prevents a fraction from being interpreted as a Percent
   */
  public readonly isPercent: true = true;

  public static override readonly ZERO: Percent = new Percent(0);

  /**
   * 1%
   */
  public static override readonly ONE: Percent = new Percent(1, 100);

  /**
   * 100% (1/1)
   */
  public static readonly ONE_HUNDRED: Percent = new Percent(1);

  /**
   * Parses a {@link Percent} from a float.
   * @param number Number to parse. (100% is 1.00)
   * @param decimals Number of decimals of precision. (default 10)
   * @returns Percent
   */
  public static override fromNumber(number: number, decimals = 10): Percent {
    const frac = Fraction.fromNumber(number, decimals);
    return new Percent(frac.numerator, frac.denominator);
  }

  /**
   * Parses a {@link Percent} from a given number of bps.
   * @returns Percent
   */
  public static fromBPS(bps: BigintIsh): Percent {
    return new Percent(bps, 10_000);
  }

  public override add(other: Fraction | BigintIsh): Percent {
    return toPercent(super.add(other));
  }

  public override subtract(other: Fraction | BigintIsh): Percent {
    return toPercent(super.subtract(other));
  }

  public override multiply(other: Fraction | BigintIsh): Percent {
    return toPercent(super.multiply(other));
  }

  public override divide(other: Fraction | BigintIsh): Percent {
    return toPercent(super.divide(other));
  }

  public override toSignificant(
    significantDigits = 5,
    format?: NumberFormat,
    rounding?: Rounding
  ): string {
    return super
      .multiply(ONE_HUNDRED)
      .toSignificant(significantDigits, format, rounding);
  }

  public override toFixed(
    decimalPlaces = 2,
    format?: NumberFormat,
    rounding?: Rounding
  ): string {
    return super.multiply(ONE_HUNDRED).toFixed(decimalPlaces, format, rounding);
  }

  /**
   * Returns true if the other object is a {@link Percent}.
   *
   * @param other
   * @returns
   */
  public static isPercent(other: unknown): other is Percent {
    return (
      Fraction.isFraction(other) &&
      (other as unknown as Record<string, unknown>)?.isPercent === true
    );
  }
}
