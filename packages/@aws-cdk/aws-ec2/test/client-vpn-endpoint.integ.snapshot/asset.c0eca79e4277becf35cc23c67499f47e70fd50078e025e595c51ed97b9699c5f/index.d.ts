export declare function handler(event: AWSLambda.CloudFormationCustomResourceEvent): Promise<{
    Data: {
        ServerCertificateArn: string | undefined;
        ClientCertificateArn: string | undefined;
    };
} | undefined>;
