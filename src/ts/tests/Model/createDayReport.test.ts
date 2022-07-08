import { createDayReport } from "src/ts/Model/createDayReport";
import { Reports } from "src/ts/Model/report/reports";
import { ExistsReportBuilder } from "src/ts/Model/report/reportBuilder";
import { Settings, UnitOfDay } from "src/ts/Model/report/settings";
import $ from "jquery";

describe("createDayReport", () => {
  describe("createDayReport()", () => {
    test("DayReportを作成する", () => {
      document.body.innerHTML =
        '<ul id="reportsList">' +
        ' <li data-day="1">' +
        '   <span name="titleInReportsList" class="overflowHidden cursorPointer">1日目' +
        "   </span>" +
        '   <button name="removeFromReportsList" class="buttonSquare" text="×">' +
        "  </li>" +
        "</ul>";
      const reports: Reports = new Reports(
        new Settings(
          "test_0",
          "テスト",
          1,
          new UnitOfDay(new Array("日目"), 1)
        ),
        new Map([
          [1, new ExistsReportBuilder(1, "1日目", "", undefined, 2).build()],
        ])
      );
      const newReport = createDayReport(reports.get(1), reports);
      expect(newReport).toMatchObject({
        day: 2,
        reportTitle: "2日目",
        report: "",
        previous: 1,
        next: undefined,
      });
      expect(reports.get(2)).toBe(newReport);
      const list = $("#reportsList>li:last-child");
      expect(Number(list.data("day"))).toBe(2);
      expect(list.children("span").text()).toBe("2日目");
    });
    test("DayReportを大量に作成する", () => {
      document.body.innerHTML =
        '<ul id="reportsList">' +
        ' <li data-day="1">' +
        '   <span name="titleInReportsList" class="overflowHidden cursorPointer">1日目</span>' +
        '   <button name="removeFromReportsList" class="buttonSquare" text="×">' +
        "  </li>" +
        "</ul>";
      const reports: Reports = new Reports(
        new Settings(
          "test_0",
          "テスト",
          1,
          new UnitOfDay(new Array("日目"), 1)
        ),
        new Map([
          [1, new ExistsReportBuilder(1, "1日目", "", undefined, 2).build()],
        ])
      );
      for (let i = 1; i < 10; i++) {
        createDayReport(reports.get(i), reports);
      }
      for (let i = 1; i < 10; i++) {
        expect(reports.get(i)).toMatchObject({
          day: i,
          reportTitle: i + "日目",
          report: "",
          previous: i > 1 ? i - 1 : undefined,
          next: i < 10 ? i + 1 : undefined,
        });
        const list = $("#reportsList > li:nth-child(" + i + ")");
        expect(Number(list.data("day"))).toBe(i);
        expect(list.children("span").text()).toBe(i + "日目");
      }
    });
    test("過去のDayReportを作成し、リストの位置が適切かテスト。", () => {
      document.body.innerHTML =
        '<ul id="reportsList">' +
        ' <li data-day="1">' +
        '   <span name="titleInReportsList" class="overflowHidden cursorPointer">1日目' +
        "   </span>" +
        '   <button name="removeFromReportsList" class="buttonSquare" text="×">' +
        "  </li>" +
        "</ul>";
      const reports: Reports = new Reports(
        new Settings(
          "test_0",
          "テスト",
          3,
          new UnitOfDay(new Array("日目"), 1)
        ),
        new Map([
          [1, new ExistsReportBuilder(1, "1日目", "", undefined, 2).build()],
        ])
      );
      const day4Report = createDayReport(reports.get(1), reports);
      expect(day4Report).toMatchObject({
        day: 4,
        reportTitle: "4日目",
        report: "",
        previous: 1,
        next: undefined,
      });
      reports.settings.dayInterval = 1;
      const newReport = createDayReport(day4Report, reports, false);

      expect(day4Report).toMatchObject({
        day: 4,
        reportTitle: "4日目",
        report: "",
        previous: 3,
        next: undefined,
      });
      expect(newReport).toMatchObject({
        day: 3,
        reportTitle: "3日目",
        report: "",
        previous: 1,
        next: 4,
      });
      expect(reports.get(3)).toBe(newReport);
      const list3 = $("#reportsList>li:nth-child(2)");
      expect(Number(list3.data("day"))).toBe(3);
      expect(list3.children("span").text()).toBe("3日目");

      const list4 = $("#reportsList>li:nth-child(3)");
      expect(Number(list4.data("day"))).toBe(4);
      expect(list4.children("span").text()).toBe("4日目");
    });
  });
});
