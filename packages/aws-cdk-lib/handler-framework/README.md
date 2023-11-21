# AWS CDK Vended Handler Framework

This module is an internal framework used to establish best practices for vending Lambda handlers that are deployed to user accounts. Primarily, this framework includes a centralized definition of the default runtime version which is the latest version of NodeJs available across all AWS Regions.

In addition to including a default runtime version, this framework forces the user to specify compatible runtimes for each Lambda handler being used. The framework first checks for the default runtime in the list of compatible runtimes. If found, the default runtime is used. If not found, the framework will look for the latest defined runtime in the list of compatible runtimes. If the latest runtime found is marked as deprecated, then the framework will force the build to fail. To continue, the user must specify a non-deprecated runtime version that the handler code is compatible with.

## CDK Handler

## CDK Function

## CDK Singleton Function
