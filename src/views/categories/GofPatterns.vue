<script setup>
import ConceptCard from '@/components/ConceptCard.vue'
</script>

<template>
  <section class="category" id="cat-gof">
    <h2>GoF Design Patterns</h2>

    <!-- Builder -->
    <ConceptCard id="builder" title="Builder" badge-type="pattern" badge-label="Creational">
      <div class="one-liner">Construct complex objects step-by-step, separating construction from representation.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
        <pre><span class="cmt">// Constructor with 10 parameters — unreadable, error-prone</span>
<span class="kw">const</span> query = <span class="kw">new</span> Query(<span class="str">"users"</span>, [<span class="str">"name"</span>], <span class="kw">null</span>, <span class="str">"age &gt; 18"</span>,
  <span class="kw">null</span>, <span class="str">"name"</span>, <span class="str">"ASC"</span>, 10, 0, <span class="kw">true</span>);</pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="kw">const</span> query = <span class="kw">new</span> QueryBuilder(<span class="str">"users"</span>)
  .select(<span class="str">"name"</span>)
  .where(<span class="str">"age &gt; 18"</span>)
  .orderBy(<span class="str">"name"</span>, <span class="str">"ASC"</span>)
  .limit(10)
  .build();</pre>
      </div>
      <div class="sw-grid">
        <div>
          <div class="section-label">Strengths</div>
          <ul class="strengths">
            <li>Readable, self-documenting</li>
            <li>Validates at build time</li>
            <li>Immutable result objects</li>
          </ul>
        </div>
        <div>
          <div class="section-label">Weaknesses</div>
          <ul class="weaknesses">
            <li>More code for simple objects</li>
            <li>Duplicated field definitions</li>
          </ul>
        </div>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>SQL query builders</strong> (Knex, TypeORM QueryBuilder), <strong>HTTP request builders</strong>, <strong>StringBuilder</strong> in Java.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Fluent query params builder</span>
<span class="kw">class</span> QueryBuilder {
  <span class="kw">private</span> params = <span class="kw">new</span> URLSearchParams();
  <span class="fn">page</span>(n: <span class="kw">number</span>) { <span class="kw">this</span>.params.set(<span class="str">'page'</span>, String(n)); <span class="kw">return this</span>; }
  <span class="fn">limit</span>(n: <span class="kw">number</span>) { <span class="kw">this</span>.params.set(<span class="str">'limit'</span>, String(n)); <span class="kw">return this</span>; }
  <span class="fn">filter</span>(k: <span class="kw">string</span>, v: <span class="kw">string</span>) { <span class="kw">this</span>.params.set(k, v); <span class="kw">return this</span>; }
  <span class="fn">build</span>() { <span class="kw">return this</span>.params.toString(); }
}

<span class="kw">const</span> query = <span class="kw">new</span> QueryBuilder()
  .page(1).limit(20).filter(<span class="str">'status'</span>, <span class="str">'active'</span>).build();

<span class="cmt">// TanStack Query options builder pattern</span>
<span class="kw">const</span> { data } = useQuery({
  queryKey: [<span class="str">'walletAssets'</span>, currency],
  queryFn: () =&gt; walletApi.getAssets(currency),
  staleTime: 30_000,
  retry: 3,
});</pre>
      </div>
    </ConceptCard>

    <!-- Adapter -->
    <ConceptCard id="adapter" title="Adapter" badge-type="pattern" badge-label="Structural">
      <div class="one-liner">Convert one interface into another that clients expect — a plug converter for code.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
        <pre><span class="cmt">// Client code has to deal with every payment provider's API</span>
<span class="kw">if</span> (provider === <span class="str">"stripe"</span>) stripe.charges.create({amount});
<span class="kw">else if</span> (provider === <span class="str">"paypal"</span>) paypal.payment.execute({total: amount});</pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="kw">interface</span> PaymentGateway { charge(amount: number): Receipt; }

