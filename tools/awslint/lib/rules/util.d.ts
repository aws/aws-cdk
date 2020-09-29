import * as reflect from 'jsii-reflect';
/**
 * Returns a documentation tag. Looks it up in inheritance hierarchy.
 * @param documentable starting point
 * @param tag the tag to search for
 */
export declare function getDocTag(documentable: reflect.Documentable, tag: string): string | undefined;
export declare function memberFqn(m: reflect.Method | reflect.Property): string;
