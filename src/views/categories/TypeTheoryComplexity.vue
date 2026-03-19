<script setup>
import ConceptCard from '@/components/ConceptCard.vue'
</script>

<template>
  <section class="category" id="cat-theory">
    <h2>Type Theory &amp; Complexity</h2>

    <ConceptCard
      id="type-systems"
      title="Type Systems"
      badge-type="theory"
      badge-label="Theory"
    >
      <div class="one-liner">Classify values to prevent illegal operations at compile time — more types, fewer bugs.</div>
      <div class="section-label">Spectrum</div>
      <div class="problem-box" style="border-left-color: var(--cyan)">
        <strong>Untyped</strong> → Assembly (anything goes)<br>
        <strong>Dynamic</strong> → JS, Python (checked at runtime)<br>
        <strong>Static</strong> → Java, Go (checked at compile time)<br>
        <strong>Strong Static</strong> → Haskell, Rust (rich types, no implicit coercion)<br>
        <strong>Dependent</strong> → Idris, Agda (types can depend on values)
      </div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
        <pre><span class="cmt">// Dynamic — errors only found at runtime</span>
<span class="kw">function</span> add(a, b) { <span class="kw">return</span> a + b; }
add(<span class="str">"5"</span>, 3); <span class="cmt">// "53" — silent bug!</span></pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="kw">function</span> add(a: <span class="kw">number</span>, b: <span class="kw">number</span>): <span class="kw">number</span> { <span class="kw">return</span> a + b; }
add(<span class="str">"5"</span>, 3); <span class="cmt">// TS Error: Argument of type 'string' not assignable</span>

<span class="cmt">// Even better — branded types for domain safety:</span>
<span class="kw">type</span> USD = number &amp; { __brand: <span class="str">"USD"</span> };
<span class="kw">type</span> EUR = number &amp; { __brand: <span class="str">"EUR"</span> };
<span class="kw">function</span> addUSD(a: USD, b: USD): USD;
<span class="cmt">// addUSD(usd(10), eur(5)); // Type error! Can't mix currencies</span></pre>
      </div>
    </ConceptCard>

    <ConceptCard
      id="adt"
      title="Algebraic Data Types (ADT)"
      badge-type="theory"
      badge-label="Theory"
    >
      <div class="one-liner">Combine types via sum (OR) and product (AND) for precise domain modeling.</div>
      <div class="section-label">Concepts</div>
      <div class="problem-box" style="border-left-color: var(--purple)">
        <strong>Product type</strong> = A AND B (tuples, records): <code>{ name: string, age: number }</code><br>
        <strong>Sum type</strong> = A OR B (tagged unions): <code>"loading" | "success" | "error"</code>
      </div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
        <pre><span class="cmt">// Impossible states are representable</span>
<span class="kw">type</span> ApiState = {
  loading: boolean;
  data: Data | null;
  error: Error | null;
}
<span class="cmt">// Can have loading=true AND data AND error simultaneously — makes no sense</span></pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="cmt">// Sum type — impossible states are unrepresentable</span>
<span class="kw">type</span> ApiState =
  | { status: <span class="str">"idle"</span> }
  | { status: <span class="str">"loading"</span> }
  | { status: <span class="str">"success"</span>; data: Data }
  | { status: <span class="str">"error"</span>; error: Error };

<span class="cmt">// TypeScript exhaustiveness checking:</span>
<span class="kw">switch</span> (state.status) {
  <span class="kw">case</span> <span class="str">"success"</span>: <span class="kw">return</span> state.data; <span class="cmt">// TS knows data exists here</span>
  <span class="kw">case</span> <span class="str">"error"</span>: <span class="kw">return</span> state.error;  <span class="cmt">// TS knows error exists here</span>
}</pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Rust's Result&lt;T, E&gt; and Option&lt;T&gt;</strong>, <strong>Redux action types</strong>, <strong>React state machines</strong>, <strong>API response modeling</strong>.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Discriminated union for component state</span>
<span class="kw">type</span> AsyncState&lt;T&gt; =
  | { status: <span class="str">'idle'</span> }
  | { status: <span class="str">'loading'</span> }
  | { status: <span class="str">'success'</span>; data: T }
  | { status: <span class="str">'error'</span>; error: Error };

