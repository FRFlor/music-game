import { Vue } from 'vue-property-decorator';
import { PlayerState, YoutubeAPI } from '../interfaces/YoutubeAPI';
export { YoutubeAPI };
export default class VideoPlayer extends Vue implements YoutubeAPI {
    protected videoId: string;
    protected isReady: boolean;
    selectVideo(videoId: string): Promise<void>;
    playVideo(): Promise<void>;
    pauseVideo(): Promise<void>;
    stopVideo(): Promise<void>;
    mute(): Promise<void>;
    unMute(): Promise<void>;
    isMuted(): Promise<void>;
    getVolume(): Promise<number>;
    getPlaybackRate(): Promise<void>;
    getPlayerState(): Promise<PlayerState>;
    setPlaybackRate(suggestedRate: number): Promise<void>;
    getDuration(): Promise<number>;
    seekTo(seconds: number, allowSeekAhead: boolean): Promise<void>;
    setVolume(volume: number): Promise<void>;
    protected pollUntilTrue(cb: () => Promise<boolean>): Promise<void>;
    protected untilPlayerIsReady(): Promise<void>;
    protected untilVideoStartsPlaying(): Promise<void>;
    protected readonly player: YoutubeAPI;
}
