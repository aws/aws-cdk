# Installing Dependencies

Since CDK npm modules are not published to npm, use `y-npm` instead of `npm`
when installing dependencies.

    y-npm install @aws-cdk/dynamo

This wrapper falls-back to the public npm repository, and
you should use it for installing all dependencies for this project:

    y-npm i left-pad --save-dev

# Useful commands

 * `npm run prepare` compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `cdk docs`        open CDK documentation

