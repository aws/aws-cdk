"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const camelcase = require("camelcase");
const linter_1 = require("../linter");
const core_types_1 = require("./core-types");
const resource_1 = require("./resource");
// this linter verifies that we have L2 coverage. it finds all "Cfn" classes and verifies
// that we have a corresponding L1 class for it that's identified as a resource.
exports.cfnResourceLinter = new linter_1.Linter(a => CfnResourceReflection.findAll(a));
exports.cfnResourceLinter.add({
    code: 'resource-class',
    message: `every resource must have a resource class (L2), add '@resource %s' to its docstring`,
    warning: true,
    eval: e => {
        const l2 = resource_1.ResourceReflection.findAll(e.ctx.classType.assembly).find(r => r.cfn.fullname === e.ctx.fullname);
        e.assert(l2, e.ctx.fullname, e.ctx.fullname);
    }
});
class CfnResourceReflection {
    constructor(cls) {
        this.classType = cls;
        this.basename = cls.name.substr('Cfn'.length);
        // HACK: extract full CFN name from initializer docs
        const initializerDoc = (cls.initializer && cls.initializer.docs.docs.summary) || '';
        const out = /a new `([^`]+)`/.exec(initializerDoc);
        const fullname = out && out[1];
        if (!fullname) {
            throw new Error(`Unable to extract CloudFormation resource name from initializer documentation of ${cls}`);
        }
        this.fullname = fullname;
        this.namespace = fullname.split('::').slice(0, 2).join('::');
        this.attributeNames = cls.ownProperties
            .filter(p => (p.docs.docs.custom || {}).cloudformationAttribute)
            .map(p => p.docs.customTag('cloudformationAttribute') || '<error>')
            .map(p => this.attributePropertyNameFromCfnName(p));
        this.doc = cls.docs.docs.see || '';
    }
    /**
     * Finds a Cfn resource class by full CloudFormation resource name (e.g. `AWS::S3::Bucket`)
     * @param fullName first two components are case-insensitive (e.g. `aws::s3::Bucket` is equivalent to `Aws::S3::Bucket`)
     */
    static findByName(sys, fullName) {
        const [org, ns, resource] = fullName.split('::');
        if (resource === undefined) {
            throw new Error(`Not a valid CFN resource name: ${fullName}`);
        }
        const fqn = `@aws-cdk/${org.toLocaleLowerCase()}-${ns.toLocaleLowerCase()}.Cfn${resource}`;
        if (!sys.tryFindFqn(fqn)) {
            return undefined;
        }
        const cls = sys.findClass(fqn);
        return new CfnResourceReflection(cls);
    }
    /**
     * Returns all CFN resource classes within an assembly.
     */
    static findAll(assembly) {
        return assembly.classes
            .filter(c => core_types_1.CoreTypes.isCfnResource(c))
            .map(c => new CfnResourceReflection(c));
    }
    attributePropertyNameFromCfnName(name) {
        // special case (someone was smart), special case copied from cfn2ts
        if (this.basename === 'SecurityGroup' && name === 'GroupId') {
            return 'Id';
        }
        return camelcase(name, { pascalCase: true });
    }
}
exports.CfnResourceReflection = CfnResourceReflection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXJlc291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLXJlc291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQXVDO0FBRXZDLHNDQUFtQztBQUNuQyw2Q0FBeUM7QUFDekMseUNBQWdEO0FBRWhELHlGQUF5RjtBQUN6RixnRkFBZ0Y7QUFDbkUsUUFBQSxpQkFBaUIsR0FBRyxJQUFJLGVBQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRW5GLHlCQUFpQixDQUFDLEdBQUcsQ0FBQztJQUNwQixJQUFJLEVBQUUsZ0JBQWdCO0lBQ3RCLE9BQU8sRUFBRSxxRkFBcUY7SUFDOUYsT0FBTyxFQUFFLElBQUk7SUFDYixJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUU7UUFDUixNQUFNLEVBQUUsR0FBRyw2QkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3RyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFhLHFCQUFxQjtJQWtDaEMsWUFBWSxHQUFzQjtRQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztRQUVyQixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5QyxvREFBb0Q7UUFDcEQsTUFBTSxjQUFj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RUQsc0RBb0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2FtZWxjYXNlIGZyb20gJ2NhbWVsY2FzZSc7XG5pbXBvcnQgKiBhcyByZWZsZWN0IGZyb20gJ2pzaWktcmVmbGVjdCc7XG5pbXBvcnQgeyBMaW50ZXIgfSBmcm9tICcuLi9saW50ZXInO1xuaW1wb3J0IHsgQ29yZVR5cGVzIH0gZnJvbSAnLi9jb3JlLXR5cGVzJztcbmltcG9ydCB7IFJlc291cmNlUmVmbGVjdGlvbiB9IGZyb20gJy4vcmVzb3VyY2UnO1xuXG4vLyB0aGlzIGxpbnRlciB2ZXJpZmllcyB0aGF0IHdlIGhhdmUgTDIgY292ZXJhZ2UuIGl0IGZpbmRzIGFsbCBcIkNmblwiIGNsYXNzZXMgYW5kIHZlcmlmaWVzXG4vLyB0aGF0IHdlIGhhdmUgYSBjb3JyZXNwb25kaW5nIEwxIGNsYXNzIGZvciBpdCB0aGF0J3MgaWRlbnRpZmllZCBhcyBhIHJlc291cmNlLlxuZXhwb3J0IGNvbnN0IGNmblJlc291cmNlTGludGVyID0gbmV3IExpbnRlcihhID0+IENmblJlc291cmNlUmVmbGVjdGlvbi5maW5kQWxsKGEpKTtcblxuY2ZuUmVzb3VyY2VMaW50ZXIuYWRkKHtcbiAgY29kZTogJ3Jlc291cmNlLWNsYXNzJyxcbiAgbWVzc2FnZTogYGV2ZXJ5IHJlc291cmNlIG11c3QgaGF2ZSBhIHJlc291cmNlIGNsYXNzIChMMiksIGFkZCAnQHJlc291cmNlICVzJyB0byBpdHMgZG9jc3RyaW5nYCxcbiAgd2FybmluZzogdHJ1ZSxcbiAgZXZhbDogZSA9PiB7XG4gICAgY29uc3QgbDIgPSBSZXNvdXJjZVJlZmxlY3Rpb24uZmluZEFsbChlLmN0eC5jbGFzc1R5cGUuYXNzZW1ibHkpLmZpbmQociA9PiByLmNmbi5mdWxsbmFtZSA9PT0gZS5jdHguZnVsbG5hbWUpO1xuICAgIGUuYXNzZXJ0KGwyLCBlLmN0eC5mdWxsbmFtZSwgZS5jdHguZnVsbG5hbWUpO1xuICB9XG59KTtcblxuZXhwb3J0IGNsYXNzIENmblJlc291cmNlUmVmbGVjdGlvbiB7XG4gIC8qKlxuICAgKiBGaW5kcyBhIENmbiByZXNvdXJjZSBjbGFzcyBieSBmdWxsIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIG5hbWUgKGUuZy4gYEFXUzo6UzM6OkJ1Y2tldGApXG4gICAqIEBwYXJhbSBmdWxsTmFtZSBmaXJzdCB0d28gY29tcG9uZW50cyBhcmUgY2FzZS1pbnNlbnNpdGl2ZSAoZS5nLiBgYXdzOjpzMzo6QnVja2V0YCBpcyBlcXVpdmFsZW50IHRvIGBBd3M6OlMzOjpCdWNrZXRgKVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmaW5kQnlOYW1lKHN5czogcmVmbGVjdC5UeXBlU3lzdGVtLCBmdWxsTmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgWyBvcmcsIG5zLCByZXNvdXJjZSBdID0gZnVsbE5hbWUuc3BsaXQoJzo6Jyk7XG4gICAgaWYgKHJlc291cmNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBOb3QgYSB2YWxpZCBDRk4gcmVzb3VyY2UgbmFtZTogJHtmdWxsTmFtZX1gKTtcbiAgICB9XG4gICAgY29uc3QgZnFuID0gYEBhd3MtY2RrLyR7b3JnLnRvTG9jYWxlTG93ZXJDYXNlKCl9LSR7bnMudG9Mb2NhbGVMb3dlckNhc2UoKX0uQ2ZuJHtyZXNvdXJjZX1gO1xuICAgIGlmICghc3lzLnRyeUZpbmRGcW4oZnFuKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3QgY2xzID0gc3lzLmZpbmRDbGFzcyhmcW4pO1xuICAgIHJldHVybiBuZXcgQ2ZuUmVzb3VyY2VSZWZsZWN0aW9uKGNscyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbGwgQ0ZOIHJlc291cmNlIGNsYXNzZXMgd2l0aGluIGFuIGFzc2VtYmx5LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmaW5kQWxsKGFzc2VtYmx5OiByZWZsZWN0LkFzc2VtYmx5KSB7XG4gICAgcmV0dXJuIGFzc2VtYmx5LmNsYXNzZXNcbiAgICAgIC5maWx0ZXIoYyA9PiBDb3JlVHlwZXMuaXNDZm5SZXNvdXJjZShjKSlcbiAgICAgIC5tYXAoYyA9PiBuZXcgQ2ZuUmVzb3VyY2VSZWZsZWN0aW9uKGMpKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBjbGFzc1R5cGU6IHJlZmxlY3QuQ2xhc3NUeXBlO1xuICBwdWJsaWMgcmVhZG9ubHkgZnVsbG5hbWU6IHN0cmluZzsgLy8gQVdTOjpTMzo6QnVja2V0XG4gIHB1YmxpYyByZWFkb25seSBuYW1lc3BhY2U6IHN0cmluZzsgLy8gQVdTOjpTM1xuICBwdWJsaWMgcmVhZG9ubHkgYmFzZW5hbWU6IHN0cmluZzsgLy8gQnVja2V0XG4gIHB1YmxpYyByZWFkb25seSBhdHRyaWJ1dGVOYW1lczogc3RyaW5nW107IC8vIChub3JtYWxpemVkKSBidWNrZXRBcm4sIGJ1Y2tldE5hbWUsIHF1ZXVlVXJsXG4gIHB1YmxpYyByZWFkb25seSBkb2M6IHN0cmluZzsgLy8gbGluayB0byBDbG91ZEZvcm1hdGlvbiBkb2NzXG5cbiAgY29uc3RydWN0b3IoY2xzOiByZWZsZWN0LkNsYXNzVHlwZSkge1xuICAgIHRoaXMuY2xhc3NUeXBlID0gY2xzO1xuXG4gICAgdGhpcy5iYXNlbmFtZSA9IGNscy5uYW1lLnN1YnN0cignQ2ZuJy5sZW5ndGgpO1xuXG4gICAgLy8gSEFDSzogZXh0cmFjdCBmdWxsIENGTiBuYW1lIGZyb20gaW5pdGlhbGl6ZXIgZG9jc1xuICAgIGNvbnN0IGluaXRpYWxpemVyRG9jID0gKGNscy5pbml0aWFsaXplciAmJiBjbHMuaW5pdGlhbGl6ZXIuZG9jcy5kb2NzLnN1bW1hcnkpIHx8ICcnO1xuICAgIGNvbnN0IG91dCA9IC9hIG5ldyBgKFteYF0rKWAvLmV4ZWMoaW5pdGlhbGl6ZXJEb2MpO1xuICAgIGNvbnN0IGZ1bGxuYW1lID0gb3V0ICYmIG91dFsxXTtcbiAgICBpZiAoIWZ1bGxuYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBleHRyYWN0IENsb3VkRm9ybWF0aW9uIHJlc291cmNlIG5hbWUgZnJvbSBpbml0aWFsaXplciBkb2N1bWVudGF0aW9uIG9mICR7Y2xzfWApO1xuICAgIH1cblxuICAgIHRoaXMuZnVsbG5hbWUgPSBmdWxsbmFtZTtcblxuICAgIHRoaXMubmFtZXNwYWNlID0gZnVsbG5hbWUuc3BsaXQoJzo6Jykuc2xpY2UoMCwgMikuam9pbignOjonKTtcblxuICAgIHRoaXMuYXR0cmlidXRlTmFtZXMgPSBjbHMub3duUHJvcGVydGllc1xuICAgICAgLmZpbHRlcihwID0+IChwLmRvY3MuZG9jcy5jdXN0b20gfHwge30pLmNsb3VkZm9ybWF0aW9uQXR0cmlidXRlKVxuICAgICAgLm1hcChwID0+IHAuZG9jcy5jdXN0b21UYWcoJ2Nsb3VkZm9ybWF0aW9uQXR0cmlidXRlJykgfHwgJzxlcnJvcj4nKVxuICAgICAgLm1hcChwID0+IHRoaXMuYXR0cmlidXRlUHJvcGVydHlOYW1lRnJvbUNmbk5hbWUocCkpO1xuXG4gICAgdGhpcy5kb2MgPSBjbHMuZG9jcy5kb2NzLnNlZSB8fCAnJztcbiAgfVxuXG4gIHByaXZhdGUgYXR0cmlidXRlUHJvcGVydHlOYW1lRnJvbUNmbk5hbWUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcblxuICAgIC8vIHNwZWNpYWwgY2FzZSAoc29tZW9uZSB3YXMgc21hcnQpLCBzcGVjaWFsIGNhc2UgY29waWVkIGZyb20gY2ZuMnRzXG4gICAgaWYgKHRoaXMuYmFzZW5hbWUgPT09ICdTZWN1cml0eUdyb3VwJyAmJiBuYW1lID09PSAnR3JvdXBJZCcpIHtcbiAgICAgIHJldHVybiAnSWQnO1xuICAgIH1cblxuICAgIHJldHVybiBjYW1lbGNhc2UobmFtZSwgeyBwYXNjYWxDYXNlOiB0cnVlIH0pO1xuICB9XG59XG4iXX0=