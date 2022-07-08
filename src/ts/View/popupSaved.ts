import { Storage } from "../Model/storage";
export function savedOnWindow() {
  Storage.instance.save();
  popupSaved();
}
function popupSaved() {
  $("#isSaved").fadeIn(500, () => $("#isSaved").fadeOut(500));
}
