<script setup>
import ConceptCard from '@/components/ConceptCard.vue'
</script>

<template>
  <section class="category" id="cat-principles">
    <h2>Principles &amp; SOLID</h2>

    <ConceptCard id="ioc" title="Inversion of Control (IoC)" badge-type="principle" badge-label="Principle">
      <div class="one-liner">Don't call us, we'll call you — the framework controls the flow, not your code.</div>
      <div class="section-label">Problem</div>
      <div class="problem-box">Your code controls everything: object creation, lifecycle, flow. Tight coupling everywhere. Changing one part means rewriting many others.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
<pre><span class="cmt">// Your code controls everything</span>
<span class="kw">class</span> OrderService {
  process(order) {
    <span class="kw">const</span> db = <span class="kw">new</span> MySQLDatabase();      <span class="cmt">// YOU create it</span>
    <span class="kw">const</span> mailer = <span class="kw">new</span> SmtpMailer();      <span class="cmt">// YOU create it</span>
    <span class="kw">const</span> logger = <span class="kw">new</span> FileLogger();      <span class="cmt">// YOU create it</span>
    db.save(order);
    mailer.send(order.email, <span class="str">"Confirmed"</span>);
    logger.log(<span class="str">"Order processed"</span>);
  }
}</pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
<pre><span class="cmt">// Framework/container controls creation and wiring</span>
<span class="kw">class</span> OrderService {
  <span class="kw">constructor</span>(db, mailer, logger) {   <span class="cmt">// GIVEN to you</span>
    <span class="kw">this</span>.db = db;
    <span class="kw">this</span>.mailer = mailer;
    <span class="kw">this</span>.logger = logger;
  }
  process(order) {
    <span class="kw">this</span>.db.save(order);
    <span class="kw">this</span>.mailer.send(order.email, <span class="str">"Confirmed"</span>);
    <span class="kw">this</span>.logger.log(<span class="str">"Order processed"</span>);
  }
}</pre>
      </div>
      <div class="sw-grid">
        <div><div class="section-label">Strengths</div><ul class="strengths"><li>Loose coupling</li><li>Easy to test with mocks</li><li>Swappable implementations</li></ul></div>
        <div><div class="section-label">Weaknesses</div><ul class="weaknesses"><li>Harder to trace flow</li><li>Container configuration complexity</li><li>Learning curve</li></ul></div>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Spring Framework, Angular, NestJS</strong> — your controllers/services are instantiated and wired by the framework, not by you calling <code>new</code>.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
<pre><span class="cmt">// Vue's plugin system — Vue controls the lifecycle, not you</span>
<span class="kw">const</span> app = createApp(App);
app.use(piniaPlugin);     <span class="cmt">// Vue calls plugin.install()</span>
app.use(routerPlugin);    <span class="cmt">// You don't call router.init()</span>
app.use(i18nPlugin);      <span class="cmt">// Framework orchestrates everything</span>

<span class="cmt">// provide/inject — parent controls what child receives</span>
<span class="cmt">// Parent component</span>
<span class="kw">const</span> apiService = <span class="kw">new</span> ApiService();
provide(<span class="str">'api'</span>, apiService);  <span class="cmt">// Parent decides what to provide</span>

<span class="cmt">// Child component — doesn't create its own dependency</span>
<span class="kw">const</span> api = inject(<span class="str">'api'</span>);   <span class="cmt">// Given to you, not created by you</span></pre>
      </div>
    </ConceptCard>

    <ConceptCard id="di" title="Dependency Injection (DI)" badge-type="principle" badge-label="Principle">
      <div class="one-liner">Pass dependencies in from outside instead of creating them inside.</div>
      <div class="section-label">Problem</div>
      <div class="problem-box">Classes create their own dependencies, making them impossible to test in isolation or swap implementations.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
