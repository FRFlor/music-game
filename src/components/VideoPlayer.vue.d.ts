import { Vue } from 'vue-property-decorator';
import { PlayerState, YoutubeAPI } from '../interfaces/YoutubeAPI';
export default class VideoPlayer extends Vue implements YoutubeAPI {
    protected videoId: string;
    protected isReady: boolean;
    protected readonly player: YoutubeAPI;
    public selectVideo(videoId: string): Promise<void>;
    public playVideo(): Promise<void>;
    public pauseVideo(): Promise<void>;
    public stopVideo(): Promise<void>;
    public mute(): Promise<void>;
    public unMute(): Promise<void>;
    public isMuted(): Promise<void>;
    public getVolume(): Promise<number>;
    public getPlaybackRate(): Promise<void>;
    public getPlayerState(): Promise<PlayerState>;
    public setPlaybackRate(suggestedRate: number): Promise<void>;
    public setSize(width: number, height: number): Promise<void>;
    public getDuration(): Promise<number>;
    public seekTo(seconds: number, allowSeekAhead: boolean): Promise<void>;
    public setVolume(volume: number): Promise<void>;
    protected pollUntilTrue(cb: () => Promise<boolean>): Promise<void>;
    protected untilPlayerIsReady(): Promise<void>;
    protected untilVideoStartsPlaying(): Promise<void>;
}