<span class="kw">class</span> StripeAdapter <span class="kw">implements</span> PaymentGateway {
  charge(amount) { <span class="kw">return</span> stripe.charges.create({amount}); }
}
<span class="kw">class</span> PayPalAdapter <span class="kw">implements</span> PaymentGateway {
  charge(amount) { <span class="kw">return</span> paypal.payment.execute({total: amount}); }
}
<span class="cmt">// Client just calls gateway.charge(100) — doesn't care which provider</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>ORMs adapting to different databases</strong>, <strong>logging facades</strong> (SLF4J wrapping Log4j/Logback), <strong>API version migration layers</strong>.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// API response adapter: snake_case → camelCase</span>
<span class="kw">interface</span> ApiTransaction {
  tx_id: <span class="kw">string</span>; created_at: <span class="kw">string</span>; amount_usd: <span class="kw">string</span>;
}
<span class="kw">interface</span> Transaction {
  txId: <span class="kw">string</span>; createdAt: <span class="kw">string</span>; amountUsd: <span class="kw">string</span>;
}

<span class="kw">function</span> <span class="fn">adaptTransaction</span>(raw: ApiTransaction): Transaction {
  <span class="kw">return</span> {
    txId: raw.tx_id,
    createdAt: raw.created_at,
    amountUsd: raw.amount_usd,
  };
}

<span class="cmt">// Third-party lib wrapper composable</span>
<span class="cmt">// Wraps Telegram WebApp SDK into Vue-friendly reactive API</span>
<span class="kw">function</span> <span class="fn">useTelegram</span>() {
  <span class="kw">const</span> user = ref(window.Telegram?.WebApp?.initDataUnsafe?.user);
  <span class="kw">const</span> close = () =&gt; window.Telegram?.WebApp?.close();
  <span class="kw">return</span> { user, close };
}</pre>
      </div>
    </ConceptCard>

    <!-- Facade -->
    <ConceptCard id="facade" title="Facade" badge-type="pattern" badge-label="Structural">
      <div class="one-liner">Provide a simplified interface to a complex subsystem.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
        <pre><span class="cmt">// Client must orchestrate 5 subsystems to place an order</span>
inventory.reserve(items);
<span class="kw">const</span> tax = taxService.calculate(items, address);
<span class="kw">const</span> charge = payment.charge(total + tax);
shipping.createLabel(address, items);
notification.sendConfirmation(email, orderId);</pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="kw">class</span> OrderFacade {
  <span class="fn">placeOrder</span>(items, address, email) {
    inventory.reserve(items);
    <span class="kw">const</span> tax = taxService.calculate(items, address);
    payment.charge(total + tax);
    shipping.createLabel(address, items);
    notification.sendConfirmation(email);
  }
}
<span class="cmt">// Client: orderFacade.placeOrder(items, addr, email);</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>jQuery</strong> was a facade over inconsistent browser DOM APIs. <strong>AWS SDK high-level clients</strong> simplify multi-step S3 uploads.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Complex subsystem: 3 stores + API + router</span>
<span class="cmt">// Facade composable hides all complexity</span>
<span class="kw">function</span> <span class="fn">useCheckout</span>() {
  <span class="kw">const</span> cart = useCartStore();
  <span class="kw">const</span> wallet = useWalletStore();
  <span class="kw">const</span> auth = useAuthStore();
  <span class="kw">const</span> router = useRouter();

  <span class="kw">const</span> checkout = <span class="kw">async</span> () =&gt; {
    <span class="kw">if</span> (!auth.isLoggedIn) <span class="kw">return</span> router.push(<span class="str">'/login'</span>);
    <span class="kw">await</span> walletApi.charge(cart.total);
    wallet.refreshBalance();
    cart.clear();
    router.push(<span class="str">'/success'</span>);
  };

  <span class="kw">return</span> { checkout }; <span class="cmt">// Simple interface!</span>
}

