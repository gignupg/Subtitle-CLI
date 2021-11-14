interface Answers {
    file: string;
    srt?: string;
    mkv?: string;
    space?: number;
}

interface Action {
    audacityLabel: 'audacity label';
    silenceCount: 'silence count';
    extractSubs: 'extract subtitles';
}