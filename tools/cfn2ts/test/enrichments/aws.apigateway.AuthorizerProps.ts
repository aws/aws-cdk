import { aws } from '../lib'; /// <omit/>

export interface AuthorizerProps extends aws.apigateway.AuthorizerPropsBase {
  public enrichment() {
    return 'I am an enriched property type';
  }
}
