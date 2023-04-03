import { Template } from './template';
export declare function findMappings(template: Template, logicalId: string, props?: any): {
    [key: string]: {
        [key: string]: any;
    };
};
export declare function hasMapping(template: Template, logicalId: string, props: any): string | void;
