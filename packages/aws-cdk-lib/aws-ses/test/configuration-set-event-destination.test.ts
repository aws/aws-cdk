import { Template } from '../../assertions';
import * as sns from '../../aws-sns';
import { Stack } from '../../core';
import { CloudWatchDimensionSource, ConfigurationSet, ConfigurationSetEventDestination, EventDestination } from '../lib';

let stack: Stack;
let configurationSet: ConfigurationSet;
beforeEach(() => {
  stack = new Stack();
  configurationSet = new ConfigurationSet(stack, 'ConfigurationSet');
});

test('sns destination', () => {
  const topic = new sns.Topic(stack, 'Topic');

  new ConfigurationSetEventDestination(stack, 'Sns', {
    configurationSet,
    destination: EventDestination.snsTopic(topic),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SES::ConfigurationSetEventDestination', {
    ConfigurationSetName: { Ref: 'ConfigurationSet3DD38186' },
    EventDestination: {
      Enabled: true,
      SnsDestination: { TopicARN: { Ref: 'TopicBFC7AF6E' } },
      MatchingEventTypes: [
        'send',
        'reject',
        'bounce',
        'complaint',
        'delivery',
        'open',
        'click',
        'renderingFailure',
        'deliveryDelay',
        'subscription',
      ],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SNS::TopicPolicy', {
    PolicyDocument: {
      Statement: [{
        Action: 'sns:Publish',
        Condition: {
          StringEquals: {
            'AWS:SourceAccount': { Ref: 'AWS::AccountId' },
            'AWS:SourceArn': {
              'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':ses:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':configuration-set/',
                { Ref: 'ConfigurationSet3DD38186' },
              ]],
            },
          },
        },
        Effect: 'Allow',
        Principal: { Service: 'ses.amazonaws.com' },
        Resource: { Ref: 'TopicBFC7AF6E' },
      }],
    },
  });
});

test('cloudwatch dimensions destination', () => {
  new ConfigurationSetEventDestination(stack, 'Sns', {
    configurationSet,
    destination: EventDestination.cloudWatchDimensions([
      {
        source: CloudWatchDimensionSource.MESSAGE_TAG,
        name: 'ses:from-domain',
        defaultValue: 'no_domain',
      },
      {
        source: CloudWatchDimensionSource.MESSAGE_TAG,
        name: 'ses:source-ip',
        defaultValue: 'no_ip',
      },
    ]),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SES::ConfigurationSetEventDestination', {
    ConfigurationSetName: { Ref: 'ConfigurationSet3DD38186' },
    EventDestination: {
      CloudWatchDestination: {
        DimensionConfigurations: [
          {
            DefaultDimensionValue: 'no_domain',
            DimensionName: 'ses:from-domain',
            DimensionValueSource: 'messageTag',
          },
          {
            DefaultDimensionValue: 'no_ip',
            DimensionName: 'ses:source-ip',
            DimensionValueSource: 'messageTag',
          },
        ],
      },
    },
  });
});

