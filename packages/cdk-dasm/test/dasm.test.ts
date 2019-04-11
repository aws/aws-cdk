import { dasmTypeScript } from '../lib';

test('basic test', async () => {
  expect(await dasmTypeScript({
    Resources: {
      MyTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          DisplayName: 'hello hello'
        }
      }
    }
  })).toMatchSnapshot();
});

test('no props', async () => {
  expect(await dasmTypeScript({
    Resources: {
      Boom: {
        Type: 'AWS::S3::Bucket'
      }
    }
  })).toMatchSnapshot();
});

test('bucket-and-key', async () => {
  expect(await dasmTypeScript(require('./bucket-key.json'))).toMatchSnapshot();
});