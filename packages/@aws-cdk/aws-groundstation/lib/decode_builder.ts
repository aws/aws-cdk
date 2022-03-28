interface Edge {
  from: string
  to: string
}

export enum NodeType {
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

export class DecodeConfig {
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

export enum DemodType {
  QPSK = 'QPSK',
  OQPSK = 'OQPSK',
  BPSK = 'BPSK',
  SQPSK = 'SQPSK',
  UAQPSK = 'UAQPSK',
  PSK_8 = '8PSK',
  APSK_16_32 = '16/32 APSK',
  MSK = 'MSK',
  QAM_16 = '16QAM',
  GMSK = 'GMSK'
}

export interface QPSK {
  carrierFrequencyRecovery: CarrierFrequencyRecovery;
  symbolTimingRecovery: SymbolTimingRecovery;
}

export interface OQPSK {
  carrierFrequencyRecovery: CarrierFrequencyRecovery;
  symbolTimingRecovery: SymbolTimingRecovery;
}

export interface SymbolTimingRecovery {
  symbolRate: CenterFrequency;
  range: CenterFrequency;
  matchedFilter: MatchedFilter;
}

export interface MatchedFilter {
  type: string;
  rolloffFactor: number;
}

export interface CarrierFrequencyRecovery {
  centerFrequency: CenterFrequency;
  range: CenterFrequency;
}

export interface CenterFrequency {
  value: number;
  units: string;
}

export class DemodConfig {
  private config: {[key: string]: object};

  constructor(config: {[key: string]: object}) {
    this.config = { ...config };
  }

  toJSON() {
    return JSON.stringify(this.config);
  }
}