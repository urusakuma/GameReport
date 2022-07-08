import $ from "jquery";
import { userController } from "src/ts/View/userController";
import { Storage } from "src/ts/Model/storage";
import {
  SERIALIZED_STRING,
  INNER_HTML_TEMPLATE,
} from "./userControllerTestConfig";
describe("settingsContoller", () => {
  test("#playGameDataNameに入力することでplayGameDataNameが変化する", () => {
    document.body.innerHTML = INNER_HTML_TEMPLATE;
    Storage.instance.import(SERIALIZED_STRING);
    userController();
    const newGameName = "ゲームデータ名変更テスト";
    $("#playGameDataName").val(newGameName).trigger("input");
    const playGaDeNa = Storage.instance.reports.settings.playGamedataName;
    expect(playGaDeNa).toBe(newGameName);
  });
  test("#dayIntervalに変化させることでdayIntervalと#dayIntervalResultが変化する", () => {
    document.body.innerHTML = INNER_HTML_TEMPLATE;
    Storage.instance.import(SERIALIZED_STRING);
    userController();
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
    for (let i = 1; i <= 10; i++) {
      $("#dayInterval").val(i).trigger("input");
      const val = step[0].lowestValue + (i - step[0].val) * step[0].step;
      expect(Storage.instance.reports.settings.dayInterval).toBe(val);
      expect($("#dayIntervalResult").text()).toBe(String(val));
    }
    for (let i = 10; i <= 18; i++) {
      $("#dayInterval").val(i).trigger("input");
      const val = step[1].lowestValue + (i - step[1].val) * step[1].step;
      expect(Storage.instance.reports.settings.dayInterval).toBe(val);
      expect($("#dayIntervalResult").text()).toBe(String(val));
    }
    for (let i = 18; i <= 23; i++) {
      $("#dayInterval").val(i).trigger("input");
      const val = step[2].lowestValue + (i - step[2].val) * step[2].step;
      expect(Storage.instance.reports.settings.dayInterval).toBe(val);
      expect($("#dayIntervalResult").text()).toBe(String(val));
    }
  });
  test("#unitに入力することでunit[0]が変化する。", () => {
    document.body.innerHTML = INNER_HTML_TEMPLATE;
    Storage.instance.import(SERIALIZED_STRING);
    userController();
    const newUnit = "個目のテスト";
    $("#unit").val(newUnit).trigger("input");
    const unit = Storage.instance.reports.settings.unitOfDay.unit[0];
    expect(unit).toBe(newUnit);
  });
  test("amountInUnitの数値を変更することでサイクル単位の入力欄が増減する。", () => {
    document.body.innerHTML = INNER_HTML_TEMPLATE;
    Storage.instance.import(SERIALIZED_STRING);
    userController();
    for (let i = 0; i <= 4; i++) {
      $("#amountInUnit").val(i).trigger("input");
      expect($("#unitsOfDayList").children().length).toBe(i);
    }
    for (let i = 4; i <= 0; i--) {
      $("#amountInUnit").val(i).trigger("input");
      expect($("#unitsOfDayList").children().length).toBe(i);
    }
  });
  test("#unitsOfDayList>li>inputに入力することでunit[i]が変化する。", () => {
    document.body.innerHTML = INNER_HTML_TEMPLATE;
    Storage.instance.import(SERIALIZED_STRING);
    userController();
    const season = new Array("春", "夏", "秋", "冬");
    $("#amountInUnit").val(4).trigger("input");
    for (let i = 0; i < 4; i++) {
      $("#unitsOfDayList")
        .children("li")
        .eq(i)
        .children("input")
        .val(season[i])
        .trigger("input");
      const unit = Storage.instance.reports.settings.unitOfDay.unit[i + 1];
      expect(unit).toBe(season[i]);
    }
  });
});
