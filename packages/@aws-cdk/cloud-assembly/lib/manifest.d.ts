export interface Manifest {
    schema: 'cloud-assembly/1.0';
    drops: {
        [logicalId: string]: Drop;
    };
    /**
     * @minProperties 1
     */
    missing?: {
        [key: string]: Missing;
    };
}
export interface Drop {
    /**
     * @minItems 1
     */
    dependsOn?: string[];
    /**
     * @pattern ^[^:]+://.+$
     */
    type: string;
    /**
     * @pattern ^[^:]+://.+$
     */
    environment: string;
    /**
     * @minProperties 1
     */
    metadata?: {
        [key: string]: Metadata;
    };
    /**
     * @minProperties 1
     */
    properties?: {
        [name: string]: any;
    };
}
export interface Missing {
    /**
     * @pattern ^[^:]+://.+$
     */
    provider: string;
    /**
     * @minProperties 1
     */
    props: {
        [key: string]: any;
    };
}
export interface Metadata {
    tag: string;
    value: any;
}
