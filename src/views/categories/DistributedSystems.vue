<script setup>
import ConceptCard from '@/components/ConceptCard.vue'
</script>

<template>
  <section class="category" id="cat-distributed">
    <h2>Distributed Systems</h2>

    <ConceptCard
      id="cap"
      title="CAP Theorem"
      badge-type="distributed"
      badge-label="Distributed"
    >
      <div class="one-liner">Pick two of three: Consistency, Availability, Partition tolerance — you can't have all three.</div>
      <div class="section-label">The Three Properties</div>
      <div class="problem-box" style="border-left-color: var(--pink)">
        <strong>C — Consistency</strong>: Every read receives the most recent write.<br>
        <strong>A — Availability</strong>: Every request receives a response (not an error).<br>
        <strong>P — Partition Tolerance</strong>: System continues despite network splits between nodes.
      </div>
      <div class="section-label">Trade-offs</div>
      <div class="good-box">
        <pre><span class="cmt">// CP (Consistency + Partition tolerance): refuse requests during partitions</span>
<span class="cmt">// → MongoDB (default), HBase, Zookeeper</span>
<span class="cmt">// Use when: financial transactions, inventory counts</span>

<span class="cmt">// AP (Availability + Partition tolerance): serve stale data during partitions</span>
<span class="cmt">// → Cassandra, DynamoDB, CouchDB</span>
<span class="cmt">// Use when: social media feeds, shopping carts</span>

<span class="cmt">// CA (Consistency + Availability): impossible in distributed systems</span>
<span class="cmt">// → Only single-node databases (traditional RDBMS)</span></pre>
      </div>
    </ConceptCard>

    <ConceptCard
      id="acid"
      title="ACID"
      badge-type="distributed"
      badge-label="Database"
    >
      <div class="one-liner">Atomicity, Consistency, Isolation, Durability — guarantees for reliable DB transactions.</div>
      <div class="section-label">Properties</div>
      <div class="good-box">
        <pre><span class="cmt">// A — Atomicity: all or nothing</span>
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT; <span class="cmt">// Both succeed or both fail</span>

<span class="cmt">// C — Consistency: DB moves from one valid state to another</span>
<span class="cmt">// Constraints, triggers, foreign keys enforced</span>

<span class="cmt">// I — Isolation: concurrent transactions don't interfere</span>
<span class="cmt">// Levels: READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE</span>

<span class="cmt">// D — Durability: committed data survives crashes (WAL, fsync)</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>PostgreSQL, MySQL InnoDB, Oracle</strong> — any system where correctness beats throughput: banking, booking systems, medical records.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// localStorage is NOT atomic — can leave partial state</span>
localStorage.setItem(<span class="str">'balance'</span>, newBalance);
<span class="cmt">// ← crash here = inconsistent state</span>
localStorage.setItem(<span class="str">'lastTx'</span>, txId);

<span class="cmt">// IndexedDB transactions ARE atomic</span>
<span class="kw">const</span> tx = db.transaction([<span class="str">'wallet'</span>], <span class="str">'readwrite'</span>);
tx.objectStore(<span class="str">'wallet'</span>).put({ id: 1, balance: newBalance });
tx.objectStore(<span class="str">'wallet'</span>).put({ id: 1, lastTx: txId });
<span class="cmt">// Both succeed or both fail — ACID</span>

<span class="cmt">// Pinia $patch — atomic state update</span>
store.$patch({
  balance: <span class="str">'100.00'</span>,
  pendingTx: <span class="kw">null</span>,
  lastUpdated: Date.now(),
}); <span class="cmt">// One reactive flush — components see consistent state</span></pre>
      </div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Offline-first PWA — AP choice (Availability + Partition tolerance)</span>
<span class="cmt">// Service worker cache-first strategy</span>
self.addEventListener(<span class="str">'fetch'</span>, (e) =&gt; {
  e.respondWith(
    caches.match(e.request)          <span class="cmt">// Try cache first (Available)</span>
      .then(r =&gt; r || fetch(e.request)) <span class="cmt">// Fallback to network</span>
  );
});

