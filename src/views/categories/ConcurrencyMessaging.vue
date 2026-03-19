<script setup>
import ConceptCard from '@/components/ConceptCard.vue'
</script>

<template>
  <section class="category" id="cat-concurrency">
    <h2>Concurrency &amp; Messaging</h2>

    <ConceptCard
      id="actor"
      title="Actor Model"
      badge-type="distributed"
      badge-label="Concurrency"
    >
      <div class="one-liner">Concurrency via isolated actors that communicate only through async messages.</div>
      <div class="section-label">Bad Approach (Shared State)</div>
      <div class="bad-box">
        <pre><span class="cmt">// Shared mutable state + locks = deadlocks, race conditions</span>
<span class="kw">let</span> balance = 1000;
mutex.lock();
balance -= amount; <span class="cmt">// Thread A</span>
mutex.unlock();
<span class="cmt">// Thread B waiting... deadlock risk with multiple locks</span></pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="cmt">// Each actor has private state, processes messages sequentially</span>
<span class="kw">class</span> AccountActor {
  balance = 1000;

  receive(msg) {
    <span class="kw">switch</span>(msg.type) {
      <span class="kw">case</span> <span class="str">"withdraw"</span>:
        <span class="kw">if</span> (<span class="kw">this</span>.balance >= msg.amount) {
          <span class="kw">this</span>.balance -= msg.amount;
          msg.replyTo.send({ type: <span class="str">"success"</span> });
        }
        <span class="kw">break</span>;
    }
  }
}
<span class="cmt">// No locks needed — messages processed one at a time</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Akka (JVM)</strong>, <strong>Erlang/OTP</strong> (WhatsApp, telecom switches), <strong>Microsoft Orleans</strong> (Halo game servers).</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Web Worker as an actor — isolated, communicates via messages</span>
<span class="cmt">// worker.ts</span>
self.onmessage = (e: MessageEvent) =&gt; {
  <span class="kw">const</span> result = heavyComputation(e.data);
  self.postMessage(result); <span class="cmt">// Send message back</span>
};

<span class="cmt">// Component — communicates via async messages, no shared state</span>
<span class="kw">const</span> worker = <span class="kw">new</span> Worker(<span class="str">'./worker.ts'</span>);
worker.postMessage({ prices: rawPrices });
worker.onmessage = (e) =&gt; { computedPrices.value = e.data; };

<span class="cmt">// BroadcastChannel — cross-tab actor messaging</span>
<span class="kw">const</span> channel = <span class="kw">new</span> BroadcastChannel(<span class="str">'wallet-sync'</span>);
channel.postMessage({ type: <span class="str">'BALANCE_UPDATED'</span> });
channel.onmessage = (e) =&gt; { <span class="cmt">/* other tabs react */</span> };</pre>
      </div>
    </ConceptCard>

    <ConceptCard
      id="reactor"
      title="Reactor Pattern"
      badge-type="distributed"
      badge-label="Concurrency"
    >
      <div class="one-liner">Single-threaded event loop dispatching I/O events to handlers — non-blocking by design.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
        <pre><span class="cmt">// Thread-per-connection — 10K connections = 10K threads</span>
<span class="kw">while</span> (<span class="kw">true</span>) {
  socket = server.accept();       <span class="cmt">// Blocks</span>
  <span class="kw">new</span> Thread(() => handle(socket)); <span class="cmt">// Expensive!</span>
}
<span class="cmt">// Memory: ~1MB per thread × 10K = 10GB just for stacks</span></pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="cmt">// Event loop + non-blocking I/O</span>
<span class="kw">const</span> server = http.createServer((req, res) => {
  <span class="cmt">// This handler is called by the event loop</span>
  <span class="cmt">// when data is ready — no blocking, no threads</span>
  db.query(sql).then(data => res.end(JSON.stringify(data)));
});
<span class="cmt">// Single thread handles 10K+ concurrent connections</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Node.js</strong> (libuv event loop), <strong>Nginx</strong>, <strong>Redis</strong> (single-threaded), <strong>Netty</strong> (Java), <strong>Tokio</strong> (Rust).</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// JavaScript event loop IS the reactor pattern!</span>
<span class="cmt">// Single thread dispatches events to handlers</span>

