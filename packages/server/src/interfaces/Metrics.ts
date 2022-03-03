import { BucketHistogram } from './BucketHistogram';
import { UpCounter } from './UpCounter';
import { ValueRecorder } from './ValueRecorder';

export interface Metrics {
    bucketHistograms: BucketHistogram[];
    upCounters: UpCounter[];
    valueRecorders: ValueRecorder[];
}
