import { Reports } from "src/ts/Model/report/reports";
import { ExistsReportBuilder } from "src/ts/Model/report/reportBuilder";
import { Settings } from "src/ts/Model/report/settings";
import { turnOverToReportOfThisDay } from "src/ts/Model/turnOverReport";
import { ArgumentError, KeyNotFoundError } from "src/ts/Model/Error";
import $ from "jquery";

describe("turnOverToReportOfThisDay()", () => {
  test("リストを使用して2日目に変更する", () => {
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
      ' <li data-day="2">' +
      '   <span name="titleInReportsList" class="overflowHidden cursorPointer">2日目</span>' +
      '   <button name="removeFromReportsList" class="buttonSquare" text="×">' +
      " </li>" +
      ' <li data-day="3">' +
      '   <span name="titleInReportsList" class="overflowHidden cursorPointer">3日目</span>' +
      '   <button name="removeFromReportsList" class="buttonSquare" text="×">' +
      " </li>" +
      "</ul>" +
      '<input id="reportTitle" class="l-100per l-itemH" type="text" value="レポートのタイトル">' +
      '<textarea id="report" class="report" data-current-day="1">レポートの内容</textarea>';
    turnOverToReportOfThisDay(2, 1, reports);
    expect($("#report").data("currentDay")).toBe(2);
  });
  test("リストを使用して最新日の3日目から1日目に変更し、3日目が消えていることをテスト", () => {
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
      ' <li data-day="2">' +
      '   <span name="titleInReportsList" class="overflowHidden cursorPointer">2日目</span>' +
      '   <button name="removeFromReportsList" class="buttonSquare" text="×">' +
      " </li>" +
      ' <li data-day="3">' +
      '   <span name="titleInReportsList" class="overflowHidden cursorPointer">3日目</span>' +
      '   <button name="removeFromReportsList" class="buttonSquare" text="×">' +
      " </li>" +
      "</ul>" +
      '<input id="reportTitle" class="l-100per l-itemH" type="text" value="レポートのタイトル">' +
      '<textarea id="report" class="report" data-current-day="3">レポートの内容</textarea>';
    turnOverToReportOfThisDay(1, 3, reports);
    expect($("#report").data("currentDay")).toBe(1);
    expect(() => reports.get(3)).toThrowError(KeyNotFoundError);
  });
  test("カレントレポートが存在しない日付", () => {
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
      ' <li data-day="2">' +
      '   <span name="titleInReportsList" class="overflowHidden cursorPointer">2日目</span>' +
      '   <button name="removeFromReportsList" class="buttonSquare" text="×">' +
      " </li>" +
      ' <li data-day="3">' +
      '   <span name="titleInReportsList" class="overflowHidden cursorPointer">3日目</span>' +
      '   <button name="removeFromReportsList" class="buttonSquare" text="×">' +
      " </li>" +
      "</ul>" +
      '<input id="reportTitle" class="l-100per l-itemH" type="text" value="レポートのタイトル">' +
      '<textarea id="report" class="report" data-current-day="4">レポートの内容</textarea>';
    const fanc = () => turnOverToReportOfThisDay(1, 4, reports);
    expect(fanc).toThrowError(ArgumentError);
    expect(fanc).toThrowError(
      new ArgumentError("currentDayのレポートがundefinedです")
    );
  });
  test("レポートリストに存在しない日付を指定する", () => {
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
      ' <li data-day="2">' +
      '   <span name="titleInReportsList" class="overflowHidden cursorPointer">2日目</span>' +
      '   <button name="removeFromReportsList" class="buttonSquare" text="×">' +
      " </li>" +
      ' <li data-day="3">' +
      '   <span name="titleInReportsList" class="overflowHidden cursorPointer">3日目</span>' +
      '   <button name="removeFromReportsList" class="buttonSquare" text="×">' +
      " </li>" +
      "</ul>" +
      '<input id="reportTitle" class="l-100per l-itemH" type="text" value="レポートのタイトル">' +
      '<textarea id="report" class="report" data-current-day="3">レポートの内容</textarea>';
    const fanc = () => turnOverToReportOfThisDay(4, 1, reports);
    expect(fanc).toThrowError(ArgumentError);
    expect(fanc).toThrowError(
      new ArgumentError("レポートリストのday = 4がReports内に存在しません")
    );
  });
});
