const execSync = require('child_process').execSync;
const currWorkingDir = process.cwd();

export default function extractSubtitles(file: string, track: string) {
    const cmd = `mkvextract tracks "${currWorkingDir}/${file}" ${track}:"${currWorkingDir}/extracted-subtitles.srt"`;
    const options = { encoding: 'utf8' };
    execSync(cmd, options);
}