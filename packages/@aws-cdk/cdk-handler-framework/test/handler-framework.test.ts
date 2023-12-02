import * as path from 'path';
import { CdkHandlerFramework } from '../lib/handler-framework';

/* eslint-disable no-console */
describe('framework generator', () => {
  test('generate and render cdk function', () => {
    const cdkFunction = CdkHandlerFramework.cdkFunction({
      className: 'MyCdkFunction',
      codeDirectory: path.join(__dirname, 'my-handler'),
    });
    console.log(cdkFunction.render());
  });

  test('generate and render cdk singleton function', () => {
    const cdkSingletonFunction = CdkHandlerFramework.cdkSingletonFunction({
      className: 'MyCdkSingletonFunction',
      codeDirectory: path.join(__dirname, 'my-handler'),
      entrypoint: 'index.onEventHandler',
    });
    console.log(cdkSingletonFunction.render());
  });

  test('generate and render cdk custom resource provider', () => {
    const cdkCustomResourceProvider = CdkHandlerFramework.cdkCustomResourceProvider({
      className: 'MyCdkCustomResourceProvider',
      codeDirectory: path.join(__dirname, 'my-handler'),
    });
    console.log(cdkCustomResourceProvider.render());
  });
});
