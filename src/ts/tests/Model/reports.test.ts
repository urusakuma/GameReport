import { ArgumentError, KeyNotFoundError } from "src/ts/Model/Error";
import { Reports } from "src/ts/Model/report/reports";
import {
  FromSourceOfReportBuilder,
  ExistsReportBuilder,
} from "src/ts/Model/report/reportBuilder";
import { Settings, UnitOfDay } from "src/ts/Model/report/settings";

describe("reportsのテスト", () => {
  describe("ReportBuilderのテスト", () => {
    describe("ExistsReportBuilderのテスト", () => {
      test("createでDayReportを作成する", () => {
        const report2 = new ExistsReportBuilder(
          2,
          "2日目",
          "2日目です",
          1,
          3
        ).build();

        expect(report2).toMatchObject({
          day: 2,
          reportTitle: "2日目",
          report: "2日目です",
          previous: 1,
          next: 3,
        });
      });
    });
    describe("PreviousBuilderのテスト", () => {
      test("createでDayReportを作成する", () => {
        const report1 = new ExistsReportBuilder(
          1,
          "1日目",
          "1日目です"
        ).build();
        const report2 = new FromSourceOfReportBuilder(
          report1,
          new Settings()
        ).build();
        expect(report2).toMatchObject({
          day: 2,
          reportTitle: "2日目",
          report: "",
          previous: 1,
        });
      });
      test("SettingのdayIntervalが2、unitOfDayが'サイクル'の場合", () => {
        const setting = new Settings(
          "test_0",
          "テスト",
          2,
          new UnitOfDay(new Array("サイクル"), 1)
        );
        const report1 = new ExistsReportBuilder(
          1,
          "1サイクル",
          "1サイクルです",
          undefined,
          2
        ).build();
        const report2 = new FromSourceOfReportBuilder(report1, setting).build();
        const report3 = new FromSourceOfReportBuilder(report2, setting).build();
        expect(report2).toMatchObject({
          day: 3,
          reportTitle: "3サイクル",
          report: "",
          previous: 1,
        });
        expect(report3).toMatchObject({
          day: 5,
          reportTitle: "5サイクル",
          report: "",
          previous: 3,
        });
      });
    });
  });
  describe("DayReportのテスト", () => {
    test("isEditedで編集されているか確認する", () => {
      const report = new ExistsReportBuilder(1, "1日目", "").build();
      // 最初は編集されていない
      expect(report.isEdited()).not.toBeTruthy();

      report.reportTitle = "タイトルを編集した場合のテスト";
      expect(report.isEdited()).toBeTruthy();
      report.reportTitle = "1日目";
      expect(report.isEdited()).not.toBeTruthy();

      report.report = "レポートを編集した場合のテスト";
      expect(report.isEdited()).toBeTruthy();
      report.report = "";
      expect(report.isEdited()).not.toBeTruthy();

      report.reportTitle = "タイトルと";
      report.report = "レポートを編集した場合のテスト";
      expect(report.isEdited()).toBeTruthy();
      // タイトルとレポートが空白になった場合は編集されていないものとする。
      report.reportTitle = "";
      report.report = "";
      expect(report.isEdited()).not.toBeTruthy();

      // レポートが""でないなら編集済みとして扱う。
      const report2 = new ExistsReportBuilder(2, "2日目", "編集済み").build();
      expect(report2.isEdited()).toBeTruthy();
    });
  });
  describe("Reportsのテスト", () => {
    test("addで新しい日付のレポートを追加する", () => {
      const reports: Reports = new Reports(
        new Settings(),
        new Map([[1, new ExistsReportBuilder(1, "1日目", "", 2).build()]])
      );
      const report = new FromSourceOfReportBuilder(
        reports.get(1),
        reports.settings
      ).build();
      reports.add(report);
      expect(reports.get(2).day).toBe(2);
    });
    test("addで既に存在する日付のレポートを追加する", () => {
      const reports: Reports = new Reports(
        new Settings(),
        new Map([[1, new ExistsReportBuilder(1, "1日目", "").build()]])
      );
      const addReport = () => reports.add(reports.get(1));
      expect(addReport).toThrowError(ArgumentError);
    });
    test("getで存在しない日付のレポートを取得する", () => {
      const reports: Reports = new Reports(
        new Settings(),
        new Map([[1, new ExistsReportBuilder(1, "1日目", "").build()]])
      );
      const getReport = () => reports.get(2);
      expect(getReport).toThrowError(KeyNotFoundError);
    });
    test("deleteで存在する日付のレポートを削除する", () => {
      const reports: Reports = new Reports(
        new Settings(),
        new Map([
          [1, new ExistsReportBuilder(1, "1日目", "", undefined, 2).build()],
          [2, new ExistsReportBuilder(2, "2日目", "", 1, 3).build()],
          [3, new ExistsReportBuilder(3, "3日目", "", 2, 4).build()],
          [4, new ExistsReportBuilder(4, "4日目", "", 3, 5).build()],
          [5, new ExistsReportBuilder(5, "5日目", "", 4, undefined).build()],
        ])
      );

      expect(reports.get(5).day).toBe(5);
      expect(reports.get(4).next).toBe(5);
      reports.delete(5);
      expect(() => reports.get(5)).toThrowError(KeyNotFoundError);
      expect(reports.get(4).next).toBeUndefined();

      expect(reports.get(1).day).toBe(1);
      expect(reports.get(2).previous).toBe(1);
      reports.delete(1);
      expect(() => reports.get(1)).toThrowError(KeyNotFoundError);
      expect(reports.get(2).previous).toBeUndefined();

      expect(reports.get(3).day).toBe(3);
      expect(reports.get(2).next).toBe(3);
      expect(reports.get(4).previous).toBe(3);
      reports.delete(3);
      expect(() => reports.get(3)).toThrowError(KeyNotFoundError);
      expect(reports.get(2).next).toBe(4);
      expect(reports.get(4).previous).toBe(2);
    });
    test("deleteで削除したBooleanをテスト", () => {
      const reports: Reports = new Reports(
        new Settings(),
        new Map([[1, new ExistsReportBuilder(1, "1日目", "").build()]])
      );
      expect(reports.delete(1)).toBeTruthy();
      expect(reports.delete(2)).toBeFalsy();
    });
    test("clearで初期化", () => {
      const reports: Reports = new Reports(
        new Settings(),
        new Map([
          [1, new ExistsReportBuilder(1, "1日目", "", undefined, 2).build()],
          [2, new ExistsReportBuilder(2, "2日目", "", 1, 3).build()],
          [3, new ExistsReportBuilder(3, "3日目", "", 2, 4).build()],
          [4, new ExistsReportBuilder(4, "4日目", "", 3, 5).build()],
          [5, new ExistsReportBuilder(5, "5日目", "", 4, undefined).build()],
        ])
      );
      reports.clear();
      expect(JSON.stringify(reports)).toStrictEqual(
        JSON.stringify(new Reports())
      );
    });
  });
});
