import { Vue } from 'vue-property-decorator';
export default class GameTimer extends Vue {
    private value;
    private success;
    private interval;
    private startValue;
    private progress;
    start(): void;
    stop(): void;
    readonly isPlaying: boolean;
    private readonly timerColour;
}
