import { DayReport } from "./report/DayReport";
import $ from "jquery";

/**
 * 現在開いているレポートを変更する。
 * @param {DayReport} dayReport 新しく開いたレポート
 */
export function changeCurrentReport(dayReport: DayReport) {
  const $itemFromReportsList = $("#reportsList")
    .children("li")
    .filter((i, element) => $(element).data("day") == dayReport.day)
    .children("span");

  $("#reportTitle")
    .off("input") // inputを一度停止させる。
    .val(dayReport.reportTitle) // テキストエリアに入力されている文字列をdayReportのものに置き換える。
    .on("input", () => {
      // レポートタイトルに入力されたとき、dayReport.reportTitleとレポートリストを書き換えるようイベントを紐づける
      dayReport.reportTitle = String($("#reportTitle").val());
      $itemFromReportsList.text(String($("#reportTitle").val()));
    });
  $("#report")
    .off("input") // inputを一度停止させる。
    .val(dayReport.report) // テキストエリアに入力されている文字列をdayReportのものに置き換える。
    .data("currentDay", dayReport.day) // カレントの日付を変更する。
    // レポートに入力されたとき、dayReport.reportを書き換えるようイベントを紐づける
    .on("input", () => (dayReport.report = String($("#report").val())));
}
