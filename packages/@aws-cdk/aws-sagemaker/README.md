## Amazon SageMaker Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module. Releases might lack important features and might have
> future breaking changes.**
>
> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

---
<!--END STABILITY BANNER-->

### Notebook instance

Define a notebook instance.

```ts
new NotebookInstance(this, 'MyNotebook');
```

Add a KMS encryption key, launch in own VPC, set the instance type to 'ml.p3.xlarge', disable direct internet access and set the EBS volume size to 100 GB.

```ts
const vpc = new ec2.Vpc(this, "Vpc");
const key = new kms.Key(this, 'Key');
new NotebookInstance(this, 'MyNotebook', {
    vpc,
    kmsKeyId: key,
    instanceType = new ec2.InstanceType('p3.2xlarge'),
    enableDirectInternetAccess: false,
    volumeSizeInGB: 100,
});
```

Add custom scripts when notebook instance is created and started.

```ts
const notebook =new NotebookInstance(this, 'MyNotebook');
notebook.addOnCreateScript('echo "Creating Notebook"');
notebook.addOnStartScript('echo "Starting Notebook"');
```

Add a security group to the notebook instance.

```ts
const vpc = new ec2.Vpc(this, "Vpc");
const sg = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });
const notebook =new NotebookInstance(this, 'MyNotebook', {
    vpc
});
notebook.addSecurityGroup(sg);
```

### Models

Define a model.

```ts
new Model(this, 'MyModel', {
    primaryContainer: new GenericContainerDefinition( { 'us-west-2': '123456789012.dkr.ecr.us-west-2.amazonaws.com/mymodel:latest' })
});
```

Define a model with a container inference pipeline.

```ts
const model = new Model(this, 'MyModel');
model.addContainer(new GenericContainerDefinition({ 'us-west-2': '123456789012.dkr.ecr.us-west-2.amazonaws.com/mymodel1:latest' }));
model.addContainer(new GenericContainerDefinition({ 'us-west-2': '123456789012.dkr.ecr.us-west-2.amazonaws.com/mymodel2:latest' }));
```

### Endpoonts

Define an endpoint.

```ts
const model = new Model(this, 'MyModel', {
    primaryContainer: new GenericContainerDefinition( { 'us-west-2': '123456789012.dkr.ecr.us-west-2.amazonaws.com/mymodel:latest' })
});
const endpooint = new Endpoint(stack, 'MyEndpoint', {
    productionVariants: [ 
        { 
            model,
        }   
    ],
});
```
