'use strict';

const aws = require('aws-sdk');
const codedeploy = new aws.CodeDeploy({ apiVersion: '2014-10-06' });

exports.handler = (event, context, callback) => {
  console.log('pre hook');
	/*
		[Perform pre-validation or pre-warming steps here]
	*/

  // Pass AWS CodeDeploy the prepared validation test results.
  codedeploy.putLifecycleEventHookExecutionStatus({
    deploymentId: event.DeploymentId,
    lifecycleEventHookExecutionId: event.LifecycleEventHookExecutionId,
    status: 'Succeeded' // status can be 'Succeeded' or 'Failed'
  }, function (err, data) {
    console.log(err);
    if (err) {
      callback('Validation test failed');
    } else {
      callback(null, 'Validation test succeeded');
    }
  });
}
