export declare type Template = {
    Resources?: {
        [logicalId: string]: Resource;
    };
    Outputs?: {
        [logicalId: string]: Output;
    };
    Mappings?: {
        [logicalId: string]: Mapping;
    };
    Parameters?: {
        [logicalId: string]: Parameter;
    };
    Conditions?: {
        [logicalId: string]: Condition;
    };
};
export declare type Resource = {
    Type: string;
    DependsOn?: string | string[];
    Properties?: {
        [key: string]: any;
    };
    [key: string]: any;
};
export declare type Output = {
    [key: string]: any;
};
export declare type Mapping = {
    [key: string]: any;
};
export declare type Parameter = {
    Type: string;
    [key: string]: any;
};
export declare type Condition = {
    [key: string]: any;
};
