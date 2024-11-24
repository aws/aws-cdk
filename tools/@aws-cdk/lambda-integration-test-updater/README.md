# Lambda Integration Test Updater

This tool updates integration test cases for AWS Lambda runtimes in the AWS CDK codebase. It specifically handles:

- Checking for all runtimes in the Runtime class
- Updating integration test files with all runtime information
- Supporting NodeJS, Python, and Go runtime families

The purpose of this tool is to make sure that we have integration test cases that cover new runtimes, and to so we 
can detect if there is an issue in the build image to contact SAM team to fix it before releasing the new runtime.