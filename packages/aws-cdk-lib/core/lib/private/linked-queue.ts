/**
 * A queue that is faster than an array at large throughput
 */
export class LinkedQueue<A> {
  private head?: Node<A>;
  private last?: Node<A>;

  constructor(items?: Iterable<A>) {
    if (items) {
      for (const x of items) {
        this.push(x);
      }
    }
  }

  public push(value: A) {
    const node: Node<A> = { value };
    if (this.head && this.last) {
      this.last.next = node;
      this.last = node;
    } else {
      this.head = node;
      this.last = node;
    }
  }

  public shift(): A | undefined {
    if (!this.head) {
      return undefined;
    }
    const ret = this.head.value;

    this.head = this.head.next;
    if (!this.head) {
      this.last = undefined;
    }

    return ret;
  }
}

interface Node<A> {
  value: A;
  next?: Node<A>;
}
