# AWS ECS - Support for Private Registry Authentication

To address issue [#1698](https://github.com/aws/aws-cdk/issues/1698), the ECS construct library should provide a way for customers to specify [`repositoryCredentials`](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_ContainerDefinition.html#ECS-Type-ContainerDefinition-repositoryCredentials) on their container.

Minimally, this would mean adding a new string field on `ContainerDefinition`, however this doesn't provide any added value in terms of logical grouping or resource creation. We can instead modify the existing ECS CDK construct [`ContainerImage`](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-ecs/lib/container-image.ts) so that repository credentials are specified along with the image they're meant to access.

## General approach

The [`ecs.ContainerImage`](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-ecs/lib/container-image.ts) class already includes constructs for 3 types of images:

* DockerHubImage
* EcrImage
* AssetImage

DockerHub images are assumed public, however DockerHub also provides private repositories and there's currently no way to specify credentials for them in the CDK.

There's also no explicit way to specify images hosted outside of DockerHub, AWS, or your local machine. Customers hosting their own registries or using another registry host, like Quay.io or JFrog Artifactory, would need to be able to specify both the image URI and the registry credentials in order to pull their images down for ECS tasks.

Fundamentally, specifying images hosted in DockerHub or elsewhere works the same, because when passed an image URI vs. a plain (or namespaced) image name + tag, the Docker daemon does the right thing and tries to pull the image from the specified registry.

Therefore, we should rename the existing `DockerHubImage` type be more generic and add the ability to optionally specify credentials.


## Code changes

Given the above, we should make the following changes to support private registry authentication:

1. Define `RepositoryCredentials` interface & class, add to `IContainerImage`
2. Rename `DockerHubImage` construct to be more generic, optionally accept and set `RepositoryCreds`


# Part 1: How to define registry credentials

For extensibility, we can define a new `IRepositoryCreds` interface to house the AWS Secrets Manager secret with the creds and a new `RepositoryCreds` class which satisfies it using specific constructs (e.g., "fromSecret").

```ts
export interface IRepositoryCreds {
    readonly secret: secretsManager.Secret;
}

export class RepositoryCreds {
  public readonly secret: secretsManager.Secret;

  public static fromSecret(secret: secretsManager.Secret) {
    this.secret = secret;
  }

  public bind(containerDefinition: ContainerDefinition): void {
    // grant the execution role read access so the secret can be read prior to image pull
    this.secret.grantRead(containerDefinition.taskDefinition.obtainExecutionRole());
  }
}
```

The `IContainerImage` interface will be updated to include an optional `repositoryCredentials` property:
```ts
export interface IContainerImage {
  // ...
  readonly imageName: string;

  /**
   * NEW: The credentials required to access the image
   */
  readonly repositoryCredentials?: IRepositoryCreds;

  // ...
  bind(containerDefinition: ContainerDefinition): void;
}
```


# Part 2: Rename `DockerHubImage` class to `WebHostedImage`, add optional creds

The `DockerHubImage` construct will be renamed to `WebHostedImage`, and augmented to take in optional "credentials" via keyword props:
```ts
// define props
export interface WebHostedImageProps {
    credentials: RepositoryCreds;
}

// "DockerHubImage" class --> "WebHostedImage"
export class WebHostedImage implements IContainerImage {
  public readonly imageName: string;
  public readonly credentials: IRepositoryCreds;

  // add credentials to constructor
  constructor(imageName: string, props: WebHostedImageProps) {
    this.imageName = imageName
    this.credentials = props.credentials
  }

  public bind(_containerDefinition: ContainerDefinition): void {
    // bind repositoryCredentials to ContainerDefinition
    this.repositoryCredentials.bind();
  }
}
```

We will also update the API on `ContainerImage` to match:
```ts
export class ContainerImage {
  //...
  public static fromInternet(imageName: string, props: WebHostedImageProps) {
    return new WebHostedImage(imageName, props);
  }
  // ...

}
```

Example use:
```ts
const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

const secret = secretsManager.Secret.fromSecretArn(stack, 'myRepoSecret', 'arn:aws:secretsmanager:.....')

taskDefinition.AddContainer('myPrivateContainer', {
  image: ecs.ContainerImage.fromInternet('userx/test', {
      credentials: ecs.RepositoryCreds.fromSecret(secret)
  });
});

```
