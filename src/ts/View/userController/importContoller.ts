import $ from "jquery";
import { Storage } from "src/ts/Model/storage";
import { ArgumentError } from "src/ts/Model/Error";
import { changeCurrentReport } from "src/ts/Model/changeCurrentReport";
export function importContoller() {
  /**インポート */
  $("#importbtn").on("click", function () {
    const importVal = String($("#importInput").val());
    try {
      Storage.instance.import(importVal);
      const storageKey = Storage.instance.reports.settings.storageKey;

      changeCurrentReport(Storage.instance.reports.get(1));
      $("#currentGameDataName").data("currentGameDataName", storageKey);

      const hasKeyInDropDownList =
        $("#loadingDropDownList").children("option[value=" + storageKey + "]")
          .length != 0;
      if (hasKeyInDropDownList || storageKey === undefined) {
        return;
      }
      const obj = $("<option>").attr("value", storageKey);
      $("#loadingDropDownList").append(obj);
    } catch (e) {
      if (e instanceof ArgumentError || e instanceof SyntaxError) {
        // データを複合できない。よくあることなので握りつぶす。
        return;
      }
      if (e instanceof Error) {
        // ローカルストレージに対応していないのでアラート。
        console.log(e.message);
        alert(e.message);
      }
    }
  });

  /** インポート画面を開くボタン */
  $("#moveToImportWindow").on("click", () => $("#importInput").val(""));
}
