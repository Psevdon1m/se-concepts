<script setup>
import ConceptCard from '@/components/ConceptCard.vue'
</script>

<template>
  <section class="category" id="cat-reliability">
    <h2>Reliability Patterns</h2>

    <ConceptCard
      id="idempotency"
      title="Idempotency"
      badge-type="reliability"
      badge-label="Reliability"
    >
      <div class="one-liner">Same operation applied multiple times produces the same result — safe to retry.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
        <pre><span class="cmt">// Non-idempotent: double-charging on retry</span>
POST /payments { amount: 100 }
<span class="cmt">// Network timeout... client retries...</span>
POST /payments { amount: 100 }
<span class="cmt">// Customer charged $200!</span></pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="cmt">// Idempotency key — same key = same result</span>
POST /payments
  Idempotency-Key: abc-123
  { amount: 100 }

<span class="kw">function</span> <span class="fn">processPayment</span>(key, amount) {
  <span class="kw">const</span> existing = <span class="kw">await</span> db.findByKey(key);
  <span class="kw">if</span> (existing) <span class="kw">return</span> existing.result; <span class="cmt">// Already processed — return same result</span>
  <span class="kw">const</span> result = <span class="kw">await</span> chargeCard(amount);
  <span class="kw">await</span> db.save({ key, result });
  <span class="kw">return</span> result;
}
<span class="cmt">// Retry-safe: first call charges, subsequent calls return cached result</span></pre>
      </div>
      <div class="section-label">Naturally Idempotent</div>
      <div class="good-box">
        <pre><span class="cmt">// PUT (set to specific value): PUT /users/1 { name: "Bob" }</span>
<span class="cmt">// DELETE: DELETE /users/1 (already gone? Fine.)</span>
<span class="cmt">// GET: read-only, always safe</span>

<span class="cmt">// NOT idempotent: POST (create), increment operations</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Stripe API</strong> (Idempotency-Key header), <strong>AWS SQS</strong> (at-least-once delivery → consumers must be idempotent), <strong>Kafka consumer offsets</strong>.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Debounced submit button — prevent double submission</span>
<span class="kw">const</span> isSubmitting = ref(<span class="kw">false</span>);
<span class="kw">const</span> submit = <span class="kw">async</span> () =&gt; {
  <span class="kw">if</span> (isSubmitting.value) <span class="kw">return</span>; <span class="cmt">// Idempotent guard</span>
  isSubmitting.value = <span class="kw">true</span>;
  <span class="kw">try</span> {
    <span class="kw">await</span> api.post(<span class="str">'/transfer'</span>, data);
  } <span class="kw">finally</span> {
    isSubmitting.value = <span class="kw">false</span>;
  }
};

<span class="cmt">// Idempotency key on POST requests</span>
<span class="kw">const</span> idempotencyKey = crypto.randomUUID();
<span class="kw">await</span> api.post(<span class="str">'/transfer'</span>, data, {
  headers: { <span class="str">'Idempotency-Key'</span>: idempotencyKey },
}); <span class="cmt">// Server deduplicates — safe to retry on network error</span>

<span class="cmt">// TanStack mutation — disable button while pending</span>
<span class="kw">const</span> { mutate, isPending } = useMutation({ mutationFn: transfer });
<span class="cmt">// &lt;button :disabled="isPending"&gt; prevents double-click</span></pre>
      </div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// JS is single-threaded BUT race conditions still happen!</span>

<span class="cmt">// Race condition in async code</span>
<span class="kw">let</span> balance = <span class="str">'100'</span>;
<span class="kw">async function</span> <span class="fn">withdraw</span>(amount: <span class="kw">string</span>) {
  <span class="kw">const</span> current = <span class="kw">await</span> api.getBalance(); <span class="cmt">// yields to event loop</span>
  <span class="cmt">// Another withdraw() could run here!</span>
  <span class="kw">await</span> api.setBalance(Big(current).minus(amount).toString());
}

