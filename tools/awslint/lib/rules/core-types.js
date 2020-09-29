"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const CORE_MODULE = "@aws-cdk/core";
var CoreTypesFqn;
(function (CoreTypesFqn) {
    CoreTypesFqn["CfnResource"] = "@aws-cdk/core.CfnResource";
    CoreTypesFqn["Construct"] = "@aws-cdk/core.Construct";
    CoreTypesFqn["ConstructInterface"] = "@aws-cdk/core.IConstruct";
    CoreTypesFqn["Resource"] = "@aws-cdk/core.Resource";
    CoreTypesFqn["ResourceInterface"] = "@aws-cdk/core.IResource";
    CoreTypesFqn["ResolvableInterface"] = "@aws-cdk/core.IResolvable";
    CoreTypesFqn["PhysicalName"] = "@aws-cdk/core.PhysicalName";
})(CoreTypesFqn || (CoreTypesFqn = {}));
class CoreTypes {
    constructor(sys) {
        this.sys = sys;
        if (!sys.includesAssembly(CORE_MODULE)) {
            // disable-all-checks
            return;
        }
        for (const fqn of Object.values(CoreTypesFqn)) {
            if (!this.sys.tryFindFqn(fqn)) {
                throw new Error(`core FQN type not found: ${fqn}`);
            }
        }
    }
    /**
     * @returns true if assembly has the Core module
     */
    static hasCoreModule(assembly) {
        return (!assembly.system.assemblies.find(a => a.name === CORE_MODULE));
    }
    /**
     * @returns true if `classType` represents an L1 Cfn Resource
     */
    static isCfnResource(c) {
        if (!c.system.includesAssembly(CORE_MODULE)) {
            return false;
        }
        // skip CfnResource itself
        if (c.fqn === CoreTypesFqn.CfnResource) {
            return false;
        }
        if (!this.isConstructClass(c)) {
            return false;
        }
        const cfnResourceClass = c.system.findFqn(CoreTypesFqn.CfnResource);
        if (!c.extends(cfnResourceClass)) {
            return false;
        }
        if (!c.name.startsWith("Cfn")) {
            return false;
        }
        return true;
    }
    /**
     * @returns true if `classType` represents a Construct
     */
    static isConstructClass(c) {
        if (!c.system.includesAssembly(CORE_MODULE)) {
            return false;
        }
        if (!c.isClassType()) {
            return false;
        }
        if (c.abstract) {
            return false;
        }
        return c.extends(c.system.findFqn(CoreTypesFqn.Construct));
    }
    /**
     * @returns true if `classType` represents an AWS resource (i.e. extends `cdk.Resource`).
     */
    static isResourceClass(classType) {
        const baseResource = classType.system.findClass(CoreTypesFqn.Resource);
        return classType.extends(baseResource) || util_1.getDocTag(classType, "resource");
    }
    /**
     * Return true if the given interface type is a CFN class or prop type
     */
    static isCfnType(interfaceType) {
        return interfaceType.name.startsWith('Cfn') || (interfaceType.namespace && interfaceType.namespace.startsWith('Cfn'));
    }
    /**
     * @returns `classType` for the core type Construct
     */
    get constructClass() {
        return this.sys.findClass(CoreTypesFqn.Construct);
    }
    /**
     * @returns `interfacetype` for the core type Construct
     */
    get constructInterface() {
        return this.sys.findInterface(CoreTypesFqn.ConstructInterface);
    }
    /**
     * @returns `classType` for the core type Construct
     */
    get resourceClass() {
        return this.sys.findClass(CoreTypesFqn.Resource);
    }
    /**
     * @returns `interfaceType` for the core type Resource
     */
    get resourceInterface() {
        return this.sys.findInterface(CoreTypesFqn.ResourceInterface);
    }
    /**
     * @returns `classType` for the core type Token
     */
    get tokenInterface() {
        return this.sys.findInterface(CoreTypesFqn.ResolvableInterface);
    }
    get physicalNameClass() {
        return this.sys.findClass(CoreTypesFqn.PhysicalName);
    }
}
exports.CoreTypes = CoreTypes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS10eXBlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvcmUtdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpQ0FBbUM7QUFFbkMsTUFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDO0FBQ3BDLElBQUssWUFRSjtBQVJELFdBQUssWUFBWTtJQUNmLHlEQUF5QyxDQUFBO0lBQ3pDLHFEQUFxQyxDQUFBO0lBQ3JDLCtEQUErQyxDQUFBO0lBQy9DLG1EQUFtQyxDQUFBO0lBQ25DLDZEQUE2QyxDQUFBO0lBQzdDLGlFQUFpRCxDQUFBO0lBQ2pELDJEQUEyQyxDQUFBO0FBQzdDLENBQUMsRUFSSSxZQUFZLEtBQVosWUFBWSxRQVFoQjtBQUVELE1BQWEsU0FBUztJQWlIcEIsWUFBWSxHQUF1QjtRQUNqQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDdEMscUJBQXFCO1lBQ3JCLE9BQU87U0FDUjtRQUVELEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLEdBQUcsRUFBRSxDQUFDLENBQUM7YUFDcEQ7U0FDRjtJQUNILENBQUM7SUEzSEQ7O09BRUc7SUFDSSxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQTBCO1FBQ3BELE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsYUFBYSxDQUFDLENB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RSxDQUFDO0lBRUQsSUFBVyxpQkFBaUI7UUFDMUIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdkQsQ0FBQztDQWlCRjtBQTlIRCw4QkE4SEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyByZWZsZWN0IGZyb20gJ2pzaWktcmVmbGVjdCc7XG5pbXBvcnQgeyBUeXBlU3lzdGVtIH0gZnJvbSBcImpzaWktcmVmbGVjdFwiO1xuaW1wb3J0IHsgZ2V0RG9jVGFnIH0gZnJvbSBcIi4vdXRpbFwiO1xuXG5jb25zdCBDT1JFX01PRFVMRSA9IFwiQGF3cy1jZGsvY29yZVwiO1xuZW51bSBDb3JlVHlwZXNGcW4ge1xuICBDZm5SZXNvdXJjZSA9IFwiQGF3cy1jZGsvY29yZS5DZm5SZXNvdXJjZVwiLFxuICBDb25zdHJ1Y3QgPSBcIkBhd3MtY2RrL2NvcmUuQ29uc3RydWN0XCIsXG4gIENvbnN0cnVjdEludGVyZmFjZSA9IFwiQGF3cy1jZGsvY29yZS5JQ29uc3RydWN0XCIsXG4gIFJlc291cmNlID0gXCJAYXdzLWNkay9jb3JlLlJlc291cmNlXCIsXG4gIFJlc291cmNlSW50ZXJmYWNlID0gXCJAYXdzLWNkay9jb3JlLklSZXNvdXJjZVwiLFxuICBSZXNvbHZhYmxlSW50ZXJmYWNlID0gXCJAYXdzLWNkay9jb3JlLklSZXNvbHZhYmxlXCIsXG4gIFBoeXNpY2FsTmFtZSA9IFwiQGF3cy1jZGsvY29yZS5QaHlzaWNhbE5hbWVcIlxufVxuXG5leHBvcnQgY2xhc3MgQ29yZVR5cGVzIHtcblxuICAvKipcbiAgICogQHJldHVybnMgdHJ1ZSBpZiBhc3NlbWJseSBoYXMgdGhlIENvcmUgbW9kdWxlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGhhc0NvcmVNb2R1bGUoYXNzZW1ibHk6IHJlZmxlY3QuQXNzZW1ibHkpIHtcbiAgICByZXR1cm4gKCFhc3NlbWJseS5zeXN0ZW0uYXNzZW1ibGllcy5maW5kKGEgPT4gYS5uYW1lID09PSBDT1JFX01PRFVMRSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHRydWUgaWYgYGNsYXNzVHlwZWAgcmVwcmVzZW50cyBhbiBMMSBDZm4gUmVzb3VyY2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNDZm5SZXNvdXJjZShjOiByZWZsZWN0LkNsYXNzVHlwZSkge1xuICAgIGlmICghYy5zeXN0ZW0uaW5jbHVkZXNBc3NlbWJseShDT1JFX01PRFVMRSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBza2lwIENmblJlc291cmNlIGl0c2VsZlxuICAgIGlmIChjLmZxbiA9PT0gQ29yZVR5cGVzRnFuLkNmblJlc291cmNlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmlzQ29uc3RydWN0Q2xhc3MoYykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBjZm5SZXNvdXJjZUNsYXNzID0gYy5zeXN0ZW0uZmluZEZxbihDb3JlVHlwZXNGcW4uQ2ZuUmVzb3VyY2UpO1xuICAgIGlmICghYy5leHRlbmRzKGNmblJlc291cmNlQ2xhc3MpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCFjLm5hbWUuc3RhcnRzV2l0aChcIkNmblwiKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHRydWUgaWYgYGNsYXNzVHlwZWAgcmVwcmVzZW50cyBhIENvbnN0cnVjdFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc0NvbnN0cnVjdENsYXNzKGM6IHJlZmxlY3QuQ2xhc3NUeXBlKSB7XG4gICAgaWYgKCFjLnN5c3RlbS5pbmNsdWRlc0Fzc2VtYmx5KENPUkVfTU9EVUxFKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghYy5pc0NsYXNzVHlwZSgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGMuYWJzdHJhY3QpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYy5leHRlbmRzKGMuc3lzdGVtLmZpbmRGcW4oQ29yZVR5cGVzRnFuLkNvbnN0cnVjdCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHRydWUgaWYgYGNsYXNzVHlwZWAgcmVwcmVzZW50cyBhbiBBV1MgcmVzb3VyY2UgKGkuZS4gZXh0ZW5kcyBgY2RrLlJlc291cmNlYCkuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlzUmVzb3VyY2VDbGFzcyhjbGFzc1R5cGU6IHJlZmxlY3QuQ2xhc3NUeXBlKSB7XG4gICAgY29uc3QgYmFzZVJlc291cmNlID0gY2xhc3NUeXBlLnN5c3RlbS5maW5kQ2xhc3MoQ29yZVR5cGVzRnFuLlJlc291cmNlKTtcbiAgICByZXR1cm4gY2xhc3NUeXBlLmV4dGVuZHMoYmFzZVJlc291cmNlKSB8fCBnZXREb2NUYWcoY2xhc3NUeXBlLCBcInJlc291cmNlXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0cnVlIGlmIHRoZSBnaXZlbiBpbnRlcmZhY2UgdHlwZSBpcyBhIENGTiBjbGFzcyBvciBwcm9wIHR5cGVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNDZm5UeXBlKGludGVyZmFjZVR5cGU6IHJlZmxlY3QuVHlwZSkge1xuICAgIHJldHVybiBpbnRlcmZhY2VUeXBlLm5hbWUuc3RhcnRzV2l0aCgnQ2ZuJykgfHwgKGludGVyZmFjZVR5cGUubmFtZXNwYWNlICYmIGludGVyZmFjZVR5cGUubmFtZXNwYWNlLnN0YXJ0c1dpdGgoJ0NmbicpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyBgY2xhc3NUeXBlYCBmb3IgdGhlIGNvcmUgdHlwZSBDb25zdHJ1Y3RcbiAgICovXG4gIHB1YmxpYyBnZXQgY29uc3RydWN0Q2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3lzLmZpbmRDbGFzcyhDb3JlVHlwZXNGcW4uQ29uc3RydWN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyBgaW50ZXJmYWNldHlwZWAgZm9yIHRoZSBjb3JlIHR5cGUgQ29uc3RydWN0XG4gICAqL1xuICBwdWJsaWMgZ2V0IGNvbnN0cnVjdEludGVyZmFjZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zeXMuZmluZEludGVyZmFjZShDb3JlVHlwZXNGcW4uQ29uc3RydWN0SW50ZXJmYWNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyBgY2xhc3NUeXBlYCBmb3IgdGhlIGNvcmUgdHlwZSBDb25zdHJ1Y3RcbiAgICovXG4gIHB1YmxpYyBnZXQgcmVzb3VyY2VDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5zeXMuZmluZENsYXNzKENvcmVUeXBlc0Zxbi5SZXNvdXJjZSk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgYGludGVyZmFjZVR5cGVgIGZvciB0aGUgY29yZSB0eXBlIFJlc291cmNlXG4gICAqL1xuICBwdWJsaWMgZ2V0IHJlc291cmNlSW50ZXJmYWNlKCkge1xuICAgIHJldHVybiB0aGlzLnN5cy5maW5kSW50ZXJmYWNlKENvcmVUeXBlc0Zxbi5SZXNvdXJjZUludGVyZmFjZSk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgYGNsYXNzVHlwZWAgZm9yIHRoZSBjb3JlIHR5cGUgVG9rZW5cbiAgICovXG4gIHB1YmxpYyBnZXQgdG9rZW5JbnRlcmZhY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3lzLmZpbmRJbnRlcmZhY2UoQ29yZVR5cGVzRnFuLlJlc29sdmFibGVJbnRlcmZhY2UpO1xuICB9XG5cbiAgcHVibGljIGdldCBwaHlzaWNhbE5hbWVDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5zeXMuZmluZENsYXNzKENvcmVUeXBlc0Zxbi5QaHlzaWNhbE5hbWUpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBzeXM6IFR5cGVTeXN0ZW07XG5cbiAgY29uc3RydWN0b3Ioc3lzOiByZWZsZWN0LlR5cGVTeXN0ZW0pIHtcbiAgICB0aGlzLnN5cyA9IHN5cztcbiAgICBpZiAoIXN5cy5pbmNsdWRlc0Fzc2VtYmx5KENPUkVfTU9EVUxFKSkge1xuICAgICAgLy8gZGlzYWJsZS1hbGwtY2hlY2tzXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBmcW4gb2YgT2JqZWN0LnZhbHVlcyhDb3JlVHlwZXNGcW4pKSB7XG4gICAgICBpZiAoIXRoaXMuc3lzLnRyeUZpbmRGcW4oZnFuKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGNvcmUgRlFOIHR5cGUgbm90IGZvdW5kOiAke2Zxbn1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==