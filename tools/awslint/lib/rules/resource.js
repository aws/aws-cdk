"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const camelcase = require("camelcase");
const linter_1 = require("../linter");
const cfn_resource_1 = require("./cfn-resource");
const construct_1 = require("./construct");
const core_types_1 = require("./core-types");
const util_1 = require("./util");
const GRANT_RESULT_FQN = '@aws-cdk/aws-iam.Grant';
exports.resourceLinter = new linter_1.Linter(a => ResourceReflection.findAll(a));
var AttributeSite;
(function (AttributeSite) {
    AttributeSite["Interface"] = "interface";
    AttributeSite["Class"] = "class";
})(AttributeSite = exports.AttributeSite || (exports.AttributeSite = {}));
class ResourceReflection {
    constructor(construct) {
        this.construct = construct;
        this.assembly = construct.classType.assembly;
        this.sys = this.assembly.system;
        const cfn = tryResolveCfnResource(construct.classType);
        if (!cfn) {
            throw new Error(`Cannot find L1 class for L2 ${construct.fqn}. ` +
                `Is "${guessResourceName(construct.fqn)}" an actual CloudFormation resource. ` +
                `If not, use the "@resource" doc tag to indicate the full resource name (e.g. "@resource AWS::Route53::HostedZone")`);
        }
        this.core = new core_types_1.CoreTypes(this.sys);
        this.cfn = cfn;
        this.basename = construct.classType.name;
        this.fqn = construct.fqn;
        this.attributes = this.findAttributeProperties();
        this.physicalNameProp = this.findPhysicalNameProp();
    }
    /**
     * @returns all resource constructs (everything that extends `cdk.Resource`)
     */
    static findAll(assembly) {
        if (core_types_1.CoreTypes.hasCoreModule(assembly)) {
            return []; // not part of the dep stack
        }
        return construct_1.ConstructReflection
            .findAllConstructs(assembly)
            .filter(c => core_types_1.CoreTypes.isResourceClass(c.classType))
            .map(c => new ResourceReflection(c));
    }
    findPhysicalNameProp() {
        if (!this.construct.propsType) {
            return undefined;
        }
        const resourceName = camelcase(this.cfn.basename);
        // if resource name ends with "Name" (e.g. DomainName, then just use it as-is, otherwise append "Name")
        const physicalNameProp = resourceName.endsWith('Name') ? resourceName : `${resourceName}Name`;
        return this.construct.propsType.allProperties.find(x => x.name === physicalNameProp);
    }
    /**
     * Attribute properties are all the properties that begin with the type name (e.g. bucketXxx).
     */
    findAttributeProperties() {
        const result = new Array();
        for (const p of this.construct.classType.allProperties) {
            if (p.protected) {
                continue; // skip any protected properties
            }
            const basename = camelcase(this.cfn.basename);
            // an attribute property is a property which starts with the type name
            // (e.g. "bucketXxx") and/or has an @attribute doc tag.
            const tag = util_1.getDocTag(p, 'attribute');
            if (!p.name.startsWith(basename) && !tag) {
                continue;
            }
            let cfnAttributeNames;
            if (tag && tag !== 'true') {
                // if there's an `@attribute` doc tag with a value other than "true"
                // it should be used as the CFN attribute name instead of the property name
                // multiple attribute names can be listed as a comma-delimited list
                cfnAttributeNames = tag.split(',');
            }
            else {
                // okay, we don't have an explicit CFN attribute name, so we'll guess it
                // from the name of the property.
                const name = camelcase(p.name, { pascalCase: true });
                if (this.cfn.attributeNames.includes(name)) {
                    // special case: there is a cloudformation resource type in the attribute name
                    // for example 'RoleId'.
                    cfnAttributeNames = [name];
                }
                else if (p.name.startsWith(basename)) {
                    // begins with the resource name, just trim it
                    cfnAttributeNames = [name.substring(this.cfn.basename.length)];
                }
                else {
                    // we couldn't determine CFN attribute name, so we don't account for this
                    // as an attribute. this could be, for example, when a construct implements
                    // an interface that represents another resource (e.g. `lambda.Alias` implements `IFunction`).
                    continue;
                }
            }
            // check if this attribute is defined on an interface or on a class
            const property = findDeclarationSite(p);
            const site = property.parentType.isInterfaceType() ? AttributeSite.Interface : AttributeSite.Class;
            result.push({
                site,
                cfnAttributeNames,
                property
            });
        }
        return result;
    }
}
exports.ResourceReflection = ResourceReflection;
function findDeclarationSite(prop) {
    if (!prop.overrides || (!prop.overrides.isClassType() && !prop.overrides.isInterfaceType())) {
        if (!prop.parentType.isClassType() && !prop.parentType.isInterfaceType()) {
            throw new Error('invalid parent type');
        }
        return prop;
    }
    const overridesProp = prop.overrides.allProperties.find(p => p.name === prop.name);
    if (!overridesProp) {
        throw new Error(`Cannot find property ${prop.name} in override site ${prop.overrides.fqn}`);
    }
    return findDeclarationSite(overridesProp);
}
exports.resourceLinter.add({
    code: 'resource-class-extends-resource',
    message: `resource classes must extend "cdk.Resource" directly or indirectly`,
    eval: e => {
        const resourceBase = e.ctx.sys.findClass(e.ctx.core.resourceClass.fqn);
        e.assert(e.ctx.construct.classType.extends(resourceBase), e.ctx.construct.fqn);
    }
});
exports.resourceLinter.add({
    code: 'resource-interface',
    warning: true,
    message: 'every resource must have a resource interface',
    eval: e => {
        e.assert(e.ctx.construct.interfaceType, e.ctx.construct.fqn);
    }
});
exports.resourceLinter.add({
    code: 'resource-interface-extends-resource',
    message: 'construct interfaces of AWS resources must extend cdk.IResource',
    eval: e => {
        const resourceInterface = e.ctx.construct.interfaceType;
        if (!resourceInterface) {
            return;
        }
        const resourceInterfaceFqn = e.ctx.core.resourceInterface.fqn;
        const interfaceBase = e.ctx.sys.findInterface(resourceInterfaceFqn);
        e.assert(resourceInterface.extends(interfaceBase), resourceInterface.fqn);
    }
});
exports.resourceLinter.add({
    code: 'resource-attribute',
    message: 'resources must represent all cloudformation attributes as attribute properties. ' +
        '"@attribute ATTR[,ATTR]" can be used to tag non-standard attribute names. ' +
        'missing property:',
    eval: e => {
        for (const name of e.ctx.cfn.attributeNames) {
            const expected = camelcase(name).startsWith(camelcase(e.ctx.cfn.basename))
                ? camelcase(name)
                : camelcase(e.ctx.cfn.basename + name);
            const found = e.ctx.attributes.find(a => a.cfnAttributeNames.includes(name));
            e.assert(found, `${e.ctx.fqn}.${expected}`, expected);
        }
    }
});
exports.resourceLinter.add({
    code: 'grant-result',
    message: `"grant" method must return ${GRANT_RESULT_FQN}`,
    eval: e => {
        const grantResultType = e.ctx.sys.findFqn(GRANT_RESULT_FQN);
        const grantMethods = e.ctx.construct.classType.allMethods.filter(m => m.name.startsWith('grant'));
        for (const grantMethod of grantMethods) {
            e.assertSignature(grantMethod, {
                returns: grantResultType
            });
        }
    }
});
exports.resourceLinter.add({
    code: 'props-physical-name',
    message: "Every Resource must have a single physical name construction property, " +
        "with a name that is an ending substring of <cfnResource>Name",
    eval: e => {
        if (!e.ctx.construct.propsType) {
            return;
        }
        e.assert(e.ctx.physicalNameProp, e.ctx.construct.propsFqn);
    }
});
exports.resourceLinter.add({
    code: 'props-physical-name-type',
    message: 'The type of the physical name prop should always be a "string"',
    eval: e => {
        if (!e.ctx.physicalNameProp) {
            return;
        }
        const prop = e.ctx.physicalNameProp;
        e.assertTypesEqual(e.ctx.sys, prop.type, 'string', `${e.ctx.construct.propsFqn}.${prop.name}`);
    }
});
function tryResolveCfnResource(resourceClass) {
    const sys = resourceClass.system;
    // if there is a @resource doc tag, it takes precedece
    const tag = resourceClass.docs.customTag('resource');
    if (tag) {
        return cfn_resource_1.CfnResourceReflection.findByName(sys, tag);
    }
    // parse the FQN of the class name and see if we can find a matching CFN resource
    const guess = guessResourceName(resourceClass.fqn);
    if (guess) {
        const cfn = cfn_resource_1.CfnResourceReflection.findByName(sys, guess);
        if (cfn) {
            return cfn;
        }
    }
    // try to resolve through ancestors
    for (const base of resourceClass.getAncestors()) {
        const ret = tryResolveCfnResource(base);
        if (ret) {
            return ret;
        }
    }
    // failed misrably
    return undefined;
}
function guessResourceName(fqn) {
    const match = /@aws-cdk\/([a-z]+)-([a-z0-9]+)\.([A-Z][a-zA-Z0-9]+)/.exec(fqn);
    if (!match) {
        return undefined;
    }
    const [, org, ns, rs] = match;
    if (!org || !ns || !rs) {
        return undefined;
    }
    return `${org}::${ns}::${rs}`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUF1QztBQUV2QyxzQ0FBbUM7QUFDbkMsaURBQXVEO0FBQ3ZELDJDQUFrRDtBQUNsRCw2Q0FBeUM7QUFDekMsaUNBQW1DO0FBRW5DLE1BQU0sZ0JBQWdCLEdBQUcsd0JBQXdCLENBQUM7QUFFckMsUUFBQSxjQUFjLEdBQUcsSUFBSSxlQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQVE3RSxJQUFZLGFBR1g7QUFIRCxXQUFZLGFBQWE7SUFDdkIsd0NBQXVCLENBQUE7SUFDdkIsZ0NBQWUsQ0FBQTtBQUNqQixDQUFDLEVBSFcsYUFBYSxHQUFiLHFCQUFhLEtBQWIscUJBQWEsUUFHeEI7QUFFRCxNQUFhLGtCQUFrQjtJQTBCN0IsWUFBNEIsU0FBOEI7UUFBOUIsY0FBUyxHQUFULFNBQVMsQ0FBcUI7UUFDeEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztRQUM3QyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBRWhDLE1BQU0sR0FBRyxHQUFHLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1IsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsU0FBUyxDQUFDLEdBQUcsSUFBSTtnQkFDOUQsT0FBTyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHVDQUF1QztnQkFDOUUsb0hBQW9ILENBQUMsQ0FBQztTQUN6SDtRQUVELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxzQkFBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMs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R0FBRyxDQUFDLENBQUM7SUFDbkQsSUFBSSxLQUFLLEVBQUU7UUFDVCxNQUFNLEdBQUcsR0FBRyxvQ0FBcUIsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pELElBQUksR0FBRyxFQUFFO1lBQ1AsT0FBTyxHQUFHLENBQUM7U0FDWjtLQUNGO0lBRUQsbUNBQW1DO0lBQ25DLEtBQUssTUFBTSxJQUFJLElBQUksYUFBYSxDQUFDLFlBQVksRUFBRSxFQUFFO1FBQy9DLE1BQU0sR0FBRyxHQUFHLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksR0FBRyxFQUFFO1lBQ1AsT0FBTyxHQUFHLENBQUM7U0FDWjtLQUNGO0lBRUQsa0JBQWtCO0lBQ2xCLE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFFRCxTQUFTLGlCQUFpQixDQUFDLEdBQVc7SUFDcEMsTUFBTSxLQUFLLEdBQUcscURBQXFELENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlFLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFBRSxPQUFPLFNBQVMsQ0FBQztLQUFFO0lBRWpDLE1BQU0sQ0FBRSxBQUFELEVBQUcsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUUsR0FBRyxLQUFLLENBQUM7SUFDaEMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRTtRQUFFLE9BQU8sU0FBUyxDQUFDO0tBQUU7SUFFN0MsT0FBTyxHQUFHLEdBQUcsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUM7QUFDaEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNhbWVsY2FzZSBmcm9tICdjYW1lbGNhc2UnO1xuaW1wb3J0ICogYXMgcmVmbGVjdCBmcm9tICdqc2lpLXJlZmxlY3QnO1xuaW1wb3J0IHsgTGludGVyIH0gZnJvbSAnLi4vbGludGVyJztcbmltcG9ydCB7IENmblJlc291cmNlUmVmbGVjdGlvbiB9IGZyb20gJy4vY2ZuLXJlc291cmNlJztcbmltcG9ydCB7IENvbnN0cnVjdFJlZmxlY3Rpb24gfSBmcm9tICcuL2NvbnN0cnVjdCc7XG5pbXBvcnQgeyBDb3JlVHlwZXMgfSBmcm9tICcuL2NvcmUtdHlwZXMnO1xuaW1wb3J0IHsgZ2V0RG9jVGFnIH0gZnJvbSAnLi91dGlsJztcblxuY29uc3QgR1JBTlRfUkVTVUxUX0ZRTiA9ICdAYXdzLWNkay9hd3MtaWFtLkdyYW50JztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlTGludGVyID0gbmV3IExpbnRlcihhID0+IFJlc291cmNlUmVmbGVjdGlvbi5maW5kQWxsKGEpKTtcblxuZXhwb3J0IGludGVyZmFjZSBBdHRyaWJ1dGUge1xuICBzaXRlOiBBdHRyaWJ1dGVTaXRlO1xuICBwcm9wZXJ0eTogcmVmbGVjdC5Qcm9wZXJ0eTtcbiAgY2ZuQXR0cmlidXRlTmFtZXM6IHN0cmluZ1tdOyAvLyBidWNrZXRBcm5cbn1cblxuZXhwb3J0IGVudW0gQXR0cmlidXRlU2l0ZSB7XG4gIEludGVyZmFjZSA9ICdpbnRlcmZhY2UnLFxuICBDbGFzcyA9ICdjbGFzcydcbn1cblxuZXhwb3J0IGNsYXNzIFJlc291cmNlUmVmbGVjdGlvbiB7XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIGFsbCByZXNvdXJjZSBjb25zdHJ1Y3RzIChldmVyeXRoaW5nIHRoYXQgZXh0ZW5kcyBgY2RrLlJlc291cmNlYClcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZmluZEFsbChhc3NlbWJseTogcmVmbGVjdC5Bc3NlbWJseSkge1xuICAgIGlmIChDb3JlVHlwZXMuaGFzQ29yZU1vZHVsZShhc3NlbWJseSkpIHtcbiAgICAgIHJldHVybiBbXTsgLy8gbm90IHBhcnQgb2YgdGhlIGRlcCBzdGFja1xuICAgIH1cblxuICAgIHJldHVybiBDb25zdHJ1Y3RSZWZsZWN0aW9uXG4gICAgICAuZmluZEFsbENvbnN0cnVjdHMoYXNzZW1ibHkpXG4gICAgICAuZmlsdGVyKGMgPT4gQ29yZVR5cGVzLmlzUmVzb3VyY2VDbGFzcyhjLmNsYXNzVHlwZSkpXG4gICAgICAubWFwKGMgPT4gbmV3IFJlc291cmNlUmVmbGVjdGlvbihjKSk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgYXR0cmlidXRlczogQXR0cmlidXRlW107IC8vIGFjdHVhbCBhdHRyaWJ1dGUgcHJvcHNcbiAgcHVibGljIHJlYWRvbmx5IGZxbjogc3RyaW5nOyAvLyBleHBlY3RlZCBmcW4gb2YgcmVzb3VyY2UgY2xhc3NcblxuICBwdWJsaWMgcmVhZG9ubHkgYXNzZW1ibHk6IHJlZmxlY3QuQXNzZW1ibHk7XG4gIHB1YmxpYyByZWFkb25seSBzeXM6IHJlZmxlY3QuVHlwZVN5c3RlbTtcbiAgcHVibGljIHJlYWRvbmx5IGNmbjogQ2ZuUmVzb3VyY2VSZWZsZWN0aW9uO1xuICBwdWJsaWMgcmVhZG9ubHkgYmFzZW5hbWU6IHN0cmluZzsgLy8gaS5lLiBCdWNrZXRcbiAgcHVibGljIHJlYWRvbmx5IGNvcmU6IENvcmVUeXBlcztcbiAgcHVibGljIHJlYWRvbmx5IHBoeXNpY2FsTmFtZVByb3A/OiByZWZsZWN0LlByb3BlcnR5O1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBjb25zdHJ1Y3Q6IENvbnN0cnVjdFJlZmxlY3Rpb24pIHtcbiAgICB0aGlzLmFzc2VtYmx5ID0gY29uc3RydWN0LmNsYXNzVHlwZS5hc3NlbWJseTtcbiAgICB0aGlzLnN5cyA9IHRoaXMuYXNzZW1ibHkuc3lzdGVtO1xuXG4gICAgY29uc3QgY2ZuID0gdHJ5UmVzb2x2ZUNmblJlc291cmNlKGNvbnN0cnVjdC5jbGFzc1R5cGUpO1xuICAgIGlmICghY2ZuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBmaW5kIEwxIGNsYXNzIGZvciBMMiAke2NvbnN0cnVjdC5mcW59LiBgICtcbiAgICAgICAgYElzIFwiJHtndWVzc1Jlc291cmNlTmFtZShjb25zdHJ1Y3QuZnFuKX1cIiBhbiBhY3R1YWwgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UuIGAgK1xuICAgICAgICBgSWYgbm90LCB1c2UgdGhlIFwiQHJlc291cmNlXCIgZG9jIHRhZyB0byBpbmRpY2F0ZSB0aGUgZnVsbCByZXNvdXJjZSBuYW1lIChlLmcuIFwiQHJlc291cmNlIEFXUzo6Um91dGU1Mzo6SG9zdGVkWm9uZVwiKWApO1xuICAgIH1cblxuICAgIHRoaXMuY29yZSA9IG5ldyBDb3JlVHlwZXModGhpcy5zeXMpO1xuICAgIHRoaXMuY2ZuID0gY2ZuO1xuICAgIHRoaXMuYmFzZW5hbWUgPSBjb25zdHJ1Y3QuY2xhc3NUeXBlLm5hbWU7XG4gICAgdGhpcy5mcW4gPSBjb25zdHJ1Y3QuZnFuO1xuICAgIHRoaXMuYXR0cmlidXRlcyA9IHRoaXMuZmluZEF0dHJpYnV0ZVByb3BlcnRpZXMoKTtcbiAgICB0aGlzLnBoeXNpY2FsTmFtZVByb3AgPSB0aGlzLmZpbmRQaHlzaWNhbE5hbWVQcm9wKCk7XG4gIH1cblxuICBwcml2YXRlIGZpbmRQaHlzaWNhbE5hbWVQcm9wKCkge1xuICAgIGlmICghdGhpcy5jb25zdHJ1Y3QucHJvcHNUeXBlKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc291cmNlTmFtZSA9IGNhbWVsY2FzZSh0aGlzLmNmbi5iYXNlbmFtZSk7XG5cbiAgICAvLyBpZiByZXNvdXJjZSBuYW1lIGVuZHMgd2l0aCBcIk5hbWVcIiAoZS5nLiBEb21haW5OYW1lLCB0aGVuIGp1c3QgdXNlIGl0IGFzLWlzLCBvdGhlcndpc2UgYXBwZW5kIFwiTmFtZVwiKVxuICAgIGNvbnN0IHBoeXNpY2FsTmFtZVByb3AgPSByZXNvdXJjZU5hbWUuZW5kc1dpdGgoJ05hbWUnKSA/IHJlc291cmNlTmFtZSA6IGAke3Jlc291cmNlTmFtZX1OYW1lYDtcbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3QucHJvcHNUeXBlLmFsbFByb3BlcnRpZXMuZmluZCh4ID0+IHgubmFtZSA9PT0gcGh5c2ljYWxOYW1lUHJvcCk7XG4gIH1cblxuICAvKipcbiAgICogQXR0cmlidXRlIHByb3BlcnRpZXMgYXJlIGFsbCB0aGUgcHJvcGVydGllcyB0aGF0IGJlZ2luIHdpdGggdGhlIHR5cGUgbmFtZSAoZS5nLiBidWNrZXRYeHgpLlxuICAgKi9cbiAgcHJpdmF0ZSBmaW5kQXR0cmlidXRlUHJvcGVydGllcygpOiBBdHRyaWJ1dGVbXSB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IEFycmF5PEF0dHJpYnV0ZT4oKTtcblxuICAgIGZvciAoY29uc3QgcCBvZiB0aGlzLmNvbnN0cnVjdC5jbGFzc1R5cGUuYWxsUHJvcGVydGllcykge1xuICAgICAgaWYgKHAucHJvdGVjdGVkKSB7XG4gICAgICAgIGNvbnRpbnVlOyAvLyBza2lwIGFueSBwcm90ZWN0ZWQgcHJvcGVydGllc1xuICAgICAgfVxuXG4gICAgICBjb25zdCBiYXNlbmFtZSA9IGNhbWVsY2FzZSh0aGlzLmNmbi5iYXNlbmFtZSk7XG5cbiAgICAgIC8vIGFuIGF0dHJpYnV0ZSBwcm9wZXJ0eSBpcyBhIHByb3BlcnR5IHdoaWNoIHN0YXJ0cyB3aXRoIHRoZSB0eXBlIG5hbWVcbiAgICAgIC8vIChlLmcuIFwiYnVja2V0WHh4XCIpIGFuZC9vciBoYXMgYW4gQGF0dHJpYnV0ZSBkb2MgdGFnLlxuICAgICAgY29uc3QgdGFnID0gZ2V0RG9jVGFnKHAsICdhdHRyaWJ1dGUnKTtcbiAgICAgIGlmICghcC5uYW1lLnN0YXJ0c1dpdGgoYmFzZW5hbWUpICYmICF0YWcpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBjZm5BdHRyaWJ1dGVOYW1lcztcbiAgICAgIGlmICh0YWcgJiYgdGFnICE9PSAndHJ1ZScpIHtcbiAgICAgICAgLy8gaWYgdGhlcmUncyBhbiBgQGF0dHJpYnV0ZWAgZG9jIHRhZyB3aXRoIGEgdmFsdWUgb3RoZXIgdGhhbiBcInRydWVcIlxuICAgICAgICAvLyBpdCBzaG91bGQgYmUgdXNlZCBhcyB0aGUgQ0ZOIGF0dHJpYnV0ZSBuYW1lIGluc3RlYWQgb2YgdGhlIHByb3BlcnR5IG5hbWVcbiAgICAgICAgLy8gbXVsdGlwbGUgYXR0cmlidXRlIG5hbWVzIGNhbiBiZSBsaXN0ZWQgYXMgYSBjb21tYS1kZWxpbWl0ZWQgbGlzdFxuICAgICAgICBjZm5BdHRyaWJ1dGVOYW1lcyA9IHRhZy5zcGxpdCgnLCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gb2theSwgd2UgZG9uJ3QgaGF2ZSBhbiBleHBsaWNpdCBDRk4gYXR0cmlidXRlIG5hbWUsIHNvIHdlJ2xsIGd1ZXNzIGl0XG4gICAgICAgIC8vIGZyb20gdGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5LlxuXG4gICAgICAgIGNvbnN0IG5hbWUgPSBjYW1lbGNhc2UocC5uYW1lLCB7IHBhc2NhbENhc2U6IHRydWUgfSk7XG4gICAgICAgIGlmICh0aGlzLmNmbi5hdHRyaWJ1dGVOYW1lcy5pbmNsdWRlcyhuYW1lKSkge1xuICAgICAgICAgIC8vIHNwZWNpYWwgY2FzZTogdGhlcmUgaXMgYSBjbG91ZGZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIGluIHRoZSBhdHRyaWJ1dGUgbmFtZVxuICAgICAgICAgIC8vIGZvciBleGFtcGxlICdSb2xlSWQnLlxuICAgICAgICAgIGNmbkF0dHJpYnV0ZU5hbWVzID0gWyBuYW1lIF07XG4gICAgICAgIH0gZWxzZSBpZiAocC5uYW1lLnN0YXJ0c1dpdGgoYmFzZW5hbWUpKSB7XG4gICAgICAgICAgLy8gYmVnaW5zIHdpdGggdGhlIHJlc291cmNlIG5hbWUsIGp1c3QgdHJpbSBpdFxuICAgICAgICAgIGNmbkF0dHJpYnV0ZU5hbWVzID0gWyBuYW1lLnN1YnN0cmluZyh0aGlzLmNmbi5iYXNlbmFtZS5sZW5ndGgpIF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gd2UgY291bGRuJ3QgZGV0ZXJtaW5lIENGTiBhdHRyaWJ1dGUgbmFtZSwgc28gd2UgZG9uJ3QgYWNjb3VudCBmb3IgdGhpc1xuICAgICAgICAgIC8vIGFzIGFuIGF0dHJpYnV0ZS4gdGhpcyBjb3VsZCBiZSwgZm9yIGV4YW1wbGUsIHdoZW4gYSBjb25zdHJ1Y3QgaW1wbGVtZW50c1xuICAgICAgICAgIC8vIGFuIGludGVyZmFjZSB0aGF0IHJlcHJlc2VudHMgYW5vdGhlciByZXNvdXJjZSAoZS5nLiBgbGFtYmRhLkFsaWFzYCBpbXBsZW1lbnRzIGBJRnVuY3Rpb25gKS5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBjaGVjayBpZiB0aGlzIGF0dHJpYnV0ZSBpcyBkZWZpbmVkIG9uIGFuIGludGVyZmFjZSBvciBvbiBhIGNsYXNzXG4gICAgICBjb25zdCBwcm9wZXJ0eSA9IGZpbmREZWNsYXJhdGlvblNpdGUocCk7XG4gICAgICBjb25zdCBzaXRlID0gcHJvcGVydHkucGFyZW50VHlwZS5pc0ludGVyZmFjZVR5cGUoKSA/IEF0dHJpYnV0ZVNpdGUuSW50ZXJmYWNlIDogQXR0cmlidXRlU2l0ZS5DbGFzcztcblxuICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICBzaXRlLFxuICAgICAgICBjZm5BdHRyaWJ1dGVOYW1lcyxcbiAgICAgICAgcHJvcGVydHlcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZERlY2xhcmF0aW9uU2l0ZShwcm9wOiByZWZsZWN0LlByb3BlcnR5KTogcmVmbGVjdC5Qcm9wZXJ0eSB7XG4gIGlmICghcHJvcC5vdmVycmlkZXMgfHwgKCFwcm9wLm92ZXJyaWRlcy5pc0NsYXNzVHlwZSgpICYmICFwcm9wLm92ZXJyaWRlcy5pc0ludGVyZmFjZVR5cGUoKSkpIHtcbiAgICBpZiAoIXByb3AucGFyZW50VHlwZS5pc0NsYXNzVHlwZSgpICYmICFwcm9wLnBhcmVudFR5cGUuaXNJbnRlcmZhY2VUeXBlKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBwYXJlbnQgdHlwZScpO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcDtcbiAgfVxuXG4gIGNvbnN0IG92ZXJyaWRlc1Byb3AgPSBwcm9wLm92ZXJyaWRlcy5hbGxQcm9wZXJ0aWVzLmZpbmQocCA9PiBwLm5hbWUgPT09IHByb3AubmFtZSk7XG4gIGlmICghb3ZlcnJpZGVzUHJvcCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgcHJvcGVydHkgJHtwcm9wLm5hbWV9IGluIG92ZXJyaWRlIHNpdGUgJHtwcm9wLm92ZXJyaWRlcy5mcW59YCk7XG4gIH1cbiAgcmV0dXJuIGZpbmREZWNsYXJhdGlvblNpdGUob3ZlcnJpZGVzUHJvcCk7XG59XG5cbnJlc291cmNlTGludGVyLmFkZCh7XG4gIGNvZGU6ICdyZXNvdXJjZS1jbGFzcy1leHRlbmRzLXJlc291cmNlJyxcbiAgbWVzc2FnZTogYHJlc291cmNlIGNsYXNzZXMgbXVzdCBleHRlbmQgXCJjZGsuUmVzb3VyY2VcIiBkaXJlY3RseSBvciBpbmRpcmVjdGx5YCxcbiAgZXZhbDogZSA9PiB7XG4gICAgY29uc3QgcmVzb3VyY2VCYXNlID0gZS5jdHguc3lzLmZpbmRDbGFzcyhlLmN0eC5jb3JlLnJlc291cmNlQ2xhc3MuZnFuKTtcbiAgICBlLmFzc2VydChlLmN0eC5jb25zdHJ1Y3QuY2xhc3NUeXBlLmV4dGVuZHMocmVzb3VyY2VCYXNlKSwgZS5jdHguY29uc3RydWN0LmZxbik7XG4gIH1cbn0pO1xuXG5yZXNvdXJjZUxpbnRlci5hZGQoe1xuICBjb2RlOiAncmVzb3VyY2UtaW50ZXJmYWNlJyxcbiAgd2FybmluZzogdHJ1ZSxcbiAgbWVzc2FnZTogJ2V2ZXJ5IHJlc291cmNlIG11c3QgaGF2ZSBhIHJlc291cmNlIGludGVyZmFjZScsXG4gIGV2YWw6IGUgPT4ge1xuICAgIGUuYXNzZXJ0KGUuY3R4LmNvbnN0cnVjdC5pbnRlcmZhY2VUeXBlLCBlLmN0eC5jb25zdHJ1Y3QuZnFuKTtcbiAgfVxufSk7XG5cbnJlc291cmNlTGludGVyLmFkZCh7XG4gIGNvZGU6ICdyZXNvdXJjZS1pbnRlcmZhY2UtZXh0ZW5kcy1yZXNvdXJjZScsXG4gIG1lc3NhZ2U6ICdjb25zdHJ1Y3QgaW50ZXJmYWNlcyBvZiBBV1MgcmVzb3VyY2VzIG11c3QgZXh0ZW5kIGNkay5JUmVzb3VyY2UnLFxuICBldmFsOiBlID0+IHtcbiAgICBjb25zdCByZXNvdXJjZUludGVyZmFjZSA9IGUuY3R4LmNvbnN0cnVjdC5pbnRlcmZhY2VUeXBlO1xuICAgIGlmICghcmVzb3VyY2VJbnRlcmZhY2UpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCByZXNvdXJjZUludGVyZmFjZUZxbiA9IGUuY3R4LmNvcmUucmVzb3VyY2VJbnRlcmZhY2UuZnFuO1xuICAgIGNvbnN0IGludGVyZmFjZUJhc2UgPSBlLmN0eC5zeXMuZmluZEludGVyZmFjZShyZXNvdXJjZUludGVyZmFjZUZxbik7XG4gICAgZS5hc3NlcnQocmVzb3VyY2VJbnRlcmZhY2UuZXh0ZW5kcyhpbnRlcmZhY2VCYXNlKSwgcmVzb3VyY2VJbnRlcmZhY2UuZnFuKTtcbiAgfVxufSk7XG5cbnJlc291cmNlTGludGVyLmFkZCh7XG4gIGNvZGU6ICdyZXNvdXJjZS1hdHRyaWJ1dGUnLFxuICBtZXNzYWdlOlxuICAgICdyZXNvdXJjZXMgbXVzdCByZXByZXNlbnQgYWxsIGNsb3VkZm9ybWF0aW9uIGF0dHJpYnV0ZXMgYXMgYXR0cmlidXRlIHByb3BlcnRpZXMuICcgK1xuICAgICdcIkBhdHRyaWJ1dGUgQVRUUlssQVRUUl1cIiBjYW4gYmUgdXNlZCB0byB0YWcgbm9uLXN0YW5kYXJkIGF0dHJpYnV0ZSBuYW1lcy4gJyArXG4gICAgJ21pc3NpbmcgcHJvcGVydHk6JyxcbiAgZXZhbDogZSA9PiB7XG4gICAgZm9yIChjb25zdCBuYW1lIG9mIGUuY3R4LmNmbi5hdHRyaWJ1dGVOYW1lcykge1xuICAgICAgY29uc3QgZXhwZWN0ZWQgPSBjYW1lbGNhc2UobmFtZSkuc3RhcnRzV2l0aChjYW1lbGNhc2UoZS5jdHguY2ZuLmJhc2VuYW1lKSlcbiAgICAgICAgPyBjYW1lbGNhc2UobmFtZSlcbiAgICAgICAgOiBjYW1lbGNhc2UoZS5jdHguY2ZuLmJhc2VuYW1lICsgbmFtZSk7XG5cbiAgICAgIGNvbnN0IGZvdW5kID0gZS5jdHguYXR0cmlidXRlcy5maW5kKGEgPT4gYS5jZm5BdHRyaWJ1dGVOYW1lcy5pbmNsdWRlcyhuYW1lKSk7XG4gICAgICBlLmFzc2VydChmb3VuZCwgYCR7ZS5jdHguZnFufS4ke2V4cGVjdGVkfWAsIGV4cGVjdGVkKTtcbiAgICB9XG4gIH1cbn0pO1xuXG5yZXNvdXJjZUxpbnRlci5hZGQoe1xuICBjb2RlOiAnZ3JhbnQtcmVzdWx0JyxcbiAgbWVzc2FnZTogYFwiZ3JhbnRcIiBtZXRob2QgbXVzdCByZXR1cm4gJHtHUkFOVF9SRVNVTFRfRlFOfWAsXG4gIGV2YWw6IGUgPT4ge1xuICAgIGNvbnN0IGdyYW50UmVzdWx0VHlwZSA9IGUuY3R4LnN5cy5maW5kRnFuKEdSQU5UX1JFU1VMVF9GUU4pO1xuICAgIGNvbnN0IGdyYW50TWV0aG9kcyA9IGUuY3R4LmNvbnN0cnVjdC5jbGFzc1R5cGUuYWxsTWV0aG9kcy5maWx0ZXIobSA9PiBtLm5hbWUuc3RhcnRzV2l0aCgnZ3JhbnQnKSk7XG5cbiAgICBmb3IgKGNvbnN0IGdyYW50TWV0aG9kIG9mIGdyYW50TWV0aG9kcykge1xuICAgICAgZS5hc3NlcnRTaWduYXR1cmUoZ3JhbnRNZXRob2QsIHtcbiAgICAgICAgcmV0dXJuczogZ3JhbnRSZXN1bHRUeXBlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0pO1xuXG5yZXNvdXJjZUxpbnRlci5hZGQoe1xuICBjb2RlOiAncHJvcHMtcGh5c2ljYWwtbmFtZScsXG4gIG1lc3NhZ2U6IFwiRXZlcnkgUmVzb3VyY2UgbXVzdCBoYXZlIGEgc2luZ2xlIHBoeXNpY2FsIG5hbWUgY29uc3RydWN0aW9uIHByb3BlcnR5LCBcIiArXG4gICAgXCJ3aXRoIGEgbmFtZSB0aGF0IGlzIGFuIGVuZGluZyBzdWJzdHJpbmcgb2YgPGNmblJlc291cmNlPk5hbWVcIixcbiAgZXZhbDogZSA9PiB7XG4gICAgaWYgKCFlLmN0eC5jb25zdHJ1Y3QucHJvcHNUeXBlKSB7IHJldHVybjsgfVxuICAgIGUuYXNzZXJ0KGUuY3R4LnBoeXNpY2FsTmFtZVByb3AsIGUuY3R4LmNvbnN0cnVjdC5wcm9wc0Zxbik7XG4gIH1cbn0pO1xuXG5yZXNvdXJjZUxpbnRlci5hZGQoe1xuICBjb2RlOiAncHJvcHMtcGh5c2ljYWwtbmFtZS10eXBlJyxcbiAgbWVzc2FnZTogJ1RoZSB0eXBlIG9mIHRoZSBwaHlzaWNhbCBuYW1lIHByb3Agc2hvdWxkIGFsd2F5cyBiZSBhIFwic3RyaW5nXCInLFxuICBldmFsOiBlID0+IHtcbiAgICBpZiAoIWUuY3R4LnBoeXNpY2FsTmFtZVByb3ApIHsgcmV0dXJuOyB9XG4gICAgY29uc3QgcHJvcCA9IGUuY3R4LnBoeXNpY2FsTmFtZVByb3A7XG4gICAgZS5hc3NlcnRUeXBlc0VxdWFsKGUuY3R4LnN5cywgcHJvcC50eXBlLCAnc3RyaW5nJywgYCR7ZS5jdHguY29uc3RydWN0LnByb3BzRnFufS4ke3Byb3AubmFtZX1gKTtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIHRyeVJlc29sdmVDZm5SZXNvdXJjZShyZXNvdXJjZUNsYXNzOiByZWZsZWN0LkNsYXNzVHlwZSk6IENmblJlc291cmNlUmVmbGVjdGlvbiB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHN5cyA9IHJlc291cmNlQ2xhc3Muc3lzdGVtO1xuXG4gIC8vIGlmIHRoZXJlIGlzIGEgQHJlc291cmNlIGRvYyB0YWcsIGl0IHRha2VzIHByZWNlZGVjZVxuICBjb25zdCB0YWcgPSByZXNvdXJjZUNsYXNzLmRvY3MuY3VzdG9tVGFnKCdyZXNvdXJjZScpO1xuICBpZiAodGFnKSB7XG4gICAgcmV0dXJuIENmblJlc291cmNlUmVmbGVjdGlvbi5maW5kQnlOYW1lKHN5cywgdGFnKTtcbiAgfVxuXG4gIC8vIHBhcnNlIHRoZSBGUU4gb2YgdGhlIGNsYXNzIG5hbWUgYW5kIHNlZSBpZiB3ZSBjYW4gZmluZCBhIG1hdGNoaW5nIENGTiByZXNvdXJjZVxuICBjb25zdCBndWVzcyA9IGd1ZXNzUmVzb3VyY2VOYW1lKHJlc291cmNlQ2xhc3MuZnFuKTtcbiAgaWYgKGd1ZXNzKSB7XG4gICAgY29uc3QgY2ZuID0gQ2ZuUmVzb3VyY2VSZWZsZWN0aW9uLmZpbmRCeU5hbWUoc3lzLCBndWVzcyk7XG4gICAgaWYgKGNmbikge1xuICAgICAgcmV0dXJuIGNmbjtcbiAgICB9XG4gIH1cblxuICAvLyB0cnkgdG8gcmVzb2x2ZSB0aHJvdWdoIGFuY2VzdG9yc1xuICBmb3IgKGNvbnN0IGJhc2Ugb2YgcmVzb3VyY2VDbGFzcy5nZXRBbmNlc3RvcnMoKSkge1xuICAgIGNvbnN0IHJldCA9IHRyeVJlc29sdmVDZm5SZXNvdXJjZShiYXNlKTtcbiAgICBpZiAocmV0KSB7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgfVxuXG4gIC8vIGZhaWxlZCBtaXNyYWJseVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBndWVzc1Jlc291cmNlTmFtZShmcW46IHN0cmluZykge1xuICBjb25zdCBtYXRjaCA9IC9AYXdzLWNka1xcLyhbYS16XSspLShbYS16MC05XSspXFwuKFtBLVpdW2EtekEtWjAtOV0rKS8uZXhlYyhmcW4pO1xuICBpZiAoIW1hdGNoKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cblxuICBjb25zdCBbICwgb3JnLCBucywgcnMgXSA9IG1hdGNoO1xuICBpZiAoIW9yZyB8fCAhbnMgfHwgIXJzKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cblxuICByZXR1cm4gYCR7b3JnfTo6JHtuc306OiR7cnN9YDtcbn1cbiJdfQ==