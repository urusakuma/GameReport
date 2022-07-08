import { Storage } from "src/ts/Model/storage";
import { increaseOrDecreaseList } from "src/ts/View/increaseOrDecreaseList";
import { returnNonSequenceNumbers } from "src/ts/View/returnNonSequenceNumbers";
import $ from "jquery";
export function settingsContoller() {
  /**
   * ゲームデータ名の入力。ロード画面のドロップダウンリストを更新。
   */
  $("#playGameDataName").on("input", function () {
    const val = String($(this).val());
    Storage.instance.reports.settings.playGamedataName = val;

    const cKey = $("#currentGameDataName").data("currentGameDataName");
    $("#loadingDropDownList")
      .children("option[value=" + cKey + "]")
      .text(val);
  });
  /**
   * スライダーで受け取った値をdayIntervalに代入し、表示する。
   */
  $("#dayInterval").on("input", function () {
    const step = Array(
      {
        val: 1,
        lowestValue: 1,
        step: 1,
      },
      {
        val: 10,
        lowestValue: 10,
        step: 5,
      },
      {
        val: 18,
        lowestValue: 50,
        step: 10,
      }
    );
    const nowVal = Number($(this).val());
    const result = returnNonSequenceNumbers(nowVal, step);
    $("#dayIntervalResult").text(result);
    Storage.instance.reports.settings.dayInterval = result;
  });
  /**
   * 単位の入力欄に入力することでunitを編集する。
   */
  $("#unit").on("input", function () {
    const val = String($(this).val());
    Storage.instance.reports.settings.unitOfDay.setUnit(val, 0);
  });
  /**
   * 日にちの単位の横のスライダーを動かすことで周期的な単位の入力欄を増減させる。
   */
  $("#amountInUnit").on("input", function () {
    const val = Number($(this).val());
    const amountInUnit =
      Storage.instance.reports.settings.unitOfDay.amountInUnit;
    if (amountInUnit > val) {
      $(this).val(amountInUnit);
      return;
    }

    const addObj = $("<li>").append($("<input>").attr("type", "text"));
    increaseOrDecreaseList(val, $("#unitsOfDayList"), addObj);
    if (val !== 0) {
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
  });
  /**
   * 周期的な単位の入力欄に入力することでunitを編集する。
   */
  $("#unitsOfDayList").on("input", "li > input", function () {
    const index = $(this).parent().index() + 1;
    const val = String($(this).val());
    Storage.instance.reports.settings.unitOfDay.setUnit(val, index);
  });
  /** 単位付加の周期を入力することでCycleInUnitChangesを変化させる */
  $("#CycleInUnitChanges").on("input", function () {
    const val = Number($(this).val());
    const CycleInUnitChanges = 10 + val;
    Storage.instance.reports.settings.unitOfDay.CycleInUnitChanges =
      CycleInUnitChanges;
    $("#CycleInUnitChangesResult").text(CycleInUnitChanges);
  });
}
