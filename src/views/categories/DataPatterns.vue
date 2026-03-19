<script setup>
import ConceptCard from '@/components/ConceptCard.vue'
</script>

<template>
  <section class="category" id="cat-data">
    <h2>Data Patterns</h2>

    <ConceptCard
      id="repository"
      title="Repository Pattern"
      badge-type="data"
      badge-label="Data"
    >
      <div class="one-liner">Mediate between domain and data mapping using a collection-like interface for aggregates.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
        <pre><span class="cmt">// SQL scattered across business logic</span>
<span class="kw">class</span> OrderService {
  getOrder(id) {
    <span class="kw">const</span> row = db.query(<span class="str">`SELECT * FROM orders WHERE id = ${id}`</span>);
    <span class="kw">const</span> items = db.query(<span class="str">`SELECT * FROM order_items WHERE order_id = ${id}`</span>);
    <span class="cmt">// Manual mapping everywhere, SQL injection risk</span>
  }
}</pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="kw">interface</span> OrderRepository {
  findById(id: string): Order;
  save(order: Order): void;
  findByCustomer(customerId: string): Order[];
}

<span class="kw">class</span> PostgresOrderRepo <span class="kw">implements</span> OrderRepository {
  findById(id) { <span class="cmt">/* SQL lives here, returns domain object */</span> }
}
<span class="cmt">// Domain code: this.orderRepo.findById(id) — no SQL knowledge</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Every ORM</strong> (TypeORM repos, Django managers, Hibernate), <strong>Spring Data JPA</strong> repositories with auto-generated queries.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// API service layer as repository — abstracts data source</span>
<span class="cmt">// src/modules/wallet/api/walletApi.ts</span>
<span class="kw">const</span> walletApi = {
  getAssets: () =&gt; api.get&lt;Asset[]&gt;(<span class="str">'/wallet/assets'</span>),
  getTransaction: (id: <span class="kw">string</span>) =&gt; api.get&lt;Tx&gt;(<span class="str">`/wallet/tx/${id}`</span>),
  transfer: (data: TransferDto) =&gt; api.post(<span class="str">'/wallet/transfer'</span>, data),
};

<span class="cmt">// TanStack Query as caching repository</span>
<span class="kw">function</span> <span class="fn">useAssets</span>() {
  <span class="kw">return</span> useQuery({
    queryKey: [<span class="str">'assets'</span>],
    queryFn: walletApi.getAssets,
    staleTime: 30_000,  <span class="cmt">// Cache for 30s</span>
  });
}
<span class="cmt">// Components call useAssets() — don't know if data is</span>
<span class="cmt">// from cache, network, or background refresh</span></pre>
      </div>
    </ConceptCard>

    <ConceptCard
      id="uow"
      title="Unit of Work"
      badge-type="data"
      badge-label="Data"
    >
      <div class="one-liner">Track all changes during a business transaction and commit them atomically.</div>
      <div class="section-label">Bad Approach</div>
      <div class="bad-box">
        <pre><span class="cmt">// Each operation is its own DB call — partial failures possible</span>
orderRepo.save(order);        <span class="cmt">// Succeeds</span>
inventoryRepo.update(stock);  <span class="cmt">// Fails! Order saved but stock not updated</span>
paymentRepo.save(payment);    <span class="cmt">// Never runs</span></pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="kw">class</span> UnitOfWork {
  <span class="kw">private</span> dirty = [];  <span class="kw">private</span> new$ = [];  <span class="kw">private</span> removed = [];

  markDirty(entity) { <span class="kw">this</span>.dirty.push(entity); }
  markNew(entity) { <span class="kw">this</span>.new$.push(entity); }

  <span class="kw">async</span> commit() {
    <span class="kw">const</span> tx = <span class="kw">await</span> db.beginTransaction();
    <span class="kw">try</span> {
      <span class="kw">for</span> (<span class="kw">const</span> e <span class="kw">of this</span>.new$) <span class="kw">await</span> tx.insert(e);
      <span class="kw">for</span> (<span class="kw">const</span> e <span class="kw">of this</span>.dirty) <span class="kw">await</span> tx.update(e);
      <span class="kw">await</span> tx.commit();
    } <span class="kw">catch</span> { <span class="kw">await</span> tx.rollback(); }
  }
}</pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Entity Framework's DbContext</strong>, <strong>Hibernate Session</strong>, <strong>SQLAlchemy Session</strong> — all implement Unit of Work internally.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Batch API calls with Promise.all — all or nothing</span>
<span class="kw">async function</span> <span class="fn">saveProfile</span>(changes: ProfileChanges) {
  <span class="kw">await</span> Promise.all([
    userApi.updateName(changes.name),
    userApi.updateAvatar(changes.avatar),
    userApi.updatePreferences(changes.prefs),
  ]); <span class="cmt">// All succeed together</span>
}