<span class="cmt">// Fix: use a mutex/lock pattern</span>
<span class="kw">let</span> pending = Promise.resolve();
<span class="kw">function</span> <span class="fn">safeWithdraw</span>(amount: <span class="kw">string</span>) {
  pending = pending.then(() =&gt; withdraw(amount));
  <span class="kw">return</span> pending;
}

<span class="cmt">// Stale closure — common in composables</span>
<span class="cmt">// Always use .value for refs, never close over primitive snapshots</span></pre>
      </div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Memory leak: uncleared watcher</span>
<span class="cmt">// BAD — watcher keeps reference alive after component unmounts</span>
<span class="kw">const</span> stop = watch(source, callback);
<span class="cmt">// If component unmounts without calling stop(), leak!</span>

<span class="cmt">// GOOD — Vue auto-cleans watchers in setup, or use onUnmounted</span>
onUnmounted(() =&gt; {
  stop();                 <span class="cmt">// Clean up watcher</span>
  channel.close();        <span class="cmt">// Clean up BroadcastChannel</span>
  observer.disconnect();  <span class="cmt">// Clean up IntersectionObserver</span>
});

<span class="cmt">// WeakRef / WeakMap — allow GC to collect</span>
<span class="kw">const</span> cache = <span class="kw">new</span> WeakMap&lt;<span class="kw">object</span>, ComputedResult&gt;();
<span class="cmt">// When key object is GC'd, entry is automatically removed</span>

<span class="cmt">// Common leaks: event listeners, setInterval, closures over</span>
<span class="cmt">// large data, detached DOM nodes, unresolved Promises</span></pre>
      </div>
    </ConceptCard>

    <ConceptCard
      id="rate-limiting"
      title="Rate Limiting"
      badge-type="reliability"
      badge-label="Reliability"
    >
      <div class="one-liner">Cap request throughput to protect services — token bucket, sliding window, or leaky bucket.</div>
      <div class="section-label">Algorithms</div>
      <div class="good-box">
        <pre><span class="cmt">// 1. Token Bucket (most common)</span>
<span class="cmt">//    Bucket fills with tokens at fixed rate (e.g., 10/sec)</span>
<span class="cmt">//    Each request consumes a token</span>
<span class="cmt">//    No tokens? → 429 Too Many Requests</span>
<span class="cmt">//    ✓ Allows bursts (up to bucket size)</span>

<span class="kw">class</span> TokenBucket {
  tokens = 10; maxTokens = 10; refillRate = 10; <span class="cmt">// per sec</span>

  <span class="fn">allow</span>() {
    <span class="kw">this</span>.refill();
    <span class="kw">if</span> (<span class="kw">this</span>.tokens > 0) { <span class="kw">this</span>.tokens--; <span class="kw">return true</span>; }
    <span class="kw">return false</span>;
  }
}

<span class="cmt">// 2. Sliding Window Log — precise but memory-heavy</span>
<span class="cmt">// 3. Sliding Window Counter — approximate, memory-efficient</span>
<span class="cmt">// 4. Leaky Bucket — smooths bursts, constant output rate</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>API gateways</strong> (Kong, AWS API Gateway), <strong>GitHub API</strong> (5000 req/hr), <strong>Nginx limit_req</strong>, <strong>Redis-based distributed rate limiting</strong>.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Debounce search input — don't fire API on every keystroke</span>
<span class="kw">import</span> { useDebounceFn } <span class="kw">from</span> <span class="str">'@vueuse/core'</span>;

<span class="kw">const</span> query = ref(<span class="str">''</span>);
<span class="kw">const</span> search = useDebounceFn(<span class="kw">async</span> (q: <span class="kw">string</span>) =&gt; {
  results.value = <span class="kw">await</span> api.search(q);
}, 300); <span class="cmt">// Wait 300ms after last keystroke</span>

watch(query, (q) =&gt; search(q));

