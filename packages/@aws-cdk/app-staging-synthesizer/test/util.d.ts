import * as cxapi from 'aws-cdk-lib/cx-api';
export declare const CFN_CONTEXT: {
    'AWS::Region': string;
    'AWS::AccountId': string;
    'AWS::URLSuffix': string;
};
export declare const APP_ID = "appid";
export declare function isAssetManifest(x: cxapi.CloudArtifact): x is cxapi.AssetManifestArtifact;
export declare function last<A>(xs?: A[]): A | undefined;