<span class="kw">const</span> state = ref&lt;AsyncState&lt;Asset[]&gt;&gt;({ status: <span class="str">'idle'</span> });

<span class="cmt">// Exhaustive switch in template logic</span>
<span class="kw">switch</span> (state.value.status) {
  <span class="kw">case</span> <span class="str">'idle'</span>: <span class="kw">return</span> <span class="str">'Press to load'</span>;
  <span class="kw">case</span> <span class="str">'loading'</span>: <span class="kw">return</span> <span class="str">'Loading...'</span>;
  <span class="kw">case</span> <span class="str">'success'</span>: <span class="kw">return</span> state.value.data; <span class="cmt">// TS knows data exists</span>
  <span class="kw">case</span> <span class="str">'error'</span>: <span class="kw">return</span> state.value.error.message;
}

<span class="cmt">// Result pattern</span>
<span class="kw">type</span> Result&lt;T, E = Error&gt; =
  | { ok: <span class="kw">true</span>; value: T }
  | { ok: <span class="kw">false</span>; error: E };</pre>
      </div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// TypeScript strict mode catches bugs at compile time</span>
<span class="kw">const</span> balance: <span class="kw">string</span> = getBalance(); <span class="cmt">// NOT number — use Big.js</span>

<span class="cmt">// Branded types for type-safe IDs</span>
<span class="kw">type</span> UserId = <span class="kw">string</span> &amp; { __brand: <span class="str">'UserId'</span> };
<span class="kw">type</span> TxId = <span class="kw">string</span> &amp; { __brand: <span class="str">'TxId'</span> };
<span class="kw">function</span> <span class="fn">getUser</span>(id: UserId) { ... }
getUser(txId); <span class="cmt">// ✗ Type error! Can't pass TxId as UserId</span>

<span class="cmt">// as const for literal types</span>
<span class="kw">const</span> NETWORKS = [<span class="str">'ethereum'</span>, <span class="str">'bitcoin'</span>, <span class="str">'tron'</span>] <span class="kw">as const</span>;
<span class="kw">type</span> Network = (<span class="kw">typeof</span> NETWORKS)[<span class="kw">number</span>]; <span class="cmt">// 'ethereum' | 'bitcoin' | 'tron'</span>

<span class="cmt">// Template literal types for route paths</span>
<span class="kw">type</span> Route = <span class="str">`/${<span class="kw">string</span>}`</span>;
<span class="kw">function</span> <span class="fn">navigate</span>(path: Route) { ... }
navigate(<span class="str">'/wallet'</span>);  <span class="cmt">// ✓</span>
navigate(<span class="str">'wallet'</span>);   <span class="cmt">// ✗ Missing leading slash</span></pre>
      </div>
    </ConceptCard>

    <ConceptCard
      id="big-o"
      title="Big O Notation"
      badge-type="theory"
      badge-label="Theory"
    >
      <div class="one-liner">Upper bound on growth rate — how algorithm time/space scales with input size.</div>
      <div class="section-label">Common Complexities</div>
      <div class="problem-box" style="border-left-color: var(--green)">
        <strong>O(1)</strong> — constant: hash lookup, array index<br>
        <strong>O(log n)</strong> — logarithmic: binary search<br>
        <strong>O(n)</strong> — linear: single loop, array scan<br>
        <strong>O(n log n)</strong> — linearithmic: merge sort, heap sort<br>
        <strong>O(n²)</strong> — quadratic: nested loops, bubble sort<br>
        <strong>O(2ⁿ)</strong> — exponential: brute-force subsets<br>
        <strong>O(n!)</strong> — factorial: brute-force permutations
      </div>
      <div class="section-label">Example</div>
      <div class="bad-box">
        <pre><span class="cmt">// O(n²) — checking duplicates with nested loops</span>
