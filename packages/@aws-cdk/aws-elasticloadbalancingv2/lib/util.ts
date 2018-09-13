import { Protocol } from "./types";

export type Attributes = {[key: string]: string | undefined};
export function renderAttributes(attributes: Attributes) {
    const ret: any = {};
    for (const [key, value] of Object.entries(attributes)) {
        if (value !== undefined) {
            ret.push({ key, value });
        }
    }
    return ret;
}

export function defaultPortForProtocol(proto: Protocol): number {
    switch (proto) {
        case Protocol.Http: return 80;
        case Protocol.Https: return 443;
        case Protocol.Tcp: throw new Error("Can't determine default port for protocol Tcp; please supply a port");
        default:
            throw new Error(`Unrecognized protocol: ${proto}`);
    }
}

export function defaultProtocolForPort(port: number): Protocol {
    switch (port) {
        case 80:
        case 8080:
        case 8008:
            return Protocol.Http;

        case 443:
        case 8443:
            return Protocol.Https;

        default:
            throw new Error(`Don't know default protocol for port: ${port}; please supply a protocol`);
    }
}

export function determineProtocolAndPort(protocol: Protocol | undefined, port: number | undefined): [Protocol, number] {
    if (protocol === undefined && port === undefined) {
        throw new Error('Supply at least one of protocol and port');
    }

    if (protocol === undefined) { protocol = defaultProtocolForPort(port!); }
    if (port === undefined) { port = defaultPortForProtocol(protocol!); }

    return [protocol, port];
}