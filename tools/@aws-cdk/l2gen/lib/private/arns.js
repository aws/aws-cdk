"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitArnExpression = exports.formatArnExpression = exports.analyzeArnFormat = void 0;
const value_1 = require("../value");
const well_known_values_1 = require("../well-known-values");
const well_known_types_1 = require("../well-known-types");
function analyzeArnFormat(arnFormat) {
    const parts = arnFormat.split(':');
    if (parts[0] !== 'arn') {
        throw new Error(`Does not look like an ARN: ${arnFormat}`);
    }
    if (parts[1] !== '${Partition}') {
        throw new Error(`Second ARN element must be \${Partition}: ${arnFormat}`);
    }
    const service = parts[2];
    if (!['', '${Region}'].includes(parts[3])) {
        throw new Error(`Fourth ARN element must be empty string or \${Region}: ${arnFormat}`);
    }
    const hasRegion = parts[3] === '${Region}';
    if (!['', '${Account}'].includes(parts[4])) {
        throw new Error(`Fifth ARN element must be empty string or \${Account}: ${arnFormat}`);
    }
    const hasAccount = parts[4] === '${Account}';
    // FIXME: Support ARNs with more `:`es than this
    const resourceParts = parts[5].split('/').map((p) => {
        // Very naive parsing right now.
        if (p.startsWith('${')) {
            if (!p.endsWith('}')) {
                throw new Error(`Does not look like placeholder: ${p}`);
            }
            return { type: 'attr', attr: p.substr(2, p.length - 3) };
        }
        if (p.includes('${')) {
            throw new Error(`Placeholder must be entire slashpart, not start halfway in the middle: ${p}`);
        }
        return { type: 'literal', literal: p };
    });
    return {
        service,
        hasRegion,
        hasAccount,
        resourceParts,
    };
}
exports.analyzeArnFormat = analyzeArnFormat;
function formatArnExpression(format, stackVariable, fields) {
    return well_known_types_1.withMembers(stackVariable).callExp('formatArn')(value_1.objLit({
        service: well_known_values_1.jsVal(format.service),
        // Explicitly set to nothing if missing, otherwise default is to take from stack
        ...!format.hasRegion ? { region: well_known_values_1.jsVal('') } : {},
        ...!format.hasAccount ? { account: well_known_values_1.jsVal('') } : {},
        // We put everything into the 'resource' field.
        arnFormat: well_known_types_1.ARN_FORMAT.propExp('NO_RESOURCE_NAME'),
        resource: well_known_types_1.FN.callExp('join')(well_known_values_1.jsVal('/'), well_known_values_1.arrayVal(format.resourceParts.map((rsPart) => {
            switch (rsPart.type) {
                case 'literal':
                    return well_known_values_1.jsVal(rsPart.literal);
                case 'attr':
                    if (!fields[rsPart.attr]) {
                        throw new Error(`Field in ARN string missing from arguments: ${rsPart.attr}`);
                    }
                    return fields[rsPart.attr];
            }
        }))),
    }));
}
exports.formatArnExpression = formatArnExpression;
function splitArnExpression(format, arnVariable, parsedVarName) {
    const splitExpression = value_1.litVal(well_known_types_1.ARN.callExp('split')(arnVariable, well_known_types_1.ARN_FORMAT.propExp('NO_RESOURCE_NAME')));
    const fieldAndIndex = format.resourceParts
        .flatMap((part, i) => part.type === 'attr' ? [[part.attr, i]] : []);
    const splitFields = Object.fromEntries(fieldAndIndex.map(([field, ix]) => [field, well_known_values_1.splitSelect('/', ix, well_known_types_1.withMembers(parsedVarName).propExp('resource'))]));
    return { splitExpression, splitFields };
}
exports.splitArnExpression = splitArnExpression;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFybnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsb0NBQTBDO0FBQzFDLDREQUFvRTtBQUNwRSwwREFBdUU7QUFHdkUsU0FBZ0IsZ0JBQWdCLENBQUMsU0FBaUI7SUFDaEQsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUVuQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUU7UUFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsU0FBUyxFQUFFLENBQUMsQ0FBQztLQUM1RDtJQUNELElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLGNBQWMsRUFBRTtRQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0tBQzNFO0lBQ0QsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXpCLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDekMsTUFBTSxJQUFJLEtBQUssQ0FBQywwREFBMEQsU0FBUyxFQUFFLENBQUMsQ0FBQztLQUN4RjtJQUNELE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxXQUFXLENBQUM7SUFFM0MsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUMxQyxNQUFNLElBQUksS0FBSyxDQUFDLDBEQUEwRCxTQUFTLEVBQUUsQ0FBQyxDQUFDO0tBQ3hGO0lBQ0QsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLFlBQVksQ0FBQztJQUU3QyxnREFBZ0Q7SUFFaEQsTUFBTSxhQUFh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