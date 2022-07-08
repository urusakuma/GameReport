import { Storage } from "src/ts/Model/storage";
import { loadingAreaContoller } from "./userController/loadingAreaContoller";
import { reportContoller } from "./userController/reportContoller";
import { settingsContoller } from "./userController/settingsContoller";
import { importContoller } from "./userController/importContoller";
import $ from "jquery";
import { screenInitialization } from "./screenInitialization";
import { savedOnWindow } from "./popupSaved";

export function userController() {
  /** ロード用ドロップダウンリストの生成 */
  const gameDataNames = Storage.instance.gameDataNames;
  const length = gameDataNames.length;
  const dropDownList = $("#loadingDropDownList");
  const obj = $("<option>");
  for (let i = 0; i < length; i++) {
    obj.val(gameDataNames[i].storageKey);
    obj.text(gameDataNames[i].playGamedataName);
    dropDownList.append(obj.clone());
  }
  /** 画面の初期化 */
  screenInitialization();
  /** レポートのコントロール */
  reportContoller();
  /** 設定のコントロール */
  settingsContoller();
  /** ロード・セーブデータ新規作成・デリート */
  loadingAreaContoller();

  /** インポート */
  importContoller();
  /** セーブ */
  $("#savebtn").on("click", function () {
    savedOnWindow();
  });
  /** エクスポート */
  $("#exportbtn").on("click", function () {
    $("#exportOutput").val(Storage.instance.export());
  });
  $("#exportOutput").on("focus", () => {
    $("#exportOutput").trigger("select");
  });

  $(window).on("keydown", function (e) {
    // 初期画面以外の場合
    if (location.hash !== "") {
      if (e.key === "Escape") {
        location.hash = "";
        return false;
      }
      return true;
    }
    //初期画面の場合
    if (e.ctrlKey === true && e.key === "o") {
      $("#moveToImportWindow").trigger("click");
      location.hash = "importInputScreen";
      return false;
    }
    return true;
  });
}
