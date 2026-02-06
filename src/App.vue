<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { SlotTable, SlotTableColumn, SlotTableColumnGroup } from './index.js'

// ── Demo Data ────────────────────────────────────────
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

// ── Sorting ──────────────────────────────────────────
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

// ── Row click ────────────────────────────────────────
const clickedRow = ref(null)
function onRowClick(index, row) {
  clickedRow.value = row
}

// ── Helpers ──────────────────────────────────────────
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

// ── Sidebar / scroll-spy ─────────────────────────────
const sidebarOpen = ref(false)
const activeSection = ref('hero')

const sectionIds = [
  'hero', 'features', 'installation',
  'ex-basic', 'ex-custom', 'ex-striped', 'ex-sorting',
  'ex-row-events', 'ex-sticky', 'ex-groups', 'ex-empty', 'ex-sizing',
  'api-slottable', 'api-column', 'api-columngroup', 'api-cellscope',
]

function onScroll() {
  const y = window.scrollY + 120
  for (let i = sectionIds.length - 1; i >= 0; i--) {
    const el = document.getElementById(sectionIds[i])
    if (el && el.offsetTop <= y) {
      activeSection.value = sectionIds[i]
      return
    }
  }
  activeSection.value = 'hero'
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function navClick() {
  sidebarOpen.value = false
}

// ── Copy code ────────────────────────────────────────
const copiedKey = ref('')
function copyCode(key) {
  navigator.clipboard.writeText(code[key])
  copiedKey.value = key
  setTimeout(() => { copiedKey.value = '' }, 2000)
}

// ── Code examples (real < > {{ }} chars!) ────────────
const code = {
  basic: `<template>
  <SlotTable :rows="users" table-class="my-table">
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
</template>

<script setup>
import { SlotTable, SlotTableColumn } from 'vue-slottable'

const users = [
  { name: 'Alice Johnson', role: 'Engineer', department: 'Frontend' },
  { name: 'Bob Smith', role: 'Designer', department: 'UX' },
]
<\/script>`,

  customCells: `<SlotTable :rows="products" hoverable>
  <SlotTableColumn width="100px">
    <template #header>SKU</template>
    <template #cell="{ row }"><code>{{ row.sku }}</code></template>
  </SlotTableColumn>
  <SlotTableColumn>
    <template #header>Product</template>
    <template #cell="{ row }"><strong>{{ row.name }}</strong></template>
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
</SlotTable>`,

  stripedBordered: `<SlotTable :rows="employees" striped bordered>
  <SlotTableColumn>
    <template #header>Name</template>
    <template #cell="{ row }">{{ row.name }}</template>
  </SlotTableColumn>
  <SlotTableColumn align="center">
    <template #header>Age</template>
    <template #cell="{ row }">{{ row.age }}</template>
  </SlotTableColumn>
  <SlotTableColumn align="right">
    <template #header>Salary</template>
    <template #cell="{ row }">{{ currency(row.salary) }}</template>
  </SlotTableColumn>
</SlotTable>`,

  sorting: `<template>
  <SlotTable
    :rows="sortedEmployees"
    hoverable
    row-key="id"
    @header-click="onSortClick"
  >
    <SlotTableColumn>
      <template #header>
        <span class="sortable">Name {{ sortIndicator(0) }}</span>
      </template>
      <template #cell="{ row }">{{ row.name }}</template>
    </SlotTableColumn>
    <SlotTableColumn align="right">
      <template #header>
        <span class="sortable">Salary {{ sortIndicator(1) }}</span>
      </template>
      <template #cell="{ row }">{{ currency(row.salary) }}</template>
    </SlotTableColumn>
  </SlotTable>
</template>

<script setup>
import { ref, computed } from 'vue'

const sortColumn = ref(null)
const sortDir = ref('asc')
const columns = ['name', 'salary']

function onSortClick(columnIndex) {
  if (sortColumn.value === columnIndex) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = columnIndex
    sortDir.value = 'asc'
  }
}

const sortedEmployees = computed(() => {
  if (sortColumn.value === null) return employees.value
  const col = columns[sortColumn.value]
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...employees.value].sort((a, b) => {
    if (a[col] < b[col]) return -dir
    if (a[col] > b[col]) return dir
    return 0
  })
})
<\/script>`,

  rowEvents: `<SlotTable
  :rows="employees"
  hoverable
  :row-class="(row) => row.status === 'inactive' ? 'row-inactive' : ''"
  @row-click="(index, row) => selectedRow = row"
>
  <SlotTableColumn>
    <template #header>Name</template>
    <template #cell="{ row }">{{ row.name }}</template>
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
</SlotTable>`,

  stickyColumns: `<SlotTable :rows="data" hoverable>
  <SlotTableColumn sticky="left" min-width="200px">
    <template #header>Name (pinned)</template>
    <template #cell="{ row }">{{ row.name }}</template>
  </SlotTableColumn>

  <!-- Scrollable columns in the middle -->
  <SlotTableColumn min-width="200px">
    <template #header>Role</template>
    <template #cell="{ row }">{{ row.role }}</template>
  </SlotTableColumn>
  <SlotTableColumn min-width="200px">
    <template #header>Department</template>
    <template #cell="{ row }">{{ row.department }}</template>
  </SlotTableColumn>

  <SlotTableColumn sticky="right" align="right" min-width="150px">
    <template #header>Salary (pinned)</template>
    <template #cell="{ row }">{{ currency(row.salary) }}</template>
  </SlotTableColumn>
</SlotTable>`,

  columnGroups: `<SlotTable :rows="employees" bordered>
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
</SlotTable>`,

  emptyState: `<SlotTable :rows="[]">
  <template #empty>
    <div class="empty-state">
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
</SlotTable>`,

  columnSizing: `<SlotTable :rows="products" striped>
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
</SlotTable>`,
}
</script>

<template>
  <!-- Mobile menu toggle -->
  <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen" aria-label="Toggle menu">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <rect y="3" width="20" height="2" rx="1" />
      <rect y="9" width="20" height="2" rx="1" />
      <rect y="15" width="20" height="2" rx="1" />
    </svg>
  </button>

  <!-- Overlay -->
  <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false" />

  <!-- Sidebar -->
  <aside class="sidebar" :class="{ open: sidebarOpen }">
    <div class="sidebar-header">
      <a href="#hero" @click="navClick" class="sidebar-brand">vue-slottable</a>
      <span class="sidebar-version">v1.1.0</span>
    </div>

    <nav class="sidebar-nav">
      <a href="#hero" @click="navClick" :class="{ active: activeSection === 'hero' }">Introduction</a>
      <a href="#features" @click="navClick" :class="{ active: activeSection === 'features' }">Features</a>
      <a href="#installation" @click="navClick" :class="{ active: activeSection === 'installation' }">Installation</a>

      <div class="nav-group">Examples</div>
      <a href="#ex-basic" @click="navClick" :class="{ active: activeSection === 'ex-basic' }">Basic Table</a>
      <a href="#ex-custom" @click="navClick" :class="{ active: activeSection === 'ex-custom' }">Custom Cells</a>
      <a href="#ex-striped" @click="navClick" :class="{ active: activeSection === 'ex-striped' }">Striped &amp; Bordered</a>
      <a href="#ex-sorting" @click="navClick" :class="{ active: activeSection === 'ex-sorting' }">Sorting</a>
      <a href="#ex-row-events" @click="navClick" :class="{ active: activeSection === 'ex-row-events' }">Row Events</a>
      <a href="#ex-sticky" @click="navClick" :class="{ active: activeSection === 'ex-sticky' }">Sticky Columns</a>
      <a href="#ex-groups" @click="navClick" :class="{ active: activeSection === 'ex-groups' }">Column Groups</a>
      <a href="#ex-empty" @click="navClick" :class="{ active: activeSection === 'ex-empty' }">Empty State</a>
      <a href="#ex-sizing" @click="navClick" :class="{ active: activeSection === 'ex-sizing' }">Column Sizing</a>

      <div class="nav-group">API Reference</div>
      <a href="#api-slottable" @click="navClick" :class="{ active: activeSection === 'api-slottable' }">SlotTable</a>
      <a href="#api-column" @click="navClick" :class="{ active: activeSection === 'api-column' }">SlotTableColumn</a>
      <a href="#api-columngroup" @click="navClick" :class="{ active: activeSection === 'api-columngroup' }">SlotTableColumnGroup</a>
      <a href="#api-cellscope" @click="navClick" :class="{ active: activeSection === 'api-cellscope' }">Cell Slot Scope</a>
    </nav>

    <div class="sidebar-footer">
      <a href="https://github.com/muraliavarma/vue-slot-table" target="_blank">GitHub</a>
      <a href="https://www.npmjs.com/package/vue-slottable" target="_blank">npm</a>
    </div>
  </aside>

  <!-- Main content -->
  <main class="main-content">

    <!-- ═══════════════════════════════════════════════ -->
    <!-- HERO -->
    <!-- ═══════════════════════════════════════════════ -->
    <section id="hero" class="hero">
      <h1>vue-slottable</h1>
      <p class="hero-tagline">A flexible, slot-based table component for Vue 3.</p>
      <p class="hero-sub">Define columns with scoped slots. Add sticky columns, column groups, sorting, and more &mdash; with zero CSS opinions.</p>
      <div class="hero-badges">
        <a href="https://www.npmjs.com/package/vue-slottable"><img src="https://img.shields.io/npm/v/vue-slottable.svg" alt="npm" /></a>
        <a href="https://github.com/muraliavarma/vue-slot-table"><img src="https://img.shields.io/github/license/muraliavarma/vue-slot-table.svg" alt="license" /></a>
        <a href="https://github.com/muraliavarma/vue-slot-table/actions/workflows/ci.yml"><img src="https://github.com/muraliavarma/vue-slot-table/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
      </div>
      <div class="hero-install">
        <code>npm install vue-slottable</code>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- FEATURES -->
    <!-- ═══════════════════════════════════════════════ -->
    <section id="features" class="doc-section">
      <h2>Features</h2>
      <div class="features-grid">
        <div class="feature-card">
          <h3>Slot-Based API</h3>
          <p>Define columns as child components with <code>#header</code> and <code>#cell</code> scoped slots. No config objects.</p>
        </div>
        <div class="feature-card">
          <h3>Sticky Columns</h3>
          <p>Pin columns to the left or right edge. They stay visible when scrolling horizontally.</p>
        </div>
        <div class="feature-card">
          <h3>Column Groups</h3>
          <p>Multi-level grouped headers that span multiple columns for organized data display.</p>
        </div>
        <div class="feature-card">
          <h3>Sortable Headers</h3>
          <p>Built-in <code>header-click</code> event makes implementing sort trivial. You own the sort logic.</p>
        </div>
        <div class="feature-card">
          <h3>Custom Cell Rendering</h3>
          <p>Full control over every cell. Use any HTML, Vue components, or computed values inside slots.</p>
        </div>
        <div class="feature-card">
          <h3>Empty State</h3>
          <p>Built-in <code>#empty</code> slot to show custom content when there are no rows to display.</p>
        </div>
        <div class="feature-card">
          <h3>Styling Props</h3>
          <p>Add <code>striped</code>, <code>bordered</code>, and <code>hoverable</code> with boolean props. Style with your own CSS.</p>
        </div>
        <div class="feature-card">
          <h3>Dynamic Row Classes</h3>
          <p>Apply classes per row with a string, object, or function. Highlight, dim, or color rows conditionally.</p>
        </div>
        <div class="feature-card">
          <h3>Column Sizing</h3>
          <p>Set <code>width</code>, <code>min-width</code>, and <code>align</code> per column for precise layout control.</p>
        </div>
        <div class="feature-card">
          <h3>TypeScript Support</h3>
          <p>Full type declarations included. Get autocomplete and type checking out of the box.</p>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- INSTALLATION -->
    <!-- ═══════════════════════════════════════════════ -->
    <section id="installation" class="doc-section">
      <h2>Installation</h2>
      <p class="section-desc">Requires Vue 3.4+.</p>
      <div class="code-block">
        <div class="code-toolbar">
          <span class="code-lang">bash</span>
        </div>
        <pre><code>npm install vue-slottable</code></pre>
      </div>
      <p class="section-desc" style="margin-top: 1rem;">Then import the components you need:</p>
      <div class="code-block">
        <div class="code-toolbar">
          <span class="code-lang">js</span>
        </div>
        <pre><code>import { SlotTable, SlotTableColumn, SlotTableColumnGroup } from 'vue-slottable'</code></pre>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- EXAMPLE: BASIC -->
    <!-- ═══════════════════════════════════════════════ -->
    <section id="ex-basic" class="doc-section">
      <h2>Basic Table</h2>
      <p class="section-desc">The simplest usage &mdash; define columns with <code>#header</code> and <code>#cell</code> slots.</p>
      <div class="example-block">
        <div class="example-preview">
          <SlotTable :rows="employees.slice(0, 4)" table-class="demo-table">
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
        <details class="example-source">
          <summary>
            <span>View source</span>
            <button class="copy-btn" @click.stop="copyCode('basic')">{{ copiedKey === 'basic' ? 'Copied!' : 'Copy' }}</button>
          </summary>
          <pre><code>{{ code.basic }}</code></pre>
        </details>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- EXAMPLE: CUSTOM CELLS -->
    <!-- ═══════════════════════════════════════════════ -->
    <section id="ex-custom" class="doc-section">
      <h2>Custom Cell Rendering</h2>
      <p class="section-desc">Use any HTML or Vue components inside cell slots. The scoped slot receives <code>{ row, rowIndex, columnIndex }</code>.</p>
      <div class="example-block">
        <div class="example-preview">
          <SlotTable :rows="products" table-class="demo-table" hoverable>
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
        <details class="example-source">
          <summary>
            <span>View source</span>
            <button class="copy-btn" @click.stop="copyCode('customCells')">{{ copiedKey === 'customCells' ? 'Copied!' : 'Copy' }}</button>
          </summary>
          <pre><code>{{ code.customCells }}</code></pre>
        </details>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- EXAMPLE: STRIPED & BORDERED -->
    <!-- ═══════════════════════════════════════════════ -->
    <section id="ex-striped" class="doc-section">
      <h2>Striped &amp; Bordered</h2>
      <p class="section-desc">Add <code>striped</code> and <code>bordered</code> props for classic table styling.</p>
      <div class="example-block">
        <div class="example-preview">
          <SlotTable :rows="employees.slice(0, 5)" table-class="demo-table" striped bordered>
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
        <details class="example-source">
          <summary>
            <span>View source</span>
            <button class="copy-btn" @click.stop="copyCode('stripedBordered')">{{ copiedKey === 'stripedBordered' ? 'Copied!' : 'Copy' }}</button>
          </summary>
          <pre><code>{{ code.stripedBordered }}</code></pre>
        </details>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- EXAMPLE: SORTING -->
    <!-- ═══════════════════════════════════════════════ -->
    <section id="ex-sorting" class="doc-section">
      <h2>Sorting</h2>
      <p class="section-desc">Use the <code>@header-click</code> event to implement sorting. Click any column header to sort.</p>
      <div class="example-block">
        <div class="example-preview">
          <SlotTable
            :rows="sortedEmployees"
            table-class="demo-table"
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
        <details class="example-source">
          <summary>
            <span>View source</span>
            <button class="copy-btn" @click.stop="copyCode('sorting')">{{ copiedKey === 'sorting' ? 'Copied!' : 'Copy' }}</button>
          </summary>
          <pre><code>{{ code.sorting }}</code></pre>
        </details>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- EXAMPLE: ROW EVENTS -->
    <!-- ═══════════════════════════════════════════════ -->
    <section id="ex-row-events" class="doc-section">
      <h2>Row Click &amp; Dynamic Row Classes</h2>
      <p class="section-desc">Handle row clicks with <code>@row-click</code> and apply dynamic classes with <code>:row-class</code>. Inactive rows are dimmed.</p>
      <div class="example-block">
        <div class="example-preview">
          <div v-if="clickedRow" class="click-banner">
            Clicked: <strong>{{ clickedRow.name }}</strong> ({{ clickedRow.role }})
          </div>
          <SlotTable
            :rows="employees"
            table-class="demo-table"
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
        <details class="example-source">
          <summary>
            <span>View source</span>
            <button class="copy-btn" @click.stop="copyCode('rowEvents')">{{ copiedKey === 'rowEvents' ? 'Copied!' : 'Copy' }}</button>
          </summary>
          <pre><code>{{ code.rowEvents }}</code></pre>
        </details>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- EXAMPLE: STICKY COLUMNS -->
    <!-- ═══════════════════════════════════════════════ -->
    <section id="ex-sticky" class="doc-section">
      <h2>Sticky Columns</h2>
      <p class="section-desc">Pin columns to the left or right edge with <code>sticky="left"</code> or <code>sticky="right"</code>. Scroll horizontally to see the effect.</p>
      <div class="example-block">
        <div class="example-preview scroll-container">
          <SlotTable :rows="employees" table-class="demo-table demo-table-wide" hoverable>
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
        <details class="example-source">
          <summary>
            <span>View source</span>
            <button class="copy-btn" @click.stop="copyCode('stickyColumns')">{{ copiedKey === 'stickyColumns' ? 'Copied!' : 'Copy' }}</button>
          </summary>
          <pre><code>{{ code.stickyColumns }}</code></pre>
        </details>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- EXAMPLE: COLUMN GROUPS -->
    <!-- ═══════════════════════════════════════════════ -->
    <section id="ex-groups" class="doc-section">
      <h2>Column Groups</h2>
      <p class="section-desc">Add grouped header rows with <code>&lt;SlotTableColumnGroup&gt;</code> and <code>:colspan</code>.</p>
      <div class="example-block">
        <div class="example-preview">
          <SlotTable :rows="employees.slice(0, 5)" table-class="demo-table" bordered>
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
        <details class="example-source">
          <summary>
            <span>View source</span>
            <button class="copy-btn" @click.stop="copyCode('columnGroups')">{{ copiedKey === 'columnGroups' ? 'Copied!' : 'Copy' }}</button>
          </summary>
          <pre><code>{{ code.columnGroups }}</code></pre>
        </details>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- EXAMPLE: EMPTY STATE -->
    <!-- ═══════════════════════════════════════════════ -->
    <section id="ex-empty" class="doc-section">
      <h2>Empty State</h2>
      <p class="section-desc">Provide an <code>#empty</code> slot to display when there are no rows.</p>
      <div class="example-block">
        <div class="example-preview">
          <SlotTable :rows="emptyRows" table-class="demo-table">
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
        <details class="example-source">
          <summary>
            <span>View source</span>
            <button class="copy-btn" @click.stop="copyCode('emptyState')">{{ copiedKey === 'emptyState' ? 'Copied!' : 'Copy' }}</button>
          </summary>
          <pre><code>{{ code.emptyState }}</code></pre>
        </details>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- EXAMPLE: COLUMN SIZING -->
    <!-- ═══════════════════════════════════════════════ -->
    <section id="ex-sizing" class="doc-section">
      <h2>Column Width &amp; Alignment</h2>
      <p class="section-desc">Control column sizing with <code>width</code> and <code>min-width</code>. Set text alignment with <code>align</code>.</p>
      <div class="example-block">
        <div class="example-preview">
          <SlotTable :rows="products.slice(0, 4)" table-class="demo-table" striped>
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
        <details class="example-source">
          <summary>
            <span>View source</span>
            <button class="copy-btn" @click.stop="copyCode('columnSizing')">{{ copiedKey === 'columnSizing' ? 'Copied!' : 'Copy' }}</button>
          </summary>
          <pre><code>{{ code.columnSizing }}</code></pre>
        </details>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- API: SLOTTABLE -->
    <!-- ═══════════════════════════════════════════════ -->
    <section id="api-slottable" class="doc-section">
      <h2>SlotTable</h2>
      <p class="section-desc">The main table component. Accepts rows and renders columns defined as children.</p>

      <h3>Props</h3>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>rows</code></td><td>Array</td><td><em>required</em></td><td>Array of row data objects</td></tr>
            <tr><td><code>table-class</code></td><td>String</td><td><code>''</code></td><td>CSS class applied to the <code>&lt;table&gt;</code> element</td></tr>
            <tr><td><code>row-key</code></td><td>String | Function</td><td>&mdash;</td><td>Property name or <code>(row, index) =&gt; key</code> for <code>:key</code> on each <code>&lt;tr&gt;</code></td></tr>
            <tr><td><code>row-class</code></td><td>String | Object | Function</td><td>&mdash;</td><td>Class(es) for each <code>&lt;tr&gt;</code>. Function receives <code>(row, index)</code></td></tr>
            <tr><td><code>striped</code></td><td>Boolean</td><td><code>false</code></td><td>Adds <code>.slot-table-striped</code> to odd rows</td></tr>
            <tr><td><code>hoverable</code></td><td>Boolean</td><td><code>false</code></td><td>Adds <code>.slot-table-hoverable</code> to all rows</td></tr>
            <tr><td><code>bordered</code></td><td>Boolean</td><td><code>false</code></td><td>Adds <code>.slot-table-bordered</code> to the table</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Events</h3>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr><th>Event</th><th>Payload</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>row-click</code></td><td><code>(rowIndex, row)</code></td><td>Fired when a data row is clicked</td></tr>
            <tr><td><code>header-click</code></td><td><code>(columnIndex)</code></td><td>Fired when a header cell is clicked</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Slots</h3>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr><th>Slot</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>default</code></td><td><code>&lt;SlotTableColumn&gt;</code> and <code>&lt;SlotTableColumnGroup&gt;</code> children</td></tr>
            <tr><td><code>empty</code></td><td>Content displayed when <code>rows</code> is empty</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- API: SLOTTABLECOLUMN -->
    <!-- ═══════════════════════════════════════════════ -->
    <section id="api-column" class="doc-section">
      <h2>SlotTableColumn</h2>
      <p class="section-desc">Renderless component that defines a single column. Must be a direct child of <code>&lt;SlotTable&gt;</code>.</p>

      <h3>Props</h3>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>sticky</code></td><td>String</td><td><code>''</code></td><td><code>'left'</code> or <code>'right'</code> to pin the column</td></tr>
            <tr><td><code>align</code></td><td>String</td><td><code>''</code></td><td><code>'left'</code>, <code>'center'</code>, or <code>'right'</code></td></tr>
            <tr><td><code>width</code></td><td>String</td><td><code>''</code></td><td>CSS width (e.g. <code>'150px'</code>)</td></tr>
            <tr><td><code>min-width</code></td><td>String</td><td><code>''</code></td><td>CSS min-width (e.g. <code>'200px'</code>)</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Slots</h3>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr><th>Slot</th><th>Scope</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>header</code></td><td>&mdash;</td><td>Column header content rendered in <code>&lt;th&gt;</code></td></tr>
            <tr><td><code>cell</code></td><td><code>{ row, rowIndex, columnIndex }</code></td><td>Cell content rendered in <code>&lt;td&gt;</code> for each row</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- API: SLOTTABLECOLUMNGROUP -->
    <!-- ═══════════════════════════════════════════════ -->
    <section id="api-columngroup" class="doc-section">
      <h2>SlotTableColumnGroup</h2>
      <p class="section-desc">Renderless component for grouped header rows. Must be a direct child of <code>&lt;SlotTable&gt;</code>.</p>

      <h3>Props</h3>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>sticky</code></td><td>String</td><td><code>''</code></td><td><code>'left'</code> or <code>'right'</code> to pin the group header</td></tr>
            <tr><td><code>colspan</code></td><td>Number</td><td>&mdash;</td><td>Number of columns this group header spans</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Slots</h3>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr><th>Slot</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>default</code></td><td>Group header text content</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- API: CELL SLOT SCOPE -->
    <!-- ═══════════════════════════════════════════════ -->
    <section id="api-cellscope" class="doc-section">
      <h2>Cell Slot Scope</h2>
      <p class="section-desc">The <code>#cell</code> scoped slot receives the following properties:</p>

      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>row</code></td><td>Object</td><td>The data object for this row (from the <code>rows</code> array)</td></tr>
            <tr><td><code>rowIndex</code></td><td>Number</td><td>Zero-based index of the row</td></tr>
            <tr><td><code>columnIndex</code></td><td>Number</td><td>Zero-based index of the column</td></tr>
          </tbody>
        </table>
      </div>

      <h3>CSS Classes Reference</h3>
      <p class="section-desc">The component applies these classes that you can style:</p>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr><th>Class</th><th>Applied to</th><th>When</th></tr>
          </thead>
          <tbody>
            <tr><td><code>.sticky-left</code></td><td><code>&lt;th&gt;</code>, <code>&lt;td&gt;</code></td><td>Column has <code>sticky="left"</code></td></tr>
            <tr><td><code>.sticky-right</code></td><td><code>&lt;th&gt;</code>, <code>&lt;td&gt;</code></td><td>Column has <code>sticky="right"</code></td></tr>
            <tr><td><code>.align-left</code></td><td><code>&lt;th&gt;</code>, <code>&lt;td&gt;</code></td><td>Column has <code>align="left"</code></td></tr>
            <tr><td><code>.align-center</code></td><td><code>&lt;th&gt;</code>, <code>&lt;td&gt;</code></td><td>Column has <code>align="center"</code></td></tr>
            <tr><td><code>.align-right</code></td><td><code>&lt;th&gt;</code>, <code>&lt;td&gt;</code></td><td>Column has <code>align="right"</code></td></tr>
            <tr><td><code>.slot-table-striped</code></td><td><code>&lt;tr&gt;</code></td><td>Odd rows when <code>striped</code> prop is true</td></tr>
            <tr><td><code>.slot-table-hoverable</code></td><td><code>&lt;tr&gt;</code></td><td>All rows when <code>hoverable</code> prop is true</td></tr>
            <tr><td><code>.slot-table-bordered</code></td><td><code>&lt;table&gt;</code></td><td>When <code>bordered</code> prop is true</td></tr>
            <tr><td><code>.slot-table-empty</code></td><td><code>&lt;td&gt;</code></td><td>The cell wrapping the <code>#empty</code> slot content</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- FOOTER -->
    <!-- ═══════════════════════════════════════════════ -->
    <footer class="doc-footer">
      <p>
        <a href="https://github.com/muraliavarma/vue-slot-table">GitHub</a>
        &middot;
        <a href="https://www.npmjs.com/package/vue-slottable">npm</a>
        &middot;
        MIT License
      </p>
    </footer>

  </main>
</template>

<style>
/* ═══════════════════════════════════════════════════════
   RESET & BASE
   ═══════════════════════════════════════════════════════ */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f8fafc;
  color: #1e293b;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* ═══════════════════════════════════════════════════════
   LAYOUT
   ═══════════════════════════════════════════════════════ */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 260px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow-y: auto;
}

