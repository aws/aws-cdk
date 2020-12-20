# AWS::CodeArtifact Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources]) are always stable and safe to use.
>
> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

CodeArtifact is a fully managed artifact repository service that makes it easy for organizations to securely store and share software packages used for application development. You can use CodeArtifact with popular build tools and package managers such as **Maven**, **Gradle**, **npm**, **yarn**, **pip**, and **twine**.

For further information on CodeCommit, see the [AWS CodeArtifact documentation](https://docs.aws.amazon.com/codeartifact).

Add a CodeArtifact Domain to your stack:

```ts
import * as codeartifact from '@aws-cdk/aws-codeartifact';

const domain = new codeartifact.Domain(stack, 'domain', { domainName: 'example-domain' });
```

Add a CodeArtifact Repository to your stack:

```ts
import * as codeartifact from '@aws-cdk/aws-codeartifact';

const domain = new codeartifact.Domain(stack, 'domain', { domainName: 'example-domain' });
const repository = new codeartifact.Repository(stack, 'repository', {
    repositoryName: 'repository',
    domain: domain,
});
```

It is possible to use the `addRepository` method on `codeartifact.Domain` to add repostories implicitly.

```ts
import * as codeartifact from '@aws-cdk/aws-codeartifact';

const domain = new codeartifact.Domain(stack, 'domain', { domainName: 'example-domain' });
const repo1 = new codeartifact.Repository(stack, 'repository_1', { repositoryName: 'repository-1' });
const repo2 = new codeartifact.Repository(stack, 'repository_2', { repositoryName: 'repository-2' });

domain.addRepositories(repo1, repo2);

```

## External Connections

Extenal connections can be added by calling `.withExternalConnections(...)` method on a repository. It accepts and
array of external connecitions. You can also pass the external connections when creating a repository by setting the
`externalConnections` property.

Add an external connection when constructing a new repository

```ts
import * as codeartifact from '@aws-cdk/aws-codeartifact';

const domain = new codeartifact.Domain(stack, 'domain', { domainName: 'example-domain' });
const repository = new codeartifact.Repository(stack, 'repository', {
    repositoryName: 'repository',
    domain: domain,
    externalConnections: [codeartifact.ExternalConnection.NPM]
});
```

Add an external connection to an existing repository

```ts
import * as codeartifact from '@aws-cdk/aws-codeartifact';

const domain = new codeartifact.Domain(stack, 'domain', { domainName: 'example-domain' });
const repository = new codeartifact.Repository(stack, 'repository', {
    repositoryName: 'repository',
    domain: domain
});


repository.withExternalConnections(codeartifact.ExternalConnection.NPM);
```

## Upstream Repositories

Upstream repositories can be added by calling `.withUpstream(...)` method on a repository. It accepts an array of `IRepository`.
You can also pass the upstream repositories in the `upstreams` property during construction.

Add an upstream when constructing a new repository

```ts
import * as codeartifact from '@aws-cdk/aws-codeartifact';

const domain = new codeartifact.Domain(stack, 'domain', { domainName: 'example-domain' });

const upstreamRepository = new codeartifact.Repository(stack, 'upstream-repository', {
    repositoryName: 'upstream-repository',
    domain: domain,
});

const repository = new codeartifact.Repository(stack, 'repository', {
    repositoryName: 'repository',
    domain: domain,
    upstreams: [upstreamRepository]
});
```

Add an upstream to an existing repository

```ts
import * as codeartifact from '@aws-cdk/aws-codeartifact';

const domain = new codeartifact.Domain(stack, 'domain', { domainName: 'example-domain' });

const upstreamRepository = new codeartifact.Repository(stack, 'upstream-repository', {
    repositoryName: 'upstream-repository',
    domain: domain,
});

const repository = new codeartifact.Repository(stack, 'repository', {
    repositoryName: 'repository',
    domain: domain
});


repository.withUpstream(upstreamRepository);
```
