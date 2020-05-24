import { dasmTypeScript } from '../lib';

test('basic test', async () => {
  expect(await dasm({
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
  expect(await dasm({
    Resources: {
      Boom: {
        Type: 'AWS::S3::Bucket'
      }
    }
  })).toMatchSnapshot();
});

test('multiple of same type', async () => {
  expect(await dasm({
    Resources: {
      MyTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          DisplayName: 'hello hello'
        }
      },
      MyTopicDos: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          DisplayName: 'hello again'
        }
      }
    }
  })).toMatchSnapshot();
});

test('bucket-and-key', async () => {
  expect(await dasm(require('./bucket-key.json'))).toMatchSnapshot();
});

async function dasm(template: any) {
  return dasmTypeScript(template, { timestamp: false });
}