.main-content {
  margin-left: 260px;
  max-width: 860px;
  padding: 0 2.5rem 4rem;
}

/* ═══════════════════════════════════════════════════════
   SIDEBAR
   ═══════════════════════════════════════════════════════ */
.sidebar-header {
  padding: 1.25rem 1.5rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

.sidebar-brand {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1e293b;
  text-decoration: none;
  display: block;
}

.sidebar-version {
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 500;
  background: #f1f5f9;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  display: inline-block;
  margin-top: 0.15rem;
}

.sidebar-nav {
  flex: 1;
  padding: 0.75rem 0;
  overflow-y: auto;
}

.sidebar-nav a {
  display: block;
  padding: 0.3rem 1.5rem;
  font-size: 0.84rem;
  color: #64748b;
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}

.sidebar-nav a:hover {
  color: #1e293b;
}

.sidebar-nav a.active {
  color: #3b82f6;
  border-left-color: #3b82f6;
  background: #eff6ff;
  font-weight: 500;
}

.nav-group {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  font-weight: 600;
  padding: 1.25rem 1.5rem 0.3rem;
}

.sidebar-footer {
  padding: 0.75rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
}

.sidebar-footer a {
  color: #64748b;
  text-decoration: none;
}

.sidebar-footer a:hover {
  color: #3b82f6;
}

/* ═══════════════════════════════════════════════════════
   MOBILE
   ═══════════════════════════════════════════════════════ */
.menu-toggle {
  display: none;
  position: fixed;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 200;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  color: #475569;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.sidebar-overlay {
  display: none;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    z-index: 150;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
    padding: 0 1.25rem 3rem;
  }

  .menu-toggle {
    display: block;
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.3);
    z-index: 140;
  }

  .hero {
    padding-top: 3.5rem !important;
  }
}

