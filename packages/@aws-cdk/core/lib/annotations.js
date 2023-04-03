"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Annotations = void 0;
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const cxapi = require("@aws-cdk/cx-api");
/**
 * Includes API for attaching annotations such as warning messages to constructs.
 */
class Annotations {
    /**
     * Returns the annotations API for a construct scope.
     * @param scope The scope
     */
    static of(scope) {
        return new Annotations(scope);
    }
    constructor(scope) {
        this.scope = scope;
        const disableTrace = scope.node.tryGetContext(cxapi.DISABLE_METADATA_STACK_TRACE) ||
            process.env.CDK_DISABLE_STACK_TRACE;
        this.stackTraces = !disableTrace;
    }
    /**
     * Adds a warning metadata entry to this construct.
     *
     * The CLI will display the warning when an app is synthesized, or fail if run
     * in --strict mode.
     *
     * @param message The warning message.
     */
    addWarning(message) {
        this.addMessage(cxschema.ArtifactMetadataEntryType.WARN, message);
    }
    /**
     * Adds an info metadata entry to this construct.
     *
     * The CLI will display the info message when apps are synthesized.
     *
     * @param message The info message.
     */
    addInfo(message) {
        this.addMessage(cxschema.ArtifactMetadataEntryType.INFO, message);
    }
    /**
     * Adds an { "error": <message> } metadata entry to this construct.
     * The toolkit will fail deployment of any stack that has errors reported against it.
     * @param message The error message.
     */
    addError(message) {
        this.addMessage(cxschema.ArtifactMetadataEntryType.ERROR, message);
    }
    /**
     * Adds a deprecation warning for a specific API.
     *
     * Deprecations will be added only once per construct as a warning and will be
     * deduplicated based on the `api`.
     *
     * If the environment variable `CDK_BLOCK_DEPRECATIONS` is set, this method
     * will throw an error instead with the deprecation message.
     *
     * @param api The API being deprecated in the format `module.Class.property`
     * (e.g. `@aws-cdk/core.Construct.node`).
     * @param message The deprecation message to display, with information about
     * alternatives.
     */
    addDeprecation(api, message) {
        const text = `The API ${api} is deprecated: ${message}. This API will be removed in the next major release`;
        // throw if CDK_BLOCK_DEPRECATIONS is set
        if (process.env.CDK_BLOCK_DEPRECATIONS) {
            throw new Error(`${this.scope.node.path}: ${text}`);
        }
        this.addWarning(text);
    }
    /**
     * Adds a message metadata entry to the construct node, to be displayed by the CDK CLI.
     *
     * Records the message once per construct.
     * @param level The message level
     * @param message The message itself
     */
    addMessage(level, message) {
        const isNew = !this.scope.node.metadata.find((x) => x.data === message);
        if (isNew) {
            this.scope.node.addMetadata(level, message, { stackTrace: this.stackTraces });
        }
    }
}
exports.Annotations = Annotations;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ub3RhdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbm5vdGF0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyREFBMkQ7QUFDM0QseUNBQXlDO0FBR3pDOztHQUVHO0FBQ0gsTUFBYSxXQUFXO0lBQ3RCOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBaUI7UUFDaEMsT0FBTyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBSUQsWUFBcUMsS0FBaUI7UUFBakIsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUNwRCxNQUFNLFlBQVksR0FDaEIsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDO1lBQzVELE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUM7UUFFdEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLFlBQVksQ0FBQztJQUNuQyxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLFVBQVUsQ0FBQyxPQUFlO1FBQy9CLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksT0FBTyxDQUFDLE9BQWU7UUFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMseUJBQXlCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksUUFBUSxDQUFDLE9BQWU7UUFDN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMseUJBQXlCLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0ksY0FBYyxDQUFDLEdBQVcsRUFBRSxPQUFlO1FBQ2hELE1BQU0sSUFBSSxHQUFHLFdBQVcsR0FBRyxtQkFBbUIsT0FBTyxzREFBc0QsQ0FBQztRQUU1Ryx5Q0FBeUM7UUFDekMsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixFQUFFO1lBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQztTQUNyRDtRQUVELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNLLFVBQVUsQ0FBQyxLQUFhLEVBQUUsT0FBZTtRQUMvQyxNQUFNLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUM7UUFDeEUsSUFBSSxLQUFLLEVBQUU7WUFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztTQUMvRTtJQUNILENBQUM7Q0FDRjtBQXpGRCxrQ0F5RkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjeHNjaGVtYSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuLyoqXG4gKiBJbmNsdWRlcyBBUEkgZm9yIGF0dGFjaGluZyBhbm5vdGF0aW9ucyBzdWNoIGFzIHdhcm5pbmcgbWVzc2FnZXMgdG8gY29uc3RydWN0cy5cbiAqL1xuZXhwb3J0IGNsYXNzIEFubm90YXRpb25zIHtcbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGFubm90YXRpb25zIEFQSSBmb3IgYSBjb25zdHJ1Y3Qgc2NvcGUuXG4gICAqIEBwYXJhbSBzY29wZSBUaGUgc2NvcGVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgb2Yoc2NvcGU6IElDb25zdHJ1Y3QpIHtcbiAgICByZXR1cm4gbmV3IEFubm90YXRpb25zKHNjb3BlKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgc3RhY2tUcmFjZXM6IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHNjb3BlOiBJQ29uc3RydWN0KSB7XG4gICAgY29uc3QgZGlzYWJsZVRyYWNlID1cbiAgICAgIHNjb3BlLm5vZGUudHJ5R2V0Q29udGV4dChjeGFwaS5ESVNBQkxFX01FVEFEQVRBX1NUQUNLX1RSQUNFKSB8fFxuICAgICAgcHJvY2Vzcy5lbnYuQ0RLX0RJU0FCTEVfU1RBQ0tfVFJBQ0U7XG5cbiAgICB0aGlzLnN0YWNrVHJhY2VzID0gIWRpc2FibGVUcmFjZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgd2FybmluZyBtZXRhZGF0YSBlbnRyeSB0byB0aGlzIGNvbnN0cnVjdC5cbiAgICpcbiAgICogVGhlIENMSSB3aWxsIGRpc3BsYXkgdGhlIHdhcm5pbmcgd2hlbiBhbiBhcHAgaXMgc3ludGhlc2l6ZWQsIG9yIGZhaWwgaWYgcnVuXG4gICAqIGluIC0tc3RyaWN0IG1vZGUuXG4gICAqXG4gICAqIEBwYXJhbSBtZXNzYWdlIFRoZSB3YXJuaW5nIG1lc3NhZ2UuXG4gICAqL1xuICBwdWJsaWMgYWRkV2FybmluZyhtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICB0aGlzLmFkZE1lc3NhZ2UoY3hzY2hlbWEuQXJ0aWZhY3RNZXRhZGF0YUVudHJ5VHlwZS5XQVJOLCBtZXNzYWdlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGluZm8gbWV0YWRhdGEgZW50cnkgdG8gdGhpcyBjb25zdHJ1Y3QuXG4gICAqXG4gICAqIFRoZSBDTEkgd2lsbCBkaXNwbGF5IHRoZSBpbmZvIG1lc3NhZ2Ugd2hlbiBhcHBzIGFyZSBzeW50aGVzaXplZC5cbiAgICpcbiAgICogQHBhcmFtIG1lc3NhZ2UgVGhlIGluZm8gbWVzc2FnZS5cbiAgICovXG4gIHB1YmxpYyBhZGRJbmZvKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuYWRkTWVzc2FnZShjeHNjaGVtYS5BcnRpZmFjdE1ldGFkYXRhRW50cnlUeXBlLklORk8sIG1lc3NhZ2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4geyBcImVycm9yXCI6IDxtZXNzYWdlPiB9IG1ldGFkYXRhIGVudHJ5IHRvIHRoaXMgY29uc3RydWN0LlxuICAgKiBUaGUgdG9vbGtpdCB3aWxsIGZhaWwgZGVwbG95bWVudCBvZiBhbnkgc3RhY2sgdGhhdCBoYXMgZXJyb3JzIHJlcG9ydGVkIGFnYWluc3QgaXQuXG4gICAqIEBwYXJhbSBtZXNzYWdlIFRoZSBlcnJvciBtZXNzYWdlLlxuICAgKi9cbiAgcHVibGljIGFkZEVycm9yKG1lc3NhZ2U6IHN0cmluZykge1xuICAgIHRoaXMuYWRkTWVzc2FnZShjeHNjaGVtYS5BcnRpZmFjdE1ldGFkYXRhRW50cnlUeXBlLkVSUk9SLCBtZXNzYWdlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgZGVwcmVjYXRpb24gd2FybmluZyBmb3IgYSBzcGVjaWZpYyBBUEkuXG4gICAqXG4gICAqIERlcHJlY2F0aW9ucyB3aWxsIGJlIGFkZGVkIG9ubHkgb25jZSBwZXIgY29uc3RydWN0IGFzIGEgd2FybmluZyBhbmQgd2lsbCBiZVxuICAgKiBkZWR1cGxpY2F0ZWQgYmFzZWQgb24gdGhlIGBhcGlgLlxuICAgKlxuICAgKiBJZiB0aGUgZW52aXJvbm1lbnQgdmFyaWFibGUgYENES19CTE9DS19ERVBSRUNBVElPTlNgIGlzIHNldCwgdGhpcyBtZXRob2RcbiAgICogd2lsbCB0aHJvdyBhbiBlcnJvciBpbnN0ZWFkIHdpdGggdGhlIGRlcHJlY2F0aW9uIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSBhcGkgVGhlIEFQSSBiZWluZyBkZXByZWNhdGVkIGluIHRoZSBmb3JtYXQgYG1vZHVsZS5DbGFzcy5wcm9wZXJ0eWBcbiAgICogKGUuZy4gYEBhd3MtY2RrL2NvcmUuQ29uc3RydWN0Lm5vZGVgKS5cbiAgICogQHBhcmFtIG1lc3NhZ2UgVGhlIGRlcHJlY2F0aW9uIG1lc3NhZ2UgdG8gZGlzcGxheSwgd2l0aCBpbmZvcm1hdGlvbiBhYm91dFxuICAgKiBhbHRlcm5hdGl2ZXMuXG4gICAqL1xuICBwdWJsaWMgYWRkRGVwcmVjYXRpb24oYXBpOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZykge1xuICAgIGNvbnN0IHRleHQgPSBgVGhlIEFQSSAke2FwaX0gaXMgZGVwcmVjYXRlZDogJHttZXNzYWdlfS4gVGhpcyBBUEkgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHJlbGVhc2VgO1xuXG4gICAgLy8gdGhyb3cgaWYgQ0RLX0JMT0NLX0RFUFJFQ0FUSU9OUyBpcyBzZXRcbiAgICBpZiAocHJvY2Vzcy5lbnYuQ0RLX0JMT0NLX0RFUFJFQ0FUSU9OUykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMuc2NvcGUubm9kZS5wYXRofTogJHt0ZXh0fWApO1xuICAgIH1cblxuICAgIHRoaXMuYWRkV2FybmluZyh0ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbWVzc2FnZSBtZXRhZGF0YSBlbnRyeSB0byB0aGUgY29uc3RydWN0IG5vZGUsIHRvIGJlIGRpc3BsYXllZCBieSB0aGUgQ0RLIENMSS5cbiAgICpcbiAgICogUmVjb3JkcyB0aGUgbWVzc2FnZSBvbmNlIHBlciBjb25zdHJ1Y3QuXG4gICAqIEBwYXJhbSBsZXZlbCBUaGUgbWVzc2FnZSBsZXZlbFxuICAgKiBAcGFyYW0gbWVzc2FnZSBUaGUgbWVzc2FnZSBpdHNlbGZcbiAgICovXG4gIHByaXZhdGUgYWRkTWVzc2FnZShsZXZlbDogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBpc05ldyA9ICF0aGlzLnNjb3BlLm5vZGUubWV0YWRhdGEuZmluZCgoeCkgPT4geC5kYXRhID09PSBtZXNzYWdlKTtcbiAgICBpZiAoaXNOZXcpIHtcbiAgICAgIHRoaXMuc2NvcGUubm9kZS5hZGRNZXRhZGF0YShsZXZlbCwgbWVzc2FnZSwgeyBzdGFja1RyYWNlOiB0aGlzLnN0YWNrVHJhY2VzIH0pO1xuICAgIH1cbiAgfVxufVxuIl19