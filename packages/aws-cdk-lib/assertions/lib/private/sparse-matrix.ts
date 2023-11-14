export class SparseMatrix<A> {
  private readonly matrix = new Map<number, Map<number, A>>();

  public get(row: number, col: number): A | undefined {
    return this.matrix.get(row)?.get(col);
  }

  public row(row: number): Array<[number, A]> {
    return Array.from(this.matrix.get(row)?.entries() ?? []);
  }

  public set(row: number, col: number, value: A): void {
    let r = this.matrix.get(row);
    if (!r) {
      r = new Map();
      this.matrix.set(row, r);
    }
    r.set(col, value);
  }
}