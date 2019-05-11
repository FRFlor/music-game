// Based on: https://developers.google.com/youtube/iframe_api_reference#playVideoAt
export interface YoutubeAPI {
    mute(): Promise<void>;

    unMute(): Promise<void>;

    isMuted(): Promise<void>;

    setVolume(volume: number): Promise<void>;

    getVolume(): Promise<number>;

    getPlaybackRate(): Promise<void>;

    setPlaybackRate(suggestedRate: number): Promise<void>;

    playVideo(): Promise<void>;

    getDuration(): Promise<number>;

    pauseVideo(): Promise<void>;

    stopVideo(): Promise<void>;

    seekTo(seconds: number, allowSeekAhead: boolean): Promise<void>;
}
