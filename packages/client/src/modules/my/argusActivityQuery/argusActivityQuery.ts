import { api } from 'lwc';
import ArgusQueryBase from '../../shared/argusQueryBase';

export default class ArgusActivityQuery extends ArgusQueryBase {
    private _activityName: string;
    @api
    get activityName(): string {
        return this._activityName;
    }
    set activityName(value: string) {
        this._activityName = value;
        this.updateQuery();
    }

    protected getMetricName(): string {
        let tokens: string[] = [];
        if (this.loggerName) {
            tokens.push(this.argusEncode(this.loggerName));
        } else {
            tokens.push('*');
        }

        if (this.activityName) {
            tokens.push(`activity_${this.argusEncode(this.activityName)}`);
        } else {
            tokens.push('activity_*');
        }

        tokens.push(this.metricType);

        const metricName = tokens.join('.');
        return metricName;
    }
}
