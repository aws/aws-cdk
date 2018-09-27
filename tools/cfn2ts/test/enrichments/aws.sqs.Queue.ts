import { aws } from '../lib' /// <omit/>

export class Queue extends aws.sqs.QueueBase {
  enrichment() {
    return 'I am an enriched queue';
  }
}
