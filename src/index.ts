import getSelectableFiles from "./getSelectableFiles";
import dialog from "./dialog";

const currWorkingDir = process.cwd();
const selectableFiles = getSelectableFiles(currWorkingDir);

if (selectableFiles) dialog(selectableFiles);