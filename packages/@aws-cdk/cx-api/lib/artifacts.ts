export const AWS_ENV_REGEX = /aws\:\/\/([0-9]+|unknown-account)\/([a-z\-0-9]+)/;

export enum ArtifactType {
  CloudFormationStack = 'aws:cloudformation:stack',
  DockerImage = 'aws:docker',
  File = 'aws:file'
}

export interface Artifact {
  type: ArtifactType;
  environment: string; // format: aws://account/region
  properties?: { [name: string]: any };
  metadata?: { [path: string]: any };
  dependencies?: string[];
  missing?: { [key: string]: any };

  /**
   * Build instructions for this artifact (for example, lambda-builders, zip directory, docker build, etc)
   */
  build?: any;
}

export function validateArtifact(artifcat: Artifact) {
  if (!AWS_ENV_REGEX.test(artifcat.environment)) {
    throw new Error(`Artifact "environment" must conform to ${AWS_ENV_REGEX}: ${artifcat.environment}`);
  }
}