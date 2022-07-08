import { Storage } from "src/ts/Model/storage";
import $ from "jquery";
import { ArgumentError } from "src/ts/Model/Error";
import { screenInitialization } from "../screenInitialization";

export function loadingAreaContoller() {
  /** ロードボタン */
  $("#loadbtn").on("click", function () {
    const loadGameDataKey = String($("#loadingDropDownList").val());
    try {
      Storage.instance.load(loadGameDataKey);
      screenInitialization();
    } catch (e) {
      if (e instanceof ArgumentError) {
        // データがローカルストレージに存在しないのでドロップダウンリストから要素を削除
        $("#loadingDropDownList")
          .children("option[value=" + loadGameDataKey + "]")
          .remove();
      }
      if (e instanceof Error) {
        // ローカルストレージに対応していないのでアラート。
        console.log(e.message);
        alert(e.message);
      }
    }
  });
  /** デリートボタン */
  $("#deletebtn").on("click", function () {
    const deleteGameDataKey = String($("#loadingDropDownList").val());
    Storage.instance.remove(deleteGameDataKey);

    const deleteList = $("#loadingDropDownList").children(
      "option[value=" + deleteGameDataKey + "]"
    );
    const index = deleteList.index();
    deleteList.remove();
    if (Storage.instance.reports.settings.storageKey !== deleteGameDataKey) {
      return;
    }
    /** 現在開いているレポートが削除された */
    const children = $("#loadingDropDownList").children();
    if (children.length === 0) {
      Storage.instance.reports.clear(crypto.randomUUID());
      Storage.instance.save();
      createloadingDropDownListItem(
        Storage.instance.reports.settings.storageKey,
        Storage.instance.reports.settings.playGamedataName
      );
      screenInitialization();
      return;
    }
    const loadGameDataKey =
      index === children.length
        ? String(children.eq(index - 1).val())
        : String(children.eq(index).val());
    Storage.instance.load(loadGameDataKey);
    screenInitialization();
  });
  /** クリエイトボタン */
  $("#createbtn").on("click", function () {
    const gameName = String($("#inputNewSaveData").val());
    const hasGameName =
      Storage.instance.gameDataNames.filter(
        (item) => item.playGamedataName === gameName
      ).length !== 0;
    if (gameName === "" || hasGameName) {
      return;
    }
    Storage.instance.create(gameName);
    Storage.instance.save();
    createloadingDropDownListItem(
      Storage.instance.reports.settings.storageKey,
      gameName
    );
    screenInitialization();
  });
}

/**
 * ドロップダウンリストにアイテムを追加する。
 * @param {string} storageKey ストレージキー
 * @param {string} gameName ゲームデータ名
 */
function createloadingDropDownListItem(storageKey: string, gameName: string) {
  const obj = $("<option>").attr("value", storageKey).text(gameName);
  $("#loadingDropDownList").append(obj);
}
