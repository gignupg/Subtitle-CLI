import fs from 'fs';
import path from 'path';
import { parse, map } from 'subtitle';
import detectCharacterEncoding from 'detect-character-encoding';

const currWorkingDir = process.cwd();

export default function createAudacityLabel(file: string, space: number | undefined) {
    if (file && space) {
        const fileName = path.join(currWorkingDir, file);

        // Encoding
        const fileBuffer = fs.readFileSync(fileName);
        const fileEncoding = detectCharacterEncoding(fileBuffer);

        let previousEnd = 0;

        if (fileEncoding) {
            // @ts-ignore
            const encoding = fileEncoding === "ISO-8859-1" ? "latin1" : "utf8";

            fs.createReadStream(fileName, encoding)
                .pipe(parse())
                .pipe(map((node) => {
                    if (node.type === 'cue') {
                        const silenceStart = previousEnd;
                        const elem = node.data;
                        const text = elem.text.replace(/\<\/*.*?\>/g, "");

                        const sentenceEnd = numberConverter(elem.end);
                        const sentenceStart = numberConverter(elem.start);

                        // Spot music, other sounds, and silence
                        const music = /\[.+\]/.test(text);   // The automated subtitles on Youtube use [Music] to indicate music and [Applause] and so on.
                        const includesWords = /\w/.test(text);

                        // If it's music or doesn't include any words
                        if (music || !includesWords) {
                            return null;

                            // If it's text and the silence gap is bigger than 2 seconds
                        } else if (sentenceStart - silenceStart > 2) {
                            previousEnd = sentenceEnd;
                            return `${silenceStart + space}\t\t${sentenceStart - space}\t\tSilence\n`;

                            // If it's text and the silence gap is smaller or equal to 2 seconds
                        } else if (sentenceStart - silenceStart <= 2) {
                            previousEnd = sentenceEnd;
                            return null;

                        } else {
                            return null;
                        }
                    }
                }))
                .pipe(fs.createWriteStream(`${currWorkingDir}/new-audacity-label.txt`, encoding));

        } else {
            console.warn('detectCharacterEncoding(fileBuffer) failed!');
        }

    } else {
        console.warn('createAudacityLabel() was called with insufficient arguments!');
    }
}

function numberConverter(num: string | number) {
    num = num.toString();
    return Number(num.slice(0, num.length - 3) + "." + num.slice(num.length - 3));
}