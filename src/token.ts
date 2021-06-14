/**
 * Standard interface for a token.
 */
export interface Token {
  decimals: number;
  equals: (other: Token) => boolean;
}
