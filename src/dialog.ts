import inquirer from "inquirer";
import createAudacityLabel from "./actions/audacityLabel/createAudacityLabel";
import createSubtitlesWithSilence from "./actions/silenceCount/createSubtitlesWithSilence";
import extractSubtitles from "./actions/subtitleExtractor/extractSubtitles";
import getSubtitleTracks from "./actions/subtitleExtractor/getSubtitleTracks";

const AUDACITY_LABEL = 'Audacity Label';
const SILENCE_COUNT = 'Silence Count';

async function dialog(selectableFiles: string[]) {
    // Writing the questions object directly inside the prompt to get TypeScript support!
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'file',
            message: 'Select a File:',
            choices: selectableFiles
        },
        {
            type: 'list',
            name: 'srt',
            message: 'Select an Action:',
            choices: [AUDACITY_LABEL, SILENCE_COUNT],
            when(answers: Answers) {
                return /^.*\.(srt)$/i.test(answers.file);
            }
        },
        {
            type: 'list',
            name: 'mkv',
            message: 'Extract Subtitles Track::',
            choices(answers: Answers) {
                const subtitleTracks = getSubtitleTracks(answers.file);
                return subtitleTracks;
            },
            when(answers: Answers) {
                return /^.*\.(mkv)$/i.test(answers.file);
            }
        },
        {
            type: 'number',
            name: 'space',
            message: 'Subtitle Spacing:',
            default: 0.5,
            when(answers: Answers) {
                return answers.srt === AUDACITY_LABEL;
            }
        },
    ]);

    const { file, srt, mkv, space } = answers;

    if (srt === AUDACITY_LABEL) {
        createAudacityLabel(file, space);

    } else if (srt === SILENCE_COUNT) {
        createSubtitlesWithSilence(file);

    } else if (mkv) {
        extractSubtitles(file, mkv[0]);

    } else {
        console.warn('Invalid selection at dialog.ts!');
    }
}

export default dialog;
