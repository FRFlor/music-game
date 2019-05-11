// Based on: https://developers.google.com/youtube/iframe_api_reference#playVideoAt
export enum PlayerState {
    unstarted,
    ended,
    playing,
    paused,
    buffering,
    cued,
}

export interface YoutubeAPI {
    mute(): Promise<void>;

    unMute(): Promise<void>;

    isMuted(): Promise<void>;

    setVolume(volume: number): Promise<void>;

    getVolume(): Promise<number>;

    getPlaybackRate(): Promise<void>;

    getPlayerState(): Promise<PlayerState>;

    setPlaybackRate(suggestedRate: number): Promise<void>;

    playVideo(): Promise<void>;

    getDuration(): Promise<number>;

    pauseVideo(): Promise<void>;

    stopVideo(): Promise<void>;

    seekTo(seconds: number, allowSeekAhead: boolean): Promise<void>;
}
