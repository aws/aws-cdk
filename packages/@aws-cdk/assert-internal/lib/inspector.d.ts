import * as api from '@aws-cdk/cx-api';
import { Assertion } from './assertion';
import { MatchStyle } from './assertions/match-template';
export declare abstract class Inspector {
    aroundAssert?: (cb: () => void) => any;
    constructor();
    to(assertion: Assertion<this>): any;
    notTo(assertion: Assertion<this>): any;
    abstract get value(): any;
    private _to;
}
export declare class StackInspector extends Inspector {
    readonly stack: api.CloudFormationStackArtifact | object;
    private readonly template;
    constructor(stack: api.CloudFormationStackArtifact | object);
    at(path: string | string[]): StackPathInspector;
    toMatch(template: {
        [key: string]: any;
    }, matchStyle?: MatchStyle): any;
    get value(): {
        [key: string]: any;
    };
}
export declare class StackPathInspector extends Inspector {
    readonly stack: api.CloudFormationStackArtifact;
    readonly path: string;
    constructor(stack: api.CloudFormationStackArtifact, path: string);
    get value(): {
        [key: string]: any;
    } | undefined;
}
