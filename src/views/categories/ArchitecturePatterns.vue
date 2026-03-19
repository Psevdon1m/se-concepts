<script setup>
import ConceptCard from '@/components/ConceptCard.vue'
</script>

<template>
  <section class="category" id="cat-arch">
    <h2>Architecture Patterns</h2>

    <ConceptCard id="ddd" title="Domain-Driven Design (DDD)" badge-type="architecture" badge-label="Architecture">
      <div class="one-liner">Model software around the business domain using ubiquitous language and bounded contexts.</div>
      <div class="section-label">Key Concepts</div>
      <div class="problem-box" style="border-left-color: var(--purple)">
        <strong>Ubiquitous Language</strong> — developers and domain experts use the same terms in code and conversation.<br>
        <strong>Bounded Context</strong> — explicit boundary within which a model applies. "Account" means different things in Banking vs. Auth contexts.<br>
        <strong>Entities</strong> — objects with identity (User, Order).<br>
        <strong>Value Objects</strong> — immutable, no identity (Money, Address).<br>
        <strong>Aggregates</strong> — cluster of entities with a root that ensures consistency.<br>
        <strong>Domain Events</strong> — something meaningful that happened (OrderPlaced, PaymentReceived).<br>
        <strong>Repositories</strong> — persist/retrieve aggregates.
      </div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
        <pre><span class="cmt">// Anemic domain model — logic scattered in services</span>
<span class="kw">class</span> Order { id; status; items; total; } <span class="cmt">// Just data</span>
<span class="kw">class</span> OrderService {
  cancel(order) { order.status = <span class="str">"cancelled"</span>; refund(order); }
  <span class="cmt">// Business rules live outside the domain object</span>
}</pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="kw">class</span> Order {
  <span class="fn">cancel</span>() {
    <span class="kw">if</span> (<span class="kw">this</span>.status === <span class="str">"shipped"</span>) <span class="kw">throw new</span> Error(<span class="str">"Cannot cancel shipped order"</span>);
    <span class="kw">this</span>.status = OrderStatus.Cancelled;
    <span class="kw">this</span>.addDomainEvent(<span class="kw">new</span> OrderCancelled(<span class="kw">this</span>.id));
  }
}
<span class="cmt">// Domain object owns its rules and emits events</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>E-commerce platforms</strong> — separate bounded contexts for Catalog, Orders, Shipping, Payments, each with their own models and teams.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Module-per-domain structure (this project!)</span>
modules/
  wallet/      <span class="cmt">// Bounded context: balances, assets, transactions</span>
    api/       <span class="cmt">// walletApi.ts</span>
    store/     <span class="cmt">// useWalletStore.ts</span>
    views/     <span class="cmt">// WalletView.vue</span>
    components/<span class="cmt">// WalletAssetsList.vue</span>
  cards/       <span class="cmt">// Bounded context: card management</span>
  borrow/      <span class="cmt">// Bounded context: loans</span>
  lend/        <span class="cmt">// Bounded context: lending</span>

<span class="cmt">// Branded types as Value Objects</span>
<span class="kw">type</span> USD = <span class="kw">string</span> &amp; { __brand: <span class="str">'USD'</span> };
<span class="kw">type</span> BTC = <span class="kw">string</span> &amp; { __brand: <span class="str">'BTC'</span> };
<span class="cmt">// Can't accidentally pass BTC amount where USD expected</span>

<span class="cmt">// Each module has its own types, API layer, store — no cross-imports</span></pre>
      </div>
    </ConceptCard>

    <ConceptCard id="clean-arch" title="Clean Architecture" badge-type="architecture" badge-label="Architecture">
      <div class="one-liner">Dependencies point inward — business rules know nothing about frameworks or DB.</div>
      <div class="section-label">Layers (inside → out)</div>
      <div class="problem-box" style="border-left-color: var(--green)">
        <strong>1. Entities</strong> — enterprise-wide business rules (pure domain objects).<br>
        <strong>2. Use Cases</strong> — application-specific business rules (orchestrate entities).<br>
        <strong>3. Interface Adapters</strong> — controllers, presenters, gateways (convert data between layers).<br>
        <strong>4. Frameworks &amp; Drivers</strong> — DB, web framework, UI (outermost, most volatile).
      </div>
      <div class="section-label">Key Rule</div>
      <div class="good-box">
        <pre><span class="cmt">// Inner layers NEVER import from outer layers</span>
<span class="cmt">// Use Case defines interface:</span>
<span class="kw">interface</span> UserRepository { findById(id: string): User; }

<span class="cmt">// Infrastructure implements it:</span>
<span class="kw">class</span> PostgresUserRepo <span class="kw">implements</span> UserRepository { ... }

