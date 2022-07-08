import $ from "jquery";
import { Storage } from "src/ts/Model/storage";
import { Reports } from "../Model/report/reports";
export function screenInitialization() {
  /** カレントのゲームデータを変更 */
  $("#currentGameDataName").data(
    "currentGameDataName",
    Storage.instance.reports.settings.storageKey
  );

  /** レポートリストの初期化 */
  const $reportsList = $("#reportsList");
  $reportsList.children().remove();
  addAllReportsToList(1, Storage.instance.reports, $reportsList);

  /** レポートタイトルとレポートの初期化 */
  const lastDay = Storage.instance.reports.lastDay;
  const report = Storage.instance.reports.get(lastDay);
  $("#reportTitle").val(report.reportTitle);
  $("#report").val(report.report);
  /** カレントのレポートを変更 */
  $("#report").data("currentDay", report.day);

  /** 設定の初期化 */
  const settings = Storage.instance.reports.settings;
  $("#playGameDataName").val(settings.playGamedataName);
  $("#dayInterval").val(settings.dayInterval);

  $("#unit").val(settings.unitOfDay.unit[0]);
  $("#amountInUnit").val(settings.unitOfDay.amountInUnit);
  const $unitsOfDayList = $("#unitsOfDayList");
  $unitsOfDayList.children().remove();

  const $newInputObj = $("<input>").attr("type", "text");
  const $itemInUnitOfDayOnList = $("<li>").append($newInputObj);
  for (let i = 1; i < settings.unitOfDay.unit.length; i++) {
    const unit = settings.unitOfDay.unit[i];
    if (unit === "") {
      continue;
    }
    const item = $itemInUnitOfDayOnList.clone();
    item.children("input").val(unit);
    $unitsOfDayList.append(item);
  }
  if ($unitsOfDayList.children().length !== 0) {
    $("#settingArea")
      .find(".hiddonBlock")
      .removeClass("hiddonBlock")
      .addClass("visibleBlock");
  } else {
    $("#settingArea")
      .find(".visibleBlock")
      .removeClass("visibleBlock")
      .addClass("hiddonBlock");
  }
  $("#CycleInUnitChanges").val(settings.unitOfDay.CycleInUnitChanges - 10);
  $("#CycleInUnitChangesResult").text(settings.unitOfDay.CycleInUnitChanges);
  /** ロード用ドロップダウンリストの初期化 */
  $("#loadingDropDownList").val(Storage.instance.reports.settings.storageKey);

  /** ゲームデータ新規作成の初期化 */
  $("#inputNewSaveData").val("");

  /** セーブしたことの表示を隠す */
  $("#isSaved").hide();
}

// レポートリストに追加するリストの定数群
const TITLE_IN_REPORTS_LIST: JQuery = $("<span>");
const REMOVE_ITEM_FROM_REPORTS: JQuery = $("<button>")
  .attr({ class: "buttonSquare" })
  .text("×");
const LIST_ITEM_IN_REPORTS_LIST: JQuery = $("<li>")
  .append(TITLE_IN_REPORTS_LIST)
  .append(REMOVE_ITEM_FROM_REPORTS);

function addAllReportsToList(
  day: number,
  reports: Reports,
  list: JQuery<HTMLElement>
) {
  const report = reports.get(day);
  const item = LIST_ITEM_IN_REPORTS_LIST.clone();
  item.data("day", day);
  item.children("span").text(report.reportTitle);
  $(list).append(item);

  if (report.next === undefined) {
    return;
  }
  addAllReportsToList(report.next, reports, list);
}