/* ═══════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════ */
.hero {
  padding: 3rem 0 1.5rem;
}

.hero h1 {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-tagline {
  font-size: 1.25rem;
  color: #475569;
  margin-top: 0.25rem;
  font-weight: 500;
}

.hero-sub {
  font-size: 0.95rem;
  color: #94a3b8;
  margin-top: 0.25rem;
  max-width: 520px;
}

.hero-badges {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.hero-badges img {
  height: 20px;
}

.hero-install {
  margin-top: 1rem;
  display: inline-block;
  background: #1e293b;
  color: #e2e8f0;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-size: 0.9rem;
}

.hero-install code {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, monospace;
}

/* ═══════════════════════════════════════════════════════
   SECTIONS
   ═══════════════════════════════════════════════════════ */
.doc-section {
  margin-top: 3rem;
  padding-top: 1rem;
}

.doc-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-bottom: 0.25rem;
}

.doc-section h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: #334155;
}

.section-desc {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

/* ═══════════════════════════════════════════════════════
   FEATURES GRID
   ═══════════════════════════════════════════════════════ */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.feature-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem 1.15rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.feature-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.feature-card h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.2rem;
}

.feature-card p {
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.45;
  margin: 0;
}

/* ═══════════════════════════════════════════════════════
   CODE BLOCKS (standalone)
   ═══════════════════════════════════════════════════════ */