<span class="cmt">// Use Case depends on abstraction, not Postgres</span>
<span class="kw">class</span> GetUser {
  <span class="kw">constructor</span>(<span class="kw">private</span> repo: UserRepository) {}
  execute(id) { <span class="kw">return this</span>.repo.findById(id); }
}</pre>
      </div>
      <div class="sw-grid">
        <div>
          <div class="section-label">Strengths</div>
          <ul class="strengths">
            <li>Framework-independent</li>
            <li>Highly testable</li>
            <li>Business rules protected from change</li>
          </ul>
        </div>
        <div>
          <div class="section-label">Weaknesses</div>
          <ul class="weaknesses">
            <li>Lots of interfaces &amp; mapping</li>
            <li>Overkill for simple CRUD apps</li>
          </ul>
        </div>
      </div>
    </ConceptCard>

    <ConceptCard id="cqrs" title="CQRS" badge-type="architecture" badge-label="Architecture">
      <div class="one-liner">Separate read models from write models for independent scaling and optimization.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
        <pre><span class="cmt">// Same model for reads and writes</span>
<span class="kw">class</span> ProductService {
  create(p) { db.products.insert(p); }
  getById(id) { <span class="kw">return</span> db.products.findById(id); }
  search(q) { <span class="kw">return</span> db.products.find(q); } <span class="cmt">// Slow! Joins everywhere</span>
}
<span class="cmt">// Write-optimized schema conflicts with read-optimized queries</span></pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="cmt">// Write side — normalized, validates business rules</span>
<span class="kw">class</span> CreateProductHandler {
  handle(cmd) { writeDb.products.insert(cmd); eventBus.emit(<span class="str">"ProductCreated"</span>); }
}

<span class="cmt">// Read side — denormalized, optimized for queries</span>
<span class="kw">class</span> ProductReadModel {
  onProductCreated(e) { readDb.productViews.upsert(flatten(e)); }
}
<span class="kw">class</span> ProductQuery {
  search(q) { <span class="kw">return</span> readDb.productViews.find(q); } <span class="cmt">// Fast! Pre-joined</span>
}</pre>
      </div>
      <div class="sw-grid">
        <div>
          <div class="section-label">Strengths</div>
          <ul class="strengths">
            <li>Independent scaling of reads/writes</li>
            <li>Optimized query models</li>
            <li>Simpler read logic</li>
          </ul>
        </div>
        <div>
          <div class="section-label">Weaknesses</div>
          <ul class="weaknesses">
            <li>Eventual consistency between models</li>
            <li>Increased complexity</li>
            <li>Data sync infrastructure needed</li>
          </ul>
        </div>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>E-commerce search</strong> — writes go to PostgreSQL (normalized), reads go to Elasticsearch (denormalized). <strong>Twitter timeline</strong> — fan-out on write to pre-computed feeds.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Queries (read) — TanStack useQuery</span>
<span class="kw">const</span> { data: assets } = useQuery({
  queryKey: [<span class="str">'assets'</span>],
  queryFn: walletApi.getAssets,  <span class="cmt">// Optimized read endpoint</span>
});

<span class="cmt">// Commands (write) — TanStack useMutation</span>
<span class="kw">const</span> { mutate: sendFunds } = useMutation({
  mutationFn: walletApi.transfer,  <span class="cmt">// Write endpoint</span>
  onSuccess: () =&gt; {
    queryClient.invalidateQueries({ queryKey: [<span class="str">'assets'</span>] }); <span class="cmt">// Sync read</span>
  },
});

<span class="cmt">// Optimistic update — UI updates before server confirms</span>
<span class="kw">const</span> { mutate } = useMutation({
  mutationFn: walletApi.transfer,
  onMutate: <span class="kw">async</span> (vars) =&gt; {
    <span class="kw">await</span> queryClient.cancelQueries({ queryKey: [<span class="str">'assets'</span>] });
    <span class="kw">const</span> prev = queryClient.getQueryData([<span class="str">'assets'</span>]);
    queryClient.setQueryData([<span class="str">'assets'</span>], optimisticUpdate(prev, vars));
    <span class="kw">return</span> { prev }; <span class="cmt">// For rollback</span>
  },
});</pre>
      </div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Layered module — dependencies point inward</span>
<span class="cmt">// Layer 1: Domain types (innermost, no deps)</span>
<span class="cmt">// src/modules/wallet/types.ts</span>
<span class="kw">interface</span> Asset { symbol: <span class="kw">string</span>; balance: <span class="kw">string</span>; }

