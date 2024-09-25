"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSchema = exports.bump = exports.update = exports.SCHEMAS = void 0;
const fs = require("fs");
const path = require("path");
const semver = require("semver");
// eslint-disable-next-line import/no-extraneous-dependencies
const tjs = require("typescript-json-schema");
function log(message) {
    // eslint-disable-next-line no-console
    console.log(message);
}
/**
 * Where schemas are committed.
 */
const SCHEMA_DIR = path.resolve(__dirname, '../schema');
const SCHEMA_DEFINITIONS = {
    'assets': {
        rootTypeName: 'AssetManifest',
        files: [path.join('assets', 'schema.ts')],
    },
    'cloud-assembly': {
        rootTypeName: 'AssemblyManifest',
        files: [path.join('cloud-assembly', 'schema.ts')],
    },
    'integ': {
        rootTypeName: 'IntegManifest',
        files: [path.join('integ-tests', 'schema.ts')],
    },
};
exports.SCHEMAS = Object.keys(SCHEMA_DEFINITIONS);
function update() {
    for (const s of exports.SCHEMAS) {
        generateSchema(s);
    }
    bump();
}
exports.update = update;
function bump() {
    const versionFile = path.join(SCHEMA_DIR, 'cloud-assembly.version.json');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const metadata = require(versionFile);
    const oldVersion = metadata.version;
    const newVersion = semver.inc(oldVersion, 'major');
    log(`Updating schema version: ${oldVersion} -> ${newVersion}`);
    fs.writeFileSync(versionFile, JSON.stringify({ version: newVersion }));
}
exports.bump = bump;
/**
 * Generates a schema from typescript types.
 * @returns JSON schema
 * @param schemaName the schema to generate
 * @param shouldBump writes a new version of the schema and bumps the major version
 */
function generateSchema(schemaName, saveToFile = true) {
    const spec = SCHEMA_DEFINITIONS[schemaName];
    const out = saveToFile ? path.join(SCHEMA_DIR, `${schemaName}.schema.json`) : '';
    const settings = {
        required: true,
        ref: true,
        topRef: true,
        noExtraProps: false,
        out,
    };
    const compilerOptions = {
        strictNullChecks: true,
    };
    const program = tjs.getProgramFromFiles(spec.files.map(file => path.join(__dirname, '..', 'lib', file)), compilerOptions);
    const schema = tjs.generateSchema(program, spec.rootTypeName, settings);
    augmentDescription(schema);
    addAnyMetadataEntry(schema);
    if (out) {
        log(`Generating schema to ${out}`);
        fs.writeFileSync(out, JSON.stringify(schema, null, 4));
    }
    return schema;
}
exports.generateSchema = generateSchema;
/**
 * Remove 'default' from the schema since its generated
 * from the tsdocs, which are not necessarily actual values,
 * but rather descriptive behavior.
 *
 * To keep this inforamtion in the schema, we append it to the
 * 'description' of the property.
 */
function augmentDescription(schema) {
    function _recurse(o) {
        for (const prop in o) {
            if (prop === 'description' && typeof o[prop] === 'string') {
                const description = o[prop];
                const defaultValue = o.default;
                if (!defaultValue) {
                    // property doesn't have a default value
                    // skip
                    continue;
                }
                const descriptionWithDefault = `${description} (Default ${defaultValue})`;
                delete o.default;
                o[prop] = descriptionWithDefault;
            }
            else if (typeof o[prop] === 'object') {
                _recurse(o[prop]);
            }
        }
    }
    _recurse(schema);
}
/**
 * Patch the properties of MetadataEntry to allow
 * specifying any free form data. This is needed since source
 * code doesn't allow this in order to enforce stricter jsii
 * compatibility checks.
 */
