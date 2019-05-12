import { Vue } from 'vue-property-decorator';
import { Link } from '../storage/links';
export default class AppFooter extends Vue {
    protected readonly links: Link[];
}
