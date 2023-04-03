"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoArtifacts = void 0;
const artifacts_1 = require("./artifacts");
/**
 * A `NO_ARTIFACTS` CodeBuild Project Artifact definition.
 * This is the default artifact type,
 * if none was specified when creating the Project
 * (and the source was not specified to be CodePipeline).
 * *Note*: the `NO_ARTIFACTS` type cannot be used as a secondary artifact,
 * and because of that, you're not allowed to specify an identifier for it.
 *
 * This class is private to the @aws-codebuild package.
 */
class NoArtifacts extends artifacts_1.Artifacts {
    constructor() {
        super({});
        this.type = 'NO_ARTIFACTS';
    }
}
exports.NoArtifacts = NoArtifacts;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tYXJ0aWZhY3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibm8tYXJ0aWZhY3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUF3QztBQUV4Qzs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFhLFdBQVksU0FBUSxxQkFBUztJQUd4QztRQUNFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUhJLFNBQUksR0FBRyxjQUFjLENBQUM7S0FJckM7Q0FDRjtBQU5ELGtDQU1DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXJ0aWZhY3RzIH0gZnJvbSAnLi9hcnRpZmFjdHMnO1xuXG4vKipcbiAqIEEgYE5PX0FSVElGQUNUU2AgQ29kZUJ1aWxkIFByb2plY3QgQXJ0aWZhY3QgZGVmaW5pdGlvbi5cbiAqIFRoaXMgaXMgdGhlIGRlZmF1bHQgYXJ0aWZhY3QgdHlwZSxcbiAqIGlmIG5vbmUgd2FzIHNwZWNpZmllZCB3aGVuIGNyZWF0aW5nIHRoZSBQcm9qZWN0XG4gKiAoYW5kIHRoZSBzb3VyY2Ugd2FzIG5vdCBzcGVjaWZpZWQgdG8gYmUgQ29kZVBpcGVsaW5lKS5cbiAqICpOb3RlKjogdGhlIGBOT19BUlRJRkFDVFNgIHR5cGUgY2Fubm90IGJlIHVzZWQgYXMgYSBzZWNvbmRhcnkgYXJ0aWZhY3QsXG4gKiBhbmQgYmVjYXVzZSBvZiB0aGF0LCB5b3UncmUgbm90IGFsbG93ZWQgdG8gc3BlY2lmeSBhbiBpZGVudGlmaWVyIGZvciBpdC5cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIHByaXZhdGUgdG8gdGhlIEBhd3MtY29kZWJ1aWxkIHBhY2thZ2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBOb0FydGlmYWN0cyBleHRlbmRzIEFydGlmYWN0cyB7XG4gIHB1YmxpYyByZWFkb25seSB0eXBlID0gJ05PX0FSVElGQUNUUyc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe30pO1xuICB9XG59XG4iXX0=