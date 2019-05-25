import { Vue } from 'vue-property-decorator';
export default class GameTimer extends Vue {
    protected readonly timerColour: string;
    private value;
    private size;
    private success;
    private interval;
    private startValue;
    private progress;
    public start(): void;
    public stop(): void;
    protected onTimerSizeChanged(): void;
    protected created(): void;
}
