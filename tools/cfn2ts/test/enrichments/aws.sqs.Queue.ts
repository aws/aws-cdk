import { aws } from '../lib'; /// <omit/>

export class Queue extends aws.sqs.QueueBase {
  public enrichment() {
    return 'I am an enriched queue';
  }
}
