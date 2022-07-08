import $ from "jquery";
import { userController } from "src/ts/View/userController";
import { Storage } from "src/ts/Model/storage";
import {
  SERIALIZED_STRING,
  INNER_HTML_TEMPLATE,
} from "./userControllerTestConfig";

describe("reportContoller", () => {
  test("click", () => {
    document.body.innerHTML = INNER_HTML_TEMPLATE;
    Storage.instance.import(SERIALIZED_STRING);
    userController();
    $("#reportsList")
      .children("li")
      .filter((i) => i === 1)
      .trigger("click");
    expect($("#report").data("currentDay")).toBe(2);
  });
  test("keydown NextDay", () => {
    document.body.innerHTML = INNER_HTML_TEMPLATE;
    Storage.instance.import(SERIALIZED_STRING);
    userController();
    const e = $.Event("keydown");
    e.ctrlKey = true;
    e.key = "ArrowRight";
    $("#report").trigger(e);
    expect($("#report").data("currentDay")).toBe(2);
  });
  test("keydown PreviousDay", () => {
    document.body.innerHTML = INNER_HTML_TEMPLATE;
    Storage.instance.import(SERIALIZED_STRING);
    $("#report").data("currentDay", 2);
    userController();
    const e = $.Event("keydown");
    e.ctrlKey = true;
    e.key = "ArrowLeft";
    $("#report").trigger(e);
    expect($("#report").data("currentDay")).toBe(1);
  });
  test("keydown ctrl+s", () => {
    document.body.innerHTML = INNER_HTML_TEMPLATE;
    Storage.instance.import(SERIALIZED_STRING);
    $("#report").data("currentDay", 2);
    userController();
    const storageKey = Storage.instance.reports.settings.storageKey;
    $("#report").val("編集");
    const e = $.Event("keydown");
    e.ctrlKey = true;
    e.key = "s";
    $("#report").trigger(e);
    Storage.instance.load(storageKey);
    expect($("#report").val()).toBe("編集");
  });
  test("keydown でたらめなKeydown", () => {
    document.body.innerHTML = INNER_HTML_TEMPLATE;
    Storage.instance.import(SERIALIZED_STRING);
    $("#report").data("currentDay", 2);
    userController();
    const e = $.Event("keydown");
    e.ctrlKey = false;
    e.key = "a";
    $("#report").trigger(e);
    e.ctrlKey = true;
    $("#report").trigger(e);
  });
});
