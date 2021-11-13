import fs from 'fs';

export const emptyDirWarning = "This directory doesn't contain any .mkv or .srt files!";
export const wrongArgsWarning = "Wrong args were passed into getListOfAvailableFiles()!";
export const badInputWarning = "Invalid dir was passed into fs.readdirSync()!";

export function getSelectableFiles(dir: string) {
    if (typeof dir === 'string') {
        let allFiles: string[] = [];

        try {
            allFiles = fs.readdirSync(dir);

            const selectableFiles = allFiles.filter(file => /^.*\.(srt|mkv)$/i.test(file));

            if (selectableFiles.length > 0) {
                return selectableFiles;

            } else {
                console.warn(emptyDirWarning);
            }

        } catch {
            console.warn(badInputWarning);
        }

    } else {
        console.warn(wrongArgsWarning);
    }
}