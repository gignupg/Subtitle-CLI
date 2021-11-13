import inquirer from "inquirer";
import { getSelectableFiles } from "./utils/getSelectableFiles";

const currWorkingDir = process.cwd();
const selectableFiles = getSelectableFiles(currWorkingDir);

if (selectableFiles) {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'file',
                message: 'Select a file:',
                choices: selectableFiles
            },
            {
                type: 'list',
                name: 'srt',
                message: 'Select an action:',
                choices: ['Audacity Label', 'Silence Count'],
                when(answers) {
                    return /^.*\.(srt)$/i.test(answers.file);
                }
            },
            {
                type: 'list',
                name: 'mkv',
                message: 'Select an action:',
                choices: ['Extract Subtitles'],
                when(answers) {
                    return /^.*\.(mkv)$/i.test(answers.file);
                }
            },
        ])
        .then((answers) => {
            console.log(JSON.stringify(answers, null, '  '));
        });
}