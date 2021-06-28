import invariant from "tiny-invariant";

import { Rounding } from "./constants";
import { Fraction, NumberFormat } from "./fraction";
import { Token } from "./token";
import { TokenAmount } from "./tokenAmount";
import { BigintIsh, makeDecimalMultiplier, parseBigintIsh } from "./utils";

export class Price<T extends Token<T>> extends Fraction {
  public readonly baseCurrency: T; // input i.e. denominator
  public readonly quoteCurrency: T; // output i.e. numerator
  public readonly scalar: Fraction; // used to adjust the raw fraction w/r/t the decimals of the {base,quote}Token

  // denominator and numerator _must_ be raw, i.e. in the native representation
  public constructor(
    baseCurrency: T,
    quoteCurrency: T,
    denominator: BigintIsh,
    numerator: BigintIsh
  ) {
    super(parseBigintIsh(numerator), parseBigintIsh(denominator));

    this.baseCurrency = baseCurrency;
    this.quoteCurrency = quoteCurrency;
    this.scalar = new Fraction(
      makeDecimalMultiplier(baseCurrency.decimals),
      makeDecimalMultiplier(quoteCurrency.decimals)
    );
  }

  public get raw(): Fraction {
    return new Fraction(this.numerator, this.denominator);
  }

  public get adjusted(): Fraction {
    return super.multiply(this.scalar);
  }

  public override invert(): Price<T> {
    return new Price(
      this.quoteCurrency,
      this.baseCurrency,
      this.numerator,
      this.denominator
    );
  }

  public override multiply(other: Price<T>): Price<T> {
    invariant(
      this.quoteCurrency.equals(other.baseCurrency),
      `multiply token mismatch: ${this.quoteCurrency.toString()} !== ${other.baseCurrency.toString()}`
    );
    const fraction = super.multiply(other);
    return new Price(
      this.baseCurrency,
      other.quoteCurrency,
      fraction.denominator,
      fraction.numerator
    );
  }

  // performs floor division on overflow
  public quote(tokenAmount: TokenAmount<T>): TokenAmount<T> {
    invariant(
      tokenAmount.token.equals(this.baseCurrency),
      `quote token mismatch: ${tokenAmount.token.toString()} !== ${this.baseCurrency.toString()}`
    );
    return new TokenAmount(
      this.quoteCurrency,
      super.multiply(tokenAmount.raw).quotient
    );
  }

  public override toSignificant(
    significantDigits = 6,
    format?: NumberFormat,
    rounding?: Rounding
  ): string {
    return this.adjusted.toSignificant(significantDigits, format, rounding);
  }

  public override toFixed(
    decimalPlaces = 4,
    format?: NumberFormat,
    rounding?: Rounding
  ): string {
    return this.adjusted.toFixed(decimalPlaces, format, rounding);
  }
}
