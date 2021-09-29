import { aws } from '../lib' /// <omit/>

export class StageDescriptionProperty extends aws.apigateways.Deployment.StageDescriptionPropertyBase {
  enrichment() {
    return 'I am an enriched property type';
  }
}
