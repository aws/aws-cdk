import * as AWS from 'aws-sdk';
import { sleep } from '../aws';

const COLLECT_BY_TAG = 'collect-by';
const REPO_LIFETIME_MS = 24 * 3600 * 1000; // One day

export class TestRepository {
  public static readonly DEFAULT_DOMAIN = 'test-cdk';

  public static async newRandom() {
    const qualifier = Math.random().toString(36).replace(/[^a-z0-9]+/g, '');

    const repo = new TestRepository(`test-${qualifier}`);
    await repo.prepare();
    return repo;
  }

  public static async newWithName(name: string) {
    const repo = new TestRepository(name);
    await repo.prepare();
    return repo;
  }

  public static existing(repositoryName: string) {
    return new TestRepository(repositoryName);
  }

  /**
   * Garbage collect repositories
   */
  public static async gc() {
    if (!await TestRepository.existing('*dummy*').domainExists()) {
      return;
    }

    const codeArtifact = new AWS.CodeArtifact();

    let nextToken: string | undefined;
    do {
      const page = await codeArtifact.listRepositories({ nextToken }).promise();

      for (const repo of page.repositories ?? []) {
        const tags = await codeArtifact.listTagsForResource({ resourceArn: repo.arn! }).promise();
        const collectable = tags?.tags?.find(t => t.key === COLLECT_BY_TAG && Number(t.value) < Date.now());
        if (collectable) {
          // eslint-disable-next-line no-console
          console.log('Deleting', repo.name);
          await codeArtifact.deleteRepository({
            domain: repo.domainName!,
            repository: repo.name!,
          }).promise();
        }
      }

      nextToken = page.nextToken;
    } while (nextToken);
  }

  public readonly npmUpstream = 'npm-upstream';
  public readonly pypiUpstream = 'pypi-upstream';
  public readonly nugetUpstream = 'nuget-upstream';
  public readonly mavenUpstream = 'maven-upstream';
  public readonly domain = TestRepository.DEFAULT_DOMAIN;

  private readonly codeArtifact = new AWS.CodeArtifact();

  private _loginInformation: LoginInformation | undefined;

  private constructor(public readonly repositoryName: string) {
  }

  public async prepare() {
    await this.ensureDomain();
    await this.ensureUpstreams();

    await this.ensureRepository(this.repositoryName, {
      description: 'Testing repository',
      upstreams: [
        this.npmUpstream,
        this.pypiUpstream,
        this.nugetUpstream,
        this.mavenUpstream,
      ],
      tags: {
        [COLLECT_BY_TAG]: `${Date.now() + REPO_LIFETIME_MS}`,
      },
    });
  }

  public async loginInformation(): Promise<LoginInformation> {
    if (this._loginInformation) {
      return this._loginInformation;
    }

    this._loginInformation = {
      authToken: (await this.codeArtifact.getAuthorizationToken({ domain: this.domain, durationSeconds: 12 * 3600 }).promise()).authorizationToken!,
      repositoryName: this.repositoryName,
      npmEndpoint: (await this.codeArtifact.getRepositoryEndpoint({ domain: this.domain, repository: this.repositoryName, format: 'npm' }).promise()).repositoryEndpoint!,
      mavenEndpoint: (await this.codeArtifact.getRepositoryEndpoint({ domain: this.domain, repository: this.repositoryName, format: 'maven' }).promise()).repositoryEndpoint!,
      nugetEndpoint: (await this.codeArtifact.getRepositoryEndpoint({ domain: this.domain, repository: this.repositoryName, format: 'nuget' }).promise()).repositoryEndpoint!,
      pypiEndpoint: (await this.codeArtifact.getRepositoryEndpoint({ domain: this.domain, repository: this.repositoryName, format: 'pypi' }).promise()).repositoryEndpoint!,
    };
    return this._loginInformation;
  }

  public async delete() {
    try {
      await this.codeArtifact.deleteRepository({
        domain: this.domain,
        repository: this.repositoryName,
      }).promise();

      // eslint-disable-next-line no-console
      console.log('Deleted', this.repositoryName);
    } catch (e: any) {
      if (e.code !== 'ResourceNotFoundException') { throw e; }
      // Okay
    }
  }

