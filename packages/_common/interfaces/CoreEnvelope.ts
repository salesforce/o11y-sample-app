import { StaticAttributes } from './StaticAttributes';
import { CoreEnvelopeDiagnostics } from './CoreEnvelopeDiagnostics';
import { MessageBundle } from './MessageBundle';
import { Metrics } from './Metrics';

export interface CoreEnvelope {
    diagnostics: CoreEnvelopeDiagnostics;
    bundles: MessageBundle[];
    metrics: Metrics;
    staticAttributes: StaticAttributes;
}
