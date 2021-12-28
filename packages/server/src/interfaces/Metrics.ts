import { UpCounter } from './UpCounter';
import { ValueRecorder } from './ValueRecorder';

export interface Metrics {
    upCounters: UpCounter[];
    valueRecorders: ValueRecorder[];
}
