import $ from "jquery";
import { Storage } from "src/ts/Model/storage";
import { userController } from "src/ts/View/userController";
import {
  INNER_HTML_TEMPLATE,
  SERIALIZED_STRING,
  SAVE_DATA_FOR_SAVE_AND_LOAD,
} from "./userControllerTestConfig";
describe("importContoller", () => {
  test("新たにインポートすると#loadingDropDownListの要素数も連動して変化する。", () => {
    document.body.innerHTML = INNER_HTML_TEMPLATE;
    for (let i = 0; i < 2; i++) {
      Storage.instance.import(SAVE_DATA_FOR_SAVE_AND_LOAD[i][1]);
    }
    userController();
    $("#importInput").val(SERIALIZED_STRING);
    $("#importbtn").trigger("click");
    expect($("#currentGameDataName").data("currentGameDataName")).toBe(
      Storage.instance.reports.settings.storageKey
    );
    expect(
      $("#loadingDropDownList").children(
        "option[value=" + Storage.instance.reports.settings.storageKey + "]"
      ).length
    ).toBe(1);
  });
  test("でたらめな文字列をインポートする", () => {
    document.body.innerHTML = INNER_HTML_TEMPLATE;
    for (let i = 0; i < 2; i++) {
      Storage.instance.import(SAVE_DATA_FOR_SAVE_AND_LOAD[i][1]);
    }
    userController();
    $("#importInput").val("でたらめな文字列");
    $("#importbtn").trigger("click");
    expect($("#currentGameDataName").data("currentGameDataName")).toBe(
      SAVE_DATA_FOR_SAVE_AND_LOAD[1][0]
    );
  });
});
