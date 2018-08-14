export function requireOneOf(props: { [name: string]: any }, names: string[]) {
    if (names.map(name => name in props).filter(x => x === true).length !== 1) {
        throw new Error(`${JSON.stringify(props)} must specify exactly one of: ${names}`);
    }
}

export function requireNextOrEnd(props: any) {
    requireOneOf(props, ['next', 'end']);
}
