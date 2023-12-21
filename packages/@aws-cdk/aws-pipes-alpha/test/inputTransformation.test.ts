import { InputTransformation } from '../lib/inputTransformation';

describe('PipeInputTransformation', () => {
  test('removes quotes for values starting with <$.', () => {
    const obj = {
      name: 'John Doe',
      secretCode: '<$.accessCode>',
    };

    expect(InputTransformation.fromJson(obj).inputTemplate).toEqual('{"name":"John Doe","secretCode":<$.accessCode>}');
  });

  test('removes quotes for values starting with <aws.pipes', () => {
    const obj = {
      name: 'John Doe',
      awsResource: '<aws.pipes.resource>',
    };

    expect(InputTransformation.fromJson(obj).inputTemplate).toEqual('{"name":"John Doe","awsResource":<aws.pipes.resource>}');
  });

  test('retains quotes for values not starting with <$. or <aws.pipes', () => {
    const obj = {
      name: 'John Doe',
      normalValue: '<normalValue>',
    };

    expect(InputTransformation.fromJson(obj).inputTemplate).toEqual('{"name":"John Doe","normalValue":"<normalValue>"}');
  });

  test('works with nested objects', () => {
    const obj = {
      name: 'John Doe',
      nested: {
        secretCode: '<$.accessCode>',
        awsResource: '<aws.pipes.resource>',
      },
    };

    expect(InputTransformation.fromJson(obj).inputTemplate).toEqual('{"name":"John Doe","nested":{"secretCode":<$.accessCode>,"awsResource":<aws.pipes.resource>}}');
  });

  test('works with arrays', () => {
    const obj = {
      name: 'John Doe',
      codes: ['<$.accessCode1>', '<aws.pipes.resource1>', '<normalValue1>'],
    };

    expect(InputTransformation.fromJson(obj).inputTemplate).toEqual('{"name":"John Doe","codes":[<$.accessCode1>,<aws.pipes.resource1>,"<normalValue1>"]}');
  });
});
