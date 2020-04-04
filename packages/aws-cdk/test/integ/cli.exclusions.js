/**
List of exclusions when running backwards compatibility tests.
Add when you need to exclude a specific integration test from a specific version.

This is an escape hatch for the rare cases where we need to introduce
a change that breaks existing integration tests. (e.g security)

For example:

{
    "test": "test-cdk-iam-diff.sh",
    "version": "1.30.0",
    "justification": "iam policy generation has changed in version > 1.30.0 because..."
},

*/
const exclusions = []

function getExclusion(test, version) {

    const filtered = exclusions.filter(e => {
        return e.test === test && e.version === version;
    });

    if (filtered.length === 0) {
        return undefined;
    }

    if (filtered.length === 1) {
        return filtered[0];
    }

    throw new Error(`Multiple exclusions found for (${test, version}): ${filtered.length}`);

}

module.exports.shouldSkip = function (test, version) {

    const exclusion = getExclusion(test, version);

    return exclusion != undefined

}

module.exports.getJustification = function (test, version) {

    const exclusion = getExclusion(test, version);

    if (!exclusion) {
        throw new Error(`Exclusion not found for (${test}, ${version})`);
    }

    return exclusion.justification;
}
