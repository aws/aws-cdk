import { aws } from '../lib' /// <omit/>

export interface AuthorizerProps extends aws.apigateway.AuthorizerPropsBase {
  enrichment() {
    return 'i am an enriched props bag';
  }
}
