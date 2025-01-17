# Lambda Integration Test Updater

This tool updates integration test cases for AWS Lambda runtimes in the AWS CDK codebase. It specifically handles:

- Checking for all runtimes in the Runtime class
- Updating integration test files with all runtime information
- Supporting NodeJS, Python, and Go runtime families

The purpose of this tool is to make sure that we have integration test cases that cover new runtimes, and so we 
can detect if there is an issue in the build image, and to make sure we do not release a new Runtime before its build 
image got released.