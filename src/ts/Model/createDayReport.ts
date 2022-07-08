import { Reports } from "./report/reports";
import { DayReport } from "./report/DayReport";
import { FromSourceOfReportBuilder } from "./report/reportBuilder";
import $ from "jquery";
/**
 * レポートを作成する関数。
 * beforeReportのnextに作成したdayを追加する。レポートリストにも記載する。
 * @param {DayReport} source レポートを作成する基となるレポート。
 * @param {Reports} reports レポートを管理しているインスタンス
 * @param {boolean} isFutureReportToCreate 新しいレポートを未来方向に作成するならtrue
 * @return {DayReport} 作成したレポート。
 */
export function createDayReport(
  source: DayReport,
  reports: Reports,
  isFutureReportToCreate: boolean = true
): DayReport {
  const builder = new FromSourceOfReportBuilder(
    source,
    reports.settings,
    isFutureReportToCreate
  );
  const newReport = builder.build();
  reports.add(newReport);

  if (isFutureReportToCreate) {
    source.next = newReport.day;
  } else {
    source.previous = newReport.day;
  }
  const item = createListInReportsList(newReport.day, newReport.reportTitle);

  $("#reportsList")
    .children("li")
    .filter((i, element) => {
      return $(element).data("day") < item.data("day");
    })
    .last()
    .after(item);

  return newReport;
}

// レポートリストに追加するリストの定数群
const TITLE_IN_REPORTS_LIST: JQuery = $("<span>");
const REMOVE_ITEM_FROM_REPORTS: JQuery = $("<button>")
  .attr({ class: "buttonSquare" })
  .text("×");
const LIST_ITEM_IN_REPORTS_LIST: JQuery = $("<li>")
  .append(TITLE_IN_REPORTS_LIST)
  .append(REMOVE_ITEM_FROM_REPORTS);
/**
 * 画面左側のレポートリストに追加する要素を作成する。
 * @param {number} day 日付。
 * @param {string} title タイトル。
 * @return {JQuery<HTMLElement>} リストに追加する要素
 */
function createListInReportsList(
  day: number,
  title: string
): JQuery<HTMLElement> {
  const item = LIST_ITEM_IN_REPORTS_LIST.clone();
  item.data("day", day);
  item.children("span").text(title);
  return item;
}
