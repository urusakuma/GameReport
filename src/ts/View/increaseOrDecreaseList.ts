import $ from "jquery";
/**
 * 与えられた値に応じてリストの中身を増減させる。
 * 増加させるオブジェクトはクローンで増やされる。
 * @param val 更新後のリストの数。
 * @param list リスト
 * @param obj リストに追加するオブジェクト
 */
export function increaseOrDecreaseList(
  val: number,
  list: JQuery<HTMLElement>,
  obj: JQuery<HTMLElement>
): void {
  const nowliLen = $(list).children().length;
  if (nowliLen == val) {
    return;
  }
  if (val > nowliLen) {
    for (let i = nowliLen; i < val; i++) {
      const clone = $(obj).clone();
      $(list).append(clone);
    }
  } else {
    for (let i = nowliLen; i > val; i--) {
      $(list).children().last().remove();
    }
  }
}
