<script setup>
import { ref, computed } from 'vue'
import { SlotTable, SlotTableColumn, SlotTableColumnGroup } from './index.js'

// ── Data ──────────────────────────────────────────────
const employees = ref([
  { id: 1, name: 'Alice Johnson', age: 28, role: 'Engineer', department: 'Frontend', salary: 95000, status: 'active' },
  { id: 2, name: 'Bob Smith', age: 34, role: 'Designer', department: 'UX', salary: 88000, status: 'active' },
  { id: 3, name: 'Carol Williams', age: 41, role: 'Manager', department: 'Engineering', salary: 120000, status: 'active' },
  { id: 4, name: 'David Brown', age: 25, role: 'Intern', department: 'Backend', salary: 45000, status: 'inactive' },
  { id: 5, name: 'Eva Martinez', age: 31, role: 'Engineer', department: 'Backend', salary: 102000, status: 'active' },
  { id: 6, name: 'Frank Lee', age: 37, role: 'Designer', department: 'Product', salary: 92000, status: 'active' },
  { id: 7, name: 'Grace Kim', age: 29, role: 'Engineer', department: 'Frontend', salary: 98000, status: 'active' },
  { id: 8, name: 'Henry Chen', age: 45, role: 'Director', department: 'Engineering', salary: 145000, status: 'active' },
])

const products = ref([
  { sku: 'WDG-001', name: 'Wireless Headphones', category: 'Audio', price: 79.99, stock: 234, rating: 4.5 },
  { sku: 'WDG-002', name: 'Mechanical Keyboard', category: 'Input', price: 149.99, stock: 89, rating: 4.8 },
  { sku: 'WDG-003', name: 'USB-C Hub', category: 'Accessories', price: 49.99, stock: 412, rating: 4.2 },
  { sku: 'WDG-004', name: '4K Monitor', category: 'Display', price: 399.99, stock: 56, rating: 4.7 },
  { sku: 'WDG-005', name: 'Webcam HD', category: 'Video', price: 69.99, stock: 178, rating: 4.1 },
  { sku: 'WDG-006', name: 'Mouse Pad XL', category: 'Accessories', price: 24.99, stock: 0, rating: 4.6 },
])

const emptyRows = ref([])

// ── Sorting ───────────────────────────────────────────
const sortColumn = ref(null)
const sortDir = ref('asc')

const sortableColumns = ['name', 'age', 'role', 'department', 'salary']

const sortedEmployees = computed(() => {
  if (sortColumn.value === null) return employees.value
  const col = sortableColumns[sortColumn.value]
  if (!col) return employees.value
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...employees.value].sort((a, b) => {
    if (a[col] < b[col]) return -1 * dir
    if (a[col] > b[col]) return 1 * dir
    return 0
  })
})

function onSortClick(columnIndex) {
  if (sortColumn.value === columnIndex) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = columnIndex
    sortDir.value = 'asc'
  }
}

function sortIndicator(columnIndex) {
  if (sortColumn.value !== columnIndex) return ' \u2195'
  return sortDir.value === 'asc' ? ' \u2191' : ' \u2193'
}

// ── Row click ─────────────────────────────────────────
const clickedRow = ref(null)
function onRowClick(index, row) {
  clickedRow.value = row
}

// ── Helpers ───────────────────────────────────────────
function currency(val) {
  return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function stars(rating) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  return '\u2605'.repeat(full) + (half ? '\u00BD' : '') + ' ' + rating.toFixed(1)
}

function statusRowClass(row) {
  return row.status === 'inactive' ? 'row-inactive' : ''
}
</script>

