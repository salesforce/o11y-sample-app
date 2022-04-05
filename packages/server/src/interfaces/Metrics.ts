import { BucketHistogram } from './BucketHistogram';
import { UpCounter } from './UpCounter';
import { ValueRecorder } from './ValueRecorder';
import { MetricTag } from './MetricTag';

export interface Metrics {
    bucketHistograms: BucketHistogram[];
    upCounters: UpCounter[];
    valueRecorders: ValueRecorder[];
    globalMetricTags: MetricTag[];
}
