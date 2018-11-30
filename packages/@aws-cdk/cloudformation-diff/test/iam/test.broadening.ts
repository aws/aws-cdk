import { Test } from 'nodeunit';
import { diffTemplate } from '../../lib';
import { poldoc, resource, template } from '../util';

export = {
  'adding of positive statements counts as permission widening'(test: Test) {
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

  'removal of not-statements counts as permission widening'(test: Test) {
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

};