<span class="kw">function</span> <span class="fn">hasDupes</span>(arr) {
  <span class="kw">for</span> (<span class="kw">let</span> i = 0; i &lt; arr.length; i++)
    <span class="kw">for</span> (<span class="kw">let</span> j = i+1; j &lt; arr.length; j++)
      <span class="kw">if</span> (arr[i] === arr[j]) <span class="kw">return true</span>;
}</pre>
      </div>
      <div class="good-box">
        <pre><span class="cmt">// O(n) — use a Set</span>
<span class="kw">function</span> <span class="fn">hasDupes</span>(arr) {
  <span class="kw">const</span> seen = <span class="kw">new</span> Set();
  <span class="kw">for</span> (<span class="kw">const</span> x <span class="kw">of</span> arr) {
    <span class="kw">if</span> (seen.has(x)) <span class="kw">return true</span>;
    seen.add(x);
  }
}</pre>
      </div>
    </ConceptCard>

    <ConceptCard
      id="amortized"
      title="Amortized Complexity"
      badge-type="theory"
      badge-label="Theory"
    >
      <div class="one-liner">Average cost per operation over a worst-case sequence — occasional expensive ops are OK.</div>
      <div class="section-label">Classic Example: Dynamic Array</div>
      <div class="good-box">
        <pre><span class="cmt">// ArrayList.add() is O(1) amortized:</span>
<span class="cmt">// Most appends: O(1) — just write to next slot</span>
<span class="cmt">// Occasionally: O(n) — array full, copy everything to 2× bigger array</span>
<span class="cmt">//</span>
<span class="cmt">// After n insertions: n cheap + log(n) expensive</span>
<span class="cmt">// Total work ≈ n + n/2 + n/4 + ... ≈ 2n → O(n) total → O(1) per op</span>

<span class="cmt">// Other examples:</span>
<span class="cmt">// - Hash table rehashing: O(1) amortized insert</span>
<span class="cmt">// - Splay tree: O(log n) amortized search</span></pre>
      </div>
      <div class="sw-grid">
        <div>
          <div class="section-label">Key Insight</div>
          <ul class="strengths">
            <li>Don't over-optimize for rare worst cases</li>
            <li>Bulk operations average out spikes</li>
          </ul>
        </div>
        <div>
          <div class="section-label">Watch Out</div>
          <ul class="weaknesses">
            <li>Not suitable for real-time systems (individual ops can spike)</li>
            <li>Different from average case (amortized is worst-case guaranteed)</li>
          </ul>
        </div>
      </div>
    </ConceptCard>

    <ConceptCard
      id="hashing"
      title="Hashing"
      badge-type="theory"
      badge-label="Theory"
    >
      <div class="one-liner">Map arbitrary data to fixed-size values for O(1) average lookup — the backbone of hash maps.</div>
      <div class="section-label">Key Properties</div>
      <div class="problem-box" style="border-left-color: var(--accent)">
        <strong>Deterministic</strong> — same input always gives same hash.<br>
        <strong>Uniform distribution</strong> — minimize collisions.<br>
        <strong>Fast</strong> — computing hash should be cheap.<br>
        <strong>Collision handling</strong> — chaining (linked list) or open addressing (probing).
      </div>
      <div class="section-label">Example</div>
      <div class="good-box">
        <pre><span class="cmt">// Hash map: O(1) average, O(n) worst case (all collisions)</span>
<span class="kw">const</span> map = <span class="kw">new</span> Map();
map.set(<span class="str">"key"</span>, value);     <span class="cmt">// hash("key") → bucket index → store</span>
map.get(<span class="str">"key"</span>);             <span class="cmt">// hash("key") → bucket index → retrieve</span>