<span class="cmt">// nextTick — schedule after current microtask flush</span>
state.value = <span class="str">'updated'</span>;
nextTick(() =&gt; {
  <span class="cmt">// DOM is now updated — reactor dispatched the update</span>
  console.log(el.textContent); <span class="cmt">// reflects new state</span>
});

<span class="cmt">// Microtask queue ordering</span>
Promise.resolve().then(() =&gt; console.log(<span class="str">'microtask 1'</span>));
queueMicrotask(() =&gt; console.log(<span class="str">'microtask 2'</span>));
setTimeout(() =&gt; console.log(<span class="str">'macrotask'</span>), 0);
<span class="cmt">// Output: microtask 1, microtask 2, macrotask</span>

<span class="cmt">// Vue batches DOM updates within the same event loop tick</span>
<span class="cmt">// Multiple ref changes → single DOM update (reactor batching)</span></pre>
      </div>
    </ConceptCard>

    <ConceptCard
      id="pubsub"
      title="Pub/Sub"
      badge-type="distributed"
      badge-label="Messaging"
    >
      <div class="one-liner">Publishers emit events to topics; subscribers listen — full decoupling of producers and consumers.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
        <pre><span class="cmt">// Direct calls — order service knows all downstream services</span>
orderService.placeOrder() {
  inventoryService.reserve();   <span class="cmt">// HTTP call</span>
  emailService.sendConfirm();   <span class="cmt">// HTTP call</span>
  analyticsService.track();     <span class="cmt">// HTTP call</span>
  <span class="cmt">// Adding a new consumer? Edit orderService.</span>
}</pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="cmt">// Publisher doesn't know subscribers</span>
orderService.placeOrder() {
  messageBus.publish(<span class="str">"orders"</span>, { type: <span class="str">"OrderPlaced"</span>, data });
}
<span class="cmt">// Subscribers independently listen:</span>
messageBus.subscribe(<span class="str">"orders"</span>, inventoryHandler);
messageBus.subscribe(<span class="str">"orders"</span>, emailHandler);
messageBus.subscribe(<span class="str">"orders"</span>, analyticsHandler);
<span class="cmt">// New consumer? Just subscribe. No publisher change.</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Kafka topics</strong>, <strong>RabbitMQ exchanges</strong>, <strong>Redis Pub/Sub</strong>, <strong>Google Cloud Pub/Sub</strong>, <strong>AWS SNS/SQS</strong>.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Custom useEventBus composable</span>
<span class="kw">import</span> mitt <span class="kw">from</span> <span class="str">'mitt'</span>;
<span class="kw">type</span> Events = {
  <span class="str">'tx:confirmed'</span>: { txId: <span class="kw">string</span> };
  <span class="str">'balance:updated'</span>: <span class="kw">void</span>;
};
<span class="kw">const</span> emitter = mitt&lt;Events&gt;();

<span class="kw">function</span> <span class="fn">useEventBus</span>() {
  <span class="kw">const</span> subscriptions: Array&lt;() =&gt; <span class="kw">void</span>&gt; = [];
  <span class="kw">const</span> on = &lt;K <span class="kw">extends</span> keyof Events&gt;(event: K, handler: (e: Events[K]) =&gt; <span class="kw">void</span>) =&gt; {
    emitter.on(event, handler);
    subscriptions.push(() =&gt; emitter.off(event, handler));
  };
  onUnmounted(() =&gt; subscriptions.forEach(unsub =&gt; unsub()));
  <span class="kw">return</span> { on, emit: emitter.emit };
}

