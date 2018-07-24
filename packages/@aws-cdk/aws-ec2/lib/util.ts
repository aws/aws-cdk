/**
 * Turn an arbitrary string into one that can be used as a CloudFormation identifier by stripping special characters
 *
 * (At the moment, no efforts are taken to prevent collissions, but we can add that later when it becomes necessary).
 */
export function slugify(x: string): string {
    return x.replace(/[^a-zA-Z0-9]/g, '');
}