<pre><span class="kw">class</span> UserController {
  <span class="fn">getUser</span>(id) {
    <span class="kw">const</span> repo = <span class="kw">new</span> PostgresUserRepo(); <span class="cmt">// Hardcoded!</span>
    <span class="kw">return</span> repo.findById(id);
  }
}
<span class="cmt">// Can't test without a real Postgres instance</span></pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
<pre><span class="kw">class</span> UserController {
  <span class="kw">constructor</span>(<span class="kw">private</span> userRepo: UserRepository) {}

  <span class="fn">getUser</span>(id) {
    <span class="kw">return this</span>.userRepo.findById(id);
  }
}
<span class="cmt">// Test: new UserController(mockRepo)</span>
<span class="cmt">// Prod: new UserController(new PostgresUserRepo())</span></pre>
      </div>
      <div class="sw-grid">
        <div><div class="section-label">Strengths</div><ul class="strengths"><li>Testability (inject mocks)</li><li>Flexibility (swap DB, cache, etc.)</li><li>Explicit dependencies</li></ul></div>
        <div><div class="section-label">Weaknesses</div><ul class="weaknesses"><li>More boilerplate / wiring</li><li>Can hide complexity in container config</li></ul></div>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Any backend framework</strong> — inject a PaymentGateway interface so you can swap Stripe for a mock in tests or switch to Adyen in production.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
<pre><span class="cmt">// Typed provide/inject with InjectionKey</span>
<span class="kw">interface</span> AuthService { login(token: <span class="kw">string</span>): Promise&lt;<span class="kw">void</span>&gt;; logout(): <span class="kw">void</span>; }
<span class="kw">class</span> RealAuthService <span class="kw">implements</span> AuthService {
  <span class="kw">async</span> login(token: <span class="kw">string</span>) { <span class="cmt">/* call API */</span> }
  logout() { <span class="cmt">/* clear session */</span> }
}

<span class="kw">const</span> AuthServiceKey: InjectionKey&lt;AuthService&gt; = Symbol(<span class="str">'auth'</span>);

<span class="cmt">// Provider component</span>
provide(AuthServiceKey, <span class="kw">new</span> RealAuthService());

<span class="cmt">// Consumer component — depends on abstraction</span>
<span class="kw">const</span> auth = inject(AuthServiceKey)!;
auth.login(<span class="str">'telegram-init-data'</span>); <span class="cmt">// uses the injected service</span>

<span class="cmt">// Composable accepting deps as params (testable!)</span>
<span class="kw">interface</span> WalletApi { getBalance(): Promise&lt;<span class="kw">string</span>&gt;; }
<span class="kw">const</span> defaultWalletApi: WalletApi = { getBalance: () =&gt; api.get(<span class="str">'/balance'</span>) };

<span class="kw">function</span> <span class="fn">useWallet</span>(walletApi: WalletApi = defaultWalletApi) {
  <span class="kw">const</span> balance = ref(<span class="str">'0'</span>);
  <span class="kw">const</span> fetchBalance = <span class="kw">async</span> () =&gt; {
    balance.value = <span class="kw">await</span> walletApi.getBalance();
  };
  <span class="kw">return</span> { balance, fetchBalance };
}
<span class="cmt">// Test: useWallet(mockApi)  Prod: useWallet()</span></pre>
      </div>
    </ConceptCard>

    <ConceptCard id="srp" title="SRP — Single Responsibility Principle" badge-type="principle" badge-label="SOLID">
      <div class="one-liner">A class should have only one reason to change.</div>
      <div class="section-label">Problem</div>
      <div class="problem-box">A god-class does everything — parsing, validation, DB access, email — so any change risks breaking unrelated features.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
<pre><span class="kw">class</span> Invoice {
  <span class="fn">calculate</span>() { <span class="cmt">/* business logic */</span> }
  <span class="fn">saveToDb</span>() { <span class="cmt">/* persistence */</span> }
  <span class="fn">generatePdf</span>() { <span class="cmt">/* presentation */</span> }
  <span class="fn">sendEmail</span>() { <span class="cmt">/* notification */</span> }
}</pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
<pre><span class="kw">class</span> Invoice { <span class="fn">calculate</span>() { <span class="cmt">/* only business logic */</span> } }
<span class="kw">class</span> InvoiceRepository { <span class="fn">save</span>(inv) { <span class="cmt">/* only persistence */</span> } }
<span class="kw">class</span> InvoicePdfGenerator { <span class="fn">generate</span>(inv) { <span class="cmt">/* only PDF */</span> } }
<span class="kw">class</span> InvoiceNotifier { <span class="fn">notify</span>(inv) { <span class="cmt">/* only email */</span> } }</pre>
      </div>
      <div class="sw-grid">
        <div><div class="section-label">Strengths</div><ul class="strengths"><li>Changes are isolated</li><li>Easier to test each piece</li><li>Better team parallelism</li></ul></div>
        <div><div class="section-label">Weaknesses</div><ul class="weaknesses"><li>More classes to manage</li><li>"One reason to change" is subjective</li></ul></div>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Microservices</strong> — each service owns one domain concern. Changing billing logic doesn't require redeploying the notification service.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