<span class="cmt">// Pinia $onAction — subscribe to store actions</span>
walletStore.$onAction(({ name, after }) =&gt; {
  after(() =&gt; console.log(<span class="str">`Action ${name} completed`</span>));
});</pre>
      </div>
    </ConceptCard>

    <ConceptCard
      id="saga"
      title="SAGA Pattern"
      badge-type="distributed"
      badge-label="Distributed"
    >
      <div class="one-liner">Manage distributed transactions via a sequence of local transactions with compensating actions.</div>
      <div class="section-label">Problem</div>
      <div class="problem-box">Distributed systems can't use traditional 2-phase commit (too slow, availability killer). How do you ensure consistency across services?</div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="cmt">// Saga: sequence of local transactions + compensations</span>
<span class="cmt">// Book Trip Saga:</span>
1. Reserve flight    → <span class="cmt">compensation: cancelFlight()</span>
2. Reserve hotel     → <span class="cmt">compensation: cancelHotel()</span>
3. Charge payment    → <span class="cmt">compensation: refund()</span>

<span class="cmt">// If step 3 fails:</span>
<span class="cmt">// → cancelHotel() → cancelFlight() (reverse order)</span>

<span class="kw">class</span> BookTripSaga {
  steps = [
    { action: reserveFlight, compensate: cancelFlight },
    { action: reserveHotel,  compensate: cancelHotel },
    { action: chargePayment, compensate: refund },
  ];
  <span class="kw">async</span> execute() {
    <span class="kw">const</span> completed = [];
    <span class="kw">for</span> (<span class="kw">const</span> step <span class="kw">of this</span>.steps) {
      <span class="kw">try</span> { <span class="kw">await</span> step.action(); completed.push(step); }
      <span class="kw">catch</span> { <span class="kw">for</span> (<span class="kw">const</span> s <span class="kw">of</span> completed.reverse()) <span class="kw">await</span> s.compensate(); }
    }
  }
}</pre>
      </div>
      <div class="sw-grid">
        <div>
          <div class="section-label">Strengths</div>
          <ul class="strengths">
            <li>No distributed locks</li>
            <li>Each service stays autonomous</li>
            <li>Fault recovery built in</li>
          </ul>
        </div>
        <div>
          <div class="section-label">Weaknesses</div>
          <ul class="weaknesses">
            <li>Compensations can fail too</li>
            <li>Eventual consistency (not immediate)</li>
            <li>Complex to debug</li>
          </ul>
        </div>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>E-commerce checkout</strong>, <strong>travel booking</strong> (flights + hotels + cars), <strong>banking transfers</strong> between institutions.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Multi-step form with rollback (compensation)</span>
<span class="kw">async function</span> <span class="fn">submitLoanApplication</span>() {
  <span class="kw">let</span> step = 0;
  <span class="kw">try</span> {
    <span class="kw">await</span> lendApi.lockCollateral(amount);   step = 1;
    <span class="kw">await</span> lendApi.createLoan(params);        step = 2;
    <span class="kw">await</span> lendApi.disburseFunds(recipient);  step = 3;
  } <span class="kw">catch</span> (err) {
    <span class="cmt">// Compensating actions (rollback in reverse)</span>
    <span class="kw">if</span> (step &gt;= 2) <span class="kw">await</span> lendApi.cancelLoan(loanId);
    <span class="kw">if</span> (step &gt;= 1) <span class="kw">await</span> lendApi.unlockCollateral(amount);
    <span class="kw">throw</span> err;
  }
}

<span class="cmt">// Vue Router navigation guards as saga steps</span>
router.beforeEach(<span class="kw">async</span> (to) =&gt; {
  <span class="kw">if</span> (to.meta.requiresAuth &amp;&amp; !isLoggedIn.value) <span class="kw">return</span> <span class="str">'/login'</span>;
  <span class="kw">if</span> (to.meta.requiresKyc &amp;&amp; !isKycDone.value) <span class="kw">return</span> <span class="str">'/kyc'</span>;
});</pre>
      </div>
    </ConceptCard>

  </section>
</template>
