import { increaseOrDecreaseList } from "src/ts/View/increaseOrDecreaseList";
import $ from "jquery";
describe("increaseOrDecreaseList", () => {
  test("リストの子要素と与えられた値が同じ場合", () => {
    document.body.innerHTML = '<ol><li><input type="text"></li></ol>';
    const list = $("ol");
    const addObj = $("<li>").append($("<input>").attr("type", "text"));
    increaseOrDecreaseList(1, list, addObj);
    expect($("ol").children().length).toBe(1);
  });
  test("与えられた値がリストの子要素より多い場合", () => {
    document.body.innerHTML = '<ol><li><input type="text"></li></ol>';
    const list = $("ol");
    const addObj = $("<li>").append($("<input>").attr("type", "text"));
    increaseOrDecreaseList(2, list, addObj);
    expect($("ol").children().length).toBe(2);
  });
  test("与えられた値がリストの子要素より少ない場合", () => {
    document.body.innerHTML = '<ol><li><input type="text"></li></ol>';
    const list = $("ol");
    const addObj = $("<li>").append($("<input>").attr("type", "text"));
    increaseOrDecreaseList(0, list, addObj);
    expect($("ol").children().length).toBe(0);
  });
});
