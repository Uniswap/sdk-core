/**
 * Standard interface for a token.
 */
export interface Token<T extends Token<T>> {
  decimals: number;
  equals: (other: T) => boolean;
}
