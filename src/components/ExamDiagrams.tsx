import React from 'react';

export const RaftQuorumDiagram: React.FC = () => {
  return (
    <div className="my-5 p-5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-[0.05em] text-[#475569]">
          Figure 1.2 — 5-Node Raft Cluster Partition Topology (Term 4)
        </span>
        <span className="text-xs font-mono text-[#475569] tabular-nums">Index #18 Replicated: A, B, C</span>
      </div>

      <svg
        viewBox="0 0 640 200"
        className="w-full h-auto max-h-[210px]"
        role="img"
        aria-label="5-node Raft cluster partitioned into nodes A, B on the left and nodes C, D, E on the right, with log index 18 replicated on A, B, and C"
      >
        {/* Partition 1 Box */}
        <rect
          x="16"
          y="16"
          width="244"
          height="168"
          rx="8"
          fill="#FFFFFF"
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />
        <text x="32" y="38" fill="#475569" fontSize="11" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">
          PARTITION ALPHA (MINORITY: 2 NODES)
        </text>

        {/* Partition 2 Box */}
        <rect
          x="300"
          y="16"
          width="324"
          height="168"
          rx="8"
          fill="#FFFFFF"
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />
        <text x="316" y="38" fill="#475569" fontSize="11" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">
          PARTITION BETA (MAJORITY: 3 NODES)
        </text>

        {/* Network Partition Cut */}
        <line
          x1="280"
          y1="10"
          x2="280"
          y2="190"
          stroke="#DC2626"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        <rect x="242" y="88" width="76" height="22" rx="4" fill="#FEF2F2" stroke="#FECACA" strokeWidth="1" />
        <text
          x="280"
          y="103"
          textAnchor="middle"
          fill="#B91C1C"
          fontSize="10"
          fontWeight="700"
          fontFamily="JetBrains Mono, monospace"
        >
          PARTITION
        </text>

        {/* Connection lines */}
        <line x1="88" y1="104" x2="188" y2="104" stroke="#2563EB" strokeWidth="2" />
        <line x1="366" y1="104" x2="462" y2="104" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="462" y1="104" x2="558" y2="104" stroke="#94A3B8" strokeWidth="1.5" />

        {/* Node A (Leader) */}
        <g transform="translate(88, 104)">
          <circle r="28" fill="#142B4D" stroke="#2563EB" strokeWidth="2.5" />
          <text y="-3" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="700">
            Node A
          </text>
          <text y="13" textAnchor="middle" fill="#4CD7F6" fontSize="10" fontFamily="JetBrains Mono, monospace">
            Leader
          </text>
          <text y="45" textAnchor="middle" fill="#047857" fontSize="11" fontWeight="600" fontFamily="JetBrains Mono, monospace">
            log[#18] ✓
          </text>
        </g>

        {/* Node B */}
        <g transform="translate(188, 104)">
          <circle r="26" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2" />
          <text y="-2" textAnchor="middle" fill="#142B4D" fontSize="13" fontWeight="700">
            Node B
          </text>
          <text y="13" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="JetBrains Mono, monospace">
            Follower
          </text>
          <text y="45" textAnchor="middle" fill="#047857" fontSize="11" fontWeight="600" fontFamily="JetBrains Mono, monospace">
            log[#18] ✓
          </text>
        </g>

        {/* Node C */}
        <g transform="translate(366, 104)">
          <circle r="26" fill="#ECFDF5" stroke="#059669" strokeWidth="2" />
          <text y="-2" textAnchor="middle" fill="#142B4D" fontSize="13" fontWeight="700">
            Node C
          </text>
          <text y="13" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="JetBrains Mono, monospace">
            Follower
          </text>
          <text y="45" textAnchor="middle" fill="#047857" fontSize="11" fontWeight="600" fontFamily="JetBrains Mono, monospace">
            log[#18] ✓
          </text>
        </g>

        {/* Node D */}
        <g transform="translate(462, 104)">
          <circle r="26" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
          <text y="-2" textAnchor="middle" fill="#142B4D" fontSize="13" fontWeight="700">
            Node D
          </text>
          <text y="13" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="JetBrains Mono, monospace">
            Follower
          </text>
          <text y="45" textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="JetBrains Mono, monospace">
            log[#17]
          </text>
        </g>

        {/* Node E */}
        <g transform="translate(558, 104)">
          <circle r="26" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
          <text y="-2" textAnchor="middle" fill="#142B4D" fontSize="13" fontWeight="700">
            Node E
          </text>
          <text y="13" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="JetBrains Mono, monospace">
            Follower
          </text>
          <text y="45" textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="JetBrains Mono, monospace">
            log[#17]
          </text>
        </g>
      </svg>
    </div>
  );
};
