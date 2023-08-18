describe('index', () =>{
  beforeEach(() => {
    // Reset because the module is cached and does not re-read environment variables
    jest.resetModules();
  });
  it('nodejs16.x runtime should use AWS SDK v2', async ()=> {
    process.env.AWS_EXECUTION_ENV = 'AWS_Lambda_nodejs16.x';
    const expected = await import('../../../lib/aws-custom-resource/runtime/aws-sdk-v2-handler');
    const runtime = await import('../../../lib/aws-custom-resource/runtime');
    expect(runtime.handler).toStrictEqual(expected.handler);
  });
  it('nodejs18.x runtime should use AWS SDK v3', async ()=> {
    process.env.AWS_EXECUTION_ENV = 'AWS_Lambda_nodejs18.x';
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const expected = require('../../../lib/aws-custom-resource/runtime/aws-sdk-v3-handler.bundled');
    const runtime = await import('../../../lib/aws-custom-resource/runtime');
    expect(runtime.handler).toStrictEqual(expected.handler);
  });
  it('nodejs18.x newer runtime should use AWS SDK v3', async ()=> {
    process.env.AWS_EXECUTION_ENV = 'AWS_Lambda_nodejs20.x';
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const expected = require('../../../lib/aws-custom-resource/runtime/aws-sdk-v3-handler.bundled');
    const runtime = await import('../../../lib/aws-custom-resource/runtime');
    expect(runtime.handler).toStrictEqual(expected.handler);
  });
});