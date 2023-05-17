import { MetricTag } from './MetricTag';

export interface UpCounter {
    name: string;
    createdTimestamp: number;
    lastUpdatedTimestamp: number;
    value: number;
    ownerName: string;
    ownerAppName: string;
    tags: MetricTag[];
}
