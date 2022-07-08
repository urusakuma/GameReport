import {
  turnOverToNextDay,
  turnOverToPreviousDay,
  turnOverToReportOfThisDay,
} from "src/ts/Model/turnOverReport";
import { Storage } from "src/ts/Model/storage";
import $ from "jquery";
import { savedOnWindow } from "../popupSaved";

export function reportContoller() {
  /**
   * レポートリストがクリックされたときカレントレポートを変更する。
   */
  $("#reportsList").on("click", "li > span", function () {
    const day: number = $(this).parent().data("day");
    const currentDay: number = $("#report").data("currentDay");
    turnOverToReportOfThisDay(day, currentDay, Storage.instance.reports);
  });
  /**
   * レポートリストのバツボタンがクリックされたときレポートを削除する。
   */
  $("#reportsList").on("click", "li > button", function () {
    const day: number = $(this).parent().data("day");
    if (day === 1) {
      return false;
    }
    const currentDay: number = $("#report").data("currentDay");
    if (day === currentDay) {
      turnOverToPreviousDay(currentDay, Storage.instance.reports);
    }
    Storage.instance.reports.delete(day);
    $("#reportsList")
      .children()
      .filter((i, e) => $(e).data("day") == day)
      .remove();
    return false;
  });

  /**
   * レポートでctrl + →を押したとき次のレポートにカレントレポートを変更する。
   * レポートでctrl + ←を押したとき前のレポートにカレントレポートを変更する。
   */
  $(window).on("keydown", function (e) {
    if (e.ctrlKey === false) {
      return true;
    }
    //セーブはどこでもできるように
    if (e.key === "s") {
      savedOnWindow();
      return false;
    }
    //それ以外は初期画面でしか入力できないように。
    if (location.hash !== "") {
      return true;
    }
    if (e.key === "ArrowRight") {
      turnOverToNextDay(
        $("#report").data("currentDay"),
        Storage.instance.reports
      );
      return false;
    }
    if (e.key === "ArrowLeft") {
      turnOverToPreviousDay(
        $("#report").data("currentDay"),
        Storage.instance.reports
      );
      return false;
    }
    return true;
  });
}
