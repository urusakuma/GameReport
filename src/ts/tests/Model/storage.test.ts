import { ArgumentError } from "src/ts/Model/Error";
import { Storage } from "src/ts/Model/storage";

describe("Storage", () => {
  const serStr =
    "N4IgzgpgLlCWB2BzMIBcoxQPYCcCGiEA0hAJ5ohQSYD6ADCADQgAmepAkvFTgG54AbNAEZmABwHsA4ngC2ENlDwA5ORAqAxhkCdDIAmGJiACu8WFADyAMwAi7NKCMm0AbRCBT00B3biAC6zAMKkAxgIQXACqxlA+ABZ4SNQiAL7xzGykAEoQYrhQKKiOjqKgKSLMOBlZAComQZq6+qWZOFA1OoBJDIA68oAIRiDxnp7xQA";
  const reportsAlreadyIncluded =
    "N4IgzgpgLlCWB2BzMIBcoAmBDAngSXiggCcA3LAGzQEYAaEABwtwHEsBbCbKLAOQ4hoQgYUVAoAyBTRUDGDIDMGQCIMgaIZANwyBdhkA-DIAmGEPQCu8WFADyAMwAiuNKF360AbRCBT00B3biAC69AMI4AxhQgEAqnpQ7gAWWEgQKKjUAL70pCRgsAD28GgADHEg2DgAShAMycRQUTY2dJjm0fTEBUVQACr6vkLUTlogtYXFQh3wEAAeUGgATDFuNiO0lTijNXXFTVAtqCAj7fPdw6sdDLWkKdpRdCD9Q2gAzOO0NhfT2VV3nQuNzYKrFxvPW730exAHZJHUbjFwxIA";
  const reportToDelete =
    "N4IgzgpgLlCWB2BzMIBcoAmBDAngSXiggCcA3LAGzQEYAaEABwtwHEsBbCbKLAOQ4hoQgKSVAJmmBNBkDRDIG6GQD8MgNYZA4wyzA-Qwh6AV3iwoAeQBmAEVxpQWnWgDaIQKemgO7cQAXXoBhHAGMKEAgFVtUFwALLCQIFFRqAF96UhIwWAB7eDQABmiQbBwAJQgGBOIocMtLOkwTCPpiXPyoABUdLyFqe3UQKryCoVb4CAAPKDQAJkjnS0HaMpwhyuqC+qhG1BBBlpmOgaXWhirSRI1wuhAe-rQAZhHaS1OJjPLrttm6hsEl09WH9a76bYhdhP2hiNHJEgA";

  test("ローカルストレージからキーのリストを確認する", () => {
    localStorage.setItem("currentGameDataName", "元々入っているレポート");
    localStorage.setItem("元々入っているレポート", reportsAlreadyIncluded);
    localStorage.setItem("削除するセーブデータ", reportToDelete);
    localStorage.setItem("不正なセーブ", "不正なセーブデータ");
    localStorage.setItem(
      "gameDataNameList",
      '[{"storageKey":"元々入っているレポート","playGamedataName":"' +
        localStorage.getItem("元々入っているレポート") +
        '"},{"storageKey":"削除するセーブデータ","playGamedataName":"' +
        localStorage.getItem("削除するセーブデータ") +
        '"},{"storageKey":"不正なセーブ","playGamedataName":"' +
        localStorage.getItem("不正なセーブ") +
        '"}]'
    );
    Storage.instance.import(serStr);
    const gameDataNames = Storage.instance.gameDataNames;
    expect(
      gameDataNames.find((item: Item) => {
        return item.storageKey == "元々入っているレポート";
      })
    ).not.toBeUndefined();
    expect(
      gameDataNames.find((item) => {
        return item.storageKey == "削除するセーブデータ";
      })
    ).not.toBeUndefined();
    expect(
      gameDataNames.find((item) => {
        return item.storageKey == "不正なセーブ";
      })
    ).not.toBeUndefined();
  });
  test("レポートをローカルストレージに保存する", () => {
    localStorage.setItem("currentGameDataName", "元々入っているレポート");
    localStorage.setItem("元々入っているレポート", reportsAlreadyIncluded);
    localStorage.setItem("削除するセーブデータ", reportToDelete);
    localStorage.setItem("不正なセーブ", "不正なセーブデータ");
    Storage.instance.import(serStr);
    const reports1 = Storage.instance.reports;
    Storage.instance.save();
    Storage.instance.load("test_0");
    const reports2 = Storage.instance.reports;
    expect(JSON.stringify(reports1)).toStrictEqual(JSON.stringify(reports2));
  });
  test("セーブデータをインポートする", () => {
    localStorage.setItem("currentGameDataName", "元々入っているレポート");

    localStorage.setItem("元々入っているレポート", reportsAlreadyIncluded);
    localStorage.setItem("削除するセーブデータ", reportToDelete);
    localStorage.setItem("不正なセーブ", "不正なセーブデータ");
    Storage.instance.import(serStr);
    const reports1 = Storage.instance.reports;
    Storage.instance.import(serStr);
    const reports2 = Storage.instance.reports;
    expect(JSON.stringify(reports1)).toStrictEqual(JSON.stringify(reports2));
  });
  test("セーブデータをエクスポートする", () => {
    localStorage.setItem("currentGameDataName", "元々入っているレポート");
    localStorage.setItem("元々入っているレポート", reportsAlreadyIncluded);
    localStorage.setItem("削除するセーブデータ", reportToDelete);
    localStorage.setItem("不正なセーブ", "不正なセーブデータ");
    Storage.instance.import(serStr);

    Storage.instance.load("test_0");
    const exportStr = Storage.instance.export();
    expect(exportStr).toBe(serStr);
  });
  test("セーブデータを削除する", () => {
    localStorage.setItem("currentGameDataName", "元々入っているレポート");

    localStorage.setItem("元々入っているレポート", reportsAlreadyIncluded);
    localStorage.setItem("削除するセーブデータ", reportToDelete);
    localStorage.setItem("不正なセーブ", "不正なセーブデータ");
    Storage.instance.import(serStr);
    Storage.instance.remove("削除するセーブデータ");

    expect(() => Storage.instance.load("削除するセーブデータ")).toThrow(
      ArgumentError
    );
    expect(() => Storage.instance.load("削除するセーブデータ")).toThrow(
      new ArgumentError(
        "Key = 削除するセーブデータの要素はローカルストレージに存在しません"
      )
    );
  });

  test("セーブデータを新規作成する", () => {
    localStorage.setItem("currentGameDataName", "元々入っているレポート");
    localStorage.setItem("元々入っているレポート", reportsAlreadyIncluded);
    localStorage.setItem("削除するセーブデータ", reportToDelete);
    localStorage.setItem("不正なセーブ", "不正なセーブデータ");
    Storage.instance.import(serStr);

    const oldStorageKey = Storage.instance.reports.settings.storageKey;

    Storage.instance.create("新規作成");
    expect(Storage.instance.reports.settings.storageKey).not.toBe(
      oldStorageKey
    );
    expect(Storage.instance.reports.settings.playGamedataName).toBe("新規作成");
  });
  test("不正なセーブを読み込む", () => {
    localStorage.setItem("currentGameDataName", "元々入っているレポート");

    localStorage.setItem("元々入っているレポート", reportsAlreadyIncluded);
    localStorage.setItem("削除するセーブデータ", reportToDelete);
    localStorage.setItem("不正なセーブ", "不正なセーブデータ");
    Storage.instance.import(serStr);
    expect(() => Storage.instance.load("不正なセーブ")).toThrowError(
      SyntaxError
    );
    expect(new Array("不正なセーブ")).toEqual(
      expect.not.arrayContaining(Storage.instance.gameDataNames)
    );
  });
  describe("存在しないセーブデータに関するテスト", () => {
    test("存在しないデータをローカルストレージから読み込んでエラーを吐く", () => {
      localStorage.setItem("currentGameDataName", "元々入っているレポート");
      localStorage.setItem("元々入っているレポート", reportsAlreadyIncluded);
      localStorage.setItem("削除するセーブデータ", reportToDelete);
      localStorage.setItem("不正なセーブ", "不正なセーブデータ");
      Storage.instance.import(serStr);
      expect(() => Storage.instance.load("存在しないデータ")).toThrow(
        ArgumentError
      );
      expect(() => Storage.instance.load("存在しないデータ")).toThrow(
        new ArgumentError(
          "Key = 存在しないデータの要素はローカルストレージに存在しません"
        )
      );
    });
    test("存在しないセーブデータを削除する", () => {
      localStorage.setItem("currentGameDataName", "元々入っているレポート");
      localStorage.setItem("元々入っているレポート", reportsAlreadyIncluded);
      localStorage.setItem("削除するセーブデータ", reportToDelete);
      localStorage.setItem("不正なセーブ", "不正なセーブデータ");
      Storage.instance.import(serStr);
      Storage.instance.remove("存在しないデータ");
    });
  });
});

class Item {
  storageKey: string;
  playGamedataName: string;
  constructor(storageKey: string, playGamedataName: string) {
    this.storageKey = storageKey;
    this.playGamedataName = playGamedataName;
  }
}
