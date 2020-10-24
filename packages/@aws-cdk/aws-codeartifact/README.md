## AWS::CodeArtifact Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

---
<!--END STABILITY BANNER-->

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
    domainName: domain.domainName,
});
```

### External Connections
Extenal connections can be added by calling `.withExternalConnections(...)` method on a repository. It accepts and
array of external connecitions. You can also pass the external connections when creating a repository by setting the
`externalConnections` property.

Add an external connection when constructing a new repository
```ts
import * as codeartifact from '@aws-cdk/aws-codeartifact';

const domain = new codeartifact.Domain(stack, 'domain', { domainName: 'example-domain' });
const repository = new codeartifact.Repository(stack, 'repository', {
    repositoryName: 'repository',
    domainName: domain.domainName,
    externalConnections: [codeartifact.ExternalConnection.NPM]
});
```

Add an external connection to an existing repository
```ts
import * as codeartifact from '@aws-cdk/aws-codeartifact';

const domain = new codeartifact.Domain(stack, 'domain', { domainName: 'example-domain' });
const repository = new codeartifact.Repository(stack, 'repository', {
    repositoryName: 'repository',
    domainName: domain.domainName
});


repository.withExternalConnections(codeartifact.ExternalConnection.NPM);
```

### Upstream Repositories
Upstream repositories can be added by calling `.withUpstream(...)` method on a repository. It accepts an array of `IRepository`.
You can also pass the upstream repositories in the `upstreams` property during construction.

Add an upstream when constructing a new repository
```ts
import * as codeartifact from '@aws-cdk/aws-codeartifact';

const domain = new codeartifact.Domain(stack, 'domain', { domainName: 'example-domain' });

const upstreamRepository = new codeartifact.Repository(stack, 'upstream-repository', {
    repositoryName: 'upstream-repository',
    domainName: domain.domainName,
});

const repository = new codeartifact.Repository(stack, 'repository', {
    repositoryName: 'repository',
    domainName: domain.domainName,
    upstreams: [upstreamRepository]
});
```

Add an upstream to an existing repository
```ts
import * as codeartifact from '@aws-cdk/aws-codeartifact';

const domain = new codeartifact.Domain(stack, 'domain', { domainName: 'example-domain' });

const upstreamRepository = new codeartifact.Repository(stack, 'upstream-repository', {
    repositoryName: 'upstream-repository',
    domainName: domain.domainName,
});

const repository = new codeartifact.Repository(stack, 'repository', {
    repositoryName: 'repository',
    domainName: domain.domainName
});


repository.withUpstream(upstreamRepository);
```