  /**
   * List all packages and mark them as "allow upstream versions".
   *
   * If we don't do this and we publish `foo@2.3.4-rc.0`, then we can't
   * download `foo@2.3.0` anymore because by default CodeArtifact will
   * block different versions from the same package.
   */
  public async markAllUpstreamAllow() {
    for await (const pkg of this.listPackages({ upstream: 'BLOCK' })) {
      await retryThrottled(() => this.codeArtifact.putPackageOriginConfiguration({
        domain: this.domain,
        repository: this.repositoryName,

        format: pkg.format!,
        package: pkg.package!,
        namespace: pkg.namespace!,
        restrictions: {
          publish: 'ALLOW',
          upstream: 'ALLOW',
        },
      }).promise());
    }
  }

  private async ensureDomain() {
    if (await this.domainExists()) { return; }
    await this.codeArtifact.createDomain({
      domain: this.domain,
      tags: [{ key: 'testing', value: 'true' }],
    }).promise();
  }

  private async ensureUpstreams() {
    await this.ensureRepository(this.npmUpstream, {
      description: 'The upstream repository for NPM',
      external: 'public:npmjs',
    });
    await this.ensureRepository(this.mavenUpstream, {
      description: 'The upstream repository for Maven',
      external: 'public:maven-central',
    });
    await this.ensureRepository(this.nugetUpstream, {
      description: 'The upstream repository for NuGet',
      external: 'public:nuget-org',
    });
    await this.ensureRepository(this.pypiUpstream, {
      description: 'The upstream repository for PyPI',
      external: 'public:pypi',
    });
  }

  private async ensureRepository(name: string, options?: {
    readonly description?: string,
    readonly external?: string,
    readonly upstreams?: string[],
    readonly tags?: Record<string, string>,
  }) {
    if (await this.repositoryExists(name)) { return; }

    await this.codeArtifact.createRepository({
      domain: this.domain,
      repository: name,
      description: options?.description,
      upstreams: options?.upstreams?.map(repositoryName => ({ repositoryName })),
      tags: options?.tags ? Object.entries(options.tags).map(([key, value]) => ({ key, value })) : undefined,
    }).promise();

    if (options?.external) {
      const externalConnection = options.external;
      await retry(() => this.codeArtifact.associateExternalConnection({
        domain: this.domain,
        repository: name,
        externalConnection,
      }).promise());
    }
  }

  private async domainExists() {
    try {
      await this.codeArtifact.describeDomain({ domain: this.domain }).promise();
      return true;
    } catch (e: any) {
      if (e.code !== 'ResourceNotFoundException') { throw e; }
      return false;
    }
  }

  private async repositoryExists(name: string) {
    try {
      await this.codeArtifact.describeRepository({ domain: this.domain, repository: name }).promise();
      return true;
    } catch (e: any) {
      if (e.code !== 'ResourceNotFoundException') { throw e; }
      return false;
    }
  }

  private async* listPackages(filter: Pick<AWS.CodeArtifact.ListPackagesRequest, 'upstream'|'publish'|'format'> = {}) {
    let response = await retryThrottled(() => this.codeArtifact.listPackages({
      domain: this.domain,
      repository: this.repositoryName,
      ...filter,
    }).promise());

    while (true) {
      for (const p of response.packages ?? []) {
        yield p;
      }

      if (!response.nextToken) {
        break;
      }

      response = await retryThrottled(() => this.codeArtifact.listPackages({
        domain: this.domain,
        repository: this.repositoryName,
        ...filter,
        nextToken: response.nextToken,
      }).promise());
    }
  }
}

async function retry<A>(block: () => Promise<A>) {
  let attempts = 3;
  while (true) {
    try {
      return await block();
    } catch (e: any) {
      if (attempts-- === 0) { throw e; }
      // eslint-disable-next-line no-console
      console.debug(e.message);
      await sleep(500);
    }
  }
}

async function retryThrottled<A>(block: () => Promise<A>) {
  let time = 100;
  let attempts = 15;
  while (true) {
    try {
      return await block();
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.debug(e.message);
      if (e.code !== 'ThrottlingException') { throw e; }
      if (attempts-- === 0) { throw e; }
      await sleep(Math.floor(Math.random() * time));
      time *= 2;
    }
  }
}

export interface LoginInformation {
  readonly authToken: string;
  readonly repositoryName: string;
  readonly npmEndpoint: string;
  readonly mavenEndpoint: string;
  readonly nugetEndpoint: string;
  readonly pypiEndpoint: string;
}
