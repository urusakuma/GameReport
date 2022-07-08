import { Reports } from "src/ts/Model/report/reports";
import { ExistsReportBuilder } from "src/ts/Model/report/reportBuilder";
import { Settings } from "src/ts/Model/report/settings";
import { turnOverToPreviousDay } from "src/ts/Model/turnOverReport";
import { ArgumentError, KeyNotFoundError } from "src/ts/Model/Error";
import $ from "jquery";

describe("turnOverToPreviousDay()", () => {
  test("2日目から1日目に変更する", () => {
    const reports: Reports = new Reports(
      new Settings(),
      new Map([
        [1, new ExistsReportBuilder(1, "1日目", "", undefined, 2).build()],
        [2, new ExistsReportBuilder(2, "2日目", "", 1, 3).build()],
        [3, new ExistsReportBuilder(3, "3日目", "", 2, undefined).build()],
      ])
    );
    document.body.innerHTML =
      '<ul id="reportsList">' +
      ' <li data-day="1">' +
      '   <span name="titleInReportsList" class="overflowHidden cursorPointer">1日目</span>' +
      '   <button name="removeFromReportsList" class="buttonSquare" text="×">' +
      " </li>" +
      "</ul>" +
      '<input id="reportTitle" class="l-100per l-itemH" type="text" value="レポートのタイトル">' +
      '<textarea id="report" class="report" data-current-day="2">レポートの内容</textarea>';
    turnOverToPreviousDay(2, reports);
    expect($("#report").data("currentDay")).toBe(1);
  });
  test("最新日の3日目から2日目に変更し、3日目が消えていることをテスト", () => {
    const reports: Reports = new Reports(
      new Settings(),
      new Map([
        [1, new ExistsReportBuilder(1, "1日目", "", undefined, 2).build()],
        [2, new ExistsReportBuilder(2, "2日目", "", 1, 3).build()],
        [3, new ExistsReportBuilder(3, "3日目", "", 2, undefined).build()],
      ])
    );
    document.body.innerHTML =
      '<ul id="reportsList">' +
      ' <li data-day="1">' +
      '   <span name="titleInReportsList" class="overflowHidden cursorPointer">1日目</span>' +
      '   <button name="removeFromReportsList" class="buttonSquare" text="×">' +
      " </li>" +
      "</ul>" +
      '<input id="reportTitle" class="l-100per l-itemH" type="text" value="レポートのタイトル">' +
      '<textarea id="report" class="report" data-current-day="3">レポートの内容</textarea>';
    turnOverToPreviousDay(3, reports);
    expect($("#report").data("currentDay")).toBe(2);
    expect(() => reports.get(3)).toThrowError(KeyNotFoundError);
  });
  test("1日目から前日に変更しようとして失敗する", () => {
    const reports: Reports = new Reports(
      new Settings(),
      new Map([
        [1, new ExistsReportBuilder(1, "1日目", "", undefined, 2).build()],
        [2, new ExistsReportBuilder(2, "2日目", "", 1, 3).build()],
        [3, new ExistsReportBuilder(3, "3日目", "", 2, undefined).build()],
      ])
    );
    document.body.innerHTML =
      '<ul id="reportsList">' +
      ' <li data-day="1">' +
      '   <span name="titleInReportsList" class="overflowHidden cursorPointer">1日目</span>' +
      '   <button name="removeFromReportsList" class="buttonSquare" text="×">' +
      " </li>" +
      "</ul>" +
      '<input id="reportTitle" class="l-100per l-itemH" type="text" value="レポートのタイトル">' +
      '<textarea id="report" class="report" data-current-day="1">レポートの内容</textarea>';
    turnOverToPreviousDay(1, reports);
    expect($("#report").data("currentDay")).toBe(1);
  });
  test("存在しない4日目から変更しようとしてエラーを吐く", () => {
    const reports: Reports = new Reports(
      new Settings(),
      new Map([
        [1, new ExistsReportBuilder(1, "1日目", "", undefined, 2).build()],
        [2, new ExistsReportBuilder(2, "2日目", "", 1, 3).build()],
        [3, new ExistsReportBuilder(3, "3日目", "", 2, undefined).build()],
      ])
    );
    document.body.innerHTML =
      '<ul id="reportsList">' +
      ' <li data-day="1">' +
      '   <span name="titleInReportsList" class="overflowHidden cursorPointer">1日目</span>' +
      '   <button name="removeFromReportsList" class="buttonSquare" text="×">' +
      " </li>" +
      "</ul>" +
      '<input id="reportTitle" class="l-100per l-itemH" type="text" value="レポートのタイトル">' +
      '<textarea id="report" class="report" data-current-day="1">レポートの内容</textarea>';
    const func = () => turnOverToPreviousDay(4, reports);
    expect(func).toThrowError(
      new ArgumentError("currentDayのレポートがundefinedです")
    );
    expect(func).toThrowError(ArgumentError);
  });
});