<span class="cmt">// Component just calls: const { checkout } = useCheckout();</span></pre>
      </div>
    </ConceptCard>

    <!-- Proxy -->
    <ConceptCard id="proxy" title="Proxy" badge-type="pattern" badge-label="Structural">
      <div class="one-liner">A surrogate that controls access to the real object (lazy load, cache, auth).</div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="kw">class</span> CachingProxy {
  <span class="kw">constructor</span>(<span class="kw">private</span> realService: DataService) {}
  cache = <span class="kw">new</span> Map();

  <span class="fn">getData</span>(key) {
    <span class="kw">if</span> (!<span class="kw">this</span>.cache.has(key)) {
      <span class="kw">this</span>.cache.set(key, <span class="kw">this</span>.realService.getData(key));
    }
    <span class="kw">return this</span>.cache.get(key);
  }
}
<span class="cmt">// Same interface as realService — client doesn't know it's cached</span></pre>
      </div>
      <div class="sw-grid">
        <div>
          <div class="section-label">Strengths</div>
          <ul class="strengths">
            <li>Transparent to clients</li>
            <li>Lazy init, caching, access control</li>
          </ul>
        </div>
        <div>
          <div class="section-label">Weaknesses</div>
          <ul class="weaknesses">
            <li>Adds indirection</li>
            <li>Can mask performance issues</li>
          </ul>
        </div>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>ORM lazy loading</strong> (Hibernate proxies), <strong>JS Proxy object</strong>, <strong>reverse proxy (Nginx)</strong>, <strong>virtual DOM</strong>.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Vue 3 reactivity IS the Proxy pattern!</span>
<span class="kw">const</span> state = reactive({ count: 0 });
<span class="cmt">// Under the hood: new Proxy(target, {</span>
<span class="cmt">//   get(target, key) { track(target, key); return target[key]; },</span>
<span class="cmt">//   set(target, key, value) { target[key] = value; trigger(target, key); }</span>
<span class="cmt">// })</span>

<span class="cmt">// computed() is a caching proxy</span>
<span class="kw">const</span> first = ref(<span class="str">'John'</span>);
<span class="kw">const</span> last = ref(<span class="str">'Doe'</span>);
<span class="kw">const</span> fullName = computed(() =&gt; `${first.value} ${last.value}`);
<span class="cmt">// Only recomputes when dependencies change — lazy + cached</span>

<span class="cmt">// watchEffect — lazy evaluation proxy</span>
watchEffect(() =&gt; {
  console.log(state.count); <span class="cmt">// Auto-tracks, re-runs on change</span>
});</pre>
      </div>
    </ConceptCard>

    <!-- Decorator -->
    <ConceptCard id="decorator" title="Decorator" badge-type="pattern" badge-label="Structural">
      <div class="one-liner">Wrap an object to add behavior dynamically without subclassing.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
        <pre><span class="cmt">// Explosion of subclasses</span>
<span class="kw">class</span> EncryptedCompressedLogger <span class="kw">extends</span> Logger { ... }
<span class="kw">class</span> EncryptedLogger <span class="kw">extends</span> Logger { ... }
<span class="kw">class</span> CompressedLogger <span class="kw">extends</span> Logger { ... }
<span class="cmt">// N features → 2^N classes!</span></pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="kw">class</span> EncryptionDecorator {
  <span class="kw">constructor</span>(<span class="kw">private</span> inner: DataSink) {}
  write(data) { <span class="kw">this</span>.inner.write(encrypt(data)); }
}
<span class="kw">class</span> CompressionDecorator {
  <span class="kw">constructor</span>(<span class="kw">private</span> inner: DataSink) {}
  write(data) { <span class="kw">this</span>.inner.write(compress(data)); }
}
<span class="cmt">// Compose: new Encryption(new Compression(new FileWriter()))</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Java I/O Streams</strong>: <code>new BufferedReader(new InputStreamReader(new FileInputStream(f)))</code>. <strong>Express/Koa middleware</strong> chains.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Wrapping a composable to add logging</span>
<span class="kw">function</span> <span class="fn">withLogging</span>&lt;T&gt;(composable: () =&gt; T, name: <span class="kw">string</span>): () =&gt; T {
  <span class="kw">return</span> () =&gt; {
    console.log(<span class="str">`[${name}] initialized`</span>);
    <span class="kw">return</span> composable();
  };
}
<span class="kw">function</span> <span class="fn">useWallet</span>() { <span class="kw">return</span> { balance: ref(<span class="str">'0'</span>) }; }
<span class="kw">const</span> useWalletWithLogs = <span class="fn">withLogging</span>(useWallet, <span class="str">'Wallet'</span>);