<template>
  <div class="page">
    <header class="hero">
      <h1>vue-slottable</h1>
      <p class="tagline">A flexible, slot-based table component for Vue 3</p>
      <div class="badges">
        <a href="https://www.npmjs.com/package/vue-slottable"><img src="https://img.shields.io/npm/v/vue-slottable.svg" alt="npm" /></a>
        <a href="https://github.com/muraliavarma/vue-slot-table"><img src="https://img.shields.io/github/license/muraliavarma/vue-slot-table.svg" alt="license" /></a>
      </div>
    </header>

    <!-- ─────────────────────────────────────────────── -->
    <section class="example">
      <h2>Basic Table</h2>
      <p>The simplest usage — define columns with <code>#header</code> and <code>#cell</code> slots.</p>
      <div class="demo">
        <SlotTable :rows="employees.slice(0, 4)" table-class="t">
          <SlotTableColumn>
            <template #header>Name</template>
            <template #cell="{ row }">{{ row.name }}</template>
          </SlotTableColumn>
          <SlotTableColumn>
            <template #header>Role</template>
            <template #cell="{ row }">{{ row.role }}</template>
          </SlotTableColumn>
          <SlotTableColumn>
            <template #header>Department</template>
            <template #cell="{ row }">{{ row.department }}</template>
          </SlotTableColumn>
        </SlotTable>
      </div>
      <details class="code-block">
        <summary>View code</summary>
        <pre><code>&lt;SlotTable :rows="employees" table-class="my-table"&gt;
  &lt;SlotTableColumn&gt;
    &lt;template #header&gt;Name&lt;/template&gt;
    &lt;template #cell="{ row }"&gt;&#123;&#123; row.name &#125;&#125;&lt;/template&gt;
  &lt;/SlotTableColumn&gt;
  &lt;SlotTableColumn&gt;
    &lt;template #header&gt;Role&lt;/template&gt;
    &lt;template #cell="{ row }"&gt;&#123;&#123; row.role &#125;&#125;&lt;/template&gt;
  &lt;/SlotTableColumn&gt;
&lt;/SlotTable&gt;</code></pre>
      </details>
    </section>

    <!-- ─────────────────────────────────────────────── -->
    <section class="example">
      <h2>Custom Cell Rendering</h2>
      <p>Use any HTML or Vue components inside cell slots. The scoped slot receives <code>{ row, rowIndex, columnIndex }</code>.</p>
      <div class="demo">
        <SlotTable :rows="products" table-class="t" hoverable>
          <SlotTableColumn width="100px">
            <template #header>SKU</template>
            <template #cell="{ row }"><code>{{ row.sku }}</code></template>
          </SlotTableColumn>
          <SlotTableColumn>
            <template #header>Product</template>
            <template #cell="{ row }"><strong>{{ row.name }}</strong></template>
          </SlotTableColumn>
          <SlotTableColumn>
            <template #header>Category</template>
            <template #cell="{ row }">
              <span class="pill" :class="'pill--' + row.category.toLowerCase()">{{ row.category }}</span>
            </template>
          </SlotTableColumn>
          <SlotTableColumn align="right">
            <template #header>Price</template>
            <template #cell="{ row }">{{ currency(row.price) }}</template>
          </SlotTableColumn>
          <SlotTableColumn align="center">
            <template #header>Rating</template>
            <template #cell="{ row }">
              <span class="stars">{{ stars(row.rating) }}</span>
            </template>
          </SlotTableColumn>
          <SlotTableColumn align="right">
            <template #header>Stock</template>
            <template #cell="{ row }">
              <span :class="{ 'out-of-stock': row.stock === 0 }">
                {{ row.stock === 0 ? 'Out of stock' : row.stock }}
              </span>
            </template>
          </SlotTableColumn>
        </SlotTable>
      </div>
      <details class="code-block">
        <summary>View code</summary>
        <pre><code>&lt;SlotTable :rows="products" hoverable&gt;
  &lt;SlotTableColumn align="right"&gt;
    &lt;template #header&gt;Price&lt;/template&gt;
    &lt;template #cell="{ row }"&gt;&#123;&#123; currency(row.price) &#125;&#125;&lt;/template&gt;
  &lt;/SlotTableColumn&gt;
  &lt;SlotTableColumn align="center"&gt;
    &lt;template #header&gt;Stock&lt;/template&gt;
    &lt;template #cell="{ row }"&gt;
      &lt;span :class="{ 'out-of-stock': row.stock === 0 }"&gt;
        &#123;&#123; row.stock === 0 ? "Out of stock" : row.stock &#125;&#125;
      &lt;/span&gt;
    &lt;/template&gt;
  &lt;/SlotTableColumn&gt;