<span class="cmt">// stale-while-revalidate — show stale, update in background</span>
<span class="cmt">// TanStack Query does this with staleTime config</span>
useQuery({
  queryKey: [<span class="str">'prices'</span>],
  queryFn: fetchPrices,
  staleTime: 60_000, <span class="cmt">// Serve stale for 60s (available but maybe stale)</span>
});
<span class="cmt">// Trade-off: user sees slightly outdated prices (consistency)</span>
<span class="cmt">// but app always responds instantly (availability)</span></pre>
      </div>
    </ConceptCard>

    <ConceptCard
      id="base"
      title="BASE"
      badge-type="distributed"
      badge-label="Database"
    >
      <div class="one-liner">Basically Available, Soft state, Eventually consistent — relaxed ACID for distributed systems.</div>
      <div class="section-label">Comparison</div>
      <div class="good-box">
        <pre><span class="cmt">// ACID: "I need the absolute truth right now"</span>
<span class="cmt">// BASE: "I'll take a close-enough answer and it'll converge"</span>

<span class="cmt">// BA — Basically Available: system always responds (may be stale)</span>
<span class="cmt">// S  — Soft state: state may change without input (background sync)</span>
<span class="cmt">// E  — Eventually consistent: given time, all nodes converge</span>

<span class="cmt">// Example: Shopping cart</span>
<span class="cmt">// User adds item → local replica updated immediately → shown to user</span>
<span class="cmt">// Background: replicate to other nodes (eventually consistent)</span>
<span class="cmt">// If network partition: user still sees their cart (available, maybe stale)</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>DynamoDB, Cassandra, Riak</strong> — content delivery, social feeds, session stores. Amazon's shopping cart is famously BASE.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Optimistic UI updates — Basically Available</span>
<span class="kw">const</span> { mutate } = useMutation({
  mutationFn: walletApi.transfer,
  onMutate: (vars) =&gt; {
    <span class="cmt">// Save previous value for rollback</span>
    <span class="kw">const</span> prev = queryClient.getQueryData([<span class="str">'balance'</span>]);
    <span class="cmt">// Immediately update UI (soft state)</span>
    queryClient.setQueryData([<span class="str">'balance'</span>],
      Big(prev <span class="kw">as string</span>).minus(vars.amount).toString()
    );
    <span class="kw">return</span> { prev }; <span class="cmt">// Context for rollback</span>
  },
  onError: (_, __, context) =&gt; {
    <span class="cmt">// Rollback on failure (eventually consistent)</span>
    queryClient.setQueryData([<span class="str">'balance'</span>], context?.prev);
  },
});

<span class="cmt">// stale-while-revalidate — cache-first, update in background</span>
<span class="cmt">// User sees stale data instantly → fresh data arrives later</span>
<span class="cmt">// Soft state: UI is "good enough" until confirmed</span></pre>
      </div>
    </ConceptCard>

    <ConceptCard
      id="consistency"
      title="Consistency Models"
      badge-type="distributed"
      badge-label="Distributed"
    >
      <div class="one-liner">Spectrum from linearizable (strongest) to eventual (weakest) — defines what readers see after writes.</div>
      <div class="section-label">Hierarchy (strongest → weakest)</div>
      <div class="good-box">
        <pre><span class="cmt">// 1. Linearizable (strongest)</span>
<span class="cmt">//    Every op appears to happen atomically at one point in time</span>
<span class="cmt">//    → Spanner, CockroachDB (GPS + atomic clocks)</span>

<span class="cmt">// 2. Sequential Consistency</span>
<span class="cmt">//    All nodes see same order, but not necessarily real-time</span>
<span class="cmt">//    → Zookeeper</span>

<span class="cmt">// 3. Causal Consistency</span>
<span class="cmt">//    Causally related ops seen in order; concurrent ops may differ</span>
<span class="cmt">//    → MongoDB (causal sessions)</span>

<span class="cmt">// 4. Read-your-writes</span>
<span class="cmt">//    You always see your own writes (others may lag)</span>

<span class="cmt">// 5. Eventual Consistency (weakest)</span>
<span class="cmt">//    Given enough time, all replicas converge</span>
<span class="cmt">//    → DynamoDB, DNS, CDN caches</span></pre>
      </div>
    </ConceptCard>

    <ConceptCard
      id="consensus"
      title="Consensus"
      badge-type="distributed"
      badge-label="Distributed"
    >
      <div class="one-liner">Agreement among distributed nodes on a single value despite failures — the core of distributed systems.</div>
      <div class="section-label">Problem</div>
      <div class="problem-box">3 nodes need to agree on "who is the leader" or "what is the committed value". Nodes can crash, messages can be delayed or lost.</div>
      <div class="section-label">Key Algorithms</div>
      <div class="good-box">
        <pre><span class="cmt">// Paxos — theoretical foundation (Leslie Lamport)</span>