<pre><span class="cmt">// BAD — one composable doing everything</span>
<span class="kw">function</span> <span class="fn">useUser</span>() {
  <span class="cmt">// fetching + validation + formatting + caching... 🤮</span>
}

<span class="cmt">// GOOD — each composable has one responsibility</span>
<span class="kw">function</span> <span class="fn">useSearch</span>() { <span class="cmt">/* only search state &amp; query */</span> }
<span class="kw">function</span> <span class="fn">useDebounce</span>(value, ms) { <span class="cmt">/* only debounce logic */</span> }
<span class="kw">function</span> <span class="fn">useUserApi</span>() { <span class="cmt">/* only API calls */</span> }

<span class="cmt">// Component split: Container vs Presentational</span>
<span class="cmt">// WalletContainer.vue — data fetching, state management</span>
<span class="cmt">// WalletAssetsList.vue — pure presentation, receives props</span>
<span class="cmt">// walletService.ts — API calls only</span>
<span class="cmt">// useWalletStore.ts — state management only</span></pre>
      </div>
    </ConceptCard>

    <ConceptCard id="ocp" title="OCP — Open/Closed Principle" badge-type="principle" badge-label="SOLID">
      <div class="one-liner">Open for extension, closed for modification — add behavior without editing existing code.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
<pre><span class="kw">function</span> <span class="fn">calculateDiscount</span>(type, amount) {
  <span class="kw">if</span> (type === <span class="str">"regular"</span>) <span class="kw">return</span> amount * 0.05;
  <span class="kw">if</span> (type === <span class="str">"premium"</span>) <span class="kw">return</span> amount * 0.1;
  <span class="kw">if</span> (type === <span class="str">"vip"</span>) <span class="kw">return</span> amount * 0.2;
  <span class="cmt">// Adding new type? Edit this function every time!</span>
}</pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
<pre><span class="kw">interface</span> DiscountStrategy { calculate(amount: number): number; }

<span class="kw">class</span> RegularDiscount <span class="kw">implements</span> DiscountStrategy {
  calculate(amount) { <span class="kw">return</span> amount * 0.05; }
}
<span class="kw">class</span> VipDiscount <span class="kw">implements</span> DiscountStrategy {
  calculate(amount) { <span class="kw">return</span> amount * 0.2; }
}
<span class="cmt">// New type? Just add a new class. No existing code modified.</span></pre>
      </div>
      <div class="sw-grid">
        <div><div class="section-label">Strengths</div><ul class="strengths"><li>New features without regression risk</li><li>Stable, tested core</li></ul></div>
        <div><div class="section-label">Weaknesses</div><ul class="weaknesses"><li>Requires upfront abstraction design</li><li>Over-engineering if requirements are stable</li></ul></div>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Plugin systems</strong> (Webpack, VS Code) — core is closed; plugins extend behavior without modifying the core.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
<pre><span class="cmt">// Dynamic component — extend without modifying</span>
&lt;component :is=<span class="str">"transactionIcons[tx.type]"</span> /&gt;

<span class="kw">const</span> transactionIcons: Record&lt;<span class="kw">string</span>, Component&gt; = {
  send: TxSendIcon,
  receive: TxReceiveIcon,
  <span class="cmt">// Add new type here — no existing code changes</span>
  swap: TxSwapIcon,
};

<span class="cmt">// Composable accepting strategy function</span>
<span class="kw">interface</span> Asset { symbol: <span class="kw">string</span>; name: <span class="kw">string</span>; price: <span class="kw">number</span>; }
<span class="kw">const</span> assets = ref&lt;Asset[]&gt;([]);

<span class="kw">function</span> <span class="fn">useSortedList</span>&lt;T&gt;(items: Ref&lt;T[]&gt;, compareFn: (a: T, b: T) =&gt; <span class="kw">number</span>) {
  <span class="kw">return</span> computed(() =&gt; [...items.value].sort(compareFn));
}
<span class="cmt">// Open for extension — pass any sort strategy</span>
<span class="kw">const</span> byPrice = <span class="fn">useSortedList</span>(assets, (a, b) =&gt; b.price - a.price);
<span class="kw">const</span> byName = <span class="fn">useSortedList</span>(assets, (a, b) =&gt; a.name.localeCompare(b.name));</pre>
      </div>
    </ConceptCard>

    <ConceptCard id="lsp" title="LSP — Liskov Substitution Principle" badge-type="principle" badge-label="SOLID">
      <div class="one-liner">Subtypes must be substitutable for their base types without breaking correctness.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
