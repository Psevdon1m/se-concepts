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
      <div class="section-label">Example: Information Expert</div>
      <div class="bad-box">
        <pre><span class="cmt">// BAD: External code calculates order total</span>
<span class="kw">function</span> <span class="fn">calcTotal</span>(order) {
  <span class="kw">return</span> order.items.reduce((sum, i) => sum + i.price * i.qty, 0);
}</pre>
      </div>
      <div class="good-box">
        <pre><span class="cmt">// GOOD: Order has the info, so Order calculates it</span>
<span class="kw">class</span> Order {
  <span class="fn">getTotal</span>() {
    <span class="kw">return this</span>.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }
}</pre>
      </div>
      <div class="section-label">Real-World</div>
      <div class="real-world"><strong>Pure Fabrication example:</strong> <code>OrderRepository</code> is not a domain concept but is fabricated to separate persistence from domain logic, achieving low coupling.</div>
      <div class="section-label">Vue 3 / TS Example</div>
      <div class="vue-box">
        <div class="vue-label">Vue 3 / TS</div>
        <pre><span class="cmt">// Information Expert — component with data computes derived state</span>
<span class="cmt">// WalletView.vue has assets → it computes total balance</span>
<span class="kw">const</span> totalBalance = computed(() =&gt;
  assets.value.reduce((sum, a) =&gt; Big(sum).plus(a.balanceUsd).toString(), <span class="str">'0'</span>)
);

<span class="cmt">// Creator — parent component creates child's data</span>
<span class="cmt">// TransactionGroups.vue receives groups[] from parent that creates them</span>

<span class="cmt">// Controller — Pinia store as the coordinator</span>
<span class="kw">const</span> useWalletStore = defineStore(<span class="str">'wallet'</span>, () =&gt; {
  <span class="kw">const</span> assets = ref([]);
  <span class="kw">const</span> toggleVisibility = () =&gt; { <span class="cmt">/* coordinates UI + state */</span> };
  <span class="kw">return</span> { assets, toggleVisibility };
});

<span class="cmt">// Low Coupling — composable doesn't import specific store</span>
<span class="cmt">// High Cohesion — useSearch only handles search concerns</span></pre>
      </div>
    </ConceptCard>
  </section>
</template>
