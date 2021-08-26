import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import * as iot from '../lib';

let stack: Stack;

beforeEach(() => {
  stack = new Stack();
});

describe('IoT Thing', () => {
  test('default properties', () => {
    // WHEN
    new iot.Thing(stack, 'MyThing');

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::IoT::Thing', 1);
  });
  test('specify name', () => {
    // WHEN
    new iot.Thing(stack, 'MyThing', {
      thingName: 'thingOne',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IoT::Thing', {
      ThingName: 'thingOne',
    });
  });
  test('specify thing attributes', () => {
    // WHEN
    new iot.Thing(stack, 'MyThing', {
      attributePayload: {
        attributes: {
          hello: 'world',
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IoT::Thing', {
      AttributePayload: {
        Attributes: {
          hello: 'world',
        },
      },
    });
  });
  test('throws when given too many attributes', () => {
    // WHEN
    expect(() => {
      new iot.Thing(stack, 'MyThing', {
        attributePayload: {
          attributes: {
            one: 'attribute',
            two: 'attribute',
            three: 'attribute',
            four: 'attribute',
          },
        },
      });
    }).toThrowError(/Invalid thing attributes/);
  });
  test('attachCertificate()', () => {
    // WHEN
    const cert = new iot.Certificate(stack, 'MyCertificate', {
      status: iot.CertificateStatus.ACTIVE,
      certificateSigningRequest: 'csr',
    });

    const thing = new iot.Thing(stack, 'MyThing');
    thing.attachCertificate(cert);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IoT::ThingPrincipalAttachment', {
      ThingName: 'MyThing0C5333DD',
      Principal: { 'Fn::GetAtt': ['MyCertificate41357985', 'Arn'] },
    });
  });
  test('fromThingName()', () => {
    // WHEN
    const imported = iot.Thing.fromThingName(stack, 'Imported', 'thingOne');

    // THEN
    expect(stack.resolve(imported.thingArn)).toEqual({
      'Fn::Join':
        ['',
          ['arn:',
            { Ref: 'AWS::Partition' },
            ':iot:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':thing/thingOne']],
    });
    expect(imported.thingName).toEqual('thingOne');
  });
  test('fromThingArn', () => {
    // WHEN
    const imported = iot.Certificate.fromCertificateArn(stack, 'Imported', 'arn:aws:iot:us-east-2:*:thing/thingTwo');

    // THEN
    expect(imported.certificateArn).toEqual('arn:aws:iot:us-east-2:*:thing/thingTwo');
    expect(imported.certificateId).toEqual('thingTwo');
  });
});
