"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackPathInspector = exports.StackInspector = exports.Inspector = void 0;
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const api = require("@aws-cdk/cx-api");
const assertion_1 = require("./assertion");
const match_template_1 = require("./assertions/match-template");
class Inspector {
    constructor() {
        this.aroundAssert = undefined;
    }
    to(assertion) {
        return this.aroundAssert ? this.aroundAssert(() => this._to(assertion))
            : this._to(assertion);
    }
    notTo(assertion) {
        return this.to(assertion_1.not(assertion));
    }
    _to(assertion) {
        assertion.assertOrThrow(this);
    }
}
exports.Inspector = Inspector;
class StackInspector extends Inspector {
    constructor(stack) {
        super();
        this.stack = stack;
        this.template = stack instanceof api.CloudFormationStackArtifact ? stack.template : stack;
    }
    at(path) {
        if (!(this.stack instanceof api.CloudFormationStackArtifact)) {
            throw new Error('Cannot use "expect(stack).at(path)" for a raw template, only CloudFormationStackArtifact');
        }
        const strPath = typeof path === 'string' ? path : path.join('/');
        return new StackPathInspector(this.stack, strPath);
    }
    toMatch(template, matchStyle = match_template_1.MatchStyle.EXACT) {
        return this.to(match_template_1.matchTemplate(template, matchStyle));
    }
    get value() {
        return this.template;
    }
}
exports.StackInspector = StackInspector;
class StackPathInspector extends Inspector {
    constructor(stack, path) {
        super();
        this.stack = stack;
        this.path = path;
    }
    get value() {
        // The names of paths in metadata in tests are very ill-defined. Try with the full path first,
        // then try with the stack name preprended for backwards compat with most tests that happen to give
        // their stack an ID that's the same as the stack name.
        const metadata = this.stack.manifest.metadata || {};
        const md = metadata[this.path] || metadata[`/${this.stack.id}${this.path}`];
        if (md === undefined) {
            return undefined;
        }
        const resourceMd = md.find(entry => entry.type === cxschema.ArtifactMetadataEntryType.LOGICAL_ID);
        if (resourceMd === undefined) {
            return undefined;
        }
        const logicalId = resourceMd.data;
        return this.stack.template.Resources[logicalId];
    }
}
exports.StackPathInspector = StackPathInspector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zcGVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5zcGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJEQUEyRDtBQUMzRCx1Q0FBdUM7QUFDdkMsMkNBQTZDO0FBQzdDLGdFQUF3RTtBQUV4RSxNQUFzQixTQUFTO0lBRzdCO1FBQ0UsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUVNLEVBQUUsQ0FBQyxTQUEwQjtRQUNsQyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNyRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRU0sS0FBSyxDQUFDLFNBQTBCO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBSU8sR0FBRyxDQUFDLFNBQTBCO1FBQ3BDLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEMsQ0FBQztDQUNGO0FBckJELDhCQXFCQztBQUVELE1BQWEsY0FBZSxTQUFRLFNBQVM7SUFJM0MsWUFBNEIsS0FBK0M7UUFDekUsS0FBSyxFQUFFLENBQUM7UUFEa0IsVUFBSyxHQUFMLEtBQUssQ0FBMEM7UUFHekUsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLFlBQVksR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDNUYsQ0FBQztJQUVNLEVBQUUsQ0FBQyxJQUF1QjtRQUMvQixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxZQUFZLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFO1lBQzVELE1BQU0sSUFBSSxLQUFLLENBQUMsMEZBQTBGLENBQUMsQ0FBQztTQUM3RztRQUVELE1BQU0sT0FBTyxHQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pFLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFTSxPQUFPLENBQUMsUUFBZ0MsRUFBRSxVQUFVLEdBQUcsMkJBQVUsQ0FBQyxLQUFLO1FBQzVFLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyw4QkFBYSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxJQUFXLEtBQUs7UUFDZCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztDQUNGO0FBMUJELHdDQTBCQztBQUVELE1BQWEsa0JBQW1CLFNBQVEsU0FBUztJQUMvQyxZQUE0QixLQUFzQyxFQUFrQixJQUFZO1FBQzlGLEtBQUssRUFBRSxDQUFDO1FBRGtCLFVBQUssR0FBTCxLQUFLLENBQWlDO1FBQWtCLFNBQUksR0FBSixJQUFJLENBQVE7SUFFaEcsQ0FBQztJQUVELElBQVcsS0FBSztRQUNkLDhGQUE4RjtRQUM5RixtR0FBbUc7UUFDbkcsdURBQXVEO1FBQ3ZELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7UUFDcEQsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUM1RSxJQUFJLEVBQUUsS0FBSyxTQUFTLEVBQUU7WUFBRSxPQUFPLFNBQVMsQ0FBQztTQUFFO1FBQzNDLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsRyxJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7WUFBRSxPQUFPLFNBQVMsQ0FBQztTQUFFO1FBQ25ELE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxJQUF3QyxDQUFDO1FBQ3RFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7Q0FDRjtBQWpCRCxnREFpQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjeHNjaGVtYSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0ICogYXMgYXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBBc3NlcnRpb24sIG5vdCB9IGZyb20gJy4vYXNzZXJ0aW9uJztcbmltcG9ydCB7IE1hdGNoU3R5bGUsIG1hdGNoVGVtcGxhdGUgfSBmcm9tICcuL2Fzc2VydGlvbnMvbWF0Y2gtdGVtcGxhdGUnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSW5zcGVjdG9yIHtcbiAgcHVibGljIGFyb3VuZEFzc2VydD86IChjYjogKCkgPT4gdm9pZCkgPT4gYW55O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYXJvdW5kQXNzZXJ0ID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIHRvKGFzc2VydGlvbjogQXNzZXJ0aW9uPHRoaXM+KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5hcm91bmRBc3NlcnQgPyB0aGlzLmFyb3VuZEFzc2VydCgoKSA9PiB0aGlzLl90byhhc3NlcnRpb24pKVxuICAgICAgOiB0aGlzLl90byhhc3NlcnRpb24pO1xuICB9XG5cbiAgcHVibGljIG5vdFRvKGFzc2VydGlvbjogQXNzZXJ0aW9uPHRoaXM+KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy50byhub3QoYXNzZXJ0aW9uKSk7XG4gIH1cblxuICBhYnN0cmFjdCBnZXQgdmFsdWUoKTogYW55O1xuXG4gIHByaXZhdGUgX3RvKGFzc2VydGlvbjogQXNzZXJ0aW9uPHRoaXM+KTogYW55IHtcbiAgICBhc3NlcnRpb24uYXNzZXJ0T3JUaHJvdyh0aGlzKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3RhY2tJbnNwZWN0b3IgZXh0ZW5kcyBJbnNwZWN0b3Ige1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgdGVtcGxhdGU6IHsgW2tleTogc3RyaW5nXTogYW55IH07XG5cbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHN0YWNrOiBhcGkuQ2xvdWRGb3JtYXRpb25TdGFja0FydGlmYWN0IHwgb2JqZWN0KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMudGVtcGxhdGUgPSBzdGFjayBpbnN0YW5jZW9mIGFwaS5DbG91ZEZvcm1hdGlvblN0YWNrQXJ0aWZhY3QgPyBzdGFjay50ZW1wbGF0ZSA6IHN0YWNrO1xuICB9XG5cbiAgcHVibGljIGF0KHBhdGg6IHN0cmluZyB8IHN0cmluZ1tdKTogU3RhY2tQYXRoSW5zcGVjdG9yIHtcbiAgICBpZiAoISh0aGlzLnN0YWNrIGluc3RhbmNlb2YgYXBpLkNsb3VkRm9ybWF0aW9uU3RhY2tBcnRpZmFjdCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHVzZSBcImV4cGVjdChzdGFjaykuYXQocGF0aClcIiBmb3IgYSByYXcgdGVtcGxhdGUsIG9ubHkgQ2xvdWRGb3JtYXRpb25TdGFja0FydGlmYWN0Jyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RyUGF0aCA9IHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJyA/IHBhdGggOiBwYXRoLmpvaW4oJy8nKTtcbiAgICByZXR1cm4gbmV3IFN0YWNrUGF0aEluc3BlY3Rvcih0aGlzLnN0YWNrLCBzdHJQYXRoKTtcbiAgfVxuXG4gIHB1YmxpYyB0b01hdGNoKHRlbXBsYXRlOiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBtYXRjaFN0eWxlID0gTWF0Y2hTdHlsZS5FWEFDVCkge1xuICAgIHJldHVybiB0aGlzLnRvKG1hdGNoVGVtcGxhdGUodGVtcGxhdGUsIG1hdGNoU3R5bGUpKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgdmFsdWUoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgcmV0dXJuIHRoaXMudGVtcGxhdGU7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN0YWNrUGF0aEluc3BlY3RvciBleHRlbmRzIEluc3BlY3RvciB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBzdGFjazogYXBpLkNsb3VkRm9ybWF0aW9uU3RhY2tBcnRpZmFjdCwgcHVibGljIHJlYWRvbmx5IHBhdGg6IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHZhbHVlKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gfCB1bmRlZmluZWQge1xuICAgIC8vIFRoZSBuYW1lcyBvZiBwYXRocyBpbiBtZXRhZGF0YSBpbiB0ZXN0cyBhcmUgdmVyeSBpbGwtZGVmaW5lZC4gVHJ5IHdpdGggdGhlIGZ1bGwgcGF0aCBmaXJzdCxcbiAgICAvLyB0aGVuIHRyeSB3aXRoIHRoZSBzdGFjayBuYW1lIHByZXByZW5kZWQgZm9yIGJhY2t3YXJkcyBjb21wYXQgd2l0aCBtb3N0IHRlc3RzIHRoYXQgaGFwcGVuIHRvIGdpdmVcbiAgICAvLyB0aGVpciBzdGFjayBhbiBJRCB0aGF0J3MgdGhlIHNhbWUgYXMgdGhlIHN0YWNrIG5hbWUuXG4gICAgY29uc3QgbWV0YWRhdGEgPSB0aGlzLnN0YWNrLm1hbmlmZXN0Lm1ldGFkYXRhIHx8IHt9O1xuICAgIGNvbnN0IG1kID0gbWV0YWRhdGFbdGhpcy5wYXRoXSB8fCBtZXRhZGF0YVtgLyR7dGhpcy5zdGFjay5pZH0ke3RoaXMucGF0aH1gXTtcbiAgICBpZiAobWQgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG4gICAgY29uc3QgcmVzb3VyY2VNZCA9IG1kLmZpbmQoZW50cnkgPT4gZW50cnkudHlwZSA9PT0gY3hzY2hlbWEuQXJ0aWZhY3RNZXRhZGF0YUVudHJ5VHlwZS5MT0dJQ0FMX0lEKTtcbiAgICBpZiAocmVzb3VyY2VNZCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgICBjb25zdCBsb2dpY2FsSWQgPSByZXNvdXJjZU1kLmRhdGEgYXMgY3hzY2hlbWEuTG9nTWVzc2FnZU1ldGFkYXRhRW50cnk7XG4gICAgcmV0dXJuIHRoaXMuc3RhY2sudGVtcGxhdGUuUmVzb3VyY2VzW2xvZ2ljYWxJZF07XG4gIH1cbn1cbiJdfQ==