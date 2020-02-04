import { aws } from '../lib'; /// <omit/>

export class QueueArnAttribute extends aws.sqs.QueueArnAttributeBase {
  public enrichment() {
    return 'I am an enriched queue arn attribute';
  }
}
