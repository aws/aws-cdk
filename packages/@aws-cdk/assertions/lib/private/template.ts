// Partial types for CloudFormation Template

export type Template = {
  // In actuality this is not optional, but we sometimes don't generate it so we
  // need to account for that.
  Resources?: { [logicalId: string]: Resource },
  Outputs?: { [logicalId: string]: Output },
  Mappings?: { [logicalId: string]: Mapping },
  Parameters?: { [logicalId: string]: Parameter },
  Conditions?: { [logicalId: string]: Condition },
}

export type Resource = {
  Type: string;
  DependsOn?: string | string[];
  Properties?: { [key: string]: any };
  [key: string]: any;
}

export type Output = { [key: string]: any };

export type Mapping = { [key: string]: any };

export type Parameter = {
  Type: string;
  [key: string]: any;
}

export type Condition = { [key: string]: any };