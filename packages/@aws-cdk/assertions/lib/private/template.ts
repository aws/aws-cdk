// Partial types for CloudFormation Template

export type Template = {
  Resources: { [logicalId: string]: Resource },
  Outputs: { [logicalId: string]: Output },
  Mappings: { [logicalId: string]: Mapping },
  Parameters: { [logicalId: string]: Parameter }
}

export type Resource = {
  Type: string;
  [key: string]: any;
}

export type Output = { [key: string]: any };

export type Mapping = { [key: string]: any };

export type Parameter = {
  Type: string;
  [key: string]: any;
}