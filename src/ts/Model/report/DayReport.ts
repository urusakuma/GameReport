import { digest } from "src/ts/Model/hash";

/** 日ごとのレポート*/
export class DayReport {
  readonly day: number;
  reportTitle: string = "";
  report: string = "";
  previous: number | undefined;
  next: number | undefined;
  private readonly defaultHash: string;
  /**
   * @constructor
   * @param {number} day 日付。
   * @param {string} reportTitle タイトル。
   * @param {string} report レポート。
   * @param {?number} previous 前日のレポートの日付。
   * @param {?number} next 翌日のレポートの日付。*/
  constructor(
    day: number,
    reportTitle: string,
    report: string,
    previous: number | undefined,
    next: number | undefined
  ) {
    this.day = day;
    this.reportTitle = reportTitle;
    // レポートが""の状態でデフォルトハッシュを定めておくことで、
    // このインスタンスのレポートが元々編集されていてもisEditedが無編集と誤判定を出さないようにしている。
    this.defaultHash = this.calcHash();
    this.report = report;
    this.previous = previous;
    this.next = next;
  }
  /**
   * 編集されているか判定する。
   * タイトルとレポートを全て消している場合は編集されていないものとする。
   * 入力が行われてもタイトルとレポートを初期状態に戻している場合も編集されていないものとする。
   * @return {boolean} 編集されているならtrue、されていないならfalse。*/
  isEdited = (): boolean => {
    return !(
      (this.reportTitle === "" && this.report === "") ||
      this.defaultHash === this.calcHash()
    );
  };
  /** ハッシュを計算する。
   * @return {string} タイトルとレポートから計算されるハッシュ値 */
  private calcHash = (): string => {
    const data: string = this.reportTitle + this.report;
    return digest(data);
  };
  /**
   * JSONに変換する。JSON.stringifyで自動的に呼び出される。
   * defaultHashを保存する必要がないので実装している。
   * @returns {object} シリアライズされるオブジェクト。
   */
  toJSON = (): object => {
    return {
      day: this.day,
      reportTitle: this.reportTitle,
      report: this.report,
      previous: this.previous,
      next: this.next,
    };
  };
}