.code-block {
  border-radius: 8px;
  overflow: hidden;
}

.code-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 1rem;
  background: #0f172a;
}

.code-lang {
  font-size: 0.65rem;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.code-block pre {
  background: #1e293b;
  color: #e2e8f0;
  padding: 0.85rem 1rem;
  margin: 0;
  overflow-x: auto;
  font-size: 0.82rem;
  line-height: 1.55;
}

/* ═══════════════════════════════════════════════════════
   EXAMPLE BLOCKS (demo + source)
   ═══════════════════════════════════════════════════════ */
.example-block {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.example-preview {
  padding: 1.25rem;
  overflow-x: auto;
}

.scroll-container {
  overflow-x: auto;
}

.example-source {
  border-top: 1px solid #e2e8f0;
}

.example-source summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.78rem;
  color: #94a3b8;
  cursor: pointer;
  user-select: none;
  background: #fafbfc;
  list-style: none;
}

.example-source summary::-webkit-details-marker {
  display: none;
}

.example-source summary span::before {
  content: '\25B6\00a0';
  font-size: 0.6rem;
  vertical-align: 1px;
}

.example-source[open] summary span::before {
  content: '\25BC\00a0';
}

.example-source pre {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1rem;
  margin: 0;
  overflow-x: auto;
  font-size: 0.8rem;
  line-height: 1.55;
}

.copy-btn {
  font-size: 0.7rem;
  color: #64748b;
  background: transparent;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 0.15rem 0.5rem;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  font-family: inherit;
}

.copy-btn:hover {
  color: #3b82f6;
  border-color: #3b82f6;
}

/* ═══════════════════════════════════════════════════════
   API TABLES
   ═══════════════════════════════════════════════════════ */
.api-table-wrap {
  overflow-x: auto;
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.84rem;
  margin-bottom: 0.25rem;
}

.api-table th {
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

.api-table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: top;
}

.api-table tbody tr:hover td {
  background: #f8fafc;
}

/* ═══════════════════════════════════════════════════════
   DEMO TABLE STYLES
   ═══════════════════════════════════════════════════════ */
.demo-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.demo-table th,
.demo-table td {
  padding: 0.55rem 0.85rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  background: white;
}

.demo-table thead th {
  font-weight: 600;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
  border-bottom: 2px solid #cbd5e1;
}

.demo-table-wide {
  min-width: 1100px;
}

/* ── Slot-table built-in class styling ─────────────── */
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
.demo-table .sticky-left,
.demo-table .sticky-right {
  background: white;
  box-shadow: 2px 0 4px -2px rgba(0,0,0,0.06);
}

.demo-table .sticky-right {
  box-shadow: -2px 0 4px -2px rgba(0,0,0,0.06);
}

/* ═══════════════════════════════════════════════════════
   MISC ELEMENT STYLES
   ═══════════════════════════════════════════════════════ */
.pill {
  display: inline-block;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.76rem;
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
  font-size: 0.85rem;
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

code {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, monospace;
  font-size: 0.85em;
}

p code,
td code {
  background: #f1f5f9;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  font-size: 0.82em;
  color: #c026d3;
}

/* ═══════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════ */
.doc-footer {
  margin-top: 4rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  font-size: 0.84rem;
  color: #94a3b8;
}

.doc-footer a {
  color: #64748b;
  text-decoration: none;
}

.doc-footer a:hover {
  color: #3b82f6;
}
</style>