function addAnyMetadataEntry(schema) {
    schema?.definitions?.MetadataEntry?.properties.data.anyOf.push({ description: 'Free form data.' });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLXNjaGVtYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVwZGF0ZS1zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixpQ0FBaUM7QUFDakMsNkRBQTZEO0FBQzdELDhDQUE4QztBQUU5QyxTQUFTLEdBQUcsQ0FBQyxPQUFlO0lBQzFCLHNDQUFzQztJQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZCLENBQUM7QUFFRDs7R0FFRztBQUNILE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBRXhELE1BQU0sa0JBQWtCLEdBYXBCO0lBQ0YsUUFBUSxFQUFFO1FBQ1IsWUFBWSxFQUFFLGVBQWU7UUFDN0IsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7S0FDMUM7SUFDRCxnQkFBZ0IsRUFBRTtRQUNoQixZQUFZLEVBQUUsa0JBQWtCO1FBQ2hDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLENBQUM7S0FDbEQ7SUFDRCxPQUFPLEVBQUU7UUFDUCxZQUFZLEVBQUUsZUFBZTtRQUM3QixLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQztLQUMvQztDQUNGLENBQUM7QUFFVyxRQUFBLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFFdkQsU0FBZ0IsTUFBTTtJQUNwQixLQUFLLE1BQU0sQ0FBQyxJQUFJLGVBQU8sRUFBRSxDQUFDO1FBQ3hCLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUQsSUFBSSxFQUFFLENBQUM7QUFDVCxDQUFDO0FBTkQsd0JB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LE9BQU8sQ0FBQztnQkFDakIsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLHNCQUFzQixDQUFDO1lBRW5DLENBQUM7aUJBQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxRQUFRLEVBQUUsQ0FBQztnQkFDdkMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUVuQixDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFTLG1CQUFtQixDQUFDLE1BQVc7SUFDdEMsTUFBTSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FBQztBQUNyRyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIHNlbXZlciBmcm9tICdzZW12ZXInO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0ICogYXMgdGpzIGZyb20gJ3R5cGVzY3JpcHQtanNvbi1zY2hlbWEnO1xuXG5mdW5jdGlvbiBsb2cobWVzc2FnZTogc3RyaW5nKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xufVxuXG4vKipcbiAqIFdoZXJlIHNjaGVtYXMgYXJlIGNvbW1pdHRlZC5cbiAqL1xuY29uc3QgU0NIRU1BX0RJUiA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9zY2hlbWEnKTtcblxuY29uc3QgU0NIRU1BX0RFRklOSVRJT05TOiB7XG4gIFtzY2hlbWFOYW1lOiBzdHJpbmddOiB7XG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIHJvb3QgdHlwZS5cbiAgICAgKi9cbiAgICByb290VHlwZU5hbWU6IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBGaWxlcyBsb2FkZWQgdG8gZ2VuZXJhdGUgdGhlIHNjaGVtYS5cbiAgICAgKiBTaG91bGQgYmUgcmVsYXRpdmUgdG8gYGNsb3VkLWFzc2VtYmx5LXNjaGVtYS9saWJgLlxuICAgICAqIFVzdWFsbHkgdGhpcyBpcyBqdXN0IHRoZSBmaWxlIGNvbnRhaW5pbmcgdGhlIHJvb3QgdHlwZS5cbiAgICAgKi9cbiAgICBmaWxlczogc3RyaW5nW107XG4gIH07XG59ID0ge1xuICAnYXNzZXRzJzoge1xuICAgIHJvb3RUeXBlTmFtZTogJ0Fzc2V0TWFuaWZlc3QnLFxuICAgIGZpbGVzOiBbcGF0aC5qb2luKCdhc3NldHMnLCAnc2NoZW1hLnRzJyldLFxuICB9LFxuICAnY2xvdWQtYXNzZW1ibHknOiB7XG4gICAgcm9vdFR5cGVOYW1lOiAnQXNzZW1ibHlNYW5pZmVzdCcsXG4gICAgZmlsZXM6IFtwYXRoLmpvaW4oJ2Nsb3VkLWFzc2VtYmx5JywgJ3NjaGVtYS50cycpXSxcbiAgfSxcbiAgJ2ludGVnJzoge1xuICAgIHJvb3RUeXBlTmFtZTogJ0ludGVnTWFuaWZlc3QnLFxuICAgIGZpbGVzOiBbcGF0aC5qb2luKCdpbnRlZy10ZXN0cycsICdzY2hlbWEudHMnKV0sXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgU0NIRU1BUyA9IE9iamVjdC5rZXlzKFNDSEVNQV9ERUZJTklUSU9OUyk7XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gIGZvciAoY29uc3QgcyBvZiBTQ0hFTUFTKSB7XG4gICAgZ2VuZXJhdGVTY2hlbWEocyk7XG4gIH1cblxuICBidW1wKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidW1wKCkge1xuICBjb25zdCB2ZXJzaW9uRmlsZSA9IHBhdGguam9pbihTQ0hFTUFfRElSLCAnY2xvdWQtYXNzZW1ibHkudmVyc2lvbi5qc29uJyk7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcbiAgY29uc3QgbWV0YWRhdGEgPSByZXF1aXJlKHZlcnNpb25GaWxlKTtcblxuICBjb25zdCBvbGRWZXJzaW9uID0gbWV0YWRhdGEudmVyc2lvbjtcbiAgY29uc3QgbmV3VmVyc2lvbiA9IHNlbXZlci5pbmMob2xkVmVyc2lvbiwgJ21ham9yJyk7XG5cbiAgbG9nKGBVcGRhdGluZyBzY2hlbWEgdmVyc2lvbjogJHtvbGRWZXJzaW9ufSAtPiAke25ld1ZlcnNpb259YCk7XG4gIGZzLndyaXRlRmlsZVN5bmModmVyc2lvbkZpbGUsIEpTT04uc3RyaW5naWZ5KHsgdmVyc2lvbjogbmV3VmVyc2lvbiB9KSk7XG59XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgc2NoZW1hIGZyb20gdHlwZXNjcmlwdCB0eXBlcy5cbiAqIEByZXR1cm5zIEpTT04gc2NoZW1hXG4gKiBAcGFyYW0gc2NoZW1hTmFtZSB0aGUgc2NoZW1hIHRvIGdlbmVyYXRlXG4gKiBAcGFyYW0gc2hvdWxkQnVtcCB3cml0ZXMgYSBuZXcgdmVyc2lvbiBvZiB0aGUgc2NoZW1hIGFuZCBidW1wcyB0aGUgbWFqb3IgdmVyc2lvblxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVTY2hlbWEoc2NoZW1hTmFtZTogc3RyaW5nLCBzYXZlVG9GaWxlOiBib29sZWFuID0gdHJ1ZSkge1xuICBjb25zdCBzcGVjID0gU0NIRU1BX0RFRklOSVRJT05TW3NjaGVtYU5hbWVdO1xuICBjb25zdCBvdXQgPSBzYXZlVG9GaWxlID8gcGF0aC5qb2luKFNDSEVNQV9ESVIsIGAke3NjaGVtYU5hbWV9LnNjaGVtYS5qc29uYCkgOiAnJztcblxuICBjb25zdCBzZXR0aW5nczogUGFydGlhbDx0anMuQXJncz4gPSB7XG4gICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgcmVmOiB0cnVlLFxuICAgIHRvcFJlZjogdHJ1ZSxcbiAgICBub0V4dHJhUHJvcHM6IGZhbHNlLFxuICAgIG91dCxcbiAgfTtcblxuICBjb25zdCBjb21waWxlck9wdGlvbnMgPSB7XG4gICAgc3RyaWN0TnVsbENoZWNrczogdHJ1ZSxcbiAgfTtcblxuICBjb25zdCBwcm9ncmFtID0gdGpzLmdldFByb2dyYW1Gcm9tRmlsZXMoc3BlYy5maWxlcy5tYXAoZmlsZSA9PnBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICdsaWInLCBmaWxlKSksIGNvbXBpbGVyT3B0aW9ucyk7XG4gIGNvbnN0IHNjaGVtYSA9IHRqcy5nZW5lcmF0ZVNjaGVtYShwcm9ncmFtLCBzcGVjLnJvb3RUeXBlTmFtZSwgc2V0dGluZ3MpO1xuXG4gIGF1Z21lbnREZXNjcmlwdGlvbihzY2hlbWEpO1xuICBhZGRBbnlNZXRhZGF0YUVudHJ5KHNjaGVtYSk7XG5cbiAgaWYgKG91dCkge1xuICAgIGxvZyhgR2VuZXJhdGluZyBzY2hlbWEgdG8gJHtvdXR9YCk7XG4gICAgZnMud3JpdGVGaWxlU3luYyhvdXQsIEpTT04uc3RyaW5naWZ5KHNjaGVtYSwgbnVsbCwgNCkpO1xuICB9XG5cbiAgcmV0dXJuIHNjaGVtYTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgJ2RlZmF1bHQnIGZyb20gdGhlIHNjaGVtYSBzaW5jZSBpdHMgZ2VuZXJhdGVkXG4gKiBmcm9tIHRoZSB0c2RvY3MsIHdoaWNoIGFyZSBub3QgbmVjZXNzYXJpbHkgYWN0dWFsIHZhbHVlcyxcbiAqIGJ1dCByYXRoZXIgZGVzY3JpcHRpdmUgYmVoYXZpb3IuXG4gKlxuICogVG8ga2VlcCB0aGlzIGluZm9yYW10aW9uIGluIHRoZSBzY2hlbWEsIHdlIGFwcGVuZCBpdCB0byB0aGVcbiAqICdkZXNjcmlwdGlvbicgb2YgdGhlIHByb3BlcnR5LlxuICovXG5mdW5jdGlvbiBhdWdtZW50RGVzY3JpcHRpb24oc2NoZW1hOiBhbnkpIHtcblxuICBmdW5jdGlvbiBfcmVjdXJzZShvOiBhbnkpIHtcbiAgICBmb3IgKGNvbnN0IHByb3AgaW4gbykge1xuXG4gICAgICBpZiAocHJvcCA9PT0gJ2Rlc2NyaXB0aW9uJyAmJiB0eXBlb2Ygb1twcm9wXSA9PT0gJ3N0cmluZycpIHtcblxuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IG9bcHJvcF07XG4gICAgICAgIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IG8uZGVmYXVsdDtcblxuICAgICAgICBpZiAoIWRlZmF1bHRWYWx1ZSkge1xuICAgICAgICAgIC8vIHByb3BlcnR5IGRvZXNuJ3QgaGF2ZSBhIGRlZmF1bHQgdmFsdWVcbiAgICAgICAgICAvLyBza2lwXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbldpdGhEZWZhdWx0ID0gYCR7ZGVzY3JpcHRpb259IChEZWZhdWx0ICR7ZGVmYXVsdFZhbHVlfSlgO1xuXG4gICAgICAgIGRlbGV0ZSBvLmRlZmF1bHQ7XG4gICAgICAgIG9bcHJvcF0gPSBkZXNjcmlwdGlvbldpdGhEZWZhdWx0O1xuXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvW3Byb3BdID09PSAnb2JqZWN0Jykge1xuICAgICAgICBfcmVjdXJzZShvW3Byb3BdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfcmVjdXJzZShzY2hlbWEpO1xuXG59XG5cbi8qKlxuICogUGF0Y2ggdGhlIHByb3BlcnRpZXMgb2YgTWV0YWRhdGFFbnRyeSB0byBhbGxvd1xuICogc3BlY2lmeWluZyBhbnkgZnJlZSBmb3JtIGRhdGEuIFRoaXMgaXMgbmVlZGVkIHNpbmNlIHNvdXJjZVxuICogY29kZSBkb2Vzbid0IGFsbG93IHRoaXMgaW4gb3JkZXIgdG8gZW5mb3JjZSBzdHJpY3RlciBqc2lpXG4gKiBjb21wYXRpYmlsaXR5IGNoZWNrcy5cbiAqL1xuZnVuY3Rpb24gYWRkQW55TWV0YWRhdGFFbnRyeShzY2hlbWE6IGFueSkge1xuICBzY2hlbWE/LmRlZmluaXRpb25zPy5NZXRhZGF0YUVudHJ5Py5wcm9wZXJ0aWVzLmRhdGEuYW55T2YucHVzaCh7IGRlc2NyaXB0aW9uOiAnRnJlZSBmb3JtIGRhdGEuJyB9KTtcbn1cbiJdfQ==