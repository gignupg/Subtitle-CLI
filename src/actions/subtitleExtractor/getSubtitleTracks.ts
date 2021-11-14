const execSync = require('child_process').execSync;
const currWorkingDir = process.cwd();

export default function getSubtitleTracks(file: string) {
    const cmd = `mkvmerge -J "${currWorkingDir}/${file}"`;
    const options = { encoding: 'utf8' };
    const trackObj = JSON.parse(execSync(cmd, options));
    const trackArr = trackObj.tracks;
    const subtitleTracks = trackArr.filter((track: Track) => track.type === 'subtitles');

    return subtitleTracks.map((track: Track) => `${track.id}: ${track.codec} (${track.properties.language.toUpperCase()})`);
}