<script setup>
import ConceptCard from '@/components/ConceptCard.vue'
</script>

<template>
  <section class="category" id="cat-lowlevel">
    <h2>Low-Level &amp; Performance</h2>

    <ConceptCard
      id="cas"
      title="CAS & Atomics"
      badge-type="lowlevel"
      badge-label="Low-Level"
    >
      <div class="one-liner">Compare-and-swap: lock-free atomic update — if value == expected, swap it, else retry.</div>
      <div class="section-label">How It Works</div>
      <div class="good-box">
        <pre><span class="cmt">// CAS is a single CPU instruction (CMPXCHG on x86)</span>
<span class="cmt">// Pseudocode:</span>
<span class="kw">function</span> <span class="fn">compareAndSwap</span>(address, expected, newValue) {
  <span class="kw">if</span> (*address === expected) {  <span class="cmt">// atomic check</span>
    *address = newValue;        <span class="cmt">// atomic write</span>
    <span class="kw">return true</span>;
  }
  <span class="kw">return false</span>;
}

<span class="cmt">// Lock-free counter increment:</span>
<span class="kw">do</span> {
  old = counter.get();
} <span class="kw">while</span> (!counter.compareAndSet(old, old + 1));

<span class="cmt">// Java: AtomicInteger, AtomicReference</span>
<span class="cmt">// C++: std::atomic, Rust: std::sync::atomic</span>
<span class="cmt">// JS: Atomics.compareExchange (SharedArrayBuffer)</span></pre>
      </div>
      <div class="sw-grid">
        <div><div class="section-label">Strengths</div><ul class="strengths"><li>No locks → no deadlocks</li><li>Better performance under low contention</li></ul></div>
        <div><div class="section-label">Weaknesses</div><ul class="weaknesses"><li>ABA problem (value changed and changed back)</li><li>Spin-loop waste under high contention</li></ul></div>
      </div>
    </ConceptCard>

    <ConceptCard
      id="memory-model"
      title="Memory Model"
      badge-type="lowlevel"
      badge-label="Low-Level"
    >
      <div class="one-liner">Rules for how threads see each other's memory writes — defines visibility and ordering guarantees.</div>
      <div class="section-label">Problem</div>
      <div class="problem-box">CPUs and compilers reorder instructions for performance. Thread A writes <code>x=1; ready=true</code>, but Thread B might see <code>ready=true</code> before <code>x=1</code>!</div>
      <div class="section-label">Ordering Levels</div>
      <div class="good-box">
        <pre><span class="cmt">// Relaxed — no ordering guarantees (fastest)</span>
<span class="cmt">// Acquire/Release — synchronized pairs (publish/subscribe pattern)</span>
<span class="cmt">// Sequential Consistency — total order (slowest, safest)</span>

<span class="cmt">// Java: volatile = acquire + release semantics</span>
<span class="kw">volatile</span> boolean ready = <span class="kw">false</span>;
<span class="cmt">// Thread A: x = 42; ready = true;    // release</span>
<span class="cmt">// Thread B: if (ready) use(x);       // acquire — guaranteed to see x=42</span>

<span class="cmt">// Happens-before relationship:</span>
<span class="cmt">// volatile write → volatile read (same variable)</span>
<span class="cmt">// synchronized block exit → synchronized block entry (same monitor)</span>
<span class="cmt">// Thread.start() → first action in new thread</span></pre>
      </div>
    </ConceptCard>

    <ConceptCard
      id="cache-locality"
      title="Cache Locality"
      badge-type="lowlevel"
      badge-label="Performance"
    >
      <div class="one-liner">Access memory sequentially to exploit CPU cache lines — arrays beat linked lists for traversal.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
        <pre><span class="cmt">// Linked list: each node allocated randomly in heap</span>
<span class="cmt">// Following pointers = cache miss on every node</span>
<span class="cmt">// L1 cache: ~1ns, Main memory: ~100ns (100× slower!)</span>

