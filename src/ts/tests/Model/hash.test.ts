import { digest } from "src/ts/Model/hash";

// aをSHA-1でハッシュ化しBase64で出力した結果 hvfkN/qlp/zhXR3cuerq6jd2Z7g=
describe("hash", () => {
  describe("digest()", () => {
    const resultHash = "hvfkN/qlp/zhXR3cuerq6jd2Z7g=";
    test("'a'をハッシュ化して正しい結果が出るか", () => {
      expect(digest("a")).toBe(resultHash);
    });
    test("'b'をハッシュ化してaのハッシュ化と異なる結果になるか", () => {
      expect(digest("b")).not.toBe(resultHash);
    });
  });
});