<span class="cmt">// Throttle scroll handler</span>
<span class="kw">import</span> { useThrottleFn } <span class="kw">from</span> <span class="str">'@vueuse/core'</span>;
<span class="kw">const</span> onScroll = useThrottleFn(() =&gt; {
  <span class="cmt">// Runs at most once per 100ms</span>
  checkInfiniteScroll();
}, 100);

<span class="cmt">// API call throttling with Axios interceptor</span>
<span class="cmt">// Queue requests, release max N per second</span></pre>
      </div>
    </ConceptCard>

    <ConceptCard
      id="fault-tolerance"
      title="Fault Tolerance"
      badge-type="reliability"
      badge-label="Reliability"
    >
      <div class="one-liner">System continues operating despite component failures — circuit breakers, retries, redundancy.</div>
      <div class="section-label">Patterns</div>
      <div class="good-box">
        <pre><span class="cmt">// 1. Circuit Breaker — stop calling a failing service</span>
<span class="kw">class</span> CircuitBreaker {
  state = <span class="str">"CLOSED"</span>; failures = 0; threshold = 5;

  <span class="kw">async</span> <span class="fn">call</span>(fn) {
    <span class="kw">if</span> (<span class="kw">this</span>.state === <span class="str">"OPEN"</span>) <span class="kw">throw new</span> Error(<span class="str">"Circuit open"</span>);
    <span class="kw">try</span> {
      <span class="kw">const</span> result = <span class="kw">await</span> fn();
      <span class="kw">this</span>.failures = 0;
      <span class="kw">return</span> result;
    } <span class="kw">catch</span> (e) {
      <span class="kw">if</span> (++<span class="kw">this</span>.failures >= <span class="kw">this</span>.threshold) <span class="kw">this</span>.state = <span class="str">"OPEN"</span>;
      <span class="kw">throw</span> e;
    }
  }
}

<span class="cmt">// 2. Retry with exponential backoff</span>
delay = baseDelay * 2^attempt + randomJitter

<span class="cmt">// 3. Bulkhead — isolate failures to one partition</span>
<span class="cmt">//    Separate thread pools per dependency</span>

<span class="cmt">// 4. Timeout — don't wait forever</span>
<span class="cmt">// 5. Fallback — degrade gracefully (cached data, default)</span>
<span class="cmt">// 6. Redundancy — replicas, multi-AZ, active-passive</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Netflix Hystrix/Resilience4j</strong> (circuit breakers), <strong>AWS multi-AZ</strong> (redundancy), <strong>Kubernetes pod restarts</strong> (self-healing), <strong>CDN failover</strong>.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Axios retry interceptor</span>
api.interceptors.response.use(<span class="kw">null</span>, <span class="kw">async</span> (err) =&gt; {
  <span class="kw">if</span> (err.config.retryCount &lt; 3 &amp;&amp; err.response?.status &gt;= 500) {
    err.config.retryCount = (err.config.retryCount || 0) + 1;
    <span class="kw">await</span> <span class="kw">new</span> Promise(r =&gt; setTimeout(r, 1000 * err.config.retryCount));
    <span class="kw">return</span> api(err.config); <span class="cmt">// Retry with backoff</span>
  }
  <span class="kw">throw</span> err;
});

<span class="cmt">// TanStack Query built-in retry</span>
useQuery({
  queryKey: [<span class="str">'balance'</span>],
  queryFn: walletApi.getBalance,
  retry: 3,
  retryDelay: (attempt) =&gt; Math.min(1000 * 2 ** attempt, 30000),
});

<span class="cmt">// Fallback UI with Vue's Suspense + error boundary</span>
&lt;Suspense&gt;
  &lt;template #default&gt;&lt;AsyncComponent /&gt;&lt;/template&gt;
  &lt;template #fallback&gt;&lt;LoadingSpinner /&gt;&lt;/template&gt;
&lt;/Suspense&gt;</pre>
      </div>
    </ConceptCard>

  </section>
</template>
