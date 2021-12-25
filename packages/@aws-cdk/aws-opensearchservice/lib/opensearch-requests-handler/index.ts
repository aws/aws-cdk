/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { IsCompleteResponse } from '@aws-cdk/custom-resources/lib/provider-framework/types';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as aws from 'aws-sdk';


const awsRegion = process.env.AWS_awsRegion;
const opensearchDomain = process.env.OPENSEARCH_DOMAIN;
const opensearchEndpoint = new aws.Endpoint(opensearchDomain!);
const opensearchRequest = new aws.HttpRequest(opensearchEndpoint, awsRegion!);
const awsCredentials = new aws.EnvironmentCredentials('AWS');
 // @ts-ignore
const awsHttpClient = new aws.HttpClient();

/**
 * Function that will send the signed request to the opensearch domain
 * @see https://docs.aws.amazon.com/opensearch-service/latest/developerguide/request-signing.html#request-signing-node
 */
 async function sendDocument(httpMethod: string, path: string, document: string | object, securitytenant: string) {
    return new Promise(function (resolve, reject) {

      opensearchRequest.path += path;
      opensearchRequest.method = httpMethod;
  
      if (typeof securitytenant === 'string') {
        opensearchRequest.headers['securitytenant'] = securitytenant;
      }
  
      opensearchRequest.headers['Content-Type'] = 'application/json';
      opensearchRequest.body = typeof document === 'object' ? JSON.stringify(document) : document;
      opensearchRequest.headers['host'] = opensearchDomain!;
      opensearchRequest.headers['Content-Length'] = "" + Buffer.byteLength(opensearchRequest.body);
  
      // @ts-ignore
      var signer = new aws.Signers.V4(opensearchRequest, 'es');

      signer.addAuthorization(awsCredentials, new Date());
  
      awsHttpClient.handleRequest(opensearchRequest, null, function (response: any) {
        var responseBody = '';
        response.on('data', function (chunk: any) {
          responseBody += chunk;
        });
        response.on('end', function (_chunk: any) {
          resolve({ "status": response.statusCode, "body": responseBody });
        });
      }, function (error: any) {
        reject(error);
      });
    });
  }