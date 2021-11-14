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

interface Track {
    codec: string;
    id: number;
    properties: {
        codec_id: string;
        codec_private_length: number;
        default_track: boolean;
        enabled_track: boolean;
        encoding: string;
        forced_track: boolean;
        language: string;
        minimum_timestamp: number;
        number: number;
        text_subtitles: boolean;
        uid: number;
    },
    type: string;
}