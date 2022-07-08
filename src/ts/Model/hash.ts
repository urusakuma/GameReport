//import { createHash } from "crypto";
import jsSHA from "jssha";
/**
 * HashをNode.jsで実装するか、jsSHAで実装するか隠蔽するファイル。
 * 現在jsSHAで実装している。
 */

/**
 * 指定されたdataからハッシュを求めて返却する。
 * ハッシュ関数はsha1、返却するハッシュのデータ形式はBase64。
 * @param {string} data 計算するデータ。
 * @return {string} 生成されたハッシュ。Base64。
 */
export function digest(data: string): string {
  return digestJsSHA(data);
}

/**
 * Node.Jsによる実装。
 * 指定されたdataからハッシュを求めて返却する。
 * ハッシュ関数はsha1、返却するハッシュのデータ形式はBase64。
 * @param {string} data 計算するデータ。
 * @return {string} 生成されたハッシュ。Base64。
 */
// function digestNodejs(data: string): string {
//   const hash = createHash("sha1");
//   hash.update(data);
//   return hash.digest("base64");
// }
/**
 * Web標準による実装。
 * 指定されたdataからハッシュを求めて返却する。
 * ハッシュ関数はsha1、返却するハッシュのデータ形式はArrayBufferを無理やりStringにしたもの。
 * @param {string} data 計算するデータ。
 * @return {string} 生成されたハッシュ。
 */
// async function digestWeb(data: string): Promise<string> {
//   const msgUint8 = new TextEncoder().encode(data);
//   const digest = crypto.subtle
//     .digest("sha1", msgUint8)
//     .then((response) => new TextDecoder().decode(response))
//     .catch((e) => {
//       if (e instanceof DOMException) {
//         throw new NotSupportedError();
//       }
//       return e;
//     });
//   return await digest;
// }
/**
 * JsSHAによる実装。
 * 指定されたdataからハッシュを求めて返却する。
 * ハッシュ関数はsha1、返却するハッシュのデータ形式はBase64。
 * @param {string} data 計算するデータ。
 * @return {string} 生成されたハッシュ。Base64。*/

function digestJsSHA(data: string): string {
  const hash: jsSHA = new jsSHA("SHA-1", "TEXT");
  hash.update(data);
  return hash.getHash("B64");
}
