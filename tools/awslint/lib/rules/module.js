"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const linter_1 = require("../linter");
const cfn_resource_1 = require("./cfn-resource");
exports.moduleLinter = new linter_1.Linter(assembly => {
    const cfnResources = cfn_resource_1.CfnResourceReflection.findAll(assembly);
    if (cfnResources.length === 0) {
        return undefined; // no resources
    }
    return [{
            assembly,
            namespace: cfnResources[0].namespace
        }];
});
exports.moduleLinter.add({
    code: 'module-name',
    message: 'module name must be @aws-cdk/aws-<namespace>',
    eval: e => {
        if (!e.ctx.namespace) {
            return;
        }
        if (!e.ctx.assembly) {
            return;
        }
        const namespace = overrideNamespace(e.ctx.namespace.toLocaleLowerCase().replace('::', '-'));
        e.assertEquals(e.ctx.assembly.name, `@aws-cdk/${namespace}`, e.ctx.assembly.name);
    }
});
/**
 * Overrides special-case namespaces like aws-serverless=>aws-sam
 */
function overrideNamespace(namespace) {
    if (namespace === 'aws-serverless') {
        return 'aws-sam';
    }
    return namespace;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esc0NBQW1DO0FBQ25DLGlEQUF1RDtBQU8xQyxRQUFBLFlBQVksR0FBRyxJQUFJLGVBQU0sQ0FBc0IsUUFBUSxDQUFDLEVBQUU7SUFDckUsTUFBTSxZQUFZLEdBQUcsb0NBQXFCLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdELElBQUksWUFBWSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDN0IsT0FBTyxTQUFTLENBQUMsQ0FBQyxlQUFlO0tBQ2xDO0lBRUQsT0FBTyxDQUFFO1lBQ1AsUUFBUTtZQUNSLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztTQUNyQyxDQUFFLENBQUM7QUFDTixDQUFDLENBQUMsQ0FBQztBQUVILG9CQUFZLENBQUMsR0FBRyxDQUFHO0lBQ2pCLElBQUksRUFBRSxhQUFhO0lBQ25CLE9BQU8sRUFBRSw4Q0FBOEM7SUFDdkQsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFO1FBQ1IsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFO1lBQUUsT0FBTztTQUFFO1FBQ2pDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRTtZQUFFLE9BQU87U0FBRTtRQUNoQyxNQUFNLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM1RixDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxZQUFZLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BGLENBQUM7Q0FDRixDQUFDLENBQUM7QUFFSDs7R0FFRztBQUNILFNBQVMsaUJBQWlCLENBQUMsU0FBaUI7SUFDMUMsSUFBSSxTQUFTLEtBQUssZ0JBQWdCLEVBQUU7UUFDbEMsT0FBTyxTQUFTLENBQUM7S0FDbEI7SUFDRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcmVmbGVjdCBmcm9tICdqc2lpLXJlZmxlY3QnO1xuaW1wb3J0IHsgTGludGVyIH0gZnJvbSAnLi4vbGludGVyJztcbmltcG9ydCB7IENmblJlc291cmNlUmVmbGVjdGlvbiB9IGZyb20gJy4vY2ZuLXJlc291cmNlJztcblxuaW50ZXJmYWNlIE1vZHVsZUxpbnRlckNvbnRleHQgIHtcbiAgcmVhZG9ubHkgYXNzZW1ibHk6IHJlZmxlY3QuQXNzZW1ibHk7XG4gIHJlYWRvbmx5IG5hbWVzcGFjZTogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgbW9kdWxlTGludGVyID0gbmV3IExpbnRlcjxNb2R1bGVMaW50ZXJDb250ZXh0Pihhc3NlbWJseSA9PiB7XG4gIGNvbnN0IGNmblJlc291cmNlcyA9IENmblJlc291cmNlUmVmbGVjdGlvbi5maW5kQWxsKGFzc2VtYmx5KTtcbiAgaWYgKGNmblJlc291cmNlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkOyAvLyBubyByZXNvdXJjZXNcbiAgfVxuXG4gIHJldHVybiBbIHtcbiAgICBhc3NlbWJseSxcbiAgICBuYW1lc3BhY2U6IGNmblJlc291cmNlc1swXS5uYW1lc3BhY2VcbiAgfSBdO1xufSk7XG5cbm1vZHVsZUxpbnRlci5hZGQoICB7XG4gIGNvZGU6ICdtb2R1bGUtbmFtZScsXG4gIG1lc3NhZ2U6ICdtb2R1bGUgbmFtZSBtdXN0IGJlIEBhd3MtY2RrL2F3cy08bmFtZXNwYWNlPicsXG4gIGV2YWw6IGUgPT4ge1xuICAgIGlmICghZS5jdHgubmFtZXNwYWNlKSB7IHJldHVybjsgfVxuICAgIGlmICghZS5jdHguYXNzZW1ibHkpIHsgcmV0dXJuOyB9XG4gICAgY29uc3QgbmFtZXNwYWNlID0gb3ZlcnJpZGVOYW1lc3BhY2UoZS5jdHgubmFtZXNwYWNlLnRvTG9jYWxlTG93ZXJDYXNlKCkucmVwbGFjZSgnOjonLCAnLScpKTtcbiAgICBlLmFzc2VydEVxdWFscyhlLmN0eC5hc3NlbWJseS5uYW1lLCBgQGF3cy1jZGsvJHtuYW1lc3BhY2V9YCwgZS5jdHguYXNzZW1ibHkubmFtZSk7XG4gIH1cbn0pO1xuXG4vKipcbiAqIE92ZXJyaWRlcyBzcGVjaWFsLWNhc2UgbmFtZXNwYWNlcyBsaWtlIGF3cy1zZXJ2ZXJsZXNzPT5hd3Mtc2FtXG4gKi9cbmZ1bmN0aW9uIG92ZXJyaWRlTmFtZXNwYWNlKG5hbWVzcGFjZTogc3RyaW5nKSB7XG4gIGlmIChuYW1lc3BhY2UgPT09ICdhd3Mtc2VydmVybGVzcycpIHtcbiAgICByZXR1cm4gJ2F3cy1zYW0nO1xuICB9XG4gIHJldHVybiBuYW1lc3BhY2U7XG59XG4iXX0=