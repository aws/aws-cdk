interface Edge {
  from: string
  to: string
}

enum NodeType {
  CODED_SYMBOLS_INGRESS = 'CODED_SYMBOLS_INGRESS',
  IQ_RECOMBINER = 'IQ_RECOMBINER',
  CCSDS_171_133_VITERBI_DECODER = 'CCSDS_171_133_VITERBI_DECODER',
  NRZ_M_DECODER = 'NRZ_M_DECODER',
  UNCODED_FRAMES_EGRESS = 'UNCODED_FRAMES_EGRESS'
}

interface Node {
  type: NodeType
  [key: string]: any
}

class DecodeConfig {
  private edges: Edge[]
  private nodes: {[key: string]: Node}

  constructor(edges: Edge[], nodes: {[key: string]: Node}) {
    this.nodes = nodes;

    this.edges = [];
    edges.forEach(({ from, to }) => {
      if (this.nodes.hasOwnProperty(from) && this.nodes.hasOwnProperty(to)) {
        this.edges.push({ from, to });
      } else {
        throw Error(`${from} or ${to} not found in nodes`);
      }
    });
  }

  toJSON() {
    JSON.stringify({ edges: this.edges, nodeConfigs: this.nodes });
  }

  addNode(name: string, node: Node) {
    this.nodes[name] = node;
  }

  addEdge(from: string, to: string) {
    if (this.nodes.hasOwnProperty(from) && this.nodes.hasOwnProperty(to)) {
      this.edges.push({ from, to });
    } else {
      throw Error(`${from} or ${to} not found in nodes`);
    }
  }
}