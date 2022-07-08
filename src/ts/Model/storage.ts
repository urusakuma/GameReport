import { Reports } from "./report/reports";
import {
  convertToEasySavable,
  convertReceiveFromEasySavableIntoObject,
} from "./convertToEasySavable";
import { ArgumentError, NotSupportedError, QuotaExceededError } from "./Error";

export class Storage {
  private static _instance: Storage;
  private _gameDataNames: Array<Item>;
  private _reports: Reports;
  private constructor() {
    this._reports = new Reports();
    if (!isStorageAvailable()) {
      const notSprtMsg =
        "\nプライベートモードではデータの保存ができません。\n古いブラウザはサポートしていません。";
      this.save = () => {
        throw new NotSupportedError("セーブできません。" + notSprtMsg);
      };
      this.load = () => {
        throw new NotSupportedError("ロードできません。" + notSprtMsg);
      };
      this.remove = () => {
        throw new NotSupportedError("削除できません。" + notSprtMsg);
      };
      this.create = () => {
        throw new NotSupportedError("新規作成できません。" + notSprtMsg);
      };
      throw new NotSupportedError("セーブ＆ロードができません。" + notSprtMsg);
    }

    const l = localStorage.getItem("gameDataNameList");
    if (l === null) {
      this._gameDataNames = new Array<Item>(
        new Item(
          this._reports.settings.storageKey,
          this._reports.settings.playGamedataName
        )
      );
      return;
    }
    const listJson = JSON.parse(l);
    this._gameDataNames = listJson.map((element: Item) => {
      return new Item(element.storageKey, element.playGamedataName);
    });
    const cGameDataName = localStorage.getItem("currentGameDataName");
    if (cGameDataName !== null) {
      try {
        this.load(cGameDataName);
      } catch (error) {
        if (this._gameDataNames !== undefined) {
          this.load(this.gameDataNames[0].storageKey);
        }
      }
    } else {
      const savaStr = convertToEasySavable(this.reports);
      const key = this.reports.settings.storageKey;
      localStorage.setItem(key, savaStr);
      localStorage.setItem("currentGameDataName", key);
    }
    const hasItem =
      this.gameDataNames.filter(
        (i) => i.storageKey === this.reports.settings.storageKey
      ).length !== 0;
    if (hasItem) {
      return;
    }
    this._gameDataNames.push(
      new Item(
        this.reports.settings.storageKey,
        this.reports.settings.playGamedataName
      )
    );
  }
  /**
   * シングルトンのインスタンスを返却する。
   * @returns {Storage} シングルトンのインスタンス。
   */
  public static get instance(): Storage {
    if (this._instance == undefined) {
      this._instance = new Storage();
    }
    return Storage._instance;
  }
  public get reports(): Reports {
    return this._reports;
  }
  /**
   * ゲームデータ名のリストを値渡しで複製する。外部からの編集を防ぐため。
   * @returns {Array<Item>} ゲームデータ名のリストを値渡しで複製したもの。
   */
  get gameDataNames(): Array<Item> {
    return this._gameDataNames.concat();
  }

