<script setup>
import ConceptCard from '@/components/ConceptCard.vue'
</script>

<template>
  <section class="category" id="cat-grasp">
    <h2>GRASP Patterns</h2>

    <ConceptCard
      id="grasp"
      title="GRASP — General Responsibility Assignment"
      badge-type="principle"
      badge-label="Principle"
    >
      <div class="one-liner">Nine principles for deciding which class gets which responsibility.</div>
      <div class="section-label">The 9 Patterns</div>
      <div class="problem-box" style="border-left-color: var(--accent);">
        <strong>1. Information Expert</strong> — Assign responsibility to the class with the most info needed to fulfill it.<br>
        <strong>2. Creator</strong> — B creates A if B contains/aggregates A, closely uses A, or has init data for A.<br>
        <strong>3. Controller</strong> — A non-UI object handles system events (use-case controller or facade controller).<br>
        <strong>4. Low Coupling</strong> — Minimize dependencies between classes for resilience to change.<br>
        <strong>5. High Cohesion</strong> — Keep related responsibilities together; a class does one focused thing well.<br>
        <strong>6. Polymorphism</strong> — Use polymorphic methods instead of conditionals on type.<br>
        <strong>7. Pure Fabrication</strong> — Invent a class that doesn't represent a domain concept to achieve low coupling/high cohesion.<br>
        <strong>8. Indirection</strong> — Assign responsibility to an intermediate object to decouple two components.<br>
        <strong>9. Protected Variations</strong> — Wrap instability behind a stable interface.
      </div>
      <div class="section-label">Example 1: Information Expert</div>
      <div class="bad-box">
        <pre><span class="cmt">// BAD: External code calculates order total</span>
<span class="kw">function</span> <span class="fn">calcTotal</span>(order) {
  <span class="kw">return</span> order.items.reduce((sum, i) =&gt; sum + i.price * i.qty, 0)
}</pre>
      </div>
      <div class="good-box">
        <pre><span class="cmt">// GOOD: Order has the info, so Order calculates it</span>
<span class="kw">class</span> Order {
  <span class="fn">getTotal</span>() {
    <span class="kw">return this</span>.items.reduce((sum, i) =&gt; sum + i.price * i.qty, 0)
  }
}</pre>
      </div>

      <div class="section-label">Example 2: Creator</div>
      <div class="bad-box">
        <pre><span class="cmt">// BAD: Unrelated class creates LineItems</span>
<span class="kw">class</span> ReportPrinter {
  <span class="fn">addItemToOrder</span>(order, name, qty, price) {
    <span class="kw">const</span> item = <span class="kw">new</span> LineItem(name, qty, price)
    order.items.push(item)
  }
}</pre>
      </div>
      <div class="good-box">
        <pre><span class="cmt">// GOOD: Order contains LineItems → Order creates them</span>
<span class="kw">class</span> Order {
  <span class="fn">addItem</span>(name, qty, price) {
    <span class="kw">this</span>.items.push(<span class="kw">new</span> LineItem(name, qty, price))
  }
}</pre>
      </div>

      <div class="section-label">Example 3: Controller</div>
      <div class="bad-box">
        <pre><span class="cmt">// BAD: UI component handles business logic directly</span>
<span class="kw">class</span> CheckoutButton {
  <span class="fn">onClick</span>() {
    <span class="kw">this</span>.validateCart()
    <span class="kw">this</span>.applyDiscount()
    <span class="kw">this</span>.chargePayment()
    <span class="kw">this</span>.sendConfirmationEmail()
  }
}</pre>
      </div>
      <div class="good-box">
        <pre><span class="cmt">// GOOD: Controller object coordinates the use case</span>
<span class="kw">class</span> CheckoutController {
  <span class="fn">handleCheckout</span>(cart) {
    <span class="kw">this</span>.validator.validate(cart)
    <span class="kw">this</span>.pricing.applyDiscount(cart)
    <span class="kw">this</span>.payment.charge(cart.total)
    <span class="kw">this</span>.notifier.sendConfirmation(cart)
  }
}
<span class="cmt">// UI just calls: controller.handleCheckout(cart)</span></pre>
      </div>

      <div class="section-label">Example 4: Low Coupling</div>
      <div class="bad-box">
        <pre><span class="cmt">// BAD: Direct dependency on concrete payment provider</span>
<span class="kw">class</span> OrderService {
  <span class="fn">pay</span>(order) {
    <span class="kw">const</span> stripe = <span class="kw">new</span> StripeAPI(<span class="str">'sk_live_...'</span>)
    stripe.charges.create({ amount: order.total })
  }
}</pre>
      </div>
      <div class="good-box">
        <pre><span class="cmt">// GOOD: Depend on abstraction, not concrete class</span>
