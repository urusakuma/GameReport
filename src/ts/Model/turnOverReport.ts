import { Reports } from "./report/reports";
import { DayReport } from "./report/DayReport";
import { changeCurrentReport } from "./changeCurrentReport";
import { createDayReport } from "./createDayReport";
import { ArgumentError, KeyNotFoundError } from "./Error";
import { deleteDayReport, recursiveDeleteOfReport } from "./deleteDayReport";

/**
 * レポートを次の日に切り替える。翌日が存在しない場合、レポートを新しく作成する。
 * @param {number} currentDay 現在開いているレポートの日付
 * @param {Reports} reports レポートを管理しているインスタンス */
export function turnOverToNextDay(currentDay: number, reports: Reports) {
  try {
    const day = reports.get(currentDay);
    const report: DayReport =
      day.next === undefined
        ? createDayReport(day, reports)
        : reports.get(day.next);
    changeCurrentReport(report);
  } catch (error) {
    changeCurrentReport(reports.get(1));
  }
}

/**
 * 前の日のレポートに切り替える。切り替える前にレポートに何も書かれていなかった場合レポートを削除する。
 * @param {number} currentDay 現在開いているレポートの日付
 * @param {Reports} reports レポートを管理しているインスタンス */
export function turnOverToPreviousDay(currentDay: number, reports: Reports) {
  try {
    const day = reports.get(currentDay);
    const report =
      day.previous == undefined ? undefined : reports.get(day.previous);
    if (report === undefined) {
      // 前日のレポートが存在しないので戻れない。初日の可能性が高い。
      return;
    }
    if (isLatestReportAndNotEdited(day)) {
      deleteDayReport(currentDay, reports);
    }
    changeCurrentReport(report);
  } catch (error) {
    if (!(error instanceof KeyNotFoundError)) {
      throw error;
    }
    changeCurrentReport(reports.get(1));
  }
}

/**
 * 引数で渡された日付のレポートに切り替える。
 * 切り替える前が最新の日付でかつレポートに何も書かれていなかった場合レポートを削除する。
 * @param {number} day クリックされたレポートのDay
 * @param {number} currentDay 現在開いているレポートのDay
 * @param {Reports} Reports レポートを管理しているインスタンス */
export function turnOverToReportOfThisDay(
  day: number,
  currentDay: number,
  Reports: Reports
) {
  try {
    const currentReport = Reports.get(currentDay);
    if (isLatestReportAndNotEdited(currentReport) && currentDay !== day) {
      recursiveDeleteOfReport(
        currentDay,
        isLatestReportAndNotEdited,
        day,
        Reports
      );
    }
  } catch (error) {
    if (!(error instanceof KeyNotFoundError)) {
      throw error;
    }
    changeCurrentReport(Reports.get(1));
  }
  try {
    const report = Reports.get(day);
    changeCurrentReport(report);
  } catch (error) {
    if (!(error instanceof KeyNotFoundError)) {
      throw error;
    }
    throw new ArgumentError(
      "レポートリストのday = " + day + "がReports内に存在しません"
    );
  }
}

/**
 * レポートが編集されていない、かつ次のレポートが存在しないなら削除するべきレポート。
 * @param report 削除するべきか判定するレポート
 * @returns 削除するべきならtrue、すべきでないならfalse */
function isLatestReportAndNotEdited(report: DayReport): boolean {
  return report.next === undefined && !report.isEdited();
}
