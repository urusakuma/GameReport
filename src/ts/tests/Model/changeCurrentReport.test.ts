import { changeCurrentReport } from "src/ts/Model/changeCurrentReport";
import { Reports } from "src/ts/Model/report/reports";
import { ExistsReportBuilder } from "src/ts/Model/report/reportBuilder";
import { Settings, UnitOfDay } from "src/ts/Model/report/settings";
import $ from "jquery";
describe("changeCurrentReport", () => {
  describe("changeCurrentReport()", () => {
    test("カレントを設定するとその内容にDOMが更新されるか", () => {
      document.body.innerHTML =
        '<ul id="reportsList">' +
        ' <li data-day="1">' +
        '   <span name="titleInReportsList" class="overflowHidden cursorPointer">1日目</span>' +
        '   <button name="removeFromReportsList" class="buttonSquare" text="×">' +
        " </li>" +
        "</ul>" +
        '<input id="reportTitle" class="l-100per l-itemH" type="text" value="レポートのタイトル">' +
        '<textarea id="report" class="report" data-current-day="1">レポートの内容</textarea>';
      const reports: Reports = new Reports(
        new Settings(
          "test_0",
          "テスト",
          1,
          new UnitOfDay(new Array("日目"), 1)
        ),
        new Map([[1, new ExistsReportBuilder(1, "1日目", "").build()]])
      );
      const report = reports.get(1);
      changeCurrentReport(report);
      expect($("#reportTitle").val()).toBe("1日目");
      expect($("#report").val()).toBe("");
    });
    test("DOMを編集すると内部データも更新されるか", () => {
      document.body.innerHTML =
        '<ul id="reportsList">' +
        ' <li data-day="1">' +
        '   <span name="titleInReportsList" class="overflowHidden cursorPointer">1日目</span>' +
        '   <button name="removeFromReportsList" class="buttonSquare" text="×">' +
        " </li>" +
        "</ul>" +
        '<input id="reportTitle" class="l-100per l-itemH" type="text" value="レポートのタイトル">' +
        '<textarea id="report" class="report" data-current-day="1">レポートの内容</textarea>';
      const reports: Reports = new Reports(
        new Settings(
          "test_0",
          "テスト",
          1,
          new UnitOfDay(new Array("日目"), 1)
        ),
        new Map([[1, new ExistsReportBuilder(1, "1日目", "").build()]])
      );
      const report = reports.get(1);
      changeCurrentReport(report);
      $("#reportTitle").val("1日目 レポートのタイトルを編集").trigger("input");
      $("#report").val("1日目のレポートを編集しました").trigger("input");
      expect(report.reportTitle).toBe("1日目 レポートのタイトルを編集");
      expect(report.report).toBe("1日目のレポートを編集しました");
      expect($("#reportsList > li:first-child > span").text()).toBe(
        "1日目 レポートのタイトルを編集"
      );
    });
    test("カレントを変更した時、以前のカレントレポートの紐付けが外れているか", () => {
      document.body.innerHTML =
        '<ul id="reportsList">' +
        ' <li data-day="1">' +
        '   <span name="titleInReportsList" class="overflowHidden cursorPointer">1日目</span>' +
        '   <button name="removeFromReportsList" class="buttonSquare" text="×">' +
        " </li>" +
        ' <li data-day="2">' +
        '   <span name="titleInReportsList" class="overflowHidden cursorPointer">2日目</span>' +
        '   <button name="removeFromReportsList" class="buttonSquare" text="×">' +
        " </li>" +
        "</ul>" +
        '<input id="reportTitle" class="l-100per l-itemH" type="text" value="レポートのタイトル">' +
        '<textarea id="report" class="report" data-current-day="1">レポートの内容</textarea>';
      const reports: Reports = new Reports(
        new Settings(
          "test_0",
          "テスト",
          1,
          new UnitOfDay(new Array("日目"), 1)
        ),
        new Map([
          [1, new ExistsReportBuilder(1, "1日目", "", undefined, 2).build()],
          [2, new ExistsReportBuilder(2, "2日目", "", 1, undefined).build()],
        ])
      );
      const report1 = reports.get(1);
      changeCurrentReport(report1);
      const report2 = reports.get(2);
      changeCurrentReport(report2);
      $("#reportTitle").val("2日目 レポートのタイトルを編集").trigger("input");
      $("#report").val("2日目のレポートを編集しました").trigger("input");
      expect(report1.reportTitle).toBe("1日目");
      expect(report1.report).toBe("");
      expect($("#reportsList > li:first-child > span").text()).toBe("1日目");
      expect(report2.reportTitle).toBe("2日目 レポートのタイトルを編集");
      expect(report2.report).toBe("2日目のレポートを編集しました");
      expect($("#reportsList > li:nth-child(1) > span").text()).toBe("1日目");
      expect($("#reportsList > li:nth-child(2) > span").text()).toBe(
        "2日目 レポートのタイトルを編集"
      );
    });
  });
});
