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

  add(other: Fraction | BigintIsh): Percent {
    return toPercent(super.add(other));
  }

  subtract(other: Fraction | BigintIsh): Percent {
    return toPercent(super.subtract(other));
  }

  multiply(other: Fraction | BigintIsh): Percent {
    return toPercent(super.multiply(other));
  }

  divide(other: Fraction | BigintIsh): Percent {
    return toPercent(super.divide(other));
  }

  public toSignificant(
    significantDigits: number = 5,
    format?: NumberFormat,
    rounding?: Rounding
  ): string {
    return super
      .multiply(ONE_HUNDRED)
      .toSignificant(significantDigits, format, rounding);
  }

  public toFixed(
    decimalPlaces: number = 2,
    format?: NumberFormat,
    rounding?: Rounding
  ): string {
    return super.multiply(ONE_HUNDRED).toFixed(decimalPlaces, format, rounding);
  }
}