  /**
   * ローカルストレージにReportsを保存する。カレントのゲームデータ名も保存する。
   * ローカルストレージに対応していない場合、コンストラクタで例外を投げるだけの関数に書き換えられる。
   * @throws {QuotaExceededError} ローカルストレージの容量がいっぱい。
   * @throws {NotSupportedError} ローカルストレージに対応していない。
   */
  public save = (): void => {
    const savaStr = convertToEasySavable(this.reports);
    const key = this.reports.settings.storageKey;
    try {
      localStorage.setItem(key, savaStr);
      localStorage.setItem("currentGameDataName", key);
      localStorage.setItem(
        "gameDataNameList",
        JSON.stringify(this.gameDataNames)
      );
      const hasItem =
        this.gameDataNames.filter(
          (i) => i.storageKey === this.reports.settings.storageKey
        ).length !== 0;
      if (hasItem) {
        return;
      }
      const item = new Item(key, this.reports.settings.playGamedataName);
      this._gameDataNames.push(item);
    } catch (e) {
      //セーブデータのサイズオーバーだと思われる。ローカルストレージが使用できない場合はコンストラクタで弾かれている。
      if (e instanceof DOMException) {
        console.log(e.message);
        throw new QuotaExceededError(
          "データ容量がいっぱいです。ほかのレポートを削除してください"
        );
      }
      throw e;
    }
  };
  /**
   * ローカルストレージのKeyを指定し、ローカルストレージからReportsを読み込む。
   * 読み込みに失敗した場合はローカルストレージから削除しておく。
   * ローカルストレージに対応していない場合、コンストラクタで例外を投げるだけの関数に書き換えられる。
   * @param {string} key  読み込むゲームデータのキー。
   * @throws {ArgumentError} 要素がローカルストレージに存在しない。
   * @throws {NotSupportedError} ローカルストレージに対応していない。
   */
  public load = (key: string): void => {
    const loadStr = localStorage.getItem(key);
    if (loadStr === null) {
      this.remove(key);
      throw new ArgumentError(
        "Key = " + key + "の要素はローカルストレージに存在しません"
      );
    }
    try {
      const newReport = new Reports();
      convertReceiveFromEasySavableIntoObject(loadStr, newReport);
      this._reports = newReport;
      localStorage.setItem("currentGameDataName", key);
    } catch (error) {
      if (error instanceof ArgumentError || error instanceof SyntaxError) {
        this.remove(key); // 不正な値が格納されているので削除しておく。
      }
      throw error;
    }
  };
  /**
   * Reportsのデータを文字列に変換して出力する。
   * @returns {string} レポートを圧縮した文字列
   */
  public export = (): string => {
    return convertToEasySavable(this.reports);
  };
  /**
   * 文字列をユーザから直接受け取ってレポートに復号、複合出来たら代入する。
   * @param {string} val ユーザから受け取った文字列。
   * @throws {ArgumentError} 引数に復号できない文字列を渡された。
   * @throws {SyntaxError} 引数にデシリアライズできない文字列を渡された。
   */
  public import = (val: string): void => {
    try {
      const newReport = new Reports();
      convertReceiveFromEasySavableIntoObject(val, newReport);
      this._reports = newReport;
      this.save();
    } catch (error) {
      throw error;
    }
  };
  /**
   * ローカルストレージのKeyを指定し、ローカルストレージから削除する。gameDataNamesからも削除する。
   * ローカルストレージに対応していない場合、コンストラクタで例外を投げるだけの関数に書き換えられる。
   * @param {string} key 削除するゲームデータの名前。
   * @throws {NotSupportedError} ローカルストレージに対応していない。
   */
  public remove = (key: string): void => {
    localStorage.removeItem(key);
    this._gameDataNames = this.gameDataNames.filter(
      (item) => item.storageKey !== key
    );
    localStorage.setItem(
      "gameDataNameList",
      JSON.stringify(this.gameDataNames)
    );
  };
  /**
   * 新しいセーブデータを作り出す。
   * @param gameName 画面上に表示するゲームデータの名前
   * @throws {NotSupportedError} ローカルストレージに対応していない。
   */
  public create = (gameName: string): void => {
    Storage.instance.reports.clear(crypto.randomUUID());
    Storage.instance.reports.settings.playGamedataName = gameName;
    this.save();
  };
}

class Item {
  storageKey: string;
  playGamedataName: string;
  constructor(storageKey: string, playGamedataName: string) {
    this.storageKey = storageKey;
    this.playGamedataName = playGamedataName;
  }
}
/**
 * ローカルストレージが使用可能か判別する。MDNからほぼ丸々コピってきたのでそのまま使えるはず。
 * @returns {boolean} ローカルストレージが使用可能ならtrue、使用できないならfalse。
 */
function isStorageAvailable(): boolean {
  try {
    const x = "__storage_test__";
    localStorage.setItem(x, x);
    localStorage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      localStorage &&
      localStorage.length !== 0
    );
  }
}
