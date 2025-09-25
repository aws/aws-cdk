### Serverless Inference

Amazon SageMaker Serverless Inference is a purpose-built inference option that makes it easy for you to deploy and scale ML models. Serverless endpoints automatically launch compute resources and scale them in and out depending on traffic, eliminating the need to choose instance types or manage scaling policies.

To create a serverless endpoint configuration, use the `serverlessProductionVariant` property:

```typescript
import * as sagemaker from '@aws-cdk/aws-sagemaker-alpha';

declare const model: sagemaker.Model;

const endpointConfig = new sagemaker.EndpointConfig(this, 'ServerlessEndpointConfig', {
  serverlessProductionVariant: {
    model: model,
    variantName: 'serverlessVariant',
    maxConcurrency: 10,
    memorySizeInMB: 2048,
    provisionedConcurrency: 5, // optional
  },
});
```

Serverless inference is ideal for workloads with intermittent or unpredictable traffic patterns. You can configure:

- `maxConcurrency`: Maximum concurrent invocations (1-200)
- `memorySizeInMB`: Memory allocation in 1GB increments (1024, 2048, 3072, 4096, 5120, or 6144 MB)
- `provisionedConcurrency`: Optional pre-warmed capacity to reduce cold starts

**Note**: Provisioned concurrency incurs charges even when the endpoint is not processing requests. Use it only when you need to minimize cold start latency.

You cannot mix serverless and instance-based variants in the same endpoint configuration.