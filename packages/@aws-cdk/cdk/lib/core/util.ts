import { intrinsicEngine } from './engine-intrinsics';
import { FragmentSource, StringFragment } from './engine-strings';
import { resolve } from './tokens';

/**
 * Given an object, converts all keys to PascalCase given they are currently in camel case.
 * @param obj The object.
 */
export function capitalizePropertyNames(obj: any): any {
    obj = resolve(obj);

    if (typeof(obj) !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(x => capitalizePropertyNames(x));
    }

    const newObj: any = { };
    for (const key of Object.keys(obj)) {
        const value = obj[key];

        const first = key.charAt(0).toUpperCase();
        const newKey = first + key.slice(1);
        newObj[newKey] = capitalizePropertyNames(value);
    }

    return newObj;
}

/**
 * Turns empty arrays/objects to undefined (after evaluating tokens).
 */
export function ignoreEmpty(o: any): any {
    o = resolve(o); // first resolve tokens, in case they evaluate to 'undefined'.

    // undefined/null
    if (o == null) {
        return o;
    }

    if (Array.isArray(o) && o.length === 0) {
        return undefined;
    }

    if (typeof(o) === 'object' && Object.keys(o).length === 0) {
        return undefined;
    }

    return o;
}

/**
 * Result of the split of a string with Tokens
 *
 * Either a literal part of the string, or an unresolved Token.
 */
export type MarkerSpan = { type: 'string'; value: string } | { type: 'marker'; id: string };

/**
 * Split a string up into String Spans and Marker Spans
 */
export function splitOnMarkers(s: string, beginMarker: string, idPattern: string, endMarker: string): MarkerSpan[] {
    // tslint:disable-next-line:max-line-length
    const re = new RegExp(`${regexQuote(beginMarker)}(${idPattern})${regexQuote(endMarker)}`, 'g');
    const ret = new Array<MarkerSpan>();

    let rest = 0;
    let m = re.exec(s);
    while (m) {
        if (m.index > rest) {
            ret.push({ type: 'string', value: s.substring(rest, m.index) });
        }

        ret.push({ type: 'marker', id: m[1] });

        rest = re.lastIndex;
        m = re.exec(s);
    }

    if (rest < s.length) {
        ret.push({ type: 'string', value: s.substring(rest) });
    }

    if (ret.length === 0) {
        ret.push({ type: 'string', value: '' });
    }

    return ret;
}

/**
 * Resolves marker spans to string fragments
 */
export function resolveMarkerSpans(spans: MarkerSpan[], lookup: (id: string) => any): StringFragment[] {
    return spans.map(span => {

        switch (span.type) {
            case 'string':
                return { source: FragmentSource.Literal, value: span.value };
            case 'marker':
                const value = lookup(span.id);
                return { source: FragmentSource.Token, value, intrinsicEngine: intrinsicEngine(value) };
        }
    });
}

/**
 * Quote a string for use in a regex
 */
function regexQuote(s: string) {
    return s.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}
