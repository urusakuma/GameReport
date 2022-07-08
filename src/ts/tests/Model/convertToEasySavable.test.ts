import { ExistsReportBuilder } from "src/ts/Model/report/reportBuilder";
import { Reports } from "src/ts/Model/report/reports";
import { DayReport } from "src/ts/Model/report/DayReport";
import { Settings } from "src/ts/Model/report/settings";
import {
  convertReceiveFromEasySavableIntoObject,
  convertToEasySavable,
} from "src/ts/Model/convertToEasySavable";
describe("serialize", () => {
  test("シリアライズ、デシリアライズを試す", () => {
    const s: Settings = new Settings();
    const m: Map<number, DayReport> = new Map<number, DayReport>();
    for (let i = 1, u = s.unitOfDay.unit[0]; i <= 3; i++) {
      m.set(
        i,
        new ExistsReportBuilder(
          i,
          i + u,
          i + u + "のレポート",
          i - 1 > 0 ? i - 1 : undefined,
          i + 1 < 3 ? i + 1 : undefined
        ).build()
      );
    }
    const r: Reports = new Reports(s, m);
    const serStr = convertToEasySavable(r);
    const deserRep: Reports = convertReceiveFromEasySavableIntoObject(
      serStr,
      new Reports()
    );
    expect(JSON.stringify(deserRep)).toStrictEqual(JSON.stringify(r));
  });
  test("デシリアライズでエラーを起こす", () => {
    expect(() =>
      convertReceiveFromEasySavableIntoObject(
        "圧縮されていない文字列",
        new Reports()
      )
    ).toThrowError(SyntaxError);
    expect(() =>
      convertReceiveFromEasySavableIntoObject(
        "圧縮されていない文字列",
        new Reports()
      )
    ).toThrowError(new SyntaxError("Unexpected end of JSON input"));
  });
});
