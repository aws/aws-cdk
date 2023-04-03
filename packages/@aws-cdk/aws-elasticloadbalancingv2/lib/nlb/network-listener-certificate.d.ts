import { Construct } from 'constructs';
import { INetworkListener } from './network-listener';
import { IListenerCertificate } from '../shared/listener-certificate';
/**
 * Properties for adding a set of certificates to a listener
 */
export interface NetworkListenerCertificateProps {
    /**
     * The listener to attach the rule to
     */
    readonly listener: INetworkListener;
    /**
     * Certificates to attach
     *
     * Duplicates are not allowed.
     */
    readonly certificates: IListenerCertificate[];
}
/**
 * Add certificates to a listener
 */
export declare class NetworkListenerCertificate extends Construct {
    constructor(scope: Construct, id: string, props: NetworkListenerCertificateProps);
}
