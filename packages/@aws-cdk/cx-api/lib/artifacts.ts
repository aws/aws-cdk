import { MetadataEntry } from './cxapi';

export const AWS_ENV_REGEX = /aws\:\/\/([0-9]+|unknown-account)\/([a-z\-0-9]+)/;

export enum ArtifactType {
  AwsCloudFormationStack = 'aws:cloudformation:stack',
  AwsEcrDockerImage = 'aws:ecr:image',
  AwsS3Object = 'aws:s3:object'
}

export interface Artifact {
  readonly type: ArtifactType;
  readonly environment: string; // format: aws://account/region
  readonly metadata?: { [path: string]: MetadataEntry[] };
  readonly dependencies?: string[];
  readonly missing?: { [key: string]: any };
  readonly properties?: { [name: string]: any };
  readonly autoDeploy?: boolean;
}

export interface AwsCloudFormationStackProperties {
  readonly templateFile: string;
  readonly parameters?: { [id: string]: string };
}

export function validateArtifact(artifcat: Artifact) {
  if (!AWS_ENV_REGEX.test(artifcat.environment)) {
    throw new Error(`Artifact "environment" must conform to ${AWS_ENV_REGEX}: ${artifcat.environment}`);
  }
}