<span class="cmt">// Raft — understandable alternative to Paxos (etcd, Consul)</span>
<span class="cmt">// PBFT — Byzantine fault tolerant (blockchain)</span>

<span class="cmt">// Raft simplified:</span>
<span class="cmt">// 1. Leader election: nodes vote, majority wins</span>
<span class="cmt">// 2. Log replication: leader appends entries, replicates to followers</span>
<span class="cmt">// 3. Commit: once majority acknowledges, entry is committed</span>
<span class="cmt">// 4. Leader dies? New election. Committed data safe.</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>etcd</strong> (Kubernetes state), <strong>Consul</strong> (service discovery), <strong>Zookeeper</strong> (Kafka coordination), <strong>CockroachDB</strong> (distributed SQL).</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// BroadcastChannel leader election for cross-tab coordination</span>
<span class="kw">const</span> channel = <span class="kw">new</span> BroadcastChannel(<span class="str">'leader-election'</span>);
<span class="kw">const</span> myId = crypto.randomUUID();
<span class="kw">const</span> myTs = Date.now();
<span class="kw">let</span> isLeader = <span class="kw">true</span>;

channel.postMessage({ type: <span class="str">'CLAIM'</span>, id: myId, ts: myTs });
channel.onmessage = (e) =&gt; {
  <span class="kw">if</span> (e.data.type === <span class="str">'CLAIM'</span> &amp;&amp; e.data.ts &lt; myTs) isLeader = <span class="kw">false</span>;
};
<span class="cmt">// Oldest tab becomes leader (consensus)</span>

<span class="cmt">// Shared state across tabs via localStorage events</span>
window.addEventListener(<span class="str">'storage'</span>, (e) =&gt; {
  <span class="kw">if</span> (e.key === <span class="str">'wallet-state'</span>) {
    store.$patch(JSON.parse(e.newValue!)); <span class="cmt">// All tabs agree</span>
  }
});</pre>
      </div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// TanStack Query consistency controls</span>
useQuery({
  queryKey: [<span class="str">'balance'</span>],
  queryFn: walletApi.getBalance,
  staleTime: 0,          <span class="cmt">// Strong: always refetch</span>
  gcTime: 5 * 60_000,    <span class="cmt">// Keep in cache 5 min</span>
});

useQuery({
  queryKey: [<span class="str">'prices'</span>],
  queryFn: fetchPrices,
  staleTime: 60_000,     <span class="cmt">// Eventual: serve stale for 1 min</span>
});

<span class="cmt">// Optimistic update = eventual consistency</span>
<span class="cmt">// UI updates immediately, server confirms later</span>

<span class="cmt">// Pessimistic update = strong consistency</span>
<span class="cmt">// Wait for server response before updating UI</span>
<span class="kw">const</span> { mutateAsync } = useMutation({ mutationFn: walletApi.send });
<span class="kw">await</span> mutateAsync(data); <span class="cmt">// Wait for server</span>
<span class="kw">await</span> queryClient.invalidateQueries([<span class="str">'balance'</span>]); <span class="cmt">// Refetch fresh</span></pre>
      </div>
    </ConceptCard>

    <ConceptCard
      id="paxos"
      title="Paxos"
      badge-type="distributed"
      badge-label="Distributed"
    >
      <div class="one-liner">Consensus protocol: proposers, acceptors, learners reach agreement in async networks with failures.</div>
      <div class="section-label">Phases</div>
      <div class="good-box">
        <pre><span class="cmt">// Phase 1: Prepare</span>
<span class="cmt">// Proposer sends Prepare(n) to majority of acceptors</span>
<span class="cmt">// Acceptors: if n > any previously seen, promise not to accept lower</span>
<span class="cmt">//            return any previously accepted value</span>

<span class="cmt">// Phase 2: Accept</span>
<span class="cmt">// If proposer gets majority promises:</span>
<span class="cmt">//   - If any acceptor returned a value, propose that value (preserves safety)</span>
<span class="cmt">//   - Otherwise, propose its own value</span>
<span class="cmt">// Send Accept(n, value) to acceptors</span>
<span class="cmt">// Acceptors: accept if no higher-numbered prepare seen</span>