<span class="kw">class</span> OrderService {
  <span class="fn">constructor</span>(paymentGateway) {
    <span class="kw">this</span>.payment = paymentGateway
  }
  <span class="fn">pay</span>(order) {
    <span class="kw">this</span>.payment.charge(order.total)
  }
}</pre>
      </div>

      <div class="section-label">Example 5: High Cohesion</div>
      <div class="bad-box">
        <pre><span class="cmt">// BAD: God class does everything</span>
<span class="kw">class</span> UserManager {
  <span class="fn">authenticate</span>(email, pw) { <span class="cmt">/* ... */</span> }
  <span class="fn">sendEmail</span>(to, body) { <span class="cmt">/* ... */</span> }
  <span class="fn">generateReport</span>() { <span class="cmt">/* ... */</span> }
  <span class="fn">resizeAvatar</span>(img) { <span class="cmt">/* ... */</span> }
}</pre>
      </div>
      <div class="good-box">
        <pre><span class="cmt">// GOOD: Each class has one focused responsibility</span>
<span class="kw">class</span> AuthService   { <span class="fn">authenticate</span>(email, pw) { <span class="cmt">/* ... */</span> } }
<span class="kw">class</span> Mailer        { <span class="fn">send</span>(to, body) { <span class="cmt">/* ... */</span> } }
<span class="kw">class</span> ReportBuilder { <span class="fn">generate</span>() { <span class="cmt">/* ... */</span> } }
<span class="kw">class</span> ImageService  { <span class="fn">resize</span>(img) { <span class="cmt">/* ... */</span> } }</pre>
      </div>

      <div class="section-label">Example 6: Polymorphism</div>
      <div class="bad-box">
        <pre><span class="cmt">// BAD: Conditional logic on type</span>
<span class="kw">function</span> <span class="fn">getArea</span>(shape) {
  <span class="kw">if</span> (shape.type === <span class="str">'circle'</span>)
    <span class="kw">return</span> Math.PI * shape.r ** 2
  <span class="kw">if</span> (shape.type === <span class="str">'rect'</span>)
    <span class="kw">return</span> shape.w * shape.h
  <span class="cmt">// every new shape → another if-branch</span>
}</pre>
      </div>
      <div class="good-box">
        <pre><span class="cmt">// GOOD: Each shape knows how to compute its own area</span>
<span class="kw">class</span> Circle {
  <span class="fn">getArea</span>() { <span class="kw">return</span> Math.PI * <span class="kw">this</span>.r ** 2 }
}
<span class="kw">class</span> Rect {
  <span class="fn">getArea</span>() { <span class="kw">return this</span>.w * <span class="kw">this</span>.h }
}
<span class="cmt">// New shape? Just add a class with getArea()</span></pre>
      </div>

      <div class="section-label">Example 7: Pure Fabrication</div>
      <div class="bad-box">
        <pre><span class="cmt">// BAD: Domain object handles its own persistence</span>
<span class="kw">class</span> Invoice {
  <span class="fn">save</span>() {
    db.query(<span class="str">`INSERT INTO invoices ...`</span>)
  }
}</pre>
      </div>
      <div class="good-box">
        <pre><span class="cmt">// GOOD: Fabricated class separates persistence concern</span>
<span class="kw">class</span> Invoice { <span class="cmt">/* pure domain logic */</span> }

<span class="kw">class</span> InvoiceRepository {
  <span class="fn">save</span>(invoice) {
    db.query(<span class="str">`INSERT INTO invoices ...`</span>)
  }
}
<span class="cmt">// InvoiceRepository is not a domain concept — it's a</span>
<span class="cmt">// fabrication to keep Invoice cohesive &amp; decoupled from DB</span></pre>
      </div>

      <div class="section-label">Example 8: Indirection</div>
      <div class="bad-box">
        <pre><span class="cmt">// BAD: Components talk directly to each other</span>
<span class="kw">class</span> TaxCalculator {
  <span class="fn">compute</span>(items) {
    <span class="kw">const</span> rates = <span class="kw">new</span> USATaxRateProvider().getRates()
    <span class="cmt">// tightly coupled to US tax provider</span>
  }
}</pre>
      </div>
      <div class="good-box">
        <pre><span class="cmt">// GOOD: Intermediate service decouples the two</span>
<span class="kw">class</span> TaxRateService {
  <span class="fn">constructor</span>(provider) { <span class="kw">this</span>.provider = provider }
  <span class="fn">getRates</span>() { <span class="kw">return this</span>.provider.getRates() }
}

