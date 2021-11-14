import fs from 'fs';
import path from 'path';
import { parse, map, formatTimestamp } from 'subtitle';
import detectCharacterEncoding from 'detect-character-encoding';

const currWorkingDir = process.cwd();

export default function createSubtitlesWithSilence(file: string) {
    if (file) {
        const fileName = path.join(currWorkingDir, file);

        // Encoding
        const fileBuffer = fs.readFileSync(fileName);
        const fileEncoding = detectCharacterEncoding(fileBuffer);

        if (fileEncoding) {
            // @ts-ignore
            const encoding = fileEncoding === "ISO-8859-1" ? "latin1" : "utf8";

            let count = 0;
            let prevEnd = 0;  // ms

            fs.createReadStream(fileName, encoding)
                .pipe(parse())
                .pipe(map((node) => {
                    if (node.type === 'cue') {
                        const elem = node.data;       // time in ms
                        const start = formatTimestamp(elem.start);   // time in srt format
                        const end = formatTimestamp(elem.end);       // time in srt format
                        const text = elem.text.replace(/\<\/*.*?\>/g, "");
                        const silence = Math.floor((elem.start - prevEnd) / 1000);   // in seconds

                        count++;

                        if (silence >= 10) {
                            let silenceStart = prevEnd;
                            let silenceEnd = prevEnd + 1000;

                            let silenceIndicator = `${count}\n${formatTimestamp(silenceStart)} --> ${formatTimestamp(silenceEnd)}\nSilence (${silence})\n\n`;

                            for (let i = silence - 1; i > 0; i--) {
                                count++;
                                silenceStart += 1000;
                                silenceEnd += 1000;

                                silenceIndicator += `${count}\n${formatTimestamp(silenceStart)} --> ${formatTimestamp(silenceEnd)}\nSilence (${i})\n\n`;
                            }

                            count++;
                            prevEnd = elem.end;

                            return silenceIndicator + `${count}\n${start} --> ${end}\n${text}\n\n`;

                        } else {
                            prevEnd = elem.end;
                            return `${count}\n${start} --> ${end}\n${text}\n\n`;
                        }
                    }
                }))
                .pipe(fs.createWriteStream(`${currWorkingDir}/subtitles-with-silence.srt`, encoding));

        } else {
            console.warn('detectCharacterEncoding(fileBuffer) failed!');
        }

    } else {
        console.warn('createSubtitlesWithSilence() was called with insufficient arguments!');
    }
}