export declare class SparseMatrix<A> {
    private readonly matrix;
    get(row: number, col: number): A | undefined;
    row(row: number): Array<[number, A]>;
    set(row: number, col: number, value: A): void;
}
