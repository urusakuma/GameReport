import $ from "jquery";
import { Storage } from "src/ts/Model/storage";
import { userController } from "src/ts/View/userController";
import {
  INNER_HTML_TEMPLATE,
  SAVE_DATA_FOR_SAVE_AND_LOAD,
} from "./userControllerTestConfig";
describe("loadingAreaContoller", () => {
  test("#loadbtnをクリックすると#loadingDropDownListで選択されている要素をロードする。", () => {
    document.body.innerHTML = INNER_HTML_TEMPLATE;
    for (let i = 0; i < 2; i++) {
      Storage.instance.import(SAVE_DATA_FOR_SAVE_AND_LOAD[i][1]);
    }
    userController();
    for (let i = 0; i < 2; i++) {
      $("#loadingDropDownList").val(SAVE_DATA_FOR_SAVE_AND_LOAD[i][0]);
      $("#loadbtn").trigger("click");
      expect($("#currentGameDataName").data("currentGameDataName")).toBe(
        SAVE_DATA_FOR_SAVE_AND_LOAD[i][0]
      );
      expect(Storage.instance.reports.settings.playGamedataName).toBe(
        SAVE_DATA_FOR_SAVE_AND_LOAD[i][2]
      );
    }
  });
  test("ゲームデータ名を編集すると#loadingDropDownListの名前も連動して変化する。", () => {
    document.body.innerHTML = INNER_HTML_TEMPLATE;
    for (let i = 0; i < 2; i++) {
      Storage.instance.import(SAVE_DATA_FOR_SAVE_AND_LOAD[i][1]);
    }
    userController();

    for (let i = 0; i < 2; i++) {
      Storage.instance.load(SAVE_DATA_FOR_SAVE_AND_LOAD[i][0]);
      $("#playGameDataName").val("編集した").trigger("input");
      expect(
        $("#loadingDropDownList").children("option[value=編集した]")
      ).not.toBeUndefined();
    }
  });
  test("データをリムーブすると#loadingDropDownListの要素数も連動して変化する。", () => {
    document.body.innerHTML = INNER_HTML_TEMPLATE;
    for (let i = 0; i < 2; i++) {
      Storage.instance.import(SAVE_DATA_FOR_SAVE_AND_LOAD[i][1]);
    }
    userController();

    for (let i = 0; i < 2; i++) {
      expect(
        $("#loadingDropDownList").children(
          "option[value=" + SAVE_DATA_FOR_SAVE_AND_LOAD[i][0] + "]"
        ).length
      ).toBe(1);
      $("#loadingDropDownList").val(SAVE_DATA_FOR_SAVE_AND_LOAD[i][0]);
      $("#deletebtn").trigger("click");
      expect(
        $("#loadingDropDownList").children(
          "option[value=" + SAVE_DATA_FOR_SAVE_AND_LOAD[i][0] + "]"
        ).length
      ).toBe(0);
    }
    $("#loadingDropDownList").val(
      String($("#loadingDropDownList").first().val())
    );
    $("#deletebtn").trigger("click");
    expect($("#loadingDropDownList").children("option").length).toBe(0);
  });
  test("#createbtnをクリックしたら新規作成する", () => {
    document.body.innerHTML = INNER_HTML_TEMPLATE;
    for (let i = 0; i < 2; i++) {
      Storage.instance.import(SAVE_DATA_FOR_SAVE_AND_LOAD[i][1]);
    }
    userController();
    // valが空かすでに存在するゲームデータ名なら新規作成しない。
    $("#inputNewSaveData").val("");
    $("#createbtn").trigger("click");
    expect(Storage.instance.reports.settings.playGamedataName).toBe(
      SAVE_DATA_FOR_SAVE_AND_LOAD[1][2]
    );
    for (let i = 0; i < 2; i++) {
      $("#inputNewSaveData").val(SAVE_DATA_FOR_SAVE_AND_LOAD[i][2]);
      $("#createbtn").trigger("click");
      expect(Storage.instance.reports.settings.playGamedataName).toBe(
        SAVE_DATA_FOR_SAVE_AND_LOAD[1][2]
      );
    }
    $("#inputNewSaveData").val("新規作成");
    $("#createbtn").trigger("click");
    expect(Storage.instance.reports.settings.playGamedataName).toBe("新規作成");
  });
});
