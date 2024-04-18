# AWS Custom Resource SDK Adapter

The AWS custom resource SDK adapter is an internal collection of tools built to maintain compatibility with the contracts defined for `AwsCustomResource` and the current AWS SDK version. `AwsCustomResource` can be used where a single API call can fill a gap in CloudFormation coverage by allowing a user to specify a single API call specific to create, update, and delete stack events. Users specify a `service`, an `action`, and `parameters` as part of the `AwsSdkCall` interface which are used to dynamically invoke the API. Since `AwsCustomResource` was created while SDKv2 was active, it implicitly inherited the SDKv2 contract. As a result, migrating to newer SDK versions will result in breaking changes in the `AwsCustomResource` construct. In its current state, the AWS custom resource SDK adapter contains tooling that allows `AwsCustomResource` to make API calls using SDKv3 and return the associated response. These tools are related to:

* Input type coercion
* Response coercion
* Naming normalizaion

## Input Type Coercion

In general, input types expected by SDKv3 are more restrictive than what was expected by SDKv2. One such example is the regression to number types with respect to AWS SDKv2. More specifically, in SDKv2, number types that are accidentally passed as strings will be silently converted to the right type. SDKv3, however, will not do the conversion which causes the server call to fail because of mismatched types. For example,

**SDKv2**

```ts
const codedeploy = new AWS.CodeDeploy({ region: 'eu-west-1' });

const input: AWS.CodeDeploy.CreateDeploymentConfigInput = {
  deploymentConfigName: 'testtest',
  computePlatform: 'Lambda',
  trafficRoutingConfig: {
      type: "TimeBasedLinear",
      timeBasedLinear: {
      linearInterval: "1" as any, // The type says 'number' but we're forcing strings here
      linearPercentage:"5" as any,
    },
  },
};

// Following call happily succeeds
console.log(await codedeploy.createDeploymentConfig(input).promise());
```

**SDKv3**

```ts
const codedeploy = new CodeDeploy();

const input: CreateDeploymentConfigCommandInput = {
  deploymentConfigName: 'testtest',
  computePlatform: 'Lambda',
  trafficRoutingConfig: {
      type: "TimeBasedLinear",
      timeBasedLinear: {
      linearInterval: "1" as any, // The type says 'number' but we're forcing strings here
      linearPercentage:"5" as any,
    },
  },
};

await codedeploy.createDeploymentConfig(input);

// The above call fails with the following message:
'SerializationException: STRING_VALUE can not be converted to an Integer'
```

Another example is the regression to blob types with respect to SDKv2. More specifically, in SDKv2, input fields marked as blob types used to permissively accept strings, buffers, and uint8arrays. In SDKv3, these same fields now only accept uint8arrays.

In response, the [`Coercer`](./lib/coerce-api-parameters.ts) class was created to coerce input parameters to the type expected by SDKv3. At a high-level, this class coerces parameter types using a state-machine generated using smithy models. The state-machine is gzipped to save bytes and the gzipped representation can be seen [here](./lib/parameter-types.ts).

## Response Coercion

In some cases, API call responses for SDKv3 differ from API call responses for SDKv2. One example is streaming vs. buffered responses. More specifically, SDKv3 prefers not to buffer potentially large responses. For node.js, you must consume the stream or garbage collect the client or its request handler to keep the connection open to new traffic by freeing sockets. For example,

**SDKv2**

```ts
// this buffers (consumes) the stream already
const get = await s3.getObject({ ... }).promise();
```

**SDKv3**

```ts
// consume the stream to free the socket
const get = await s3.getObject({ ... }); // object .Body has unconsumed stream
const str = await get.Body.transformToString(); // consumes the stream
```

Users are able to retrieve values returned as a result of API calls they’ve defined while using the `AwsCustomResource` construct. To be retrievable, the response values must be strings. With SDKv3, the stream must be fully consumed to a string before the custom resource exits. Thus, response coercion was built as another tool in the AWS custom resource SDK adapter. Return type coercion exists in the [api-call](./lib/api-call.ts) file and the logic is implemented in the `coerceSdkv3Response` function.

## Naming Normalization

Originally, the `AwsCustomResource` construct advertised that the `service` argument defined in the `AwsSdkCall` interface could be in any one of the following formats:

* The SDK v2 constructor name: APIGateway
* The SDK v2 constructor name in all lower case: apigateway (primary format)

Similarly, the `action` argument defined in the `AwsSdkCall` interface was advertised as being permitted in any of the following formats:

* The API call name: GetRestApi
* The API call name with a lower case starting letter: getRestApi (primary format)

Migrating `AwsCustomResource` to SDKv3 meant that the permitted `service` and `action` values for SDKv2 needed to be accepted as well as new formats with respect to SDKv3. As a result, naming normalization was established as a way to convert the `service` and `action` arguments into the format expected for SDKv3 API calls. The normalization functions for `service` and `action` can be seen in the [sdk-info](./lib/sdk-info.ts) file and are named `normalizeServiceName` and `normalizeActionName`, respectively. To enable normalization of the `service` argument, the client package names map file from the `aws-sdk-js-codemod` repository is used and can be found [here](./lib/sdk-v2-to-v3.json). More specifically, this file is used to map SDKv2 `service` names to the equivalent SDKv3 `service` name. To enable normalization of the `action` argument a [sdk-v3-metadata](./lib/sdk-v3-metadata.json) file was extracted which contains a list of APIs that end in the word `Command` which allows us to disambiguate around these when generating the SDKv3 `action` name. Note that the [sdk-v3-metadata](./lib/sdk-v3-metadata.json) file also contains a mapping of `service` names into an IAM name allowing us to correctly identify the IAM prefix for each `service`.
