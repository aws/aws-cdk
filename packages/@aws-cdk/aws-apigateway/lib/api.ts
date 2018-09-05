
import {cloudformation} from '../../aws-lambda/lib/lambda.generated';
export enum MethodType {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE'
}

export interface HttpConfig {
  path: string;
  method: MethodType;
  cors?: boolean;
}

export interface LambdaConfig {
  lambdaFn: cloudformation.FunctionResource
  http: HttpConfig
}

export enum EndpointType {
    EDGE = 'EDGE',
    REGIONAL = 'REGIONAL',
    PRIVATE = 'PRIVATE'
}

export interface ApiGatewayProps {
  name: string;
  endpoints: LambdaConfig[];
  endpointTypes: EndpointType[];
  cacheEncrypted?: boolean;
  cacheSize?: '0.5' | '1.6' | '6.1' | '13.5' | '28.4' | '58.2' | '118' | '237';
  cacheTtl?: number;
  caching?: boolean;
  logging?: boolean;
  logLevel?: 'OFF' | 'ERROR' | 'INFO';
  metrics?: boolean;
  stageName: string;
}