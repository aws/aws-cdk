import { IAws } from '../aws';
/**
 * Replace the {ACCOUNT} and {REGION} placeholders in all strings found in a complex object.
 *
 * Duplicated between cdk-assets and aws-cdk CLI because we don't have a good single place to put it
 * (they're nominally independent tools).
 */
export declare function replaceAwsPlaceholders<A extends {
    region?: string;
}>(object: A, aws: IAws): Promise<A>;
