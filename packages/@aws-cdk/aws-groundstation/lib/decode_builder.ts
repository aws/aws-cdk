/**
 * Edge of decode graph
 */
export interface Edge {
  /**
   * Node from which the edge starts
   */
  readonly from: string

  /**
   * Node to which the edge ends
   */
  readonly to: string
}

/**
 * Different types of operators that can be applied to the decoding of the signal.
 *
 * Better explanations for the following are welcomed!
 */
export enum NodeType {
  /**
   * CODED_SYMBOLS_INGRESS
   */
  CODED_SYMBOLS_INGRESS = 'CODED_SYMBOLS_INGRESS',

  /**
   * IQ_RECOMBINER
   */
  IQ_RECOMBINER = 'IQ_RECOMBINER',

  /**
   * CCSDS_171_133_VITERBI_DECODER
   */
  CCSDS_171_133_VITERBI_DECODER = 'CCSDS_171_133_VITERBI_DECODER',

  /**
   * NRZ_M_DECODER
   */
  NRZ_M_DECODER = 'NRZ_M_DECODER',

  /**
   * UNCODED_FRAMES_EGRESS
   */
  UNCODED_FRAMES_EGRESS = 'UNCODED_FRAMES_EGRESS'
}


/**
 * Node for building decode config.
 */
export interface Node {
  /**
   * The type of decode node.
   */
  readonly type: NodeType
  /**
   * Miscellaneous properties relating to the node.
   */
  readonly [key: string]: any
}

/**
 * Helper class to build a decode object
 */
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

  /**
   * toString returns the decode config as a JSON string.
   */
  toString() {
    JSON.stringify({ edges: this.edges, nodeConfigs: this.nodes });
  }

  /**
   * addNode will add a node to the decode config.
   *
   * @param name the name of the node
   * @param node the node object
   */
  addNode(name: string, node: Node) {
    this.nodes[name] = node;
  }

  /**
   * addEdge will add an edge to the decode config.
   *
   * @param from the name of the node from which the edge starts
   * @param to the name of the node from which the edge ends
   */
  addEdge(from: string, to: string) {
    if (this.nodes.hasOwnProperty(from) && this.nodes.hasOwnProperty(to)) {
      this.edges.push({ from, to });
    } else {
      throw Error(`${from} or ${to} not found in nodes`);
    }
  }
}

/**
 * Demodulation types currently supported
 */
export enum DemodType {
  /**
   * Quadrature Phase Shift Keying
   */
  QPSK = 'QPSK',

  /**
   * Offset Quadrature Phase Shift Keying
   */
  OQPSK = 'OQPSK',

  /**
   * Binary Phase Shift Keying
   */
  BPSK = 'BPSK',

  /**
   * Staggered Quadrature Phase Shift Keying
   */
  SQPSK = 'SQPSK',

  /**
   * Unbalanced Quadrature Phase Shift Keying
   */
  UAQPSK = 'UAQPSK',

  /**
   * 8 Phase Shift Keying
   */
  PSK_8 = '8PSK',

  /**
   * 16 and 32 Amplitude and Phase Shift Keying
   */
  APSK_16_32 = '16/32 APSK',

  /**
   * Minimum-Shift Keying
   */
  MSK = 'MSK',

  /**
   * 16 Quadrature Amplitude Modulation
   */
  QAM_16 = '16QAM',

  /**
   * Gaussian Minimum Shift Keying
   */
  GMSK = 'GMSK'
}

/**
 * Demodulation configuration for QPSK
 */
export interface Qpsk {
  /**
   * Carrier Frequency Recovery
   */
  readonly carrierFrequencyRecovery: CarrierFrequencyRecovery;

  /**
   * Symbol Timing Recovery
   */
  readonly symbolTimingRecovery: SymbolTimingRecovery;
}

/**
 * Demodulation configuration for OQPSK
 */
export interface Oqpsk {
  /**
   * Carrier Frequency Recovery
   */
  readonly carrierFrequencyRecovery: CarrierFrequencyRecovery;

  /**
   * Symbol Timing Recovery
   */
  readonly symbolTimingRecovery: SymbolTimingRecovery;
}

/**
 * Symbol configuration for timing recovery
 */
export interface SymbolTimingRecovery {
  /**
   * Symbol Rate
   */
  readonly symbolRate: CenterFrequency;

  /**
   * Range
   */
  readonly range: CenterFrequency;

  /**
   * Matched Filter
   */
  readonly matchedFilter: MatchedFilter;
}

/**
 * Filter configuration
 */
export interface MatchedFilter {

  /**
   * Type
   */
  readonly type: string;

  /**
   * Rolloff Factor
   */
  readonly rolloffFactor: number;
}

/**
 * Carrier frequency configuration
 */
export interface CarrierFrequencyRecovery {
  /**
   * Center Frequency
   */
  readonly centerFrequency: CenterFrequency;

  /**
   * Range
   */
  readonly range: CenterFrequency;
}

/**
 * Center Frequency of a signal
 */
export interface CenterFrequency {
  /**
   * Value
   */
  readonly value: number;

  /**
   * Units
   */
  readonly units: string;
}

/**
 * Demodulation configuration builder for signal.
 */
export class DemodConfig {
  private config: {[key: string]: object};

  constructor(config: {[key: string]: object}) {
    this.config = { ...config };
  }

  /**
   * toString returns the demodulation config as a JSON string.
   *
   * @returns the demodulation configuration
   */
  toString() {
    return JSON.stringify(this.config);
  }
}