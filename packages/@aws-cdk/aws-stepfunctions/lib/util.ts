export function requireOneOf(props: { [name: string]: any }, names: string[]) {
    if (names.map(name => name in props).filter(x => x === true).length !== 1) {
        throw new Error(`${props} must specify exactly one of: ${names}`);
    }
}

export function requireAll(props: { [name: string]: any }, names: string[]) {
    if (names.map(name => name in props).filter(x => x === false).length > 0) {
        throw new Error(`${props} must specify exactly all of: ${names}`);
    }
}

export function requirePositiveInteger(props: { [name: string]: any }, name: string) {
    if (!Number.isInteger(props[name]) || props[name] < 0) {
        throw new Error(`${name} must be a postive integer`);
    }
}