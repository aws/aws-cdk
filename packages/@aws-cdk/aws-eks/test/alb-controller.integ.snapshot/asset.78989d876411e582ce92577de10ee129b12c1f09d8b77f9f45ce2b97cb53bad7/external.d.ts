import * as aws from 'aws-sdk';
declare function defaultLogger(fmt: string, ...args: any[]): void;
/**
 * Downloads the CA thumbprint from the issuer URL
 */
declare function downloadThumbprint(issuerUrl: string): Promise<string>;
export declare const external: {
    downloadThumbprint: typeof downloadThumbprint;
    log: typeof defaultLogger;
    createOpenIDConnectProvider: (req: aws.IAM.CreateOpenIDConnectProviderRequest) => Promise<import("aws-sdk/lib/request").PromiseResult<aws.IAM.CreateOpenIDConnectProviderResponse, aws.AWSError>>;
    deleteOpenIDConnectProvider: (req: aws.IAM.DeleteOpenIDConnectProviderRequest) => Promise<{
        $response: aws.Response<{}, aws.AWSError>;
    }>;
    updateOpenIDConnectProviderThumbprint: (req: aws.IAM.UpdateOpenIDConnectProviderThumbprintRequest) => Promise<{
        $response: aws.Response<{}, aws.AWSError>;
    }>;
    addClientIDToOpenIDConnectProvider: (req: aws.IAM.AddClientIDToOpenIDConnectProviderRequest) => Promise<{
        $response: aws.Response<{}, aws.AWSError>;
    }>;
    removeClientIDFromOpenIDConnectProvider: (req: aws.IAM.RemoveClientIDFromOpenIDConnectProviderRequest) => Promise<{
        $response: aws.Response<{}, aws.AWSError>;
    }>;
};
export {};
