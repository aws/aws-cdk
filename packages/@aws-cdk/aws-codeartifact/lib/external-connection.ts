/**
 * CodeArtifact supports an external connection to the following public repositories.
 * @experimental
 * @see https://docs.aws.amazon.com/codeartifact/latest/ug/external-connection.html#supported-public-repositories
 */
export enum ExternalConnection {
  /**
   * NPM public registry
   */
  NPM = 'public:npmjs',
  /**
   * NuGet.org public registry
   */
  DOTNET_NUGETORG = 'public:nuget-org',
  /**
   * Python Package Index
   */
  PYTHON_PYPI = 'public:pypi',
  /**
   * Maven Central
   */
  MAVEN_CENTRAL = 'public:maven-central',
  /**
   * Google Android repository
   */
  MAVEN_GOOGLEANDROID = 'public:maven-googleandroid',
  /**
   * Gradle plugins repository
   */
  MAVEN_GRADLEPLUGINS = 'public:maven-gradleplugins',
  /**
   * CommonsWare Android repository
   * */
  MAVEN_COMMONSWARE = 'public:maven-commonsware',
}