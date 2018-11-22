import cfn = require('@aws-cdk/aws-cloudformation');
import ecr = require('@aws-cdk/aws-ecr');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import path = require('path');

export interface DockerImageAssetProps {
  /**
   * The directory where the Dockerfile is stored
   */
  directory: string;
}

/**
 * An asset that represents a Docker image.
 *
 * The image will be created in build time and uploaded to an ECR repository.
 */
export class DockerImageAsset extends cdk.Construct {
  /**
   * The full URI of the image (including a tag). Use this reference to pull
   * the asset.
   */
  public imageUri: string;

  /**
   * Repository where the image is stored
   */
  public repository: ecr.IRepository;

  /**
   * Directory where the source files are stored
   */
  private readonly directory: string;

  constructor(parent: cdk.Construct, id: string, props: DockerImageAssetProps) {
    super(parent, id);

    // resolve full path
    this.directory = path.resolve(props.directory);
    if (!fs.existsSync(this.directory)) {
      throw new Error(`Cannot find image directory at ${this.directory}`);
    }
    if (!fs.existsSync(path.join(this.directory, 'Dockerfile'))) {
      throw new Error(`No 'Dockerfile' found in ${this.directory}`);
    }

    const imageNameParameter = new cdk.Parameter(this, 'ImageName', {
      type: 'String',
      description: `ECR repository name and tag asset "${this.path}"`,
    });

    const asset: cxapi.ContainerImageAssetMetadataEntry = {
      packaging: 'container-image',
      path: this.directory,
      id: this.uniqueId,
      imageNameParameter: imageNameParameter.logicalId
    };

    this.addMetadata(cxapi.ASSET_METADATA, asset);

    const components = new cdk.FnSplit(':', imageNameParameter.value);
    const repositoryName = new cdk.FnSelect(0, components).toString();
    const imageTag = new cdk.FnSelect(1, components).toString();

    this.repository = ecr.Repository.import(this, 'RepositoryObject', {
      repositoryArn: ecr.Repository.arnForLocalRepository(repositoryName),
      repositoryName,
    });

    // Require that repository adoption happens first, so we route the
    // input ARN into the Custom Resource and then get the URI which we use to
    // refer to the image FROM the Custom Resource.
    //
    // If adoption fails (because the repository might be twice-adopted), we
    // haven't already started using the image.
    this.repository = new AdoptRepository(this, 'AdoptRepository', {
      repository: this.repository,
    });

    this.imageUri = this.repository.repositoryUriForTag(imageTag);
  }
}

interface AdoptRepositoryProps {
  /**
   * The imported ECR repository
   */
  repository: ecr.IRepository;
}

/**
 * Custom Resource which will adopt the repository used for the locally built
 * image into the stack.
 *
 * Since the repository is not created by the stack (but by the CDK toolkit),
 * adopting will make the repository "owned" by the stack. It will be cleaned
 * up when the stack gets deleted, to avoid leaving orphaned repositories on
 * stack cleanup.
 */
class AdoptRepository extends ecr.RepositoryBase {
  private readonly policyDocument = new iam.PolicyDocument();
  private readonly importedRepository: ecr.IRepository;

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
      .addActions('ecr:GetRepositoryPolicy', 'ecr:SetRepositoryPolicy',
'ecr:DeleteRepository', 'ecr:ListImages', 'ecr:BatchDeleteImage')
      .addResource(props.repository.repositoryArn));

    new cfn.CustomResource(this, 'Resource', {
      resourceType: 'Custom::CDKECRRepositoryAdoption',
      lambdaProvider: fn,
      properties: {
        RepositoryArn: props.repository.repositoryArn,
        PolicyDocument: this.policyDocument
      }
    });

    this.importedRepository = props.repository;
  }

  public get repositoryName() {
    return this.importedRepository.repositoryName;
  }

  public get repositoryArn() {
    return this.importedRepository.repositoryArn;
  }

  /**
   * Adds a statement to the repository resource policy
   */
  public addToResourcePolicy(statement: iam.PolicyStatement) {
    this.policyDocument.addStatement(statement);
  }
}
