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
 * An image that will be built at deployment time
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

    // Require that repository adoption happens first
    const adopted = new AdoptRegistry(this, 'AdoptRegistry', { repositoryArn: this.repositoryArn });
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

interface AdoptRegistryProps {
  repositoryArn: string;
}

/**
 * Custom Resource which will adopt the registry used for the locally built image into the stack.
 *
 * This is so we can clean it up when the stack gets deleted.
 */
class AdoptRegistry extends cdk.Construct {
  public readonly repositoryUri: string;

  constructor(parent: cdk.Construct, id: string, props: AdoptRegistryProps) {
    super(parent, id);

    const fn = new lambda.SingletonFunction(this, 'Function', {
      runtime: lambda.Runtime.NodeJS810,
      lambdaPurpose: 'AdoptEcrRegistry',
      handler: 'index.handler',
      code: lambda.Code.inline(`exports.handler = ${trivialMinify(adoptRegistryHandler.toString())}`),
      uuid: 'dbc60def-c595-44bc-aa5c-28c95d68f62c',
      timeout: 300
    });

    fn.addToRolePolicy(new iam.PolicyStatement()
      .addActions('ecr:GetRepositoryPolicy', 'ecr:SetRepositoryPolicy', 'ecr:DeleteRepository', 'ecr:ListImages', 'ecr:BatchDeleteImage')
      .addAllResources());

    const resource = new cfn.CustomResource(this, 'Resource', {
      lambdaProvider: fn,
      properties: {
        RepositoryArn: props.repositoryArn,
      }
    });

    this.repositoryUri = resource.getAtt('RepositoryUri').toString();
  }
}

// tslint:disable:no-console
async function adoptRegistryHandler(event: any, context: any) {
  try {
    const AWS = require('aws-sdk');
    const ecr = new AWS.ECR();

    console.log(JSON.stringify(event));

    const markerStatement = {
      Sid: event.StackId,
      Effect: "Deny",
      Action: "OwnedBy:CDKStack",
      Principal: "*"
    };

    function repoName(props: any) {
      return props.RepositoryArn.split('/').slice(1).join('/');
    }

    // The repository must already exist
    async function getAdopter(name: string): Promise<any> {
      try {
        const policyResponse = await ecr.getRepositoryPolicy({ repositoryName: name }).promise();
        const policy = JSON.parse(policyResponse.policyText);
        // Search the policy for an adopter marker
        return (policy.Statement || []).find((x: any) => x.Action === markerStatement.Action) || {};
      } catch (e) {
        if (e.code !== 'RepositoryPolicyNotFoundException') { throw e; }
        return {};
      }
    }

    const repo = repoName(event.ResourceProperties);
    const adopter = await getAdopter(repo);
    if (event.RequestType === 'Delete') {
      if (adopter.Sid !== markerStatement.Sid) {
        throw new Error(`This repository is already owned by another stack: ${adopter.Sid}`);
      }
      console.log('Deleting', repo);
      const ids = (await ecr.listImages({ repositoryName: repo }).promise()).imageIds;
      try {
        await ecr.batchDeleteImage({ repositoryName: repo, imageIds: ids }).promise();
        await ecr.deleteRepository({ repositoryName: repo }).promise();
      } catch (e) {
        if (e.code !== 'RepositoryPolicyNotFoundException') { throw e; }
      }
    }

    if (event.RequestType === 'Create' || event.RequestType === 'Update') {
      if (adopter.Sid !== undefined && adopter.Sid !== markerStatement.Sid) {
        throw new Error(`This repository is already owned by another stack: ${adopter.Sid}`);
      }
      console.log('Adopting', repo);
      await ecr.setRepositoryPolicy({ repositoryName: repo, policyText: JSON.stringify({
        Version: '2008-10-17',
        Statement: [markerStatement]
      }) }).promise();
    }

    const arn = event.ResourceProperties.RepositoryArn.split(':');
    await respond("SUCCESS", "OK", repo, {
      RepositoryUri: `${arn[4]}.dkr.ecr.${arn[3]}.amazonaws.com/${repoName(event.ResourceProperties)}`
    });
  } catch (e) {
    console.log(e);
    await respond("FAILED", e.message, context.logStreamName, {});
  }

  function respond(responseStatus: string, reason: string, physId: string, data: any) {
    const responseBody = JSON.stringify({
      Status: responseStatus,
      Reason: reason,
      PhysicalResourceId: physId,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      NoEcho: false,
      Data: data
    });

    console.log('Responding', JSON.stringify(responseBody));

    const parsedUrl = require('url').parse(event.ResponseURL);
    const requestOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      method: "PUT",
      headers: { "content-type": "", "content-length": responseBody.length }
    };

    return new Promise<void>((resolve, reject) => {
      try {
        const request = require('https').request(requestOptions, resolve);
        request.on("error", reject);
        request.write(responseBody);
        request.end();
      } catch (e) {
        reject(e);
      }
    });
  }
}

/**
 * Trivial minification by changing TypeScript's 4-space indentation to 1-space
 */
function trivialMinify(s: string) {
  return s.replace(/^ {4}/mg, ' ');
}
