# Amazon SageMaker Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources]) are always stable and safe to use.
>
> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

Amazon SageMaker provides every developer and data scientist with the ability to build, train, and
deploy machine learning models quickly. Amazon SageMaker is a fully-managed service that covers the
entire machine learning workflow to label and prepare your data, choose an algorithm, train the
model, tune and optimize it for deployment, make predictions, and take action. Your models get to
production faster with much less effort and lower cost.

## Installation

Install the module:

```console
$ npm i @aws-cdk/aws-sagemaker
```

Import it into your code:

```typescript
import * as sagemaker from '@aws-cdk/aws-sagemaker';
```

## Model

To create a machine learning model with Amazon Sagemaker, use the `Model` construct. This construct
includes properties that can be configured to define model components, including the model inference
code as a Docker image and an optional set of separate model data artifacts. See the [AWS
documentation](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-marketplace-develop.html)
to learn more about SageMaker models.

### Single Container Model

In the event that a single container is sufficient for your inference use-case, you can define a
single-container model:

```typescript
import * as sagemaker from '@aws-cdk/aws-sagemaker';
import * as path from 'path';

const image = sagemaker.ContainerImage.fromAsset(path.join('path', 'to', 'Dockerfile', 'directory'));
const modelData = sagemaker.ModelData.fromAsset(path.join('path', 'to', 'artifact', 'file.tar.gz'));

const model = new sagemaker.Model(this, 'PrimaryContainerModel', {
  containers: [
    {
      image: image,
      modelData: modelData,
    }
  ]
});
```

### Inference Pipeline Model

An inference pipeline is an Amazon SageMaker model that is composed of a linear sequence of multiple
containers that process requests for inferences on data. See the [AWS
documentation](https://docs.aws.amazon.com/sagemaker/latest/dg/inference-pipelines.html) to learn
more about SageMaker inference pipelines. To define an inference pipeline, you can provide
additional containers for your model:

```typescript
import * as sagemaker from '@aws-cdk/aws-sagemaker';

declare const image1: sagemaker.ContainerImage;
declare const modelData1: sagemaker.ModelData;
declare const image2: sagemaker.ContainerImage;
declare const modelData2: sagemaker.ModelData;
declare const image3: sagemaker.ContainerImage;
declare const modelData3: sagemaker.ModelData;

const model = new sagemaker.Model(this, 'InferencePipelineModel', {
  containers: [
    { image: image1, modelData: modelData1 },
    { image: image2, modelData: modelData2 },
    { image: image3, modelData: modelData3 }
  ],
});
```

### Container Images

Inference code can be stored in the Amazon EC2 Container Registry (Amazon ECR), which is specified
via `ContainerDefinition`'s `image` property which accepts a class that extends the `ContainerImage`
abstract base class.

#### Asset Image

Reference a local directory containing a Dockerfile:

```typescript
import * as sagemaker from '@aws-cdk/aws-sagemaker';
import * as path from 'path';

const image = sagemaker.ContainerImage.fromAsset(path.join('path', 'to', 'Dockerfile', 'directory'));
```

#### ECR Image

Reference an image available within ECR:

```typescript
import * as ecr from '@aws-cdk/aws-ecr';
import * as sagemaker from '@aws-cdk/aws-sagemaker';

const repository = ecr.Repository.fromRepositoryName(this, 'Repository', 'repo');
const image = sagemaker.ContainerImage.fromEcrRepository(repository, 'tag');
```

### Model Artifacts

If you choose to decouple your model artifacts from your inference code (as is natural given
different rates of change between inference code and model artifacts), the artifacts can be
specified via the `modelData` property which accepts a class that extends the `ModelData` abstract
base class. The default is to have no model artifacts associated with a model.

#### Asset Model Data

Reference local model data:

```typescript
import * as sagemaker from '@aws-cdk/aws-sagemaker';
import * as path from 'path';

const modelData = sagemaker.ModelData.fromAsset(path.join('path', 'to', 'artifact', 'file.tar.gz'));
```

#### S3 Model Data

Reference an S3 bucket and object key as the artifacts for a model:

```typescript
import * as s3 from '@aws-cdk/aws-s3';
import * as sagemaker from '@aws-cdk/aws-sagemaker';

const bucket = new s3.Bucket(this, 'MyBucket');
const modelData = sagemaker.ModelData.fromBucket(bucket, 'path/to/artifact/file.tar.gz');
```
