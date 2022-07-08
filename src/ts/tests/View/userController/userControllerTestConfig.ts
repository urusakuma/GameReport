export const SERIALIZED_STRING =
  "N4IgzgpgLlCWB2BzMIBcoxQPYCcCGiEA0hAJ5oiJ4C2EA+gAwgA0IAJnqQJLxQQ4A3PABs0ARlYAHYZwDiNCByh4AcgoqAxhkCdDIAmGFiACu8WFADyAMwAinNKCMm0AbRCBT00B3biAC6rAMKkAxsIQPACqxlA+ABZ4SBAoqGIAvomsHKQAShCSuFDxjo4SoGnirDhZOQAqJkEUYu76Zdk4UBT68BAAHi2oAEyJ3o49zEU2vaXlzVVQNaggPfXjTd0g+pJlArBYBvESIO1daADM-cyOh8Pso+cgjZXVEBSHCzcTy6vrm9tofZ6eiUA";
export const SAVE_DATA_FOR_SAVE_AND_LOAD = Array<Array<string>>(
  Array(
    "test_1",
    "N4IgzgpgLlCWB2BzMIBcoxQPYCcCGiEA0hAJ5ohQSYD6AjCADQgAmepAkvFTgG54AbNHWYAHAewDieALYQ2UPADlZECoCaGQD8MgA4ZA4wybA-QwNmAV3iwoAeQBmAEXZpQZi2gDaIQKemgO7cQAXWYAwqQAxgIQXACq5lABABZ4SNTCAL7JzGykAEoQorhQKKiuriKgGcLMODl5ACoWYRR03gAEgGMMgJ0MgBMMTCCVuThQFIDdDJqAawyAtwyagJMMgBSugHYM7R2ASQyAOvKACEYgyb6+yUA",
    "ゲームデータ1"
  ),
  Array(
    "test_2",
    "N4IgzgpgLlCWB2BzMIBcoxQPYCcCGiEA0hAJ5ohQSYD6ATCADQgAmepAkvFTgG54AbNAEZmABwHsA4ngC2ENlDwA5ORAqAmhkA-DIAOGQOMMWwP0MDZgFd4sKAHkAZgBF2aUOctoA2iECtDIBKGQPUMga4YQAF1mAGFSAGMBCC4AVQsoUIALPCRqEQBfDOY2UgAlCDFcKBRUNzdRUFyRZhxC4oAVS2iKYR8AgAJAMYZAToZACYYmEDqinCgKQG6GLUA1hkBbhi1ASYZACldAOwZevsAkhkAdeUAEIxAMoKCMoA",
    "ゲームデータ2"
  )
);

const REPORT_MAIN = `<h1 id="currentGameDataName" data-current-game-data-name="default_0">テスト</h1>
<ul id="reportsList">
  <li data-day="1">
    <span>1日目</span>
    <button class="btnSquare">×</button>
  </li>
  <li data-day="2">
    <span>2日目</span>
    <button class="btnSquare">×</button>
  </li>
</ul>
<input id="reportTitle" type="text" value="レポートのタイトル">
<button id="removeReport" class="btnSquare">×</button>
<textarea id="report" data-current-day="1">レポートの内容</textarea>
`;

const SETTING_AREA = `<div id="settingArea" class="overlays">
  <h2>設定</h2>
  <h3>ゲームデータの名前</h3>
  <input id="playGameDataName" type="text" class="textfield">
  <h3>新しく作るレポートの間隔</h3>
  <input type="range" min="1" max="23" step="1" value="1" id="dayInterval" class="textfield">
  <div id="dayIntervalResult" class="textCenterBlock">1</div>
  <h3>日にちの単位</h3>
  <input type="text" id="unit">
  <input type="range" min="0" max="4" step="1" value="0" id="amountInUnit">
  <ol id="unitsOfDayList">
  </ol>
  <button id="settingSavebtn" class="button">保存</button>
</div>`;

const LOADING_AREA = `<div id="loadingArea" class="overlays">
  <select id="loadingDropDownList" class="dropDownList">
  </select>
  <button id="loadbtn" class="button">ロード</button>
</div>
`;
const DELETE_BUTTON = `<button id="deletebtn" class="button">削除</button>`;
const CREATE_NEW_SAVE_DATA = `<div id="createNewSaveData" class="overlays">
  <input type="text" id="inputNewSaveData" class="textfield">
  <div class="sideBySide">
      <button id="createbtn" class="button">作成</button>
  </div>
</div>`;
const EXPORT_TEXTAREA = `<textarea id="exportOutput" readonly></textarea>`;
const IMPORT_BUTTON = `<textarea id="importInput"></textarea>
<button id="importbtn" class="button">作成</button>`;

export const INNER_HTML_TEMPLATE =
  REPORT_MAIN +
  SETTING_AREA +
  LOADING_AREA +
  DELETE_BUTTON +
  CREATE_NEW_SAVE_DATA +
  EXPORT_TEXTAREA +
  IMPORT_BUTTON;