&lt;/SlotTable&gt;</code></pre>
      </details>
    </section>

    <!-- ─────────────────────────────────────────────── -->
    <section class="example">
      <h2>Striped &amp; Bordered</h2>
      <p>Add <code>striped</code> and <code>bordered</code> props for classic table styling.</p>
      <div class="demo">
        <SlotTable :rows="employees.slice(0, 5)" table-class="t" striped bordered>
          <SlotTableColumn>
            <template #header>Name</template>
            <template #cell="{ row }">{{ row.name }}</template>
          </SlotTableColumn>
          <SlotTableColumn align="center">
            <template #header>Age</template>
            <template #cell="{ row }">{{ row.age }}</template>
          </SlotTableColumn>
          <SlotTableColumn>
            <template #header>Department</template>
            <template #cell="{ row }">{{ row.department }}</template>
          </SlotTableColumn>
          <SlotTableColumn align="right">
            <template #header>Salary</template>
            <template #cell="{ row }">{{ currency(row.salary) }}</template>
          </SlotTableColumn>
        </SlotTable>
      </div>
      <details class="code-block">
        <summary>View code</summary>
        <pre><code>&lt;SlotTable :rows="employees" striped bordered&gt;
  &lt;!-- columns... --&gt;
&lt;/SlotTable&gt;</code></pre>
      </details>
    </section>

    <!-- ─────────────────────────────────────────────── -->
    <section class="example">
      <h2>Sorting (via header-click)</h2>
      <p>Use the <code>@header-click</code> event to implement sorting. Click any column header to sort.</p>
      <div class="demo">
        <SlotTable
          :rows="sortedEmployees"
          table-class="t"
          hoverable
          row-key="id"
          @header-click="onSortClick"
        >
          <SlotTableColumn>
            <template #header><span class="sortable">Name{{ sortIndicator(0) }}</span></template>
            <template #cell="{ row }">{{ row.name }}</template>
          </SlotTableColumn>
          <SlotTableColumn align="center">
            <template #header><span class="sortable">Age{{ sortIndicator(1) }}</span></template>
            <template #cell="{ row }">{{ row.age }}</template>
          </SlotTableColumn>
          <SlotTableColumn>
            <template #header><span class="sortable">Role{{ sortIndicator(2) }}</span></template>
            <template #cell="{ row }">{{ row.role }}</template>
          </SlotTableColumn>
          <SlotTableColumn>
            <template #header><span class="sortable">Department{{ sortIndicator(3) }}</span></template>
            <template #cell="{ row }">{{ row.department }}</template>
          </SlotTableColumn>
          <SlotTableColumn align="right">
            <template #header><span class="sortable">Salary{{ sortIndicator(4) }}</span></template>
            <template #cell="{ row }">{{ currency(row.salary) }}</template>
          </SlotTableColumn>
        </SlotTable>
      </div>
      <details class="code-block">
        <summary>View code</summary>
        <pre><code>&lt;SlotTable :rows="sortedEmployees" @header-click="onSortClick"&gt;
  &lt;SlotTableColumn&gt;
    &lt;template #header&gt;Name &#123;&#123; sortIndicator(0) &#125;&#125;&lt;/template&gt;
    &lt;template #cell="{ row }"&gt;&#123;&#123; row.name &#125;&#125;&lt;/template&gt;
  &lt;/SlotTableColumn&gt;
&lt;/SlotTable&gt;

&lt;script setup&gt;
const sortColumn = ref(null)
const sortDir = ref('asc')

function onSortClick(columnIndex) {
  if (sortColumn.value === columnIndex) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = columnIndex
    sortDir.value = 'asc'
  }
}

const sortedEmployees = computed(() =&gt; {
  // sort logic based on sortColumn and sortDir
})
&lt;/script&gt;</code></pre>
      </details>
    </section>

    <!-- ─────────────────────────────────────────────── -->
    <section class="example">
      <h2>Row Click &amp; Dynamic Row Classes</h2>
      <p>Handle row clicks with <code>@row-click</code> and apply dynamic classes with <code>:row-class</code>. Inactive rows are dimmed.</p>
      <div class="demo">
        <div v-if="clickedRow" class="click-banner">
          Clicked: <strong>{{ clickedRow.name }}</strong> ({{ clickedRow.role }})
        </div>
        <SlotTable
          :rows="employees"
          table-class="t"
          hoverable
          :row-class="statusRowClass"
          @row-click="onRowClick"
        >
          <SlotTableColumn>
            <template #header>Name</template>
            <template #cell="{ row }">{{ row.name }}</template>
          </SlotTableColumn>
          <SlotTableColumn>
            <template #header>Role</template>
            <template #cell="{ row }">{{ row.role }}</template>
          </SlotTableColumn>
          <SlotTableColumn>
            <template #header>Status</template>
            <template #cell="{ row }">
              <span class="status-dot" :class="'status--' + row.status" />
              {{ row.status }}
            </template>
          </SlotTableColumn>
          <SlotTableColumn align="right">
            <template #header>Salary</template>
            <template #cell="{ row }">{{ currency(row.salary) }}</template>
          </SlotTableColumn>
        </SlotTable>
      </div>
      <details class="code-block">
        <summary>View code</summary>
        <pre><code>&lt;SlotTable
  :rows="employees"
  hoverable
  :row-class="(row) =&gt; row.status === 'inactive' ? 'row-inactive' : ''"
  @row-click="(index, row) =&gt; console.log(row)"
