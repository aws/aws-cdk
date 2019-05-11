import { Test } from 'nodeunit';
import { diffTemplate } from '../../lib';
import { poldoc, resource, template } from '../util';

export = {
  'broadening is': {
    'adding of positive statements'(test: Test) {
      // WHEN
      const diff = diffTemplate({}, template({
        QueuePolicy: resource('AWS::SQS::QueuePolicy', {
          Queues: [ { Ref: 'MyQueue' } ],
          PolicyDocument: poldoc({
            Effect: 'Allow',
            Action: 'sqs:SendMessage',
            Resource: '*',
            Principal: { Service: 'sns.amazonaws.com' }
          })
        })
      }));

      // THEN
      test.equal(diff.permissionsBroadened, true);

      test.done();
    },

    'adding of positive statements to an existing policy'(test: Test) {
      // WHEN
      const diff = diffTemplate(template({
        QueuePolicy: resource('AWS::SQS::QueuePolicy', {
          Queues: [ { Ref: 'MyQueue' } ],
          PolicyDocument: poldoc(
            {
              Effect: 'Allow',
              Action: 'sqs:SendMessage',
              Resource: '*',
              Principal: { Service: 'sns.amazonaws.com' }
            }
          )
        })
      }), template({
        QueuePolicy: resource('AWS::SQS::QueuePolicy', {
          Queues: [ { Ref: 'MyQueue' } ],
          PolicyDocument: poldoc(
            {
              Effect: 'Allow',
              Action: 'sqs:SendMessage',
              Resource: '*',
              Principal: { Service: 'sns.amazonaws.com' }
            },
            {
              Effect: 'Allow',
              Action: 'sqs:LookAtMessage',
              Resource: '*',
              Principal: { Service: 'sns.amazonaws.com' }
            }
          )
        })
      }));

      // THEN
      test.equal(diff.permissionsBroadened, true);

      test.done();
    },

    'removal of not-statements'(test: Test) {
      // WHEN
      const diff = diffTemplate(template({
        QueuePolicy: resource('AWS::SQS::QueuePolicy', {
          Queues: [ { Ref: 'MyQueue' } ],
          PolicyDocument: poldoc({
            Effect: 'Allow',
            Action: 'sqs:SendMessage',
            Resource: '*',
            NotPrincipal: { Service: 'sns.amazonaws.com' }
          })
        })
      }), {});

      // THEN
      test.equal(diff.permissionsBroadened, true);

      test.done();
    },

    'changing of resource target'(test: Test) {
      // WHEN
      const diff = diffTemplate(template({
        QueuePolicy: resource('AWS::SQS::QueuePolicy', {
          Queues: [ { Ref: 'MyQueue' } ],
          PolicyDocument: poldoc(
            {
              Effect: 'Allow',
              Action: 'sqs:SendMessage',
              Resource: '*',
              Principal: { Service: 'sns.amazonaws.com' }
            }
          )
        })
      }), template({
        QueuePolicy: resource('AWS::SQS::QueuePolicy', {
          Queues: [ { Ref: 'MyOtherQueue' } ],
          PolicyDocument: poldoc(
            {
              Effect: 'Allow',
              Action: 'sqs:SendMessage',
              Resource: '*',
              Principal: { Service: 'sns.amazonaws.com' }
            }
          )
        })
      }));

      // THEN
      test.equal(diff.permissionsBroadened, true);

      test.done();
    },

    'addition of ingress rules'(test: Test) {
      // WHEN
      const diff = diffTemplate(
        template({
        }),
        template({
        SG: resource('AWS::EC2::SecurityGroup', {
          SecurityGroupIngress: [
            {
              CidrIp: '1.2.3.4/8',
              FromPort: 80,
              ToPort: 80,
              IpProtocol: 'tcp',
            }
          ],
        })
      }));

      // THEN
      test.equal(diff.permissionsBroadened, true);

      test.done();
    },

    'addition of egress rules'(test: Test) {
      // WHEN
      const diff = diffTemplate(
        template({
        }),
        template({
        SG: resource('AWS::EC2::SecurityGroup', {
          SecurityGroupEgress: [
            {
              DestinationSecurityGroupId: { 'Fn::GetAtt': ['ThatOtherGroup', 'GroupId'] },
              FromPort: 80,
              ToPort: 80,
              IpProtocol: 'tcp',
            }
          ],
        })
      }));

      // THEN
      test.equal(diff.permissionsBroadened, true);

      test.done();
    },
  },
  'broadening is not': {
    'removal of positive statements from an existing policy'(test: Test) {
      // WHEN
      const diff = diffTemplate(template({
        QueuePolicy: resource('AWS::SQS::QueuePolicy', {
          Queues: [ { Ref: 'MyQueue' } ],
          PolicyDocument: poldoc(
            {
              Effect: 'Allow',
              Action: 'sqs:SendMessage',
              Resource: '*',
              Principal: { Service: 'sns.amazonaws.com' }
            },
            {
              Effect: 'Allow',
              Action: 'sqs:LookAtMessage',
              Resource: '*',
              Principal: { Service: 'sns.amazonaws.com' }
            }
          )
        })
      }), template({
        QueuePolicy: resource('AWS::SQS::QueuePolicy', {
          Queues: [ { Ref: 'MyQueue' } ],
          PolicyDocument: poldoc(
            {
              Effect: 'Allow',
              Action: 'sqs:SendMessage',
              Resource: '*',
              Principal: { Service: 'sns.amazonaws.com' }
            }
          )
        })
      }));

      // THEN
      test.equal(diff.permissionsBroadened, false);

      test.done();
    },
  }

};