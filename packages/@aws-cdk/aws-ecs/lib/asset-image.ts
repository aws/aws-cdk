import cfn = require('@aws-cdk/aws-cloudformation');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import path = require('path');
import { ContainerDefinition } from './container-definition';
import { IContainerImage } from './container-image';

export interface AssetImageProps {
  /**
   * The directory where the Dockerfile is stored
   */
  directory: string;
}

/**
 * An image that will be built at synthesis time
 */
export class AssetImage extends cdk.Construct implements IContainerImage {
  /**
   * Full name of this image
   */
  public readonly imageName: string;

  /**
   * Directory where the source files are stored
   */
  private readonly directory: string;

  /**
   * ARN of the repository
   */
  private readonly repositoryArn: string;

  constructor(parent: cdk.Construct, id: string, props: AssetImageProps) {
    super(parent, id);

    // resolve full path
    this.directory = path.resolve(props.directory);
    if (!fs.existsSync(this.directory)) {
      throw new Error(`Cannot find image directory at ${this.directory}`);
    }
    if (!fs.existsSync(path.join(this.directory, 'Dockerfile'))) {
      throw new Error(`No 'Dockerfile' found in ${this.directory}`);
    }

    const repositoryParameter = new cdk.Parameter(this, 'Repository', {
      type: 'String',
      description: `Repository ARN for asset "${this.path}"`,
    });

    const tagParameter = new cdk.Parameter(this, 'Tag', {
      type: 'String',
      description: `Tag for asset "${this.path}"`,
    });

    const asset: cxapi.ContainerImageAssetMetadataEntry = {
      packaging: 'container-image',
      path: this.directory,
      id: this.uniqueId,
      repositoryParameter: repositoryParameter.logicalId,
      tagParameter: tagParameter.logicalId
    };

    this.addMetadata(cxapi.ASSET_METADATA, asset);

    this.repositoryArn = repositoryParameter.value.toString();

    // Require that repository adoption happens first, so we route the
    // input ARN into the Custom Resource and then get the URI which we use to
    // refer to the image FROM the Custom Resource.
    //
    // If adoption fails (because the repository might be twice-adopted), we
    // haven't already started using the image.
    const adopted = new AdoptRepository(this, 'AdoptRepository', { repositoryArn: this.repositoryArn });
    this.imageName = `${adopted.repositoryUri}:${tagParameter.value}`;
  }

  public bind(containerDefinition: ContainerDefinition): void {
    // This image will be in ECR, so we need appropriate permissions.
    containerDefinition.addToExecutionPolicy(new iam.PolicyStatement()
      .addActions("ecr:BatchCheckLayerAvailability", "ecr:GetDownloadUrlForLayer", "ecr:BatchGetImage")
      .addResource(this.repositoryArn));

    containerDefinition.addToExecutionPolicy(new iam.PolicyStatement()
      .addActions("ecr:GetAuthorizationToken", "logs:CreateLogStream", "logs:PutLogEvents")
      .addAllResources());
  }
}

interface AdoptRepositoryProps {
  repositoryArn: string;
}

/**
 * Custom Resource which will adopt the repository used for the locally built image into the stack.
 *
 * Since the repository is not created by the stack (but by the CDK toolkit),
 * adopting will make the repository "owned" by the stack. It will be cleaned
 * up when the stack gets deleted, to avoid leaving orphaned repositories on stack
 * cleanup.
 */
class AdoptRepository extends cdk.Construct {
  public readonly repositoryUri: string;

  constructor(parent: cdk.Construct, id: string, props: AdoptRepositoryProps) {
    super(parent, id);

    const fn = new lambda.SingletonFunction(this, 'Function', {
      runtime: lambda.Runtime.NodeJS810,
      lambdaPurpose: 'AdoptEcrRepository',
      handler: 'handler.handler',
      code: lambda.Code.asset(path.join(__dirname, 'adopt-repository')),
      uuid: 'dbc60def-c595-44bc-aa5c-28c95d68f62c',
      timeout: 300
    });

    fn.addToRolePolicy(new iam.PolicyStatement()
      .addActions('ecr:GetRepositoryPolicy', 'ecr:SetRepositoryPolicy', 'ecr:DeleteRepository', 'ecr:ListImages', 'ecr:BatchDeleteImage')
      .addResource(props.repositoryArn));

    const resource = new cfn.CustomResource(this, 'Resource', {
      lambdaProvider: fn,
      properties: {
        RepositoryArn: props.repositoryArn,
      }
    });

    this.repositoryUri = resource.getAtt('RepositoryUri').toString();
  }
}
