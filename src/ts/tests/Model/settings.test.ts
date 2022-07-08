import { Settings, UnitOfDay } from "src/ts/Model/report/settings";

describe("settings", () => {
  describe("Settings", () => {
    describe("dayIntervalへの入力をテスト", () => {
      const settings = new Settings();
      test("正しい値", () => {
        settings.dayInterval = 10;
        expect(settings.dayInterval).toBe(10);
      });
      test("0、負数、整数で表せない値", () => {
        settings.dayInterval = 0;
        expect(settings.dayInterval).toBe(1);
        settings.dayInterval = -10;
        expect(settings.dayInterval).toBe(1);
        settings.dayInterval = Math.pow(2, 54);
        expect(settings.dayInterval).toBe(1);
      });
      test("少数", () => {
        settings.dayInterval = 12.4;
        expect(settings.dayInterval).toBe(12);
        settings.dayInterval = 13.6;
        expect(settings.dayInterval).toBe(13);
      });
    });
  });
  describe("UnitOfDay", () => {
    describe("adjustOnUnitOfDayのテスト", () => {
      test("unitOfDayが一つだけの場合", () => {
        const unitOfDay = new UnitOfDay(new Array("日目"));
        expect(unitOfDay.adjustOnUnitOfDay(1)).toBe("1日目");
      });
      test("unitOfDayが二つの場合", () => {
        const unitOfDay = new UnitOfDay(new Array("$N日目$C", "春"));
        expect(unitOfDay.adjustOnUnitOfDay(1)).toBe("1日目春");
      });
      test("unitOfDayが四つの場合、CycleInUnitChangesが15日の場合", () => {
        const unitOfDay = new UnitOfDay(
          new Array("$Y年目$C$D日", "春", "夏", "秋", "冬"),
          15
        );
        expect(unitOfDay.adjustOnUnitOfDay(1)).toBe("1年目春1日");
        expect(unitOfDay.adjustOnUnitOfDay(15)).toBe("1年目春15日");
        expect(unitOfDay.adjustOnUnitOfDay(16)).toBe("1年目夏1日");
        expect(unitOfDay.adjustOnUnitOfDay(61)).toBe("2年目春1日");
      });
    });
  });
});
