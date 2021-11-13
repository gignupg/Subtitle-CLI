import inquirer from "inquirer";

interface Answers {
    file: string;
    srt?: string;
    mkv?: string;
}

async function dialog(selectableFiles: string[]) {
    const questions = [
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
            when(answers: Answers) {
                return /^.*\.(srt)$/i.test(answers.file);
            }
        },
        {
            type: 'list',
            name: 'mkv',
            message: 'Select an action:',
            choices: ['Extract Subtitles'],
            when(answers: Answers) {
                return /^.*\.(mkv)$/i.test(answers.file);
            }
        },
    ];

    const answers = await inquirer.prompt(questions);
    console.log('answers:', answers);
}

export default dialog;