import { stripTrailingZeroes } from "./tokenAmount.js";

describe("tokenAmount", () => {
  describe("#stripTrailingZeroes", () => {
    it("works with no decimal", () => {
      expect(stripTrailingZeroes("12345")).toEqual("12345");
    });
    it("works with decimals", () => {
      expect(stripTrailingZeroes("12345.12345")).toEqual("12345.12345");
    });
    it("works with trailing zeroes", () => {
      expect(stripTrailingZeroes("12345.1234000")).toEqual("12345.1234");
    });
  });
});
