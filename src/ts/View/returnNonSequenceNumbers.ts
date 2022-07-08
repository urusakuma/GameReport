/**
 * 入力されたValからスライダーの値を返却する。
 * 決定する際に増分を等差的ではない方法で決める。
 * @param nowVal 現在のVal
 * @param sequence valは参照するlow・stepを決める値、lowestValueは最低値、stepは増分。
 * @returns 出力される値
 */
export function returnNonSequenceNumbers(
  nowVal: number,
  sequence: Array<{
    val: number;
    lowestValue: number;
    step: number;
  }>
): number {
  let result = 0;
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i].val <= nowVal) {
      result =
        sequence[i].lowestValue + (nowVal - sequence[i].val) * sequence[i].step;
    }
  }
  return result;
}
