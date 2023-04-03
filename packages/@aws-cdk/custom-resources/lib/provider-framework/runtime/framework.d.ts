import * as consts from './consts';
declare const _default: {
    onEvent: (event: any) => Promise<void>;
    isComplete: (event: any) => Promise<void>;
    onTimeout: typeof onTimeout;
};
export = _default;
declare function onTimeout(timeoutEvent: any): Promise<void>;
