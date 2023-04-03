import { Messages } from './message';
export declare function findMessage(messages: Messages, constructPath: string, props?: any): {
    [key: string]: {
        [key: string]: any;
    };
};
export declare function hasMessage(messages: Messages, constructPath: string, props: any): string | void;
export declare function hasNoMessage(messages: Messages, constructPath: string, props: any): string | void;
