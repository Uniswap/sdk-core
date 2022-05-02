import { BigSource } from "big.js";
import JSBI from "jsbi";
import invariant from "tiny-invariant";

import { MAX_U64, MAX_U256, Rounding, ZERO } from "./constants";
import { Big, Fraction, NumberFormat } from "./fraction";
import { Percent } from "./percent";
import { Token } from "./token";
import { BigintIsh, makeDecimalMultiplier, parseBigintIsh } from "./utils";

/**
 * Parses a token amount from a decimal representation.
 * @param token
 * @param uiAmount
 * @returns
 */
export const parseAmountFromString = <Tk extends Token<Tk>>(
  token: Tk,
  uiAmount: string
): JSBI => {
  const parts = uiAmount.split(".");
  if (parts.length === 0) {
    throw new Error("empty number");
  }
  invariant(parts[0]);
  const whole = JSBI.BigInt(parts[0]);
  const fraction = parts[1]
    ? JSBI.BigInt(
        parts[1].slice(0, token.decimals) +
          Array(token.decimals).fill("0").slice(parts[1].length).join("")
      )
    : JSBI.BigInt(0);
  const combined = JSBI.add(
    JSBI.multiply(
      whole,
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(token.decimals))
    ),
    fraction
  );
  return combined;
};

export class TokenAmountOverflow extends RangeError {
  constructor(type: string, amount: JSBI) {
    super(`Token amount overflows ${type}: ${amount.toString()}`);
  }
}

export class TokenAmountUnderflow extends RangeError {
  constructor(amount: JSBI) {
    super(`Token amount must be greater than zero: ${amount.toString()}`);
  }
}

/**
 * Validates that a number falls within the range of u64.
 * @param value
 */
export function validateU64(value: JSBI): void {
  if (!JSBI.greaterThanOrEqual(value, ZERO)) {
    throw new TokenAmountUnderflow(value);
  }
  if (!JSBI.lessThanOrEqual(value, MAX_U64)) {
    throw new TokenAmountOverflow("u64", value);
  }
}

/**
 * Validates that a number falls within the range of u256.
 * @param value
 */
export function validateU256(value: JSBI): void {
  if (!JSBI.greaterThanOrEqual(value, ZERO)) {
    throw new TokenAmountUnderflow(value);
  }
  if (!JSBI.lessThanOrEqual(value, MAX_U256)) {
    throw new TokenAmountOverflow("u256", value);
  }
}

export interface IFormatUint {
  /**
   * If specified, format this according to `toLocaleString`
   */
  numberFormatOptions?: Intl.NumberFormatOptions;
  /**
   * Locale of the number
   */
  locale?: string;
}

const stripTrailingZeroes = (num: string): string => {
  const [head, tail, ...rest] = num.split(".");
  if (rest.length > 0 || !head) {
    console.warn(`Invalid number passed to stripTrailingZeroes: ${num}`);
    return num;
  }
  if (!tail) {
    return num;
  }
  return `${head}.${tail.replace(/\.0+$/, "")}`;
};

export abstract class TokenAmount<T extends Token<T>> extends Fraction {
  /**
   * amount _must_ be raw, i.e. in the native representation
   */
  constructor(
    readonly token: T,
    amount: BigintIsh,
    validate?: (value: JSBI) => void
  ) {
    const parsedAmount = parseBigintIsh(amount);
    validate?.(parsedAmount);

    super(parsedAmount, makeDecimalMultiplier(token.decimals));
    this.token = token;
  }

  /**
   * Create a new TokenAmount.
   * @param token
   * @param amount
   */
  abstract new(token: T, amount: BigintIsh): this;

  withAmount(amount: BigintIsh): this {
    return this.new(this.token, amount);
  }

  get raw(): JSBI {
    return this.numerator;
  }

  override toSignificant(
    significantDigits = 6,
    format?: NumberFormat,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    return super.toSignificant(significantDigits, format, rounding);
  }

  override toFixed(
    decimalPlaces: number = this.token.decimals,
    format?: NumberFormat,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    invariant(decimalPlaces <= this.token.decimals, "DECIMALS");
    return super.toFixed(decimalPlaces, format, rounding);
  }

  toExact(format: NumberFormat = { groupSeparator: "" }): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    Big.DP = this.token.decimals;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return (
      new Big(this.numerator as unknown as BigSource).div(
        this.denominator.toString()
      ) as unknown as {
        toFormat: (format: NumberFormat) => string;
      }
    ).toFormat(format);
  }

  override add(other: this): this {
    invariant(
      this.token.equals(other.token),
      `add token mismatch: ${this.token.toString()} !== ${other.token.toString()}`
    );
    return this.withAmount(JSBI.add(this.raw, other.raw));
  }

  override subtract(other: this): this {
    invariant(
      this.token.equals(other.token),
      `subtract token mismatch: ${this.token.toString()} !== ${other.token.toString()}`
    );
    return this.withAmount(JSBI.subtract(this.raw, other.raw));
  }

  /**
   * Gets this TokenAmount as a percentage of the other TokenAmount.
   * @param other
   * @returns
   */
  percentOf(other: this): Percent {
    invariant(
      this.token.equals(other.token),
      `percentOf token mismatch: ${this.token.toString()} !== ${other.token.toString()}`
    );
    const frac = this.divide(other);
    return new Percent(frac.numerator, frac.denominator);
  }

  /**
   * Gets this TokenAmount as a percentage of the other TokenAmount.
   * @param other
   * @returns
   */
  divideBy(other: Fraction): Percent {
    const frac = this.divide(other);
    return new Percent(frac.numerator, frac.denominator);
  }

  /**
   * Multiplies this token amount by a fraction.
   * WARNING: this loses precision
   * @param percent
   * @returns
   */
  scale(fraction: Fraction): this {
    return this.withAmount(fraction.asFraction.multiply(this.raw).toFixed(0));
  }

  /**
   * Reduces this token amount by a percent.
   * WARNING: this loses precision
   * @param percent
   * @returns
   */
  reduceBy(percent: Percent): this {
    return this.scale(Percent.ONE_HUNDRED.subtract(percent));
  }

  /**
   * Formats this number using Intl.NumberFormatOptions
   * @param param0
   * @returns
   */
  format({ numberFormatOptions, locale }: IFormatUint = {}): string {
    return `${
      numberFormatOptions !== undefined
        ? this.asNumber.toLocaleString(locale, numberFormatOptions)
        : stripTrailingZeroes(this.toFixed(this.token.decimals))
    }`;
  }

  /**
   * Gets the value of this {@link TokenAmount} as a number.
   */
  override get asNumber(): number {
    return parseFloat(this.toExact());
  }

  /**
   * Returns true if the other object is a {@link TokenAmount}.
   *
   * @param other
   * @returns
   */
  static isTokenAmount<T extends Token<T>, A extends TokenAmount<T>>(
    other: unknown
  ): other is A {
    return (
      Fraction.isFraction(other) &&
      !!(other as unknown as Record<string, unknown>)?.token
    );
  }

  // ----------------------------------------------------------------
  // DEPRECATED FUNCTIONS
  // ----------------------------------------------------------------

  /**
   * Gets this TokenAmount as a percentage of the other TokenAmount.
   * @param other
   * @deprecated use {@link percentOf}
   * @returns
   */
  divideByAmount(other: this): Percent {
    return this.percentOf(other);
  }

  /**
   * Multiplies this token amount by a fraction.
   * WARNING: this loses precision
   * @param percent
   * @deprecated use {@link scale}
   * @returns
   */
  multiplyBy(fraction: Fraction): this {
    return this.scale(fraction);
  }
}
