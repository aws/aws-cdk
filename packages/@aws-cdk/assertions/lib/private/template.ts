// Partial types for CloudFormation Template

export type Template = {
  Resources: { [logicalId: string]: Resource },
  Outputs: { [logicalId: string]: Output },
  Mappings: { [logicalId: string]: Mapping }
}

export type Resource = {
  Type: string;
  [key: string]: any;
}

export type Output = { [key: string]: any };

export type Mapping = { [key: string]: any };