&gt;
  &lt;!-- columns... --&gt;
&lt;/SlotTable&gt;</code></pre>
      </details>
    </section>

    <!-- ─────────────────────────────────────────────── -->
    <section class="example">
      <h2>Sticky Columns</h2>
      <p>Pin columns to the left or right edge with <code>sticky="left"</code> or <code>sticky="right"</code>. Scroll horizontally to see the effect.</p>
      <div class="demo scroll-container">
        <SlotTable :rows="employees" table-class="t t-wide" hoverable>
          <SlotTableColumn sticky="left" min-width="200px">
            <template #header>Name (sticky)</template>
            <template #cell="{ row }"><strong>{{ row.name }}</strong></template>
          </SlotTableColumn>
          <SlotTableColumn min-width="200px">
            <template #header>Role</template>
            <template #cell="{ row }">{{ row.role }}</template>
          </SlotTableColumn>
          <SlotTableColumn min-width="200px">
            <template #header>Department</template>
            <template #cell="{ row }">{{ row.department }}</template>
          </SlotTableColumn>
          <SlotTableColumn min-width="150px" align="center">
            <template #header>Age</template>
            <template #cell="{ row }">{{ row.age }}</template>
          </SlotTableColumn>
          <SlotTableColumn min-width="200px">
            <template #header>Status</template>
            <template #cell="{ row }">{{ row.status }}</template>
          </SlotTableColumn>
          <SlotTableColumn sticky="right" min-width="150px" align="right">
            <template #header>Salary (sticky)</template>
            <template #cell="{ row }">{{ currency(row.salary) }}</template>
          </SlotTableColumn>
        </SlotTable>
      </div>
      <details class="code-block">
        <summary>View code</summary>
        <pre><code>&lt;SlotTable :rows="employees"&gt;
  &lt;SlotTableColumn sticky="left"&gt;
    &lt;template #header&gt;Name&lt;/template&gt;
    &lt;template #cell="{ row }"&gt;&#123;&#123; row.name &#125;&#125;&lt;/template&gt;
  &lt;/SlotTableColumn&gt;

  &lt;!-- scrollable columns in the middle --&gt;

  &lt;SlotTableColumn sticky="right" align="right"&gt;
    &lt;template #header&gt;Salary&lt;/template&gt;
    &lt;template #cell="{ row }"&gt;&#123;&#123; currency(row.salary) &#125;&#125;&lt;/template&gt;
  &lt;/SlotTableColumn&gt;
