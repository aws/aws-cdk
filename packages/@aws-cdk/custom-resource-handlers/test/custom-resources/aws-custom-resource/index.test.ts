/* eslint-disable @typescript-eslint/no-require-imports */

jest.mock('../../../lib/custom-resources/aws-custom-resource-handler/aws-sdk-v2-handler', () => ({
  handler: jest.fn().mockReturnValue(2),
}));
jest.mock('../../../lib/custom-resources/aws-custom-resource-handler/aws-sdk-v3-handler', () => ({
  handler: jest.fn().mockReturnValue(3),
}));

describe('index', () =>{
  beforeEach(() => {
    // Reset because the module is cached and does not re-read environment variables
    jest.resetModules();
  });

  it('nodejs16.x runtime should use AWS SDK v2', async ()=> {
    process.env.AWS_EXECUTION_ENV = 'AWS_Lambda_nodejs16.x';
    expect(require('../../../lib/custom-resources/aws-custom-resource-handler').handler({}, {})).toEqual(2);
  });
  it('nodejs18.x runtime should use AWS SDK v3', async ()=> {
    process.env.AWS_EXECUTION_ENV = 'AWS_Lambda_nodejs18.x';
    expect(require('../../../lib/custom-resources/aws-custom-resource-handler').handler({}, {})).toEqual(3);
  });
  it('nodejs18.x newer runtime should use AWS SDK v3', async ()=> {
    process.env.AWS_EXECUTION_ENV = 'AWS_Lambda_nodejs20.x';
    expect(require('../../../lib/custom-resources/aws-custom-resource-handler').handler({}, {})).toEqual(3);
  });
});