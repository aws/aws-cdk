export const AWS_ENV_REGEX = /aws\:\/\/([0-9]+|unknown-account)\/([a-z\-0-9]+)/;

export enum ArtifactType {
  AwsCloudFormationStack = 'aws:cloudformation:stack',
  AwsEcrDockerImage = 'aws:ecr:image',
  AwsS3Object = 'aws:s3:object'
}

export interface ArtifactMetadata {
  type: ArtifactType;
  environment: string; // format: aws://account/region
  metadata?: { [path: string]: any };
  dependencies?: string[];
  missing?: { [key: string]: any };
  properties?: { [name: string]: any };
}

export interface AwsCloudformationStackArtifact extends ArtifactMetadata {
  type: ArtifactType.AwsCloudFormationStack,
  properties: {
    templateFile: string;
    parameters: {
      [name: string]: string
    }
  }
}

export interface AwsS3ObjectArtifact extends ArtifactMetadata {
  type: ArtifactType.AwsS3Object,
  properties: {
    file: string;
  }
}

export type Artifact = AwsCloudformationStackArtifact | AwsS3ObjectArtifact;

export function validateArtifact(artifcat: Artifact) {
  if (!AWS_ENV_REGEX.test(artifcat.environment)) {
    throw new Error(`Artifact "environment" must conform to ${AWS_ENV_REGEX}: ${artifcat.environment}`);
  }
}