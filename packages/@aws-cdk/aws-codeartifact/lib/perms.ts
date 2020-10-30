/**
 * @experimental
 */
export const REPOSITORY_WRITE_ACTIONS = [
  'codeartifact:PublishPackageVersion',
  'codeartifact:PutPackageMetadata',
];

/**
 * @experimental
 */
export const REPOSITORY_READ_ACTIONS = [
  'codeartifact:DescribePackageVersion',
  'codeartifact:DescribeRepository',
  'codeartifact:GetPackageVersionReadme',
  'codeartifact:GetRepositoryEndpoint',
  'codeartifact:ListPackages',
  'codeartifact:ListPackageVersions',
  'codeartifact:ListPackageVersionAssets',
  'codeartifact:ListPackageVersionDependencies',
  'codeartifact:ReadFromRepository',
];

/**
 * @experimental
 */
export const DOMAIN_READ_ACTIONS = [
  'codeartifact:GetDomainPermissionsPolicy',
  'codeartifact:ListRepositoriesInDomain',
  'codeartifact:DescribeDomain',
];

/**
 * @experimental
 */
export const DOMAIN_CREATE_ACTIONS = [
  'codeartifact:CreateRepository',
];

/**
 * @experimental
 */
export const DOMAIN_LOGIN_ACTIONS = [
  'codeartifact:GetAuthorizationToken',
];