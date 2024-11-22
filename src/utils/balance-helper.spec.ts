import { describe, expect, it } from "vitest";
import { addBalance } from "./balance-helper";

describe("Utils -> Balance Helper", () => {
  describe("Add Balance FN", () => {
    it("should return 203.34 as result of the sum between 100.14 and 103.20", () => {
      const balance = "100.14";
      const amount = 103.2;

      const result = addBalance(balance, amount);

      expect(result).toBeDefined();
      expect(result).toStrictEqual("203.34");
    });

    it("should return a string with fixed 2 floating point", () => {
      const balance = "100.1415";
      const amount = 103.2;

      const result = addBalance(balance, amount);

      expect(result).toBeDefined();
      expect(result).toStrictEqual("203.34");
    });

    it("should throw an error if amount is negative", () => {
      const balance = "100.14";
      const amount = -103.2;

      expect(() => addBalance(balance, amount)).toThrow("Invalid operation");
    });

    it("should throw an error if balance is negative", () => {
      const balance = "-100.14";
      const amount = 103.2;

      expect(() => addBalance(balance, amount)).toThrow("Invalid operation");
    });

    it("should throw an error if the result is falsy", () => {
      const balance = "something";
      const amount = 103.2;

      expect(() => addBalance(balance, amount)).toThrow("Invalid operation");
    });
  });
});
