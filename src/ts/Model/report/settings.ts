import { Serializable } from "src/ts/Model/convertToEasySavable";
/** 設定を保存しておくクラス。 */
export class Settings implements Serializable<Settings> {
  /**storageKeyはシリアライズで変更される可能性があるが外部からは編集されたくないので隠ぺいしている。 */
  private _storageKey: string = "";
  playGamedataName: string;
  private _dayInterval: number = 1;
  unitOfDay: UnitOfDay;
  /**
   * @param {string} storageKey ローカルストレージに保存したときのKey。
   * @param {string} playGamedataName 遊んでいるゲームデータの名前。セーブファイルの名前にもなる。
   * @param {number} dayInterval 新規レポートを作成した時に自動で入力されるdayの間隔。
   * 新しいレポートのDayは「参照したレポートのday+dayInterval」となる。
   * @param {UnitOfDay} unitOfDay 日の単位。
   */
  constructor(
    storageKey: string = config.DEFAULT_GAME_DATA_STORAGE_KEY,
    playGamedataName: string = "初期セーブデータ",
    dayInterval: number = 1,
    unitOfDay: UnitOfDay = new UnitOfDay()
  ) {
    this.storageKey = storageKey;
    this.playGamedataName = playGamedataName;
    this.dayInterval = dayInterval;
    this.unitOfDay = unitOfDay;
  }
  adjustOnUnitOfDay = (day: number) => {
    return this.unitOfDay.adjustOnUnitOfDay(day);
  };
  /**dayIntervalのゲッタ。
   * @return {number} dayInterval
   */
  get dayInterval() {
    return this._dayInterval;
  }
  /**dayIntervalのセッタ。0以下や整数で表せない値が入力された場合は1が入る。
   * @param {number} dayInterval
   */
  set dayInterval(interval: number) {
    if (interval <= 0 || !Number.isSafeInteger(Math.trunc(interval))) {
      this._dayInterval = 1;
      return;
    }
    this._dayInterval = Math.trunc(interval);
  }
  public get storageKey() {
    return this._storageKey;
  }
  private set storageKey(val: string) {
    this._storageKey = val;
  }
  /**
   * デシリアライズした結果を自分自身に代入して返却する。
   * 型推論が使えないため、プロパティが存在するとは限らないので注意が必要。
   * dayIntervalに不正な値が入らないようにセッターを使用して代入している。
   * @param input シリアライズされた文字列。
   * @returns inputからデシリアライズしてプロパティに値を代入した自分自身。
   * @see {@link Serializable.deserialize}
   */
  deserialize = (input: Settings): Settings => {
    this.storageKey = input.storageKey;
    this.dayInterval = input.dayInterval;
    this.playGamedataName = input.playGamedataName;
    this.unitOfDay = this.unitOfDay.deserialize(input.unitOfDay);
    return this;
  };
  /**
   * JSONに変換する。JSON.stringifyで自動的に呼び出される。
   * storageKeyとdayIntervalをゲッターセッターで隠ぺいしていて明示しないとシリアライズされないので実装している。
   * @returns {object} シリアライズされるオブジェクト。
   */
  toJSON = () => {
    return {
      storageKey: this.storageKey,
      dayInterval: this.dayInterval,
      playGamedataName: this.playGamedataName,
      unitOfDay: this.unitOfDay,
    };
  };
}
/**日の単位。ゲームによって日だったりサイクルだったりする。 */
export class UnitOfDay implements Serializable<UnitOfDay> {
  private _unit: Array<string>;
  amountInUnit: number;
  CycleInUnitChanges: number;
  /**
   * @param {Array<string>} unit 日付に付加される単位。unit[0]が全体の文字。[1]以降は周期によって変化する文字。
   * @param {number} CycleInUnitChanges 単位が変化する周期。
   */
  constructor(
    unit: Array<string> = config.DEFAULT_UNIT_OF_DAY,
    amountInUnit: number = 0,
    CycleInUnitChanges: number = 10
  ) {
    this._unit = unit;
    this.amountInUnit = amountInUnit;
    this.CycleInUnitChanges = CycleInUnitChanges;
  }
  public get unit(): Array<string> {
    return this._unit.concat();
  }
  setUnit(val: string, index: number) {
    this._unit[index] = val;
    if (val !== "") {
      this.amountInUnit = this.amountInUnit > index ? this.amountInUnit : index;
    } else {
      const filterLen = this.unit.filter(
        (str, i) => i >= index && str !== ""
      ).length;

      //後ろから""の数を数える。
      let amountunitIsNull = 0;
      const unitList = this.unit;
      for (let i = 0; i < this.unit.length; i++) {
        const isUnitEqualNull = unitList.pop() === "";
        if (!isUnitEqualNull) {
          break;
        }
        amountunitIsNull++;
      }
      this.amountInUnit =
        filterLen !== 0
          ? this.amountInUnit
          : this.unit.length - amountunitIsNull - 1;
    }
  }
  /**
   * 受け取った日付に単位を付加して返却する。メタ文字として$Y、$C、$D、$Nを使用。
   * $Y = dayをCycleInUnitChangesで割った数、$C = 周期的に付与される単位、
   * $D = dayをCycleInUnitChangesで割った余り、$N = レポートから渡される日付。
   * @param naturalDay レポートに記載されている日付
   * @returns 日付の単位を付加した文字列
   */
  adjustOnUnitOfDay = (naturalDay: number) => {
    if (this.amountInUnit === 0) {
      return String(naturalDay) + this.unit[0];
    }
    const year = String(
      Math.trunc(naturalDay / (this.CycleInUnitChanges * this.amountInUnit) + 1)
    );
    const d = Math.trunc(naturalDay % this.CycleInUnitChanges);
    const day = d === 0 ? this.CycleInUnitChanges : d;
    const c = Math.trunc((naturalDay - 1) / this.CycleInUnitChanges);
    const cycleIndex = (c % this.amountInUnit) + 1;
    const cycle = this.unit[cycleIndex];
    return this.unit[0]
      .replace(config.METACHARACTER_ON_UNIT_OF_YEAR, year)
      .replace(config.METACHARACTER_ON_UNIT_OF_CYCLE, cycle)
      .replace(config.METACHARACTER_ON_UNIT_OF_DAY, String(day))
      .replace(config.METACHARACTER_ON_UNIT_OF_NATURAL_DAY, String(naturalDay));
  };
  /**
   * デシリアライズした結果を自分自身に代入して返却する。
   * 型推論が使えないため、プロパティが存在するとは限らないので注意が必要。
   * @param input シリアライズされた文字列。
   * @returns inputからデシリアライズしてプロパティに値を代入した自分自身。
   * @see {@link Serializable.deserialize}
   */
  deserialize = (input: UnitOfDay): UnitOfDay => {
    this._unit = input.unit;
    this.amountInUnit = input.amountInUnit;
    this.CycleInUnitChanges = input.CycleInUnitChanges;
    return this;
  };
  /**
   * JSONに変換する。JSON.stringifyで自動的に呼び出される。
   * unitをゲッターセッターで隠ぺいしていて明示しないとシリアライズされないので実装している。
   * @returns {object} シリアライズされるオブジェクト。
   */
  toJSON = () => {
    return {
      unit: this._unit,
      amountInUnit: this.amountInUnit,
      CycleInUnitChanges: this.CycleInUnitChanges,
    };
  };
}

/**
 * 定数を管理するためのクラス。
 */
class config {
  static readonly DEFAULT_GAME_DATA_STORAGE_KEY = crypto.randomUUID();
  static readonly DEFAULT_UNIT_OF_DAY = new Array<string>(
    "日目",
    "",
    "",
    "",
    ""
  );
  static readonly METACHARACTER_ON_UNIT_OF_YEAR = "$Y";
  static readonly METACHARACTER_ON_UNIT_OF_CYCLE = "$C";
  static readonly METACHARACTER_ON_UNIT_OF_DAY = "$D";
  static readonly METACHARACTER_ON_UNIT_OF_NATURAL_DAY = "$N";
}