<span class="cmt">// Pinia $patch — atomic state update</span>
walletStore.$patch({
  balance: newBalance,
  lastUpdated: Date.now(),
  assets: updatedAssets,
}); <span class="cmt">// Single reactive update, one watcher trigger</span>

<span class="cmt">// Form dirty tracking — track what changed</span>
<span class="kw">const</span> formData = reactive({ name: <span class="str">''</span>, email: <span class="str">''</span> });
<span class="kw">const</span> original = ref(structuredClone(formData));
<span class="kw">const</span> isDirty = computed(() =&gt;
  JSON.stringify(formData) !== JSON.stringify(original.value)
);</pre>
      </div>
    </ConceptCard>

    <ConceptCard
      id="data-mapper"
      title="Data Mapper"
      badge-type="data"
      badge-label="Data"
    >
      <div class="one-liner">Transfer data between objects and DB while keeping them independent of each other.</div>
      <div class="section-label">Bad Approach (Active Record)</div>
      <div class="bad-box">
        <pre><span class="cmt">// Domain object knows about DB — coupled</span>
<span class="kw">class</span> User {
  save() { db.query(<span class="str">`INSERT INTO users...`</span>); }
  <span class="kw">static</span> find(id) { <span class="kw">return</span> db.query(<span class="str">`SELECT * FROM users WHERE id=${id}`</span>); }
}
<span class="cmt">// Testing User requires a database</span></pre>
      </div>
      <div class="section-label">Good Approach</div>
      <div class="good-box">
        <pre><span class="kw">class</span> User { name; email; } <span class="cmt">// Pure domain — no DB knowledge</span>

<span class="kw">class</span> UserMapper {
  toDomain(row) { <span class="kw">return new</span> User(row.user_name, row.email_addr); }
  toPersistence(user) { <span class="kw">return</span> { user_name: user.name, email_addr: user.email }; }
}
<span class="cmt">// Domain objects are pure, testable without DB</span></pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>TypeORM/Hibernate</strong> Data Mapper mode vs. Active Record. Preferred in DDD because domain stays clean.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// API response → domain model mapping</span>
<span class="kw">interface</span> ApiTx { tx_hash: <span class="kw">string</span>; amount_wei: <span class="kw">string</span>; ts: <span class="kw">number</span>; }
<span class="kw">interface</span> Transaction { hash: <span class="kw">string</span>; amount: <span class="kw">string</span>; date: Date; }

<span class="kw">function</span> <span class="fn">mapTransaction</span>(raw: ApiTx): Transaction {
  <span class="kw">return</span> {
    hash: raw.tx_hash,
    amount: weiToEth(raw.amount_wei),
    date: <span class="kw">new</span> Date(raw.ts * 1000),
  };
}

<span class="cmt">// toRaw() — strip Vue reactivity (domain → raw)</span>
<span class="kw">const</span> rawData = toRaw(reactiveState); <span class="cmt">// For API submission</span>

<span class="cmt">// markRaw() — prevent Vue from making it reactive</span>
<span class="kw">const</span> chart = markRaw(<span class="kw">new</span> ChartInstance()); <span class="cmt">// Skip proxy overhead</span></pre>
      </div>
    </ConceptCard>

  </section>
</template>
