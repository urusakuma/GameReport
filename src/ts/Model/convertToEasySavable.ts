import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { ArgumentError } from "./Error";

/**
 * 保存しやすいようにシリアライズして圧縮する。
 *
 * 安全にデシリアライズするならcompressを暗号化しなければならないけれど、
 * 個々人の自己責任でインポートするはずなので必要ないと判断。
 * @param obj シリアライズして圧縮するオブジェクト
 * @returns シリアライズして圧縮した文字列
 */
export function convertToEasySavable(obj: Serializable<any>): string {
  const json = JSON.stringify(obj);
  const compress = compressToEncodedURIComponent(json);
  return compress;
}
/**
 * シリアライズして圧縮された文字列を展開してデシリアライズする。
 *
 * 安全にデシリアライズするならcompressedを暗号化しなければならないけれど、
 * 個々人の自己責任でインポートするはずなので必要ないと判断。
 * @param compressed シリアライズされて圧縮されている文字列。
 * @param recipient 結果を受け取るクラスインスタンス。Tでインスタンスを作成できないのでこのようにしている。
 * @returns 展開してデシリアライズしたクラスオブジェクト。
 * @throws {ArgumentError} 引数に復号できない文字列を渡された。
 * @throws {SyntaxError} 引数にデシリアライズできない文字列を渡された。
 */
export function convertReceiveFromEasySavableIntoObject<
  T extends Serializable<T>
>(compressed: string, recipient: T): T {
  const decompress = decompressFromEncodedURIComponent(compressed);
  if (decompress === null) {
    throw new ArgumentError("復号できませんでした");
  }
  const json = JSON.parse(decompress);
  return recipient.deserialize(json);
}
export interface Serializable<T> {
  /**
   * デシリアライズした結果を返却する。
   * 型推論が使えないため、プロパティが存在するとは限らないので注意が必要。
   * @param input
   */
  deserialize(input: T): T;
}
