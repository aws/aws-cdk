import { Construct } from 'constructs';
import { CfnParameter } from '../cfn-parameter';
export declare class FileAssetParameters extends Construct {
    readonly bucketNameParameter: CfnParameter;
    readonly objectKeyParameter: CfnParameter;
    readonly artifactHashParameter: CfnParameter;
    constructor(scope: Construct, id: string);
}