<span class="cmt">// Matrix traversal — column-major on row-major layout</span>
<span class="kw">for</span> (col = 0; col &lt; N; col++)
  <span class="kw">for</span> (row = 0; row &lt; N; row++)
    matrix[row][col] += 1; <span class="cmt">// Jumps in memory — cache misses</span></pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="cmt">// Row-major traversal — sequential memory access</span>
<span class="kw">for</span> (row = 0; row &lt; N; row++)
  <span class="kw">for</span> (col = 0; col &lt; N; col++)
    matrix[row][col] += 1; <span class="cmt">// Sequential — cache line prefetched</span>

<span class="cmt">// Use arrays/vectors instead of linked lists when possible</span>
<span class="cmt">// "Struct of Arrays" (SoA) vs "Array of Structs" (AoS)</span>
<span class="cmt">// SoA: x[], y[], z[] — better when processing one field at a time</span>
<span class="cmt">// AoS: [{x,y,z}, ...] — better when processing all fields together</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Game engines (ECS architecture)</strong> — Entity Component System uses arrays of components for cache-friendly iteration. <strong>NumPy/BLAS</strong> matrix operations optimized for cache lines.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Flat arrays vs nested objects for v-for performance</span>
<span class="cmt">// BAD — nested objects, poor cache locality</span>
<span class="kw">const</span> assets = [{ meta: { price: { usd: <span class="str">'100'</span> } } }, ...];

<span class="cmt">// GOOD — flat structure, sequential memory access</span>
<span class="kw">const</span> prices = [<span class="str">'100'</span>, <span class="str">'200'</span>, <span class="str">'300'</span>]; <span class="cmt">// Flat array, cache-friendly</span>

<span class="cmt">// shallowRef — avoid deep proxy wrapping</span>
<span class="kw">const</span> bigList = shallowRef&lt;Item[]&gt;([]);
<span class="cmt">// Deep reactive: every property of every item gets a Proxy</span>
<span class="cmt">// shallowRef: only .value is reactive — much less overhead</span>

<span class="cmt">// TypedArrays for number-heavy computation</span>
<span class="kw">const</span> priceData = <span class="kw">new</span> Float64Array(10000);
<span class="cmt">// Contiguous memory, perfect cache locality for iteration</span></pre>
      </div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// SharedArrayBuffer + Atomics ordering guarantees</span>
<span class="kw">const</span> sab = <span class="kw">new</span> SharedArrayBuffer(8);
<span class="kw">const</span> view = <span class="kw">new</span> Int32Array(sab);

<span class="cmt">// Worker A: write data then signal</span>
view[0] = 42;                     <span class="cmt">// Data</span>
Atomics.store(view, 1, 1);        <span class="cmt">// Signal (release semantics)</span>

<span class="cmt">// Worker B: wait for signal, then read data</span>
Atomics.wait(view, 1, 0);         <span class="cmt">// Block until signaled (acquire)</span>
console.log(view[0]);              <span class="cmt">// Guaranteed to see 42</span>

<span class="cmt">// postMessage uses structured clone — full copy, no sharing</span>
worker.postMessage(data); <span class="cmt">// Deep clone, no memory model concerns</span>

<span class="cmt">// Without Atomics: no ordering guarantee between workers</span>
<span class="cmt">// JS main thread: single-threaded, no memory model issues</span></pre>
      </div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Atomics with SharedArrayBuffer in Web Workers</span>
<span class="kw">const</span> sab = <span class="kw">new</span> SharedArrayBuffer(4);
<span class="kw">const</span> view = <span class="kw">new</span> Int32Array(sab);

<span class="cmt">// CAS: if view[0] === 0, set to 1 (atomic)</span>
<span class="kw">const</span> old = Atomics.compareExchange(view, 0, 0, 1);
<span class="kw">if</span> (old === 0) { <span class="cmt">/* we won the lock */</span> }

