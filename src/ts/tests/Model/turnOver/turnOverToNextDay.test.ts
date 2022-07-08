import { Reports } from "src/ts/Model/report/reports";
import { ExistsReportBuilder } from "src/ts/Model/report/reportBuilder";
import { Settings } from "src/ts/Model/report/settings";
import { turnOverToNextDay } from "src/ts/Model/turnOverReport";
import { ArgumentError } from "src/ts/Model/Error";
import $ from "jquery";

describe("turnOverToNextDay()", () => {
  test("1日目から2日目に変更する", () => {
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
    turnOverToNextDay(1, reports);
    expect($("#report").data("currentDay")).toBe(2);
  });
  test("2日目から3日目に変更する", () => {
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
    turnOverToNextDay(2, reports);
    expect($("#report").data("currentDay")).toBe(3);
  });
  test("4日目を作成し3日目から4日目に変更する", () => {
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
    turnOverToNextDay(3, reports);
    expect($("#report").data("currentDay")).toBe(4);
  });
  test("5日目から変更しようとしてエラーを吐く", () => {
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
    expect(() => turnOverToNextDay(5, reports)).toThrowError(ArgumentError);
  });
});
