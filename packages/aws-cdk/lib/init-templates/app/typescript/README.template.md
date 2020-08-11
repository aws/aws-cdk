# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run test`    perform the jest unit tests
 * `npx cdk deploy`  deploy this stack to your default AWS account/region
 * `npx cdk diff`    compare deployed stack with current state
 * `npx cdk synth`   emits the synthesized CloudFormation template

## Structure

The CDK application is located inside the `app/` folder as `%name%.ts`. 
This file describes your application and references the stacks that should be deployed.

Your classes describing stacks are located inside `app/stacks/` and should be places in one file per stack.

If you build groups of resources that you need more than once, consider putting them inside their own construct
and place it in a file inside the `app/constructs/` folder.

Your unit tests for your CDk application are located in the `test/` folder.