&lt;/SlotTable&gt;</code></pre>
      </details>
    </section>

    <!-- ─────────────────────────────────────────────── -->
    <section class="example">
      <h2>Column Groups</h2>
      <p>Add grouped header rows with <code>&lt;SlotTableColumnGroup&gt;</code> and <code>:colspan</code>.</p>
      <div class="demo">
        <SlotTable :rows="employees.slice(0, 5)" table-class="t" bordered>
          <SlotTableColumnGroup :colspan="2">Identity</SlotTableColumnGroup>
          <SlotTableColumnGroup :colspan="2">Position</SlotTableColumnGroup>
          <SlotTableColumnGroup :colspan="1">Compensation</SlotTableColumnGroup>

          <SlotTableColumn>
            <template #header>Name</template>
            <template #cell="{ row }">{{ row.name }}</template>
          </SlotTableColumn>
          <SlotTableColumn align="center">
            <template #header>Age</template>
            <template #cell="{ row }">{{ row.age }}</template>
          </SlotTableColumn>
          <SlotTableColumn>
            <template #header>Role</template>
            <template #cell="{ row }">{{ row.role }}</template>
          </SlotTableColumn>
          <SlotTableColumn>
            <template #header>Department</template>
            <template #cell="{ row }">{{ row.department }}</template>
          </SlotTableColumn>
          <SlotTableColumn align="right">
            <template #header>Salary</template>
            <template #cell="{ row }">{{ currency(row.salary) }}</template>
          </SlotTableColumn>
        </SlotTable>
      </div>
      <details class="code-block">
        <summary>View code</summary>
        <pre><code>&lt;SlotTable :rows="employees"&gt;
  &lt;SlotTableColumnGroup :colspan="2"&gt;Identity&lt;/SlotTableColumnGroup&gt;
  &lt;SlotTableColumnGroup :colspan="2"&gt;Position&lt;/SlotTableColumnGroup&gt;

  &lt;SlotTableColumn&gt;
    &lt;template #header&gt;Name&lt;/template&gt;
    &lt;template #cell="{ row }"&gt;&#123;&#123; row.name &#125;&#125;&lt;/template&gt;
  &lt;/SlotTableColumn&gt;
  &lt;!-- more columns... --&gt;
&lt;/SlotTable&gt;</code></pre>
      </details>
    </section>

    <!-- ─────────────────────────────────────────────── -->
    <section class="example">
      <h2>Empty State</h2>
      <p>Provide an <code>#empty</code> slot to display when there are no rows.</p>
      <div class="demo">
        <SlotTable :rows="emptyRows" table-class="t">
          <template #empty>
            <div class="empty-state">
              <div class="empty-icon">&#128269;</div>
              <p><strong>No data found</strong></p>
              <p>Try adjusting your search or filters.</p>
            </div>
          </template>
          <SlotTableColumn>
            <template #header>Name</template>
            <template #cell="{ row }">{{ row.name }}</template>
          </SlotTableColumn>
          <SlotTableColumn>
            <template #header>Email</template>
            <template #cell="{ row }">{{ row.email }}</template>
          </SlotTableColumn>
          <SlotTableColumn>
            <template #header>Status</template>
            <template #cell="{ row }">{{ row.status }}</template>
          </SlotTableColumn>
        </SlotTable>
      </div>
      <details class="code-block">
        <summary>View code</summary>
        <pre><code>&lt;SlotTable :rows="[]"&gt;
  &lt;template #empty&gt;
    &lt;div class="empty-state"&gt;
      &lt;p&gt;No data found&lt;/p&gt;
    &lt;/div&gt;
  &lt;/template&gt;
  &lt;!-- columns still defined for headers --&gt;
&lt;/SlotTable&gt;</code></pre>
      </details>
    </section>

    <!-- ─────────────────────────────────────────────── -->
    <section class="example">
      <h2>Column Width &amp; Alignment</h2>
      <p>Control column sizing with <code>width</code> and <code>min-width</code> props. Set text alignment with <code>align</code>.</p>
      <div class="demo">
        <SlotTable :rows="products.slice(0, 4)" table-class="t" striped>
          <SlotTableColumn width="80px" align="center">
            <template #header>#</template>
            <template #cell="{ rowIndex }">{{ rowIndex + 1 }}</template>
          </SlotTableColumn>
          <SlotTableColumn min-width="200px">
            <template #header>Product</template>
            <template #cell="{ row }">{{ row.name }}</template>
          </SlotTableColumn>
          <SlotTableColumn width="120px" align="center">
            <template #header>Category</template>
            <template #cell="{ row }">{{ row.category }}</template>
          </SlotTableColumn>
          <SlotTableColumn width="100px" align="right">
            <template #header>Price</template>
            <template #cell="{ row }">{{ currency(row.price) }}</template>
          </SlotTableColumn>
          <SlotTableColumn width="80px" align="right">
            <template #header>Stock</template>
            <template #cell="{ row }">{{ row.stock }}</template>
          </SlotTableColumn>
        </SlotTable>
      </div>
      <details class="code-block">
        <summary>View code</summary>
        <pre><code>&lt;SlotTableColumn width="80px" align="center"&gt;
  &lt;template #header&gt;#&lt;/template&gt;
  &lt;template #cell="{ rowIndex }"&gt;&#123;&#123; rowIndex + 1 &#125;&#125;&lt;/template&gt;
