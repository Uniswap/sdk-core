import _Big, { RoundingMode } from "big.js";
import _Decimal from "decimal.js-light";
import JSBI from "jsbi";
import invariant from "tiny-invariant";
import toFormat from "toformat";

import { Rounding } from "./constants";
import { BigintIsh, parseBigintIsh } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const Decimal: typeof _Decimal = toFormat(_Decimal);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const Big: typeof _Big = toFormat(_Big);

const toSignificantRounding = {
  [Rounding.ROUND_DOWN]: _Decimal.ROUND_DOWN,
  [Rounding.ROUND_HALF_UP]: _Decimal.ROUND_HALF_UP,
  [Rounding.ROUND_UP]: _Decimal.ROUND_UP,
};

const toFixedRounding = {
  [Rounding.ROUND_DOWN]: RoundingMode.RoundDown,
  [Rounding.ROUND_HALF_UP]: RoundingMode.RoundHalfUp,
  [Rounding.ROUND_UP]: RoundingMode.RoundUp,
};

export interface NumberFormat {
  decimalSeparator?: string;
  groupSeparator?: string;
  groupSize?: number;
  secondaryGroupSize?: number;
  fractionGroupSeparator?: string;
  fractionGroupSize?: number;
}

export class Fraction {
  public readonly numerator: JSBI;
  public readonly denominator: JSBI;

  public constructor(
    numerator: BigintIsh,
    denominator: BigintIsh = JSBI.BigInt(1)
  ) {
    this.numerator = JSBI.BigInt(parseBigintIsh(numerator));
    this.denominator = JSBI.BigInt(parseBigintIsh(denominator));
  }

  /**
   * Returns true if the other object is a {@link Fraction}.
   *
   * @param other
   * @returns
   */
  public static isFraction(other: unknown): other is Fraction {
    return (
      typeof other === "object" &&
      other !== null &&
      "numerator" in other &&
      "denominator" in other
    );
  }

  /**
   * Parses a {@link Fraction} from a float.
   * @param number Number to parse.
   * @param decimals Number of decimals of precision. (default 10)
   * @returns Fraction
   */
  public static fromNumber(number: number, decimals = 10): Fraction {
    const multiplier = Math.pow(10, decimals);
    return new Fraction(Math.floor(number * multiplier), multiplier);
  }

  private static tryParseFraction(fractionish: BigintIsh | Fraction): Fraction {
    if (
      fractionish instanceof JSBI ||
      typeof fractionish === "number" ||
      typeof fractionish === "string" ||
      typeof fractionish === "bigint"
    )
      return new Fraction(fractionish);

    if ("numerator" in fractionish && "denominator" in fractionish)
      return fractionish;
    throw new Error("Could not parse fraction");
  }

  // performs floor division
  public get quotient(): JSBI {
    return JSBI.divide(this.numerator, this.denominator);
  }

  // remainder after floor division
  public get remainder(): Fraction {
    return new Fraction(
      JSBI.remainder(this.numerator, this.denominator),
      this.denominator
    );
  }

  public invert(): Fraction {
    return new Fraction(this.denominator, this.numerator);
  }

  public add(other: Fraction | BigintIsh): Fraction {
    const otherParsed = Fraction.tryParseFraction(other);
    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(
        JSBI.add(this.numerator, otherParsed.numerator),
        this.denominator
      );
    }
    return new Fraction(
      JSBI.add(
        JSBI.multiply(this.numerator, otherParsed.denominator),
        JSBI.multiply(otherParsed.numerator, this.denominator)
      ),
      JSBI.multiply(this.denominator, otherParsed.denominator)
    );
  }

  public subtract(other: Fraction | BigintIsh): Fraction {
    const otherParsed = Fraction.tryParseFraction(other);
    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(
        JSBI.subtract(this.numerator, otherParsed.numerator),
        this.denominator
      );
    }
    return new Fraction(
      JSBI.subtract(
        JSBI.multiply(this.numerator, otherParsed.denominator),
        JSBI.multiply(otherParsed.numerator, this.denominator)
      ),
      JSBI.multiply(this.denominator, otherParsed.denominator)
    );
  }

  public lessThan(other: Fraction | BigintIsh): boolean {
    const otherParsed = Fraction.tryParseFraction(other);
    return JSBI.lessThan(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(otherParsed.numerator, this.denominator)
    );
  }

  public equalTo(other: Fraction | BigintIsh): boolean {
    const otherParsed = Fraction.tryParseFraction(other);
    return JSBI.equal(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(otherParsed.numerator, this.denominator)
    );
  }

  public greaterThan(other: Fraction | BigintIsh): boolean {
    const otherParsed = Fraction.tryParseFraction(other);
    return JSBI.greaterThan(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(otherParsed.numerator, this.denominator)
    );
  }

  public multiply(other: Fraction | BigintIsh): Fraction {
    const otherParsed = Fraction.tryParseFraction(other);
    return new Fraction(
      JSBI.multiply(this.numerator, otherParsed.numerator),
      JSBI.multiply(this.denominator, otherParsed.denominator)
    );
  }

  public divide(other: Fraction | BigintIsh): Fraction {
    const otherParsed = Fraction.tryParseFraction(other);
    return new Fraction(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(this.denominator, otherParsed.numerator)
    );
  }

  public toSignificant(
    significantDigits: number,
    format: NumberFormat = { groupSeparator: "" },
    rounding: Rounding = Rounding.ROUND_HALF_UP
  ): string {
    invariant(
      Number.isInteger(significantDigits),
      `${significantDigits} is not an integer.`
    );
    invariant(significantDigits > 0, `${significantDigits} is not positive.`);

    Decimal.set({
      precision: significantDigits + 1,
      rounding: toSignificantRounding[rounding],
    });
    const quotient = new Decimal(this.numerator.toString())
      .div(this.denominator.toString())
      .toSignificantDigits(significantDigits);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call
    return (
      quotient as unknown as {
        toFormat: (dec: number, format: NumberFormat) => string;
      }
    ).toFormat(quotient.decimalPlaces(), format);
  }

  public toFixed(
    decimalPlaces: number,
    format: NumberFormat = { groupSeparator: "" },
    rounding: Rounding = Rounding.ROUND_HALF_UP
  ): string {
    invariant(
      Number.isInteger(decimalPlaces),
      `${decimalPlaces} is not an integer.`
    );
    invariant(decimalPlaces >= 0, `${decimalPlaces} is negative.`);

    Big.DP = decimalPlaces;
    Big.RM = toFixedRounding[rounding];
    return (
      new Big(this.numerator.toString()).div(
        this.denominator.toString()
      ) as unknown as {
        toFormat: (dec: number, format: NumberFormat) => string;
      }
    ).toFormat(decimalPlaces, format);
  }

  /**
   * Helper method for converting any super class back to a fraction
   */
  public get asFraction(): Fraction {
    return new Fraction(this.numerator, this.denominator);
  }
}
