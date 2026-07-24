import { App, Stack } from 'aws-cdk-lib';
import { Function, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'aws-cdk-lambda-runtime-fromasset');

const lambdaFunctionJava21 = new Function(stack, 'MyFunctionJava21', {
  runtime: Runtime.JAVA_21,
  handler: 'com.mycompany.app.LambdaMethodHandler::handleRequest',
  code: Code.fromAsset(path.join(__dirname, 'my-app-1.0-SNAPSHOT.zip')),
});

const lambdaFunctionJava25 = new Function(stack, 'MyFunctionJava25', {
  runtime: Runtime.JAVA_25,
  handler: 'com.mycompany.app.LambdaMethodHandler::handleRequest',
  code: Code.fromAsset(path.join(__dirname, 'my-app-1.0-SNAPSHOT.zip')),
});

const lambdaFunctionJava8Al2023 = new Function(stack, 'MyFunctionJava8Al2023', {
  runtime: Runtime.JAVA_8_AL2023,
  handler: 'com.mycompany.app.LambdaMethodHandler::handleRequest',
  code: Code.fromAsset(path.join(__dirname, 'my-app-1.0-SNAPSHOT.zip')),
});

const lambdaFunctionJava11Al2023 = new Function(stack, 'MyFunctionJava11Al2023', {
  runtime: Runtime.JAVA_11_AL2023,
  handler: 'com.mycompany.app.LambdaMethodHandler::handleRequest',
  code: Code.fromAsset(path.join(__dirname, 'my-app-1.0-SNAPSHOT.zip')),
});

const lambdaFunctionJava17Al2023 = new Function(stack, 'MyFunctionJava17Al2023', {
  runtime: Runtime.JAVA_17_AL2023,
  handler: 'com.mycompany.app.LambdaMethodHandler::handleRequest',
  code: Code.fromAsset(path.join(__dirname, 'my-app-1.0-SNAPSHOT.zip')),
});

const integTest = new integ.IntegTest(app, 'Integ', { testCases: [stack] });

const invokeJava21 = integTest.assertions.invokeFunction({
  functionName: lambdaFunctionJava21.functionName,
  payload: '123',
});

invokeJava21.expect(integ.ExpectedResult.objectLike({
  Payload: '"123"',
}));

const invokeJava25 = integTest.assertions.invokeFunction({
  functionName: lambdaFunctionJava25.functionName,
  payload: '123',
});

invokeJava25.expect(integ.ExpectedResult.objectLike({
  Payload: '"123"',
}));

const invokeJava8Al2023 = integTest.assertions.invokeFunction({
  functionName: lambdaFunctionJava8Al2023.functionName,
  payload: '123',
});

invokeJava8Al2023.expect(integ.ExpectedResult.objectLike({
  Payload: '"123"',
}));

const invokeJava11Al2023 = integTest.assertions.invokeFunction({
  functionName: lambdaFunctionJava11Al2023.functionName,
  payload: '123',
});

invokeJava11Al2023.expect(integ.ExpectedResult.objectLike({
  Payload: '"123"',
}));

const invokeJava17Al2023 = integTest.assertions.invokeFunction({
  functionName: lambdaFunctionJava17Al2023.functionName,
  payload: '123',
});

invokeJava17Al2023.expect(integ.ExpectedResult.objectLike({
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