&lt;/SlotTableColumn&gt;
&lt;SlotTableColumn width="100px" align="right"&gt;
  &lt;template #header&gt;Price&lt;/template&gt;
  &lt;template #cell="{ row }"&gt;&#123;&#123; currency(row.price) &#125;&#125;&lt;/template&gt;
&lt;/SlotTableColumn&gt;</code></pre>
      </details>
    </section>

    <!-- ─────────────────────────────────────────────── -->
    <footer class="footer">
      <p>
        <a href="https://github.com/muraliavarma/vue-slot-table">GitHub</a>
        &middot;
        <a href="https://www.npmjs.com/package/vue-slottable">npm</a>
        &middot;
        MIT License
      </p>
    </footer>
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f8f9fa;
  color: #1a1a2e;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1.5rem 3rem;
}

/* ── Hero ──────────────────────────────────────────── */
.hero {
  text-align: center;
  padding: 3rem 0 2rem;
}

.hero h1 {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.tagline {
  color: #64748b;
  font-size: 1.15rem;
  margin-top: 0.25rem;
}

.badges {
  margin-top: 0.75rem;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.badges img {
  height: 20px;
}

/* ── Example sections ──────────────────────────────── */
.example {
  margin-top: 2.5rem;
}

.example h2 {
  font-size: 1.35rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.example > p {
  color: #64748b;
  font-size: 0.925rem;
  margin-bottom: 0.75rem;
}

.demo {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
}

/* ── Table styles ──────────────────────────────────── */
.t {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.t th,
.t td {
  padding: 0.6rem 0.85rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  background: white;
}

.t thead th {
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
  border-bottom: 2px solid #cbd5e1;
}

.t-wide {
  min-width: 1100px;
}

/* ── Slot-table built-in classes ───────────────────── */
.slot-table-striped td {
  background: #f8fafc;
}

.slot-table-hoverable {
  cursor: pointer;
  transition: background 0.15s;
}

.slot-table-hoverable:hover td {
  background: #eff6ff;
}

.slot-table-bordered td,
.slot-table-bordered th {
  border: 1px solid #e2e8f0;
}

.slot-table-empty {
  text-align: center;
  padding: 2rem !important;
}

/* ── Sticky column backgrounds ─────────────────────── */
.t .sticky-left,
.t .sticky-right {
  background: white;
  box-shadow: 2px 0 4px -2px rgba(0,0,0,0.06);
}

.t .sticky-right {
  box-shadow: -2px 0 4px -2px rgba(0,0,0,0.06);
}

/* ── Misc element styles ───────────────────────────── */
.pill {
  display: inline-block;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 500;
}

.pill--audio { background: #dbeafe; color: #1e40af; }
.pill--input { background: #fce7f3; color: #9d174d; }
.pill--accessories { background: #d1fae5; color: #065f46; }
.pill--display { background: #fef3c7; color: #92400e; }
.pill--video { background: #e0e7ff; color: #3730a3; }

.stars {
  color: #f59e0b;
  font-size: 0.85rem;
}

.out-of-stock {
  color: #ef4444;
  font-weight: 600;
  font-size: 0.8rem;
}

.sortable {
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.click-banner {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  padding: 0.5rem 0.85rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #1e40af;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.35rem;
  vertical-align: middle;
}

.status--active { background: #22c55e; }
.status--inactive { background: #94a3b8; }

.row-inactive td {
  opacity: 0.5;
}

.empty-state {
  padding: 1rem;
  color: #94a3b8;
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

/* ── Code blocks ───────────────────────────────────── */
.code-block {
  margin-top: 0.5rem;
}

.code-block summary {
  font-size: 0.8rem;
  color: #94a3b8;
  cursor: pointer;
  user-select: none;
}

.code-block pre {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.8rem;
  line-height: 1.5;
  margin-top: 0.4rem;
}

code {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, monospace;
  font-size: 0.85em;
}

p code {
  background: #f1f5f9;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  font-size: 0.82em;
}

/* ── Footer ────────────────────────────────────────── */
.footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  font-size: 0.85rem;
  color: #94a3b8;
}

.footer a {
  color: #64748b;
  text-decoration: none;
}

.footer a:hover {
  color: #1e40af;
}
</style>
