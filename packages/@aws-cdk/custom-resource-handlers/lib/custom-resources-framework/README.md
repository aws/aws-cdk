# AWS CDK Custom Resource Framework

The CDK custom resource framework is an internal framework developed to establish best practices, runtime enforcement, and consistency for custom resource providers and their associated handler code. 

# Creating a Custom Resource Provider

Custom resource providers can be created in one of three forms - `CdkFunction`, `CdkSingletonFunction`, or `CdkCustomResourceProvider`. These three custom resource provider formats are a code generated wrapper around the lambda `Function`, lambda `SingletonFunction`, and `CustomResourceProvider` constructs, respectively. These new CDK prefixed constructs will offer the same behavior and construction options as their parent minus the ability to configure the `handler`, `code`, `runtime`, and `runtimeName` properties during construction. Instead, `handler`, `code`, `runtime`, and `runtimeName` will be automatically generated using the properties configured in the [config](./config.ts) file. The [config](./config.ts) file is structured with the top most level mapping to a specific service, i.e., `aws-s3`, `aws-dynamodb`, etc. Each service can contain one or more provider modules which are containers for the custom resource providers being requested. Custom resource providers are defined within a provider module as an array of one or more `ConfigProps`. `ConfigProps` allow you to define a provider with the following properties:
 - type: the 
