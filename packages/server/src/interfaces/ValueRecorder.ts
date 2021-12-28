import { MetricTag } from './MetricTag';

export interface ValueRecorder {
    name: string;
    createdTimestamp: number;
    lastUpdatedTimestamp: number;
    values: number[];
    ownerName: string;
    ownerAppName: string;
    tags: MetricTag[];
}