<span class="cmt">// Axios interceptors as decorators</span>
<span class="kw">const</span> token = useCookies().get(<span class="str">'auth_token'</span>);
api.interceptors.request.use(config =&gt; {
  config.headers.Authorization = <span class="str">`Bearer ${token}`</span>; <span class="cmt">// Decorate request</span>
  <span class="kw">return</span> config;
});
api.interceptors.response.use(
  res =&gt; res,
  err =&gt; refreshOrInitializeToken().then(() =&gt; api(err.config)) <span class="cmt">// Decorate error handling</span>
);</pre>
      </div>
    </ConceptCard>

    <!-- Composite -->
    <ConceptCard id="composite" title="Composite" badge-type="pattern" badge-label="Structural">
      <div class="one-liner">Treat individual objects and compositions uniformly via a tree structure.</div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="kw">interface</span> FileSystemNode { getSize(): number; }

<span class="kw">class</span> File <span class="kw">implements</span> FileSystemNode {
  getSize() { <span class="kw">return this</span>.bytes; }
}
<span class="kw">class</span> Directory <span class="kw">implements</span> FileSystemNode {
  children: FileSystemNode[] = [];
  getSize() { <span class="kw">return this</span>.children.reduce((s, c) =&gt; s + c.getSize(), 0); }
}
<span class="cmt">// directory.getSize() recursively sums all files — uniform interface</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>DOM tree</strong>, <strong>React component tree</strong>, <strong>file systems</strong>, <strong>organization charts</strong>, <strong>UI layout containers</strong>.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Recursive component tree — nested menu</span>
<span class="cmt">// MenuItem.vue</span>
&lt;template&gt;
  &lt;li&gt;
    {{ item.label }}
    &lt;ul v-if=<span class="str">"item.children?.length"</span>&gt;
      &lt;MenuItem v-for=<span class="str">"child in item.children"</span>
        :key=<span class="str">"child.id"</span> :item=<span class="str">"child"</span> /&gt;
    &lt;/ul&gt;
  &lt;/li&gt;
&lt;/template&gt;

<span class="cmt">// Slot composition — uniform interface for leaf &amp; composite</span>
&lt;Card&gt;
  &lt;CardHeader&gt;Title&lt;/CardHeader&gt;
  &lt;CardBody&gt;
    &lt;Card&gt;<span class="cmt">&lt;!-- Nested card, same interface --&gt;</span>&lt;/Card&gt;
  &lt;/CardBody&gt;
&lt;/Card&gt;</pre>
      </div>
    </ConceptCard>

    <!-- Bridge -->
    <ConceptCard id="bridge" title="Bridge" badge-type="pattern" badge-label="Structural">
      <div class="one-liner">Decouple abstraction from implementation so both can vary independently.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
        <pre><span class="cmt">// 2 shapes × 3 renderers = 6 classes</span>
<span class="kw">class</span> CircleSVG, CircleCanvas, CircleWebGL
<span class="kw">class</span> SquareSVG, SquareCanvas, SquareWebGL
<span class="cmt">// Adding a new shape or renderer multiplies classes</span></pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="kw">interface</span> Renderer { drawCircle(x, y, r); drawRect(x, y, w, h); }
<span class="kw">class</span> SVGRenderer <span class="kw">implements</span> Renderer { ... }
<span class="kw">class</span> CanvasRenderer <span class="kw">implements</span> Renderer { ... }

<span class="kw">class</span> Circle {
  <span class="kw">constructor</span>(<span class="kw">private</span> renderer: Renderer) {}
  draw() { <span class="kw">this</span>.renderer.drawCircle(<span class="kw">this</span>.x, <span class="kw">this</span>.y, <span class="kw">this</span>.r); }
}
<span class="cmt">// Shapes and renderers vary independently</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>JDBC</strong> — Java's DB abstraction (bridge) works with any vendor's driver (implementation). <strong>Cross-platform UI toolkits</strong>.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Abstraction: composable for payment logic</span>
<span class="cmt">// Implementation: swappable gateway</span>
<span class="kw">interface</span> PaymentGateway {
  charge(amount: <span class="kw">string</span>): Promise&lt;Result&gt;;
}

