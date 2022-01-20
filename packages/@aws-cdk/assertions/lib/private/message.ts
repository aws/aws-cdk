import { SynthesisMessage } from '@aws-cdk/cx-api';

export type Messages = {
  [logicalId: string]: SynthesisMessage;
}
