interface LogRetentionEvent extends Omit<AWSLambda.CloudFormationCustomResourceEvent, 'ResourceProperties'> {
    ResourceProperties: {
        ServiceToken: string;
        LogGroupName: string;
        LogGroupRegion?: string;
        RetentionInDays?: string;
        SdkRetry?: {
            maxRetries?: string;
        };
        RemovalPolicy?: string;
    };
}
export declare function handler(event: LogRetentionEvent, context: AWSLambda.Context): Promise<void>;
export {};
