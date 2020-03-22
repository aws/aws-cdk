const exclusions = require('./cli.exclusions.json').exclusions;

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
