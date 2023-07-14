"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudArtifact = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const metadata_1 = require("./metadata");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
/**
 * Represents an artifact within a cloud assembly.
 */
class CloudArtifact {
    /**
     * Returns a subclass of `CloudArtifact` based on the artifact type defined in the artifact manifest.
     *
     * @param assembly The cloud assembly from which to load the artifact
     * @param id The artifact ID
     * @param artifact The artifact manifest
     * @returns the `CloudArtifact` that matches the artifact type or `undefined` if it's an artifact type that is unrecognized by this module.
     */
    static fromManifest(assembly, id, artifact) {
        try {
            jsiiDeprecationWarnings._aws_cdk_cx_api_CloudAssembly(assembly);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromManifest);
            }
            throw error;
        }
        // Implementation is defined in a separate file to break cyclic dependencies
        void (assembly), void (id), void (artifact);
        throw new Error('Implementation not overridden yet');
    }
    constructor(assembly, id, manifest) {
        this.assembly = assembly;
        this.id = id;
        try {
            jsiiDeprecationWarnings._aws_cdk_cx_api_CloudAssembly(assembly);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CloudArtifact);
            }
            throw error;
        }
        this.manifest = manifest;
        this.messages = this.renderMessages();
        this._dependencyIDs = manifest.dependencies || [];
    }
    /**
     * Returns all the artifacts that this artifact depends on.
     */
    get dependencies() {
        if (this._deps) {
            return this._deps;
        }
        this._deps = this._dependencyIDs.map(id => {
            const dep = this.assembly.tryGetArtifact(id);
            if (!dep) {
                throw new Error(`Artifact ${this.id} depends on non-existing artifact ${id}`);
            }
            return dep;
        });
        return this._deps;
    }
    /**
     * @returns all the metadata entries of a specific type in this artifact.
     * @param type
     */
    findMetadataByType(type) {
        const result = new Array();
        for (const path of Object.keys(this.manifest.metadata || {})) {
            for (const entry of (this.manifest.metadata || {})[path]) {
                if (entry.type === type) {
                    result.push({ path, ...entry });
                }
            }
        }
        return result;
    }
    renderMessages() {
        const messages = new Array();
        for (const [id, metadata] of Object.entries(this.manifest.metadata || {})) {
            for (const entry of metadata) {
                let level;
                switch (entry.type) {
                    case cxschema.ArtifactMetadataEntryType.WARN:
                        level = metadata_1.SynthesisMessageLevel.WARNING;
                        break;
                    case cxschema.ArtifactMetadataEntryType.ERROR:
                        level = metadata_1.SynthesisMessageLevel.ERROR;
                        break;
                    case cxschema.ArtifactMetadataEntryType.INFO:
                        level = metadata_1.SynthesisMessageLevel.INFO;
                        break;
                    default:
                        continue;
                }
                messages.push({ level, entry, id });
            }
        }
        return messages;
    }
    /**
     * An identifier that shows where this artifact is located in the tree
     * of nested assemblies, based on their manifests. Defaults to the normal
     * id. Should only be used in user interfaces.
     */
    get hierarchicalId() {
        return this.manifest.displayName ?? this.id;
    }
}
_a = JSII_RTTI_SYMBOL_1;
CloudArtifact[_a] = { fqn: "@aws-cdk/cx-api.CloudArtifact", version: "0.0.0" };
exports.CloudArtifact = CloudArtifact;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvdWQtYXJ0aWZhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjbG91ZC1hcnRpZmFjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx5Q0FBMEY7QUFDMUYsMkRBQTJEO0FBOEIzRDs7R0FFRztBQUNILE1BQWEsYUFBYTtJQUN4Qjs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUF1QixFQUFFLEVBQVUsRUFBRSxRQUFtQzs7Ozs7Ozs7OztRQUNqRyw0RUFBNEU7UUFDNUUsS0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekMsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0tBQ3REO0lBdUJELFlBQXNDLFFBQXVCLEVBQWtCLEVBQVUsRUFBRSxRQUFtQztRQUF4RixhQUFRLEdBQVIsUUFBUSxDQUFlO1FBQWtCLE9BQUUsR0FBRixFQUFFLENBQVE7Ozs7OzsrQ0FwQzlFLGFBQWE7Ozs7UUFxQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUM7S0FDbkQ7SUFFRDs7T0FFRztJQUNILElBQVcsWUFBWTtRQUNyQixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFBRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FBRTtRQUV0QyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ3hDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ1IsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLElBQUksQ0FBQyxFQUFFLHFDQUFxQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQy9FO1lBQ0QsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztLQUNuQjtJQUVEOzs7T0FHRztJQUNJLGtCQUFrQixDQUFDLElBQVk7UUFDcEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFLLEVBQXVCLENBQUM7UUFDaEQsS0FBSyxNQUFNLElBQUksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQyxFQUFFO1lBQzVELEtBQUssTUFBTSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDeEQsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtvQkFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUM7aUJBQ2pDO2FBQ0Y7U0FDRjtRQUNELE9BQU8sTUFBTSxDQUFDO0tBQ2Y7SUFFTyxjQUFjO1FBQ3BCLE1BQU0sUUFBUSxHQUFHLElBQUksS0FBSyxFQUFvQixDQUFDO1FBRS9DLEtBQUssTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxJQUFJLEVBQUcsQ0FBQyxFQUFFO1lBQzFFLEtBQUssTUFBTSxLQUFLLElBQUksUUFBUSxFQUFFO2dCQUM1QixJQUFJLEtBQTRCLENBQUM7Z0JBQ2pDLFFBQVEsS0FBSyxDQUFDLElBQUksRUFBRTtvQkFDbEIsS0FBSyxRQUFRLENBQUMseUJBQXlCLENBQUMsSUFBSTt3QkFDMUMsS0FBSyxHQUFHLGdDQUFxQixDQUFDLE9BQU8sQ0FBQzt3QkFDdEMsTUFBTTtvQkFDUixLQUFLLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLO3dCQUMzQyxLQUFLLEdBQUcsZ0NBQXFCLENBQUMsS0FBSyxDQUFDO3dCQUNwQyxNQUFNO29CQUNSLEtBQUssUUFBUSxDQUFDLHlCQUF5QixDQUFDLElBQUk7d0JBQzFDLEtBQUssR0FBRyxnQ0FBcUIsQ0FBQyxJQUFJLENBQUM7d0JBQ25DLE1BQU07b0JBQ1I7d0JBQ0UsU0FBUztpQkFDWjtnQkFFRCxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQ3JDO1NBQ0Y7UUFFRCxPQUFPLFFBQVEsQ0FBQztLQUNqQjtJQUVEOzs7O09BSUc7SUFDSCxJQUFXLGNBQWM7UUFDdkIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDO0tBQzdDOzs7O0FBN0dVLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBDbG91ZEFzc2VtYmx5IH0gZnJvbSAnLi9jbG91ZC1hc3NlbWJseSc7XG5pbXBvcnQgeyBNZXRhZGF0YUVudHJ5UmVzdWx0LCBTeW50aGVzaXNNZXNzYWdlLCBTeW50aGVzaXNNZXNzYWdlTGV2ZWwgfSBmcm9tICcuL21ldGFkYXRhJztcbmltcG9ydCAqIGFzIGN4c2NoZW1hIGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5cbi8qKlxuICogQXJ0aWZhY3QgcHJvcGVydGllcyBmb3IgQ2xvdWRGb3JtYXRpb24gc3RhY2tzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEF3c0Nsb3VkRm9ybWF0aW9uU3RhY2tQcm9wZXJ0aWVzIHtcbiAgLyoqXG4gICAqIEEgZmlsZSByZWxhdGl2ZSB0byB0aGUgYXNzZW1ibHkgcm9vdCB3aGljaCBjb250YWlucyB0aGUgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgZm9yIHRoaXMgc3RhY2suXG4gICAqL1xuICByZWFkb25seSB0ZW1wbGF0ZUZpbGU6IHN0cmluZztcblxuICAvKipcbiAgICogVmFsdWVzIGZvciBDbG91ZEZvcm1hdGlvbiBzdGFjayBwYXJhbWV0ZXJzIHRoYXQgc2hvdWxkIGJlIHBhc3NlZCB3aGVuIHRoZSBzdGFjayBpcyBkZXBsb3llZC5cbiAgICovXG4gIHJlYWRvbmx5IHBhcmFtZXRlcnM/OiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIHRvIHVzZSBmb3IgdGhlIENsb3VkRm9ybWF0aW9uIHN0YWNrLlxuICAgKiBAZGVmYXVsdCAtIG5hbWUgZGVyaXZlZCBmcm9tIGFydGlmYWN0IElEXG4gICAqL1xuICByZWFkb25seSBzdGFja05hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZW5hYmxlIHRlcm1pbmF0aW9uIHByb3RlY3Rpb24gZm9yIHRoaXMgc3RhY2suXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSB0ZXJtaW5hdGlvblByb3RlY3Rpb24/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gYXJ0aWZhY3Qgd2l0aGluIGEgY2xvdWQgYXNzZW1ibHkuXG4gKi9cbmV4cG9ydCBjbGFzcyBDbG91ZEFydGlmYWN0IHtcbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdWJjbGFzcyBvZiBgQ2xvdWRBcnRpZmFjdGAgYmFzZWQgb24gdGhlIGFydGlmYWN0IHR5cGUgZGVmaW5lZCBpbiB0aGUgYXJ0aWZhY3QgbWFuaWZlc3QuXG4gICAqXG4gICAqIEBwYXJhbSBhc3NlbWJseSBUaGUgY2xvdWQgYXNzZW1ibHkgZnJvbSB3aGljaCB0byBsb2FkIHRoZSBhcnRpZmFjdFxuICAgKiBAcGFyYW0gaWQgVGhlIGFydGlmYWN0IElEXG4gICAqIEBwYXJhbSBhcnRpZmFjdCBUaGUgYXJ0aWZhY3QgbWFuaWZlc3RcbiAgICogQHJldHVybnMgdGhlIGBDbG91ZEFydGlmYWN0YCB0aGF0IG1hdGNoZXMgdGhlIGFydGlmYWN0IHR5cGUgb3IgYHVuZGVmaW5lZGAgaWYgaXQncyBhbiBhcnRpZmFjdCB0eXBlIHRoYXQgaXMgdW5yZWNvZ25pemVkIGJ5IHRoaXMgbW9kdWxlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tTWFuaWZlc3QoYXNzZW1ibHk6IENsb3VkQXNzZW1ibHksIGlkOiBzdHJpbmcsIGFydGlmYWN0OiBjeHNjaGVtYS5BcnRpZmFjdE1hbmlmZXN0KTogQ2xvdWRBcnRpZmFjdCB8IHVuZGVmaW5lZCB7XG4gICAgLy8gSW1wbGVtZW50YXRpb24gaXMgZGVmaW5lZCBpbiBhIHNlcGFyYXRlIGZpbGUgdG8gYnJlYWsgY3ljbGljIGRlcGVuZGVuY2llc1xuICAgIHZvaWQoYXNzZW1ibHkpLCB2b2lkKGlkKSwgdm9pZChhcnRpZmFjdCk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbXBsZW1lbnRhdGlvbiBub3Qgb3ZlcnJpZGRlbiB5ZXQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYXJ0aWZhY3QncyBtYW5pZmVzdFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG1hbmlmZXN0OiBjeHNjaGVtYS5BcnRpZmFjdE1hbmlmZXN0O1xuXG4gIC8qKlxuICAgKiBUaGUgc2V0IG9mIG1lc3NhZ2VzIGV4dHJhY3RlZCBmcm9tIHRoZSBhcnRpZmFjdCdzIG1ldGFkYXRhLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG1lc3NhZ2VzOiBTeW50aGVzaXNNZXNzYWdlW107XG5cbiAgLyoqXG4gICAqIElEcyBvZiBhbGwgZGVwZW5kZW5jaWVzLiBVc2VkIHdoZW4gdG9wb2xvZ2ljYWxseSBzb3J0aW5nIHRoZSBhcnRpZmFjdHMgd2l0aGluIHRoZSBjbG91ZCBhc3NlbWJseS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgX2RlcGVuZGVuY3lJRHM6IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBDYWNoZSBvZiByZXNvbHZlZCBkZXBlbmRlbmNpZXMuXG4gICAqL1xuICBwcml2YXRlIF9kZXBzPzogQ2xvdWRBcnRpZmFjdFtdO1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgYXNzZW1ibHk6IENsb3VkQXNzZW1ibHksIHB1YmxpYyByZWFkb25seSBpZDogc3RyaW5nLCBtYW5pZmVzdDogY3hzY2hlbWEuQXJ0aWZhY3RNYW5pZmVzdCkge1xuICAgIHRoaXMubWFuaWZlc3QgPSBtYW5pZmVzdDtcbiAgICB0aGlzLm1lc3NhZ2VzID0gdGhpcy5yZW5kZXJNZXNzYWdlcygpO1xuICAgIHRoaXMuX2RlcGVuZGVuY3lJRHMgPSBtYW5pZmVzdC5kZXBlbmRlbmNpZXMgfHwgW107XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbGwgdGhlIGFydGlmYWN0cyB0aGF0IHRoaXMgYXJ0aWZhY3QgZGVwZW5kcyBvbi5cbiAgICovXG4gIHB1YmxpYyBnZXQgZGVwZW5kZW5jaWVzKCk6IENsb3VkQXJ0aWZhY3RbXSB7XG4gICAgaWYgKHRoaXMuX2RlcHMpIHsgcmV0dXJuIHRoaXMuX2RlcHM7IH1cblxuICAgIHRoaXMuX2RlcHMgPSB0aGlzLl9kZXBlbmRlbmN5SURzLm1hcChpZCA9PiB7XG4gICAgICBjb25zdCBkZXAgPSB0aGlzLmFzc2VtYmx5LnRyeUdldEFydGlmYWN0KGlkKTtcbiAgICAgIGlmICghZGVwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQXJ0aWZhY3QgJHt0aGlzLmlkfSBkZXBlbmRzIG9uIG5vbi1leGlzdGluZyBhcnRpZmFjdCAke2lkfWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRlcDtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLl9kZXBzO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIGFsbCB0aGUgbWV0YWRhdGEgZW50cmllcyBvZiBhIHNwZWNpZmljIHR5cGUgaW4gdGhpcyBhcnRpZmFjdC5cbiAgICogQHBhcmFtIHR5cGVcbiAgICovXG4gIHB1YmxpYyBmaW5kTWV0YWRhdGFCeVR5cGUodHlwZTogc3RyaW5nKTogTWV0YWRhdGFFbnRyeVJlc3VsdFtdIHtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgQXJyYXk8TWV0YWRhdGFFbnRyeVJlc3VsdD4oKTtcbiAgICBmb3IgKGNvbnN0IHBhdGggb2YgT2JqZWN0LmtleXModGhpcy5tYW5pZmVzdC5tZXRhZGF0YSB8fCB7fSkpIHtcbiAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgKHRoaXMubWFuaWZlc3QubWV0YWRhdGEgfHwge30pW3BhdGhdKSB7XG4gICAgICAgIGlmIChlbnRyeS50eXBlID09PSB0eXBlKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goeyBwYXRoLCAuLi5lbnRyeSB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJNZXNzYWdlcygpIHtcbiAgICBjb25zdCBtZXNzYWdlcyA9IG5ldyBBcnJheTxTeW50aGVzaXNNZXNzYWdlPigpO1xuXG4gICAgZm9yIChjb25zdCBbaWQsIG1ldGFkYXRhXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLm1hbmlmZXN0Lm1ldGFkYXRhIHx8IHsgfSkpIHtcbiAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgbWV0YWRhdGEpIHtcbiAgICAgICAgbGV0IGxldmVsOiBTeW50aGVzaXNNZXNzYWdlTGV2ZWw7XG4gICAgICAgIHN3aXRjaCAoZW50cnkudHlwZSkge1xuICAgICAgICAgIGNhc2UgY3hzY2hlbWEuQXJ0aWZhY3RNZXRhZGF0YUVudHJ5VHlwZS5XQVJOOlxuICAgICAgICAgICAgbGV2ZWwgPSBTeW50aGVzaXNNZXNzYWdlTGV2ZWwuV0FSTklORztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgY3hzY2hlbWEuQXJ0aWZhY3RNZXRhZGF0YUVudHJ5VHlwZS5FUlJPUjpcbiAgICAgICAgICAgIGxldmVsID0gU3ludGhlc2lzTWVzc2FnZUxldmVsLkVSUk9SO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBjeHNjaGVtYS5BcnRpZmFjdE1ldGFkYXRhRW50cnlUeXBlLklORk86XG4gICAgICAgICAgICBsZXZlbCA9IFN5bnRoZXNpc01lc3NhZ2VMZXZlbC5JTkZPO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbWVzc2FnZXMucHVzaCh7IGxldmVsLCBlbnRyeSwgaWQgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lc3NhZ2VzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGlkZW50aWZpZXIgdGhhdCBzaG93cyB3aGVyZSB0aGlzIGFydGlmYWN0IGlzIGxvY2F0ZWQgaW4gdGhlIHRyZWVcbiAgICogb2YgbmVzdGVkIGFzc2VtYmxpZXMsIGJhc2VkIG9uIHRoZWlyIG1hbmlmZXN0cy4gRGVmYXVsdHMgdG8gdGhlIG5vcm1hbFxuICAgKiBpZC4gU2hvdWxkIG9ubHkgYmUgdXNlZCBpbiB1c2VyIGludGVyZmFjZXMuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGhpZXJhcmNoaWNhbElkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubWFuaWZlc3QuZGlzcGxheU5hbWUgPz8gdGhpcy5pZDtcbiAgfVxufVxuIl19