<span class="kw">class</span> TaxCalculator {
  <span class="fn">constructor</span>(taxService) { <span class="kw">this</span>.tax = taxService }
  <span class="fn">compute</span>(items) {
    <span class="kw">const</span> rates = <span class="kw">this</span>.tax.getRates()
  }
}
<span class="cmt">// TaxRateService is the indirection layer</span></pre>
      </div>

      <div class="section-label">Example 9: Protected Variations</div>
      <div class="bad-box">
        <pre><span class="cmt">// BAD: Code depends on a specific storage implementation</span>
localStorage.setItem(<span class="str">'token'</span>, token)
<span class="kw">const</span> t = localStorage.getItem(<span class="str">'token'</span>)
<span class="cmt">// Switching to cookie/session storage → change every call site</span></pre>
      </div>
      <div class="good-box">
        <pre><span class="cmt">// GOOD: Stable interface wraps the volatile part</span>
<span class="kw">class</span> TokenStore {
  <span class="fn">save</span>(token)  { localStorage.setItem(<span class="str">'token'</span>, token) }
  <span class="fn">load</span>()       { <span class="kw">return</span> localStorage.getItem(<span class="str">'token'</span>) }
  <span class="fn">clear</span>()      { localStorage.removeItem(<span class="str">'token'</span>) }
}
<span class="cmt">// Swap to cookies? Change only TokenStore internals.</span></pre>
      </div>

      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Pure Fabrication:</strong> <code>OrderRepository</code> is not a domain concept but is fabricated to separate persistence from domain logic, achieving low coupling.</div>
      <div class="real-world"><strong>Protected Variations:</strong> Payment gateways (Stripe, PayPal) hide behind a <code>PaymentProvider</code> interface — switching providers requires no changes to checkout logic.</div>
      <div class="real-world"><strong>Indirection:</strong> An event bus or message broker decouples producers from consumers, so either side can evolve independently.</div>

      <div class="section-label">Vue 3 / TS Examples</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Information Expert — component with data computes derived state</span>
<span class="kw">const</span> totalBalance = computed(() =&gt;
  assets.value.reduce((sum, a) =&gt; Big(sum).plus(a.balanceUsd).toString(), <span class="str">'0'</span>)
)

<span class="cmt">// Creator — parent creates child data, passes via props</span>
<span class="cmt">// TransactionGroups.vue receives groups[] from parent that creates them</span>

<span class="cmt">// Controller — Pinia store coordinates the use case</span>
<span class="kw">const</span> useWalletStore = defineStore(<span class="str">'wallet'</span>, () =&gt; {
  <span class="kw">const</span> assets = ref([])
  <span class="kw">const</span> toggleVisibility = () =&gt; { <span class="cmt">/* coordinates UI + state */</span> }
  <span class="kw">return</span> { assets, toggleVisibility }
})

<span class="cmt">// Low Coupling — composable accepts generic params, not a specific store</span>
<span class="kw">function</span> <span class="fn">useFilter</span>(items: Ref&lt;any[]&gt;, predicate: (i: any) =&gt; boolean) {
  <span class="kw">return</span> computed(() =&gt; items.value.filter(predicate))
}

<span class="cmt">// High Cohesion — composable does one thing only</span>
<span class="kw">function</span> <span class="fn">useSearch</span>(items: Ref&lt;any[]&gt;, query: Ref&lt;string&gt;) {
  <span class="kw">return</span> computed(() =&gt;
    items.value.filter(i =&gt; i.name.includes(query.value))
  )
}

<span class="cmt">// Polymorphism — dynamic component picks renderer by type</span>
<span class="cmt">// &lt;component :is="widgetMap[widget.type]" v-bind="widget.props" /&gt;</span>

<span class="cmt">// Pure Fabrication — useLocalStorage is not a domain concept</span>
<span class="kw">function</span> <span class="fn">useLocalStorage</span>(key: string, fallback: any) {
  <span class="kw">const</span> data = ref(JSON.parse(localStorage.getItem(key) ?? <span class="str">'null'</span>) ?? fallback)
  watch(data, (v) =&gt; localStorage.setItem(key, JSON.stringify(v)), { deep: <span class="kw">true</span> })
  <span class="kw">return</span> data
}

<span class="cmt">// Indirection — event bus decouples sibling components</span>
<span class="kw">const</span> bus = mitt()
bus.emit(<span class="str">'cart:updated'</span>, cart)   <span class="cmt">// producer</span>
bus.on(<span class="str">'cart:updated'</span>, refresh)   <span class="cmt">// consumer — no direct import</span>

<span class="cmt">// Protected Variations — adapter wraps unstable API</span>
<span class="kw">const</span> http = { <span class="fn">get</span>: axios.get, <span class="fn">post</span>: axios.post }
<span class="cmt">// Swap axios for fetch? Change only this adapter object.</span></pre>
      </div>
    </ConceptCard>
  </section>
</template>
