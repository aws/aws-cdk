Open Issues
==============

- How to specify multiple sources, and where they go in the build? Do we just add the concept
  of Artifacts back into the user model, but optional?
- Similar for the sources for a shell script action.
- Specifying secrets for getting Git sources. Do we just say "secret name" and it's up to the backend
  what that means for where secrets will live? (SecretsManager secret in AWS, Env var in GitHub Actions,
  env var in Jenkins, etc?) Or potentially, do we lift the concept of "secrets manager" secret to the main
  API and in GHA/Jenkins we have to do an API call using "current" creds to get it?
- CodeBuild Project tweaks like execution role permissions -- where do they go? It doesn't make sense for
  anything other than AWS, but that's backend-specific and you'd like to specify this at the front end.
- Specifying images (ECR, DockerHub, auth...). Implies dependencies on AWS CDK libraries (`aws-ecr`, `aws-ecr-assets`).
  How does an asset image even deploy for GitHub Actions?

- Rollout problem! How do we introduce this without breaking existing users? The "prime real estate name"
  of `@aws-cdk/pipelines.CdkPipeline` is already taken. I guess we're going to have to either rename the
  class (while deprecating the old classes), or rename the module.
