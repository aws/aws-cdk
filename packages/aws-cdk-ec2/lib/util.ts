import { Token } from 'aws-cdk';

export function normalizeStackParameters(props: any) {
    const params: { [key: string]: any } = { };

    for (const prop of Object.keys(props)) {
        let value = (props as any)[prop];

        if (Array.isArray(value)) {
            // We can't ACTUALLY pass token values here (must be literal strings), but in the case where this is a MissingContext
            // token we also don't want to fail, since the template will be resynthesized later
            // FIXME: Make a distinction between those two cases.
            value = value.map(el => el instanceof Token ? "(token value)" : el).join(',');
        } else if (typeof value === 'boolean') {
            value = value.toString();
        } else if (typeof value === 'object' && !(value instanceof Token)) {
            throw new Error(`Object parameters are not supported for property ${prop}: ${JSON.stringify(value)}`);
        } else if (typeof value === 'function') {
            throw new Error(`Property ${prop} is a function`);
        }

        // Since we're going to plug this into a stack template that is expecting
        // pascalcased parameter names, uppercase the first letter here.
        params[upperCaseFirst(prop)] = value;
    }

    return params;
}

function upperCaseFirst(x: string): string {
    return x.substr(0, 1).toUpperCase() + x.substr(1);
}

/**
 * Turn an arbitrary string into one that can be used as a CloudFormation identifier by stripping special characters
 *
 * (At the moment, no efforts are taken to prevent collissions, but we can add that later when it becomes necessary).
 */
export function slugify(x: string): string {
    return x.replace(/[^a-zA-Z0-9]/g, '');
}
