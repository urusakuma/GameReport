import { returnNonSequenceNumbers } from "src/ts/View/returnNonSequenceNumbers";
describe("returnNonArithmeticNumbers", () => {
  const step = Array(
    {
      val: 1,
      lowestValue: 1,
      step: 1,
    },
    {
      val: 10,
      lowestValue: 10,
      step: 5,
    },
    {
      val: 18,
      lowestValue: 50,
      step: 10,
    }
  );
  test("valが1から10で増加値は1", () => {
    for (let i = 1; i <= 10; i++) {
      expect(returnNonSequenceNumbers(i, step)).toBe(i);
    }
  });
  test("valが10から18で増加値は5", () => {
    for (let i = 0; i <= 8; i++) {
      expect(returnNonSequenceNumbers(10 + i, step)).toBe(10 + i * 5);
    }
  });
  test("valが18から23で増加値は10", () => {
    for (let i = 0; i <= 5; i++) {
      expect(returnNonSequenceNumbers(18 + i, step)).toBe(50 + i * 10);
    }
  });
});
