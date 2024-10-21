export interface ImportCacheKey {
    readonly fileName: string;
    readonly typeName: string;
}
export type Node = any;
export interface ImportCacheRecord extends ImportCacheKey {
    readonly importNode: Node;
    readonly localName: string;
}
export declare class ImportCache {
    private records;
    record(record: ImportCacheRecord): void;
    find(key: ImportCacheKey): ImportCacheRecord | undefined;
    get imports(): ImportCacheRecord[];
}
