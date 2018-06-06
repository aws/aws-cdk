import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

if (fs.existsSync(path.join(os.homedir(), ".aws", "credentials")) && fs.existsSync(path.join(os.homedir(), ".aws", "config"))) {
    // Ensures that region is loaded from ~/.aws/config (https://github.com/aws/aws-sdk-js/pull/1391)

    // Only set this value if if the requisite files exist, otherwise this is
    // just going to throw an unhelpful error.
    process.env.AWS_SDK_LOAD_CONFIG = '1';
}

import { Environment} from 'aws-cdk-cx-api';
import { CloudFormation, config, CredentialProviderChain , EC2, S3, SSM, STS } from 'aws-sdk';
import { debug } from '../../logging';
import { PluginHost } from '../../plugin';
import { CredentialProviderSource, Mode } from '../aws-auth/credentials';

/**
 * Source for SDK client objects
 *
 * Credentials are first obtained from the SDK defaults (using environment variables and the
 * ~/.aws/{config,credentials} files).
 *
 * If those don't suffice, a list of CredentialProviderSources is interrogated for access
 * to the requested account.
 */
export class SDK {
    private defaultAccountFetched = false;
    private defaultAccountId?: string = undefined;
    private credentialSources: CredentialProviderSource[];
    private readonly userAgent: string;

    constructor() {
        this.credentialSources = PluginHost.instance.credentialProviderSources;

        // Find the package.json from the main toolkit
        const pkg = (require.main as any).require('package.json');
        this.userAgent = `${pkg.name}/${pkg.version}`;

        // tslint:disable-next-line:no-console
        console.error('useragent', this.userAgent);
    }

    public async cloudFormation(environment: Environment, mode: Mode): Promise<CloudFormation> {
        return new CloudFormation({
            region: environment.region,
            credentialProvider: await this.getCredentialProvider(environment.account, mode),
            customUserAgent: this.userAgent
        });
    }

    public async ec2(awsAccountId: string | undefined, region: string | undefined, mode: Mode): Promise<EC2> {
        return new EC2({
            region,
            credentialProvider: await this.getCredentialProvider(awsAccountId, mode),
            customUserAgent: this.userAgent
        });
    }

    public async ssm(awsAccountId: string | undefined, region: string | undefined, mode: Mode): Promise<SSM> {
        return new SSM({
            region,
            credentialProvider: await this.getCredentialProvider(awsAccountId, mode),
            customUserAgent: this.userAgent
        });
    }

    public async s3(environment: Environment, mode: Mode): Promise<S3> {
        return new S3({
            region: environment.region,
            credentialProvider: await this.getCredentialProvider(environment.account, mode),
            customUserAgent: this.userAgent
        });
    }

    public defaultRegion() {
        debug('Obtaining default region from AWS configuration');
        return config.region;
    }

    public async defaultAccount() {
        if (!this.defaultAccountFetched) {
            this.defaultAccountId = await this.lookupDefaultAccount();
            this.defaultAccountFetched = true;
        }
        return this.defaultAccountId;
    }

    private async lookupDefaultAccount() {
        try {
            debug('Looking up default account ID from STS');
            const result = await new STS().getCallerIdentity().promise();
            return result.Account;
        } catch (e) {
            debug('Unable to retrieve default account from STS:', e);
            return undefined;
        }
    }

    private async getCredentialProvider(awsAccountId: string | undefined, mode: Mode): Promise<CredentialProviderChain | undefined> {
        // If requested account is undefined or equal to default account, use default credentials provider.
        const defaultAccount = await this.defaultAccount();
        if (!awsAccountId || awsAccountId === defaultAccount) {
            debug(`Using default AWS SDK credentials for account ${awsAccountId}`);
            return undefined;
        }

        const triedSources: CredentialProviderSource[] = [];

        // Otherwise, inspect the various credential sources we have
        for (const source of this.credentialSources) {
            if (!(await source.isAvailable())) {
                debug('Credentials source %s is not available, ignoring it.', source.name);
                continue;
            }
            triedSources.push(source);

            if (!(await source.canProvideCredentials(awsAccountId))) { continue; }
            debug(`Using ${source.name} credentials for account ${awsAccountId}`);

            return await source.getProvider(awsAccountId, mode);
        }

        const sourceNames = ['default credentials'].concat(triedSources.map(s => s.name)).join(', ');

        throw new Error(`Need to perform AWS calls for account ${awsAccountId}, but no credentials found. Tried: ${sourceNames}.`);
    }
}