<span class="cmt">// Optimistic concurrency with version check on API</span>
<span class="kw">const</span> update = <span class="kw">async</span> (data: Profile) =&gt; {
  <span class="kw">const</span> res = <span class="kw">await</span> api.put(<span class="str">'/profile'</span>, {
    ...data,
    version: data.version, <span class="cmt">// Server checks: if version matches, update</span>
  });
  <span class="kw">if</span> (res.status === 409) {
    <span class="cmt">// Version mismatch — someone else edited. Refetch & retry</span>
    <span class="kw">const</span> fresh = <span class="kw">await</span> api.get(<span class="str">'/profile'</span>);
    <span class="cmt">// Show merge UI or auto-retry</span>
  }
};</pre>
      </div>
    </ConceptCard>

    <ConceptCard
      id="gc"
      title="Garbage Collection"
      badge-type="lowlevel"
      badge-label="Low-Level"
    >
      <div class="one-liner">Automatic memory reclamation — trades manual control for safety, with pause-time trade-offs.</div>
      <div class="section-label">Strategies</div>
      <div class="good-box">
        <pre><span class="cmt">// 1. Reference Counting (Python, Swift, Obj-C)</span>
<span class="cmt">//    Each object tracks # of references. Freed when count = 0.</span>
<span class="cmt">//    ✓ Deterministic, incremental    ✗ Circular references leak</span>

<span class="cmt">// 2. Mark-and-Sweep (JS V8, Java, Go)</span>
<span class="cmt">//    Phase 1: Mark all reachable objects from roots</span>
<span class="cmt">//    Phase 2: Sweep (free) unmarked objects</span>
<span class="cmt">//    ✓ Handles cycles    ✗ Stop-the-world pauses</span>

<span class="cmt">// 3. Generational GC (V8, JVM HotSpot)</span>
<span class="cmt">//    Young gen: small, collected often (most objects die young)</span>
<span class="cmt">//    Old gen: large, collected rarely</span>
<span class="cmt">//    ✓ Optimized for common patterns    ✗ Promotion overhead</span>

<span class="cmt">// 4. No GC — manual (C) or ownership (Rust)</span>
<span class="cmt">//    Rust: compiler tracks lifetimes, frees at scope exit</span>
<span class="cmt">//    ✓ Zero overhead    ✗ Learning curve, borrow checker fights</span></pre>
      </div>
    </ConceptCard>

    <ConceptCard
      id="thread-safety"
      title="Thread Safety"
      badge-type="lowlevel"
      badge-label="Concurrency"
    >
      <div class="one-liner">Code that works correctly under concurrent access — via locks, immutability, or confinement.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
        <pre><span class="cmt">// Race condition — two threads incrementing shared counter</span>
<span class="kw">let</span> count = 0;
<span class="cmt">// Thread A: temp = count (0); temp++; count = temp (1)</span>
<span class="cmt">// Thread B: temp = count (0); temp++; count = temp (1)</span>
<span class="cmt">// Expected: 2, Got: 1</span></pre>
      </div>
      <div class="section-label">Solutions</div>
      <div class="good-box">
        <pre><span class="cmt">// 1. Mutual Exclusion (locks/mutexes)</span>
mutex.lock();
count++;
mutex.unlock();

<span class="cmt">// 2. Atomic operations</span>
atomicCount.incrementAndGet();

<span class="cmt">// 3. Immutability — no writes = no races</span>
<span class="kw">const</span> config = Object.freeze({ port: 3000 });

<span class="cmt">// 4. Thread confinement — each thread owns its data</span>
ThreadLocal&lt;Connection&gt; conn = ThreadLocal.withInitial(pool::getConn);

<span class="cmt">// 5. Message passing — share by communicating (Go channels, actors)</span>
ch &lt;- value <span class="cmt">// send</span>
v := &lt;-ch   <span class="cmt">// receive</span></pre>
      </div>
    </ConceptCard>

  </section>
</template>
