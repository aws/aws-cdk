import { BuildSpec } from '../build-spec';
export declare const S3_BUCKET_ENV = "SCRIPT_S3_BUCKET";
export declare const S3_KEY_ENV = "SCRIPT_S3_KEY";
export declare function runScriptLinuxBuildSpec(entrypoint: string): BuildSpec;
