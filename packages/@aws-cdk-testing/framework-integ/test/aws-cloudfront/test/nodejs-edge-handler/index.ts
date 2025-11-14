export const handler = async (event: any): Promise<any> => {
  const request = event.Records[0].cf.request;

  // Simple TypeScript logic to verify bundling works
  const customHeader: string = 'x-custom-header';
  request.headers[customHeader] = [{
    key: customHeader,
    value: 'test-value',
  }];

  return request;
};
