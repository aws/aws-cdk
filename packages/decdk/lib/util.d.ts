import * as jsiiReflect from 'jsii-reflect';
/**
 * Reads a YAML/JSON template file.
 */
export declare function readTemplate(templateFile: string): Promise<any>;
export declare function loadTypeSystem(validate?: boolean): Promise<jsiiReflect.TypeSystem>;
export declare function stackNameFromFileName(fileName: string): string;