<span class="cmt">// Cryptographic hashing (SHA-256): one-way, collision-resistant</span>
<span class="cmt">// Used for: passwords, integrity checks, blockchain</span>
<span class="cmt">// NOT for hash maps (too slow)</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Every language's dict/map/object</strong>, <strong>database indexes</strong>, <strong>caches</strong>, <strong>consistent hashing</strong> for distributed systems (ring-based load balancing).</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Map/Set for O(1) lookups in components</span>
<span class="kw">const</span> selectedSymbols = <span class="kw">new</span> Set([<span class="str">'BTC'</span>, <span class="str">'ETH'</span>, <span class="str">'USDT'</span>]);
selectedSymbols.has(asset.symbol); <span class="cmt">// O(1) vs array.includes O(n)</span>

<span class="kw">const</span> priceMap = <span class="kw">new</span> Map&lt;<span class="kw">string</span>, <span class="kw">string</span>&gt;();
priceMap.set(<span class="str">'BTC'</span>, <span class="str">'64000.00'</span>);
priceMap.get(<span class="str">'BTC'</span>); <span class="cmt">// O(1)</span>

<span class="cmt">// Content hashing in Vite builds</span>
<span class="cmt">// assets/index-a1b2c3d4.js ← hash of file content</span>
<span class="cmt">// Same content → same hash → browser cache hit</span>
<span class="cmt">// Changed content → new hash → cache bust</span>

<span class="cmt">// Route path matching uses hashing internally</span>
<span class="cmt">// router matches '/wallet/BTC' to route pattern in O(1)</span></pre>
      </div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Vue's batched DOM updates — amortized O(1) per ref change</span>
count.value++;       <span class="cmt">// No DOM update yet</span>
name.value = <span class="str">'Bob'</span>;  <span class="cmt">// No DOM update yet</span>
list.value.push(x);  <span class="cmt">// No DOM update yet</span>
<span class="cmt">// → nextTick: ONE batched DOM update (amortized cost)</span>

<span class="cmt">// Virtual scroll — amortized chunk loading</span>
<span class="cmt">// 10,000 items but only render ~20 visible</span>
<span class="cmt">// Load chunks of 50 on scroll — occasional O(50), amortized O(1) per item</span>

<span class="cmt">// Dynamic array growth in JS</span>
<span class="kw">const</span> arr = [];
<span class="kw">for</span> (<span class="kw">let</span> i = 0; i &lt; 1e6; i++) arr.push(i);
<span class="cmt">// Push is O(1) amortized — occasional reallocation is O(n)</span></pre>
      </div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// v-for with :key — O(n) diff vs O(n²) without keys</span>
&lt;div v-for=<span class="str">"asset in assets"</span> :key=<span class="str">"asset.symbol"</span>&gt; <span class="cmt">&lt;!-- O(n) --&gt;</span>
&lt;div v-for=<span class="str">"asset in assets"</span>&gt; <span class="cmt">&lt;!-- O(n²) — Vue can't track items --&gt;</span>

<span class="cmt">// computed() = O(1) read after O(n) computation (memoized)</span>
<span class="kw">const</span> total = computed(() =&gt;
  assets.value.reduce((s, a) =&gt; Big(s).plus(a.balance).toString(), <span class="str">'0'</span>)
); <span class="cmt">// Recomputes only when assets change, not on every access</span>

<span class="cmt">// shallowRef for large arrays — O(1) reactivity check</span>
<span class="kw">const</span> prices = shallowRef&lt;Price[]&gt;([]);
<span class="cmt">// Deep ref: wraps every element in Proxy — O(n) overhead</span>
<span class="cmt">// Shallow ref: only tracks .value replacement — O(1)</span>

<span class="cmt">// Map lookup O(1) vs Array.find O(n)</span>
<span class="kw">const</span> assetMap = <span class="kw">new</span> Map(assets.map(a =&gt; [a.symbol, a]));
assetMap.get(<span class="str">'BTC'</span>); <span class="cmt">// O(1) instead of assets.find(a => a.symbol === 'BTC')</span></pre>
      </div>
    </ConceptCard>

  </section>
</template>
