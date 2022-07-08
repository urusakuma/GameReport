import { Reports } from "./report/reports";
import { DayReport } from "./report/DayReport";
import $ from "jquery";
/**
 * レポートを削除する関数。
 * dayで指定した日付を削除する。レポートリストからも削除する。
 * @param {DayReport} day 削除するレポートの日付。
 * @param {Reports} reports レポートを管理しているインスタンス
 */
export function deleteDayReport(day: number, reports: Reports): boolean {
  $("#reportsList")
    .children("li")
    .filter((i, element) => {
      return $(element).data("day") === day;
    })
    .remove();
  return reports.delete(day);
}
export function recursiveDeleteOfReport(
  day: number,
  shouldDeletedFunc: (report: DayReport) => boolean,
  stopDay: number,
  reports: Reports
) {
  const previousDay = reports.get(day).previous;
  const isDelete = deleteDayReport(day, reports);
  const shouldDeleted =
    previousDay !== undefined
      ? shouldDeletedFunc(reports.get(previousDay))
      : false;
  if (
    isDelete &&
    stopDay + 1 < day &&
    previousDay !== undefined &&
    shouldDeleted
  ) {
    recursiveDeleteOfReport(previousDay, shouldDeletedFunc, stopDay, reports);
  }
}