<span class="kw">function</span> <span class="fn">usePayment</span>(gateway: PaymentGateway) {
  <span class="kw">const</span> loading = ref(<span class="kw">false</span>);
  <span class="kw">const</span> pay = <span class="kw">async</span> (amount: <span class="kw">string</span>) =&gt; {
    loading.value = <span class="kw">true</span>;
    <span class="kw">const</span> result = <span class="kw">await</span> gateway.charge(amount);
    loading.value = <span class="kw">false</span>;
    <span class="kw">return</span> result;
  };
  <span class="kw">return</span> { loading, pay };
}

<span class="cmt">// Abstraction and implementation vary independently</span>
<span class="kw">const</span> stripe = <span class="fn">usePayment</span>(<span class="kw">new</span> StripeGateway());
<span class="kw">const</span> crypto = <span class="fn">usePayment</span>(<span class="kw">new</span> CryptoGateway());</pre>
      </div>
    </ConceptCard>

    <!-- Strategy -->
    <ConceptCard id="strategy" title="Strategy" badge-type="pattern" badge-label="Behavioral">
      <div class="one-liner">Define a family of algorithms, encapsulate each, and make them interchangeable at runtime.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
        <pre><span class="kw">function</span> <span class="fn">sort</span>(data, algorithm) {
  <span class="kw">if</span> (algorithm === <span class="str">"quick"</span>) { <span class="cmt">/* 50 lines */</span> }
  <span class="kw">else if</span> (algorithm === <span class="str">"merge"</span>) { <span class="cmt">/* 50 lines */</span> }
  <span class="kw">else if</span> (algorithm === <span class="str">"heap"</span>) { <span class="cmt">/* 50 lines */</span> }
}</pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="kw">interface</span> SortStrategy { sort(data: number[]): number[]; }

<span class="kw">class</span> Sorter {
  <span class="kw">constructor</span>(<span class="kw">private</span> strategy: SortStrategy) {}
  sort(data) { <span class="kw">return this</span>.strategy.sort(data); }
}
<span class="cmt">// new Sorter(new QuickSort()).sort(data)</span>
<span class="cmt">// new Sorter(new MergeSort()).sort(data)</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Passport.js</strong> authentication strategies, <strong>compression algorithms</strong> (gzip/brotli/zstd), <strong>pricing/discount rules</strong>.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Validation strategies passed to form composable</span>
<span class="kw">type</span> Validator = (value: <span class="kw">string</span>) =&gt; <span class="kw">string</span> | <span class="kw">null</span>;

<span class="kw">const</span> required: Validator = v =&gt; v ? <span class="kw">null</span> : <span class="str">'Required'</span>;
<span class="kw">const</span> minLength = (n: <span class="kw">number</span>): Validator =&gt;
  v =&gt; v.length &gt;= n ? <span class="kw">null</span> : <span class="str">`Min ${n} chars`</span>;

<span class="kw">function</span> <span class="fn">useField</span>(validators: Validator[]) {
  <span class="kw">const</span> value = ref(<span class="str">''</span>);
  <span class="kw">const</span> error = computed(() =&gt;
    validators.map(v =&gt; v(value.value)).find(Boolean) ?? <span class="kw">null</span>
  );
  <span class="kw">return</span> { value, error };
}

<span class="cmt">// Sort/filter strategies passed as props</span>
&lt;AssetsList :sort-fn=<span class="str">"sortByBalance"</span> :filter-fn=<span class="str">"hideZero"</span> /&gt;

<span class="cmt">// Router guards as navigation strategies</span>
router.beforeEach(authGuard);  <span class="cmt">// Swap guard strategy</span></pre>
      </div>
    </ConceptCard>

    <!-- Observer -->
    <ConceptCard id="observer" title="Observer" badge-type="pattern" badge-label="Behavioral">
      <div class="one-liner">One-to-many notification: when subject changes state, all dependents are notified.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
        <pre><span class="kw">class</span> Store {
  updatePrice(price) {
    <span class="kw">this</span>.price = price;
    <span class="kw">this</span>.dashboard.refresh();    <span class="cmt">// Tight coupling</span>
    <span class="kw">this</span>.mobileApp.push();       <span class="cmt">// Knows about all consumers</span>
    <span class="kw">this</span>.analytics.track();      <span class="cmt">// Adding new = edit Store</span>
  }
}</pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="kw">class</span> EventEmitter {
  listeners = <span class="kw">new</span> Map();
  on(event, fn) { <span class="cmt">/* subscribe */</span> }
  emit(event, data) { <span class="cmt">/* notify all */</span> }
}
<span class="kw">class</span> Store <span class="kw">extends</span> EventEmitter {
  updatePrice(price) {
    <span class="kw">this</span>.price = price;
    <span class="kw">this</span>.emit(<span class="str">"priceChanged"</span>, price); <span class="cmt">// Doesn't know who listens</span>
  }
}</pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>DOM events</strong>, <strong>Vue reactivity</strong> (watchers), <strong>RxJS Observables</strong>, <strong>Node EventEmitter</strong>, <strong>Redux subscriptions</strong>.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// watch — explicit observer</span>
watch(walletBalance, (newVal, oldVal) =&gt; {
  <span class="kw">if</span> (Big(newVal).lt(oldVal)) notify(<span class="str">'Balance decreased!'</span>);
});

