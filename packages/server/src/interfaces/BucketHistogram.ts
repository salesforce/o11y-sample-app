import { MetricTag } from './MetricTag';

export interface BucketHistogram {
    name: string;
    createdTimestamp: number;
    lastUpdatedTimestamp: number;
    values: number[];
    buckets: number[];
    ownerName: string;
    ownerAppName: string;
    tags: MetricTag[];
}