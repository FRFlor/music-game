// Based on: https://developers.google.com/youtube/iframe_api_reference#playVideoAt
export abstract class YoutubeAPI {
    public abstract async mute(): Promise<void>;
    public abstract async unMute(): Promise<void>;
    public abstract async isMuted(): Promise<void>;
    public abstract async setVolume(volume: number): Promise<void>;
    public abstract async getVolume(): Promise<number>;

    public abstract async getPlaybackRate(): Promise<void>;
    public abstract async setPlaybackRate(suggestedRate: number): Promise<void>;

    public abstract async playVideo(): Promise<void>;
    public abstract async pauseVideo(): Promise<void>;
    public abstract async stopVideo(): Promise<void>;
    public abstract async seekTo(seconds: number, allowSeekAhead: boolean): Promise<void>;
}