<span class="cmt">// watchEffect — auto-tracking observer</span>
watchEffect(() =&gt; {
  document.title = <span class="str">`Balance: ${balance.value}`</span>;
});

<span class="cmt">// Pinia $subscribe — store observer</span>
walletStore.$subscribe((mutation, state) =&gt; {
  localStorage.setItem(<span class="str">'wallet'</span>, JSON.stringify(state));
});

<span class="cmt">// Custom event bus (mitt)</span>
<span class="kw">import</span> mitt <span class="kw">from</span> <span class="str">'mitt'</span>;
<span class="kw">const</span> bus = mitt();
bus.on(<span class="str">'tx:confirmed'</span>, refreshBalance); <span class="cmt">// Subscribe</span>
bus.emit(<span class="str">'tx:confirmed'</span>, { txId });     <span class="cmt">// Publish</span></pre>
      </div>
    </ConceptCard>

    <!-- Mediator -->
    <ConceptCard id="mediator" title="Mediator" badge-type="pattern" badge-label="Behavioral">
      <div class="one-liner">Centralize complex communications between objects through a single coordinator.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
        <pre><span class="cmt">// Every UI component talks to every other — n² connections</span>
searchBox.onChange → filterPanel.update() + resultList.refresh() + pagination.reset()
filterPanel.onChange → searchBox.update() + resultList.refresh() + pagination.reset()</pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="kw">class</span> SearchMediator {
  <span class="fn">notify</span>(sender, event) {
    <span class="kw">if</span> (event === <span class="str">"search"</span>) {
      <span class="kw">this</span>.filter.reset();
      <span class="kw">this</span>.results.refresh();
      <span class="kw">this</span>.pagination.reset();
    }
  }
}
<span class="cmt">// Components only know the mediator, not each other</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Air traffic control</strong> (planes communicate via tower), <strong>chat rooms</strong>, <strong>Redux store</strong> as mediator between components.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Pinia store as mediator between components</span>
<span class="kw">const</span> useTransferStore = defineStore(<span class="str">'transfer'</span>, () =&gt; {
  <span class="kw">const</span> amount = ref(<span class="str">''</span>);
  <span class="kw">const</span> recipient = ref(<span class="str">''</span>);
  <span class="kw">const</span> status = ref&lt;<span class="str">'idle'</span> | <span class="str">'pending'</span> | <span class="str">'done'</span>&gt;(<span class="str">'idle'</span>);

  <span class="cmt">// Mediates between AmountInput, RecipientPicker, ConfirmButton</span>
  <span class="kw">const</span> canConfirm = computed(() =&gt;
    amount.value &amp;&amp; recipient.value &amp;&amp; status.value === <span class="str">'idle'</span>
  );
  <span class="kw">return</span> { amount, recipient, status, canConfirm };
});

<span class="cmt">// Parent component coordinating children via props/emits</span>
<span class="cmt">// Parent receives @select from CurrencyPicker</span>
<span class="cmt">// Parent passes :currency to AmountInput</span>
<span class="cmt">// Children never talk to each other directly</span></pre>
      </div>
    </ConceptCard>

    <!-- Iterator -->
    <ConceptCard id="iterator" title="Iterator" badge-type="pattern" badge-label="Behavioral">
      <div class="one-liner">Access elements of a collection sequentially without exposing its internal structure.</div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="cmt">// JS iterators/generators — works with any data structure</span>
