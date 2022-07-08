import { Settings } from "./settings";
import { DayReport } from "./DayReport";
import { Serializable } from "src/ts/Model/convertToEasySavable";

/** レポートを組み立てる抽象クラス。レポートの作成方法を複数提示し、DayReportを作成する。*/
export abstract class ReportBuilder {
  /** @param {number} day 日付。reportTitleに書かれるが、dayは編集されない。次のReportを作成するのに使用する。ユニーク。*/
  private day: number;
  /** @param {string} reportTitle タイトル。*/
  private reportTitle: string;
  /** @param {string} report レポート。*/
  private report: string;
  /** @param {?number} previous 前日のレポートの日付。*/
  private previous: number | undefined;
  /** @param {?number} previous 翌日のレポートの日付。*/
  private next: number | undefined;
  /**
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
    this.report = report;
    this.previous = previous;
    this.next = next;
  }
  /**
   * レポートを生成して返却する。
   * @return {DayReport} 生成したレポート */
  build = (): DayReport => {
    return new DayReport(
      this.day,
      this.reportTitle,
      this.report,
      this.previous,
      this.next
    );
  };
}
/** レポートを生成元のレポートと設定から組み立てるクラス。 */
export class FromSourceOfReportBuilder extends ReportBuilder {
  /**
   * @param {DayReport} source 生成元のレポート。
   * @param {Settings} settings 設定。
   * @param {boolean} isSourceThePreviousDayReport sourceが前日のDayReportならtrue */
  constructor(
    source: DayReport,
    settings: Settings,
    isSourceThePreviousDayReport: boolean = true
  ) {
    let day: number;
    let previous: number | undefined;
    let next: number | undefined;

    if (isSourceThePreviousDayReport) {
      day = source.day + settings.dayInterval;
      previous = source.day;
      next = undefined;
    } else {
      day = source.day - settings.dayInterval;
      previous = source.previous;
      next = source.day;
    }
    const reportTitle = settings.adjustOnUnitOfDay(day);
    super(day, reportTitle, "", previous, next);
  }
}
/**
 * レポートを既に存在するデータから組み立てるクラス。
 * このクラスでレポートを組み立てた時に、reportが""でないならisEditedはcreate直後でもtrueになる。
 * 初日のレポートもこれで作成すること。
 */
export class ExistsReportBuilder
  extends ReportBuilder
  implements Serializable<DayReport>
{
  /**
   * @param {number} day
   * @param {string} reportTitle
   * @param {string} report
   * @param {?number} previous 前日のレポートの日付。
   * @param {?number} next 翌日のレポートの日付。*/
  constructor(
    day: number = 0,
    reportTitle: string = "",
    report: string = "",
    previous: number | undefined = undefined,
    next: number | undefined = undefined
  ) {
    super(day, reportTitle, report, previous, next);
  }
  /**
   * デシリアライズした結果をビルドしてDayReportを返却する。
   * 型推論が使えないため、プロパティが存在するとは限らないので注意が必要。
   * @param {string} input シリアライズされた文字列。
   * @returns {DayReport} inputからデシリアライズしてビルドしたDayReport。
   * @see {@link Serializable.deserialize}
   */
  deserialize(input: DayReport): DayReport {
    return new ExistsReportBuilder(
      input.day,
      input.reportTitle,
      input.report,
      input?.previous,
      input?.next
    ).build();
  }
}
