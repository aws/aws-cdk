import jsonschema = require('jsonschema');
import { Manifest } from './manifest';
export declare const schema: jsonschema.Schema;
/**
 * Validate that ``obj`` is a valid Cloud Assembly manifest document, both syntactically and semantically. The semantic
 * validation ensures all Drop references are valid (they point to an existing Drop in the same manifest document), and
 * that there are no cycles in the dependency graph described by the manifest.
 *
 * @param obj the object to be validated.
 *
 * @returns ``obj``
 * @throws Error if ``obj`` is not a Cloud Assembly manifest document or if it is semantically invalid.
 */
export declare function validateManifest(obj: unknown): Manifest;