<span class="kw">function*</span> <span class="fn">range</span>(start, end) {
  <span class="kw">for</span> (<span class="kw">let</span> i = start; i &lt; end; i++) <span class="kw">yield</span> i;
}
<span class="kw">for</span> (<span class="kw">const</span> n <span class="kw">of</span> range(0, 1000000)) {
  <span class="cmt">// Lazy — doesn't allocate 1M items in memory</span>
  <span class="kw">if</span> (n &gt; 10) <span class="kw">break</span>;
}</pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Database cursors</strong>, <strong>file line-by-line readers</strong>, <strong>paginated API results</strong>, <strong>for...of in JS</strong>, <strong>Python generators</strong>.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// v-for with generator for paginated data</span>
<span class="kw">async function*</span> <span class="fn">fetchPages</span>(url: <span class="kw">string</span>) {
  <span class="kw">let</span> page = 1;
  <span class="kw">while</span> (<span class="kw">true</span>) {
    <span class="kw">const</span> res = <span class="kw">await</span> axios.get(url, { params: { page } });
    <span class="kw">if</span> (!res.data.length) <span class="kw">break</span>;
    <span class="kw">yield</span> res.data;
    page++;
  }
}

<span class="cmt">// Async iterator for infinite scroll composable</span>
<span class="kw">function</span> <span class="fn">useInfiniteScroll</span>(fetcher: AsyncGenerator) {
  <span class="kw">const</span> items = ref([]);
  <span class="kw">const</span> loadMore = <span class="kw">async</span> () =&gt; {
    <span class="kw">const</span> { value, done } = <span class="kw">await</span> fetcher.next();
    <span class="kw">if</span> (!done) items.value.push(...value);
  };
  <span class="kw">return</span> { items, loadMore };
}</pre>
      </div>
    </ConceptCard>

    <!-- Visitor -->
    <ConceptCard id="visitor" title="Visitor" badge-type="pattern" badge-label="Behavioral">
      <div class="one-liner">Add new operations to existing object structures without modifying them.</div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="kw">interface</span> ASTVisitor {
  visitLiteral(node: Literal): any;
  visitBinary(node: Binary): any;
  visitUnary(node: Unary): any;
}

<span class="kw">class</span> Interpreter <span class="kw">implements</span> ASTVisitor {
  visitLiteral(n) { <span class="kw">return</span> n.value; }
  visitBinary(n) { <span class="kw">return</span> <span class="kw">this</span>.visit(n.left) + <span class="kw">this</span>.visit(n.right); }
}
<span class="kw">class</span> PrettyPrinter <span class="kw">implements</span> ASTVisitor {
  visitLiteral(n) { <span class="kw">return</span> String(n.value); }
  visitBinary(n) { <span class="kw">return</span> <span class="str">`(${this.visit(n.left)} + ${this.visit(n.right)})`</span>; }
}
<span class="cmt">// New operation = new visitor class. AST nodes unchanged.</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Compilers &amp; AST walkers</strong> (Babel, ESLint rules), <strong>document exporters</strong> (same doc → PDF, HTML, Markdown).</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Schema-driven form renderer — visitor walks the schema</span>
<span class="kw">type</span> Field = { type: <span class="str">'text'</span> | <span class="str">'select'</span> | <span class="str">'group'</span>; fields?: Field[] };

<span class="kw">function</span> <span class="fn">renderField</span>(field: Field): VNode {
  <span class="kw">switch</span> (field.type) {
    <span class="kw">case</span> <span class="str">'text'</span>: <span class="kw">return</span> h(TextInput, field);
    <span class="kw">case</span> <span class="str">'select'</span>: <span class="kw">return</span> h(SelectInput, field);
    <span class="kw">case</span> <span class="str">'group'</span>: <span class="kw">return</span> h(<span class="str">'div'</span>, field.fields!.map(renderField));
  }
}

<span class="cmt">// Vite plugin — AST visitor transforms code at build time</span>
<span class="cmt">// ESLint rules visit AST nodes to enforce patterns</span>
<span class="cmt">// Recursive slot rendering visits component tree</span></pre>
      </div>
    </ConceptCard>

  </section>
</template>