<pre><span class="kw">class</span> Rectangle {
  setWidth(w) { <span class="kw">this</span>.w = w; }
  setHeight(h) { <span class="kw">this</span>.h = h; }
  area() { <span class="kw">return this</span>.w * <span class="kw">this</span>.h; }
}
<span class="kw">class</span> Square <span class="kw">extends</span> Rectangle {
  setWidth(w) { <span class="kw">this</span>.w = w; <span class="kw">this</span>.h = w; } <span class="cmt">// Breaks expectations!</span>
  setHeight(h) { <span class="kw">this</span>.w = h; <span class="kw">this</span>.h = h; }
}
<span class="cmt">// rect.setWidth(5); rect.setHeight(3); rect.area() → expects 15</span>
<span class="cmt">// With Square: area() → 9. Surprise!</span></pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
<pre><span class="kw">interface</span> Shape { area(): number; }
<span class="kw">class</span> Rectangle <span class="kw">implements</span> Shape { <span class="cmt">/* width × height */</span> }
<span class="kw">class</span> Square <span class="kw">implements</span> Shape { <span class="cmt">/* side × side */</span> }
<span class="cmt">// No inheritance, no broken substitution</span></pre>
      </div>
      <div class="sw-grid">
        <div><div class="section-label">Strengths</div><ul class="strengths"><li>Polymorphism works correctly</li><li>No surprises for callers</li></ul></div>
        <div><div class="section-label">Weaknesses</div><ul class="weaknesses"><li>Can limit inheritance hierarchies</li><li>Requires careful contract design</li></ul></div>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Collection APIs</strong> — <code>List</code>, <code>Set</code>, <code>Map</code> all implement <code>Iterable</code>. Any code accepting <code>Iterable</code> works with all of them.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
<pre><span class="cmt">// Props contract — IconButton must honor BaseButton's interface</span>
<span class="cmt">// BaseButton.vue</span>
defineProps&lt;{ label: <span class="kw">string</span>; disabled?: <span class="kw">boolean</span>; onClick: () =&gt; <span class="kw">void</span> }&gt;();

<span class="cmt">// IconButton.vue — extends BaseButton, substitutable everywhere</span>
defineProps&lt;{ label: <span class="kw">string</span>; disabled?: <span class="kw">boolean</span>; onClick: () =&gt; <span class="kw">void</span>; icon: <span class="kw">string</span> }&gt;();

<span class="cmt">// Parent can swap BaseButton → IconButton without breaking</span>
&lt;BaseButton v-bind=<span class="str">"buttonProps"</span> /&gt;
&lt;IconButton v-bind=<span class="str">"buttonProps"</span> icon=<span class="str">"star"</span> /&gt;  <span class="cmt">// ✓ Works!</span>

<span class="cmt">// Consistent emit interfaces across related components</span>
<span class="cmt">// All list components emit: select(item), remove(item)</span>
<span class="cmt">// AssetsList, CurrenciesList, TokenList — all substitutable</span></pre>
      </div>
    </ConceptCard>

    <ConceptCard id="isp" title="ISP — Interface Segregation Principle" badge-type="principle" badge-label="SOLID">
      <div class="one-liner">No client should be forced to depend on methods it doesn't use.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
<pre><span class="kw">interface</span> Worker {
  code(): void;
  design(): void;
  test(): void;
  managePeople(): void;
}
<span class="cmt">// Junior dev must implement managePeople()? Throws NotImplemented?</span></pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
<pre><span class="kw">interface</span> Coder { code(): void; }
<span class="kw">interface</span> Designer { design(): void; }
<span class="kw">interface</span> Manager { managePeople(): void; }

<span class="kw">class</span> FullStackDev <span class="kw">implements</span> Coder, Designer { ... }
<span class="kw">class</span> TeamLead <span class="kw">implements</span> Coder, Manager { ... }</pre>
      </div>
      <div class="sw-grid">
        <div><div class="section-label">Strengths</div><ul class="strengths"><li>Clients only see what they need</li><li>Less coupling, easier refactoring</li></ul></div>
        <div><div class="section-label">Weaknesses</div><ul class="weaknesses"><li>Many small interfaces to manage</li><li>Can fragment cohesive concepts</li></ul></div>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Java's Readable/Writable/Closeable</strong> — a read-only stream doesn't need write methods.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
