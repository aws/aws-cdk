import { App, Stack } from 'aws-cdk-lib';
import { Function, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'aws-cdk-lambda-runtime-fromasset');

const lambdaFunction = new Function(stack, 'MyFunction', {
  runtime: Runtime.JAVA_21,
  handler: 'com.mycompany.app.LambdaMethodHandler::handleRequest',
  code: Code.fromAsset(path.join(__dirname, 'my-app-1.0-SNAPSHOT.zip')),
});

const integTest = new integ.IntegTest(app, 'Integ', { testCases: [stack] });

const invoke = integTest.assertions.invokeFunction({
  functionName: lambdaFunction.functionName,
  payload: '123',
});

invoke.expect(integ.ExpectedResult.objectLike({
  Payload: '"123"',
}));

app.synth();

/* Code for the Lambda Function above:

package com.mycompany.app;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class LambdaMethodHandler implements RequestHandler<Integer, String>{
    public String handleRequest(Integer myCount, Context context) {
        return String.valueOf(myCount);
    }
}
*/