import { aws } from '../lib'; /// <omit/>

export class StageDescriptionProperty extends aws.apigateways.Deployment.StageDescriptionPropertyBase {
  public enrichment() {
    return 'I am an enriched property type';
  }
}
