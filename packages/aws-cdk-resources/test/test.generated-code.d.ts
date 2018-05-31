import { Test } from 'nodeunit';
declare const _default: {
    'missing properties in resource are reported at construction time'(test: Test): void;
    'missing properties in property type reported at synthesis time'(test: Test): void;
    'properties of invalid primitive type are reported'(test: Test): void;
    'scalar unions: primitive'(test: Test): void;
    'scalar unions: complex'(test: Test): void;
    'scalar unions: neither'(test: Test): void;
    'both lists and scalars accepted: list'(test: Test): void;
    'both lists and scalars accepted: primitive scalar'(test: Test): void;
    'both lists and scalars accepted: complex scalar'(test: Test): void;
    'return values of tokens are checked: success'(test: Test): void;
    'return values of tokens are checked: failure'(test: Test): void;
};
export = _default;
