import { Vue } from 'vue-property-decorator';
export default class GameTimer extends Vue {
    private value;
    private size;
    private success;
    private interval;
    private startValue;
    private progress;
    start(): void;
    stop(): void;
    readonly isPlaying: boolean;
    protected readonly timerColour: string;
    protected onTimerSizeChanged(): void;
    protected created(): void;
}