<pre><span class="cmt">// BAD — one huge composable forces consumers to depend on everything</span>
<span class="kw">function</span> <span class="fn">useAuthAll</span>() {
  <span class="kw">const</span> user = ref&lt;<span class="kw">string</span> | <span class="kw">null</span>&gt;(<span class="kw">null</span>);
  <span class="kw">const</span> roles = ref&lt;<span class="kw">string</span>[]&gt;([]);
  <span class="kw">const</span> login = () =&gt; { <span class="cmt">/* ... */</span> };
  <span class="kw">const</span> logout = () =&gt; { <span class="cmt">/* ... */</span> };
  <span class="kw">const</span> adminPanel = ref(<span class="kw">false</span>);
  <span class="kw">const</span> auditLog = ref&lt;<span class="kw">string</span>[]&gt;([]);
  <span class="kw">return</span> { login, logout, user, roles, adminPanel, auditLog };
}

<span class="cmt">// GOOD — split into focused composables</span>
<span class="kw">function</span> <span class="fn">useAuth</span>() {
  <span class="kw">const</span> user = ref&lt;<span class="kw">string</span> | <span class="kw">null</span>&gt;(<span class="kw">null</span>);
  <span class="kw">const</span> login = () =&gt; { <span class="cmt">/* ... */</span> };
  <span class="kw">const</span> logout = () =&gt; { <span class="cmt">/* ... */</span> };
  <span class="kw">return</span> { login, logout, user };
}
<span class="kw">function</span> <span class="fn">useAuthAdmin</span>() {
  <span class="kw">const</span> roles = ref&lt;<span class="kw">string</span>[]&gt;([]);
  <span class="kw">const</span> adminPanel = ref(<span class="kw">false</span>);
  <span class="kw">return</span> { roles, adminPanel };
}

<span class="cmt">// TypeScript: Pick only what you need</span>
<span class="kw">interface</span> User { id: <span class="kw">string</span>; name: <span class="kw">string</span>; avatar: <span class="kw">string</span>; email: <span class="kw">string</span>; }
<span class="kw">type</span> UserCardProps = Pick&lt;User, <span class="str">'name'</span> | <span class="str">'avatar'</span>&gt;;
<span class="cmt">// Instead of passing the entire User object to a display card</span></pre>
      </div>
    </ConceptCard>

    <ConceptCard id="dip" title="DIP — Dependency Inversion Principle" badge-type="principle" badge-label="SOLID">
      <div class="one-liner">High-level modules depend on abstractions, not concrete implementations.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
<pre><span class="kw">class</span> OrderService {
  <span class="kw">private</span> repo = <span class="kw">new</span> MySQLOrderRepo(); <span class="cmt">// High-level depends on low-level</span>
}
<span class="cmt">// Switching to MongoDB? Rewrite OrderService.</span></pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
<pre><span class="kw">interface</span> OrderRepository { save(o: Order): void; }

<span class="kw">class</span> OrderService {
  <span class="kw">constructor</span>(<span class="kw">private</span> repo: OrderRepository) {}
}
<span class="cmt">// Both high-level and low-level depend on the abstraction</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Clean Architecture layers</strong> — domain layer defines interfaces, infrastructure layer implements them. Domain never imports infrastructure.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
<pre><span class="cmt">// Define interface (abstraction)</span>
<span class="kw">interface</span> PaymentGateway {
  charge(amount: <span class="kw">string</span>): Promise&lt;Receipt&gt;;
}

<span class="cmt">// InjectionKey typed to interface, not implementation</span>
<span class="kw">const</span> PaymentKey: InjectionKey&lt;PaymentGateway&gt; = Symbol(<span class="str">'payment'</span>);

<span class="cmt">// High-level composable depends on abstraction</span>
<span class="kw">function</span> <span class="fn">useCheckout</span>() {
  <span class="kw">const</span> gateway = inject(PaymentKey)!; <span class="cmt">// interface, not StripeService</span>
  <span class="kw">const</span> pay = (amount: <span class="kw">string</span>) =&gt; gateway.charge(amount);
  <span class="kw">return</span> { pay };
}

<span class="cmt">// In app setup — provide concrete implementation</span>
provide(PaymentKey, <span class="kw">new</span> StripeGateway());
<span class="cmt">// In tests — provide mock</span>
provide(PaymentKey, mockGateway);</pre>
      </div>
    </ConceptCard>

  </section>
</template>