<span class="cmt">// Result: Once majority accepts → value is chosen → learners notified</span></pre>
      </div>
      <div class="sw-grid">
        <div>
          <div class="section-label">Strengths</div>
          <ul class="strengths">
            <li>Proven correct (safety guaranteed)</li>
            <li>Tolerates minority failures</li>
          </ul>
        </div>
        <div>
          <div class="section-label">Weaknesses</div>
          <ul class="weaknesses">
            <li>Notoriously hard to understand &amp; implement</li>
            <li>Livelock possible with competing proposers</li>
            <li>Multi-Paxos needed for practical systems</li>
          </ul>
        </div>
      </div>
    </ConceptCard>

    <ConceptCard
      id="crdt"
      title="CRDT"
      badge-type="distributed"
      badge-label="Distributed"
    >
      <div class="one-liner">Conflict-free Replicated Data Types — merge without coordination, always converge.</div>
      <div class="section-label">How It Works</div>
      <div class="good-box">
        <pre><span class="cmt">// G-Counter (grow-only counter) — simplest CRDT</span>
<span class="cmt">// Each node maintains its own counter</span>
<span class="cmt">// Merge: take max of each node's counter</span>
Node A: {A: 3, B: 0}
Node B: {A: 1, B: 5}
Merge:  {A: 3, B: 5} → total = 8

<span class="cmt">// LWW-Register (Last-Writer-Wins): timestamp resolves conflicts</span>
<span class="cmt">// OR-Set (Observed-Remove Set): add/remove without conflicts</span>

<span class="cmt">// Key property: merge is commutative, associative, idempotent</span>
<span class="cmt">// merge(A, B) = merge(B, A)           — order doesn't matter</span>
<span class="cmt">// merge(A, merge(B, C)) = merge(merge(A, B), C)</span>
<span class="cmt">// merge(A, A) = A                     — safe to re-merge</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Figma</strong> (multiplayer design), <strong>Redis CRDT</strong> (geo-distributed), <strong>Riak</strong> (distributed KV store), <strong>Yjs/Automerge</strong> (collaborative text editing).</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Yjs for collaborative editing in Vue</span>
<span class="kw">import</span> * <span class="kw">as</span> Y <span class="kw">from</span> <span class="str">'yjs'</span>;
<span class="kw">import</span> { WebrtcProvider } <span class="kw">from</span> <span class="str">'y-webrtc'</span>;

<span class="kw">const</span> doc = <span class="kw">new</span> Y.Doc();
<span class="kw">const</span> provider = <span class="kw">new</span> WebrtcProvider(<span class="str">'room-name'</span>, doc);
<span class="kw">const</span> yText = doc.getText(<span class="str">'shared-text'</span>);

<span class="cmt">// Bind CRDT to Vue reactive state</span>
<span class="kw">const</span> text = ref(yText.toString());
yText.observe(() =&gt; { text.value = yText.toString(); });

<span class="cmt">// Multiple users edit simultaneously — no conflicts!</span>
<span class="cmt">// CRDT merges automatically, always converges</span>
<span class="cmt">// No central server needed for conflict resolution</span></pre>
      </div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Paxos isn't directly implemented in frontend code.</span>
<span class="cmt">// But understanding it helps when your app talks to backends</span>
<span class="cmt">// that use Paxos-based consensus (etcd, Zookeeper, CockroachDB).</span>

<span class="cmt">// Frontend implication: these backends guarantee consistency</span>
<span class="cmt">// but may have higher latency during leader election.</span>

<span class="cmt">// Handle it with retry + timeout in your API layer:</span>
<span class="kw">const</span> { data } = useQuery({
  queryKey: [<span class="str">'config'</span>],
  queryFn: () =&gt; api.get(<span class="str">'/config'</span>), <span class="cmt">// Backed by etcd (Paxos/Raft)</span>
  retry: 3,
  retryDelay: (attempt) =&gt; Math.min(1000 * 2 ** attempt, 10000),
});
<span class="cmt">// If leader election is happening, requests may timeout</span>
<span class="cmt">// Retry with exponential backoff handles this gracefully</span></pre>
      </div>
    </ConceptCard>

  </section>
</template>
