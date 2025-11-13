import { CloudFrontRequestEvent, CloudFrontRequestResult } from 'aws-lambda';

export const handler = async (event: CloudFrontRequestEvent): Promise<CloudFrontRequestResult> => {
  const request = event.Records[0].cf.request;
  
  // Simple TypeScript logic to verify bundling works
  const customHeader: string = 'x-custom-header';
  request.headers[customHeader] = [{
    key: customHeader,
    value: 'test-value',
  }];
  
  return request;
};