<span class="cmt">// Layer 2: API / Infrastructure (depends on types)</span>
<span class="cmt">// src/modules/wallet/api/walletApi.ts</span>
<span class="kw">const</span> getAssets = (): Promise&lt;Asset[]&gt; =&gt; api.get(<span class="str">'/assets'</span>);

<span class="cmt">// Layer 3: Services/Composables (depends on types + api)</span>
<span class="cmt">// src/modules/wallet/composables/useWalletQueries.ts</span>
<span class="kw">function</span> <span class="fn">useWalletAssets</span>() {
  <span class="kw">return</span> useQuery({ queryKey: [<span class="str">'assets'</span>], queryFn: getAssets });
}

<span class="cmt">// Layer 4: Components/Views (outermost, depends on everything)</span>
<span class="cmt">// src/modules/wallet/views/WalletView.vue</span>
<span class="cmt">// Views never call API directly — always through composables</span></pre>
      </div>
    </ConceptCard>

    <ConceptCard id="event-sourcing" title="Event Sourcing" badge-type="architecture" badge-label="Architecture">
      <div class="one-liner">Store state as a sequence of events, not current snapshot — full history, replay capability.</div>
      <div class="section-label">Bad Approach (CRUD)</div>
      <div class="bad-box">
        <pre><span class="cmt">// Only current state — history is lost</span>
UPDATE accounts SET balance = 950 WHERE id = 1;
<span class="cmt">// Why is it 950? When did it change? From what? 🤷</span></pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="cmt">// Store events — current state derived by replaying</span>
events = [
  { type: <span class="str">"AccountOpened"</span>, balance: 0 },
  { type: <span class="str">"MoneyDeposited"</span>, amount: 1000 },
  { type: <span class="str">"MoneyWithdrawn"</span>, amount: 50 },
]
<span class="cmt">// Current balance: replay → 0 + 1000 - 50 = 950</span>
<span class="cmt">// Full audit trail, can rebuild state at any point in time</span></pre>
      </div>
      <div class="sw-grid">
        <div>
          <div class="section-label">Strengths</div>
          <ul class="strengths">
            <li>Complete audit trail</li>
            <li>Time-travel debugging</li>
            <li>Rebuild state from events</li>
            <li>Pairs with CQRS</li>
          </ul>
        </div>
        <div>
          <div class="section-label">Weaknesses</div>
          <ul class="weaknesses">
            <li>Event schema evolution is hard</li>
            <li>Replay can be slow</li>
            <li>Snapshots needed for performance</li>
          </ul>
        </div>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Banking ledgers</strong>, <strong>Git</strong> (commits are events), <strong>Redux</strong> (actions are events, state derived via reducers), <strong>Kafka event logs</strong>.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Undo/redo with event log</span>
<span class="kw">type</span> Action = { type: <span class="str">'SET_AMOUNT'</span>; value: <span class="kw">string</span> }
  | { type: <span class="str">'SET_RECIPIENT'</span>; value: <span class="kw">string</span> }
  | { type: <span class="str">'RESET'</span> };

<span class="kw">interface</span> FormState { amount: <span class="kw">string</span>; recipient: <span class="kw">string</span>; }
<span class="kw">const</span> initialState: FormState = { amount: <span class="str">''</span>, recipient: <span class="str">''</span> };

<span class="kw">function</span> <span class="fn">reducer</span>(state: FormState, action: Action): FormState {
  <span class="kw">switch</span> (action.type) {
    <span class="kw">case</span> <span class="str">'SET_AMOUNT'</span>: <span class="kw">return</span> { ...state, amount: action.value };
    <span class="kw">case</span> <span class="str">'SET_RECIPIENT'</span>: <span class="kw">return</span> { ...state, recipient: action.value };
    <span class="kw">case</span> <span class="str">'RESET'</span>: <span class="kw">return</span> initialState;
  }
}

<span class="kw">const</span> history = ref&lt;Action[]&gt;([]);
<span class="kw">const</span> pointer = ref(0);

<span class="kw">function</span> <span class="fn">dispatch</span>(action: Action) {
  history.value = [...history.value.slice(0, pointer.value), action];
  pointer.value++;
}
<span class="kw">function</span> <span class="fn">undo</span>() { <span class="kw">if</span> (pointer.value &gt; 0) pointer.value--; }
<span class="kw">function</span> <span class="fn">redo</span>() { <span class="kw">if</span> (pointer.value &lt; history.value.length) pointer.value++; }

<span class="cmt">// Current state derived by replaying events</span>
<span class="kw">const</span> state = computed(() =&gt;
  history.value.slice(0, pointer.value).reduce(reducer, initialState)
);</pre>
      </div>
    </ConceptCard>

  </section>
</template>
