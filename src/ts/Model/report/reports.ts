import { ArgumentError, KeyNotFoundError } from "src/ts/Model/Error";
import { Settings } from "./settings";
import { ExistsReportBuilder } from "./reportBuilder";
import { Serializable } from "src/ts/Model/convertToEasySavable";
import { DayReport } from "./DayReport";

/**レポートの管理を行うクラス。*/
export class Reports implements Serializable<Reports> {
  /** @param {Map<number,DayReport>} dayReports レポートの連想配列。*/
  private dayReports: Map<number, DayReport>;
  /** @param {Settings} settings 設定。*/
  public settings: Settings;
  private _lastDay: number;
  /** 最新のレポートの日付 */
  public get lastDay(): number {
    return this._lastDay;
  }
  /**
   * @param {Settings} settings すでに設定が存在する場合は引き渡す。存在しない場合、Settingsを新しく作成する。
   * @param {Map<number,DayReport>} dayReports すでにレポートが存在する場合は引き渡す。
   * 存在しない場合、1日目だけ入れた連想配列を作成する。 */
  constructor(
    settings: Settings = new Settings(),
    dayReports: Map<number, DayReport> = new Map<number, DayReport>().set(
      1,
      new ExistsReportBuilder(1, settings.adjustOnUnitOfDay(1), "").build()
    ),
    _lastDay: number = 1
  ) {
    this.dayReports = dayReports;
    this.settings = settings;
    this._lastDay = _lastDay;
  }
  /**
   * レポートを連想配列に追加する。
   * @param {DayReport} report 追加するレポート
   * @throws {ArgumentError} すでに存在する日付を追加しようとした。*/
  add = (report: DayReport): void => {
    if (this.dayReports.has(report.day)) {
      throw new ArgumentError(
        "day = " + String(report.day) + "の要素は既に存在します"
      );
    }
    this.dayReports.set(report.day, report);
    this._lastDay = this._lastDay >= report.day ? this._lastDay : report.day;
  };

  /**
   * 指定した日付のレポートを取得する。
   * @param {number} day 取得したい日付。
   * @return {DayReport} 取得するDayReport。存在しない場合はKeyNotFoundErrorを返す。
   * @throws {KeyNotFoundError} その日付のレポートは存在しない*/
  get = (day: number): DayReport => {
    const report = this.dayReports.get(day);
    if (report == undefined) {
      throw new KeyNotFoundError(
        "day = " + String(day) + "の要素は存在しません"
      );
    }
    return report;
  };

  /**
   * 指定したインデックスのレポートを削除する。
   * レポートの前後が存在するならそれを直接つなげる。前後のレポートが自身を参照しているなら、その参照を削除する。
   * @param {number} day 削除するレポートの日付
   * @returns {boolean} 削除したならtrue、しなかったならfalse。 */
  delete = (day: number): boolean => {
    try {
      const report = this.get(day);

      const previous =
        report.previous != undefined ? this.get(report.previous) : undefined;
      const next = report.next != undefined ? this.get(report.next) : undefined;
      if (this._lastDay !== day && previous !== undefined) {
      }
      // 最新日が削除する日と同じかつ前日が存在するなら前日に置き換える。
      this._lastDay =
        this._lastDay === day && previous !== undefined
          ? previous.day
          : this._lastDay;
      // 前後にレポートが存在するならそれらを繋げる。
      if (previous != undefined && next != undefined) {
        previous.next = next.day;
        next.previous = previous.day;
      }
      // 前後のレポートが自身を参照しているなら、その参照を削除する。
      if (previous != undefined && previous.next === report.day) {
        previous.next = undefined;
      }
      if (next != undefined && next.previous === report.day) {
        next.previous = undefined;
      }
      return this.dayReports.delete(day);
    } catch (e) {
      if (e instanceof KeyNotFoundError) {
        return false;
      }
      throw e;
    }
  };
  /**
   * レポートの状態を初期状態にもどす。
   * @param storageKey ローカルストレージに保存するためのKey
   */
  clear = (storageKey?: string | undefined) => {
    this.dayReports.clear();
    this.settings = new Settings(storageKey);
    this.dayReports.set(
      1,
      new ExistsReportBuilder(1, this.settings.adjustOnUnitOfDay(1)).build()
    );
    this._lastDay = 1;
  };
  /**
   * デシリアライズした結果を自分自身に代入して返却する。
   * 型推論が使えないため、プロパティが存在するとは限らないので注意が必要。
   * @param input シリアライズされた文字列。
   * @returns inputからデシリアライズしてプロパティに値を代入した自分自身。
   * @see {@link Serializable.deserialize}
   */
  deserialize = (input: Reports): Reports => {
    this.settings = this.settings.deserialize(input.settings);
    const builtDayReport = [...input.dayReports].map(
      (v, k): [number, DayReport] => [
        v[0],
        new ExistsReportBuilder().deserialize(v[1]),
      ]
    );
    this.dayReports = new Map<number, DayReport>(builtDayReport);
    this._lastDay = input.lastDay;
    return this;
  };
  /**
   * JSONに変換する。JSON.stringifyで自動的に呼び出される。
   * dayReportsはMapなのでArrayに変換しないとシリアライズされないので実装している。
   * @returns {object} シリアライズされるオブジェクト。
   */
  toJSON = (): object => {
    return {
      settings: this.settings,
      dayReports: [...this.dayReports],
      lastDay: this._lastDay,
    };
  };
}
