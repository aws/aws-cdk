import { CredentialProviderSource } from './api/aws-auth/credentials';

/**
 * Extension points to be used by plug-ins to the CDK Toolkit.
 *
 * Plug-in authors can `import { plugin } from 'aws-cdk-toolkit';`
 */
export namespace plugin {
    const CREDENTIAL_PROVIDER_SOURCES = new Array<CredentialProviderSource>();

    /**
     * Access the currently registered CredentialProviderSources. New sources can
     * be registered using the +registerCredentialProviderSource+ function.
     *
     * @return the currently registered CredentialProviderSources.
     */
    export function getCredentialProviderSources() {
        return CREDENTIAL_PROVIDER_SOURCES;
    }

    /**
     * Allows plug-ins to register new CredentialProviderSources.
     *
     * @param source a new CredentialProviderSource to register.
     */
    export function registerCredentialProviderSource(source: CredentialProviderSource) {
        CREDENTIAL_PROVIDER_SOURCES.push(source);
    }
}
