import { IPrincipal } from '../principals';
export declare function partitionPrincipals(xs: IPrincipal[]): PartitionResult;
export interface PartitionResult {
    readonly nonComparable: IPrincipal[];
    readonly comparable: Record<string, IPrincipal>;
}
