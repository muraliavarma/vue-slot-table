<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { SlotTable, SlotTableColumn, SlotTableColumnGroup } from './index'

// ── Dark mode ────────────────────────────────────────
const darkMode = ref(
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
)

function toggleDark() {
  darkMode.value = !darkMode.value
  document.documentElement.classList.toggle('dark', darkMode.value)
}

onMounted(() => {
  document.documentElement.classList.toggle('dark', darkMode.value)
})

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
function onRowClick(_index, row) {
  clickedRow.value = row
}

// ── Cell click ───────────────────────────────────────
const clickedCell = ref(null)
function onCellClick(rowIndex, columnIndex, row) {
  clickedCell.value = { rowIndex, columnIndex, value: row.name }
}

// ── Column visibility ────────────────────────────────
const showAge = ref(true)
const showDepartment = ref(true)
const showSalary = ref(true)

// ── Loading state ────────────────────────────────────
const isLoading = ref(true)

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

// ── Footer totals ────────────────────────────────────
const totalStock = computed(() => products.value.reduce((s, p) => s + p.stock, 0))
const avgPrice = computed(() => {
  const sum = products.value.reduce((s, p) => s + p.price, 0)
  return (sum / products.value.length).toFixed(2)
})
const avgRating = computed(() => {
  const sum = products.value.reduce((s, p) => s + p.rating, 0)
  return (sum / products.value.length).toFixed(1)
})

// ── Sidebar / scroll-spy ─────────────────────────────
const sidebarOpen = ref(false)
const activeSection = ref('hero')

const sectionIds = [
  'hero', 'features', 'installation',
  'ex-basic', 'ex-custom', 'ex-striped', 'ex-sizing', 'ex-visibility',
  'ex-sorting', 'ex-footer', 'ex-row-events', 'ex-cell-click',
  'ex-sticky', 'ex-sticky-header', 'ex-groups', 'ex-loading', 'ex-empty', 'ex-caption',
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

// ── Code examples ────────────────────────────────────
const code = {
  basic: `<SlotTable :rows="users" table-class="my-table">
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
</SlotTable>`,

  customCells: `<SlotTable :rows="products" hoverable>
  <SlotTableColumn width="100px">
    <template #header>SKU</template>
    <template #cell="{ row }">
      <code>{{ row.sku }}</code>
    </template>
  </SlotTableColumn>
  <SlotTableColumn>
    <template #header>Product</template>
    <template #cell="{ row }">
      <strong>{{ row.name }}</strong>
    </template>
  </SlotTableColumn>
  <SlotTableColumn align="right">
    <template #header>Price</template>
    <template #cell="{ row }">
      {{ currency(row.price) }}
    </template>
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
      <span :class="{ 'out-of-stock': !row.stock }">
        {{ row.stock || 'Out of stock' }}
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
    <template #cell="{ row }">
      {{ currency(row.salary) }}
    </template>
  </SlotTableColumn>
</SlotTable>`,

  sorting: `<SlotTable
  :rows="sortedEmployees"
  hoverable
  row-key="id"
  @header-click="onSortClick"
>
  <SlotTableColumn>
    <template #header>
      Name {{ sortIndicator(0) }}
    </template>
    <template #cell="{ row }">{{ row.name }}</template>
  </SlotTableColumn>
  <SlotTableColumn align="right">
    <template #header>
      Salary {{ sortIndicator(1) }}
    </template>
    <template #cell="{ row }">
      {{ currency(row.salary) }}
    </template>
  </SlotTableColumn>
</SlotTable>`,

  rowEvents: `<SlotTable
  :rows="employees"
  hoverable
  :row-class="statusRowClass"
  @row-click="onRowClick"
>
  <SlotTableColumn>
    <template #header>Name</template>
    <template #cell="{ row }">{{ row.name }}</template>
  </SlotTableColumn>
  <SlotTableColumn>
    <template #header>Status</template>
    <template #cell="{ row }">
      <span class="status-dot"
        :class="'status--' + row.status" />
      {{ row.status }}
    </template>
  </SlotTableColumn>
  <SlotTableColumn align="right">
    <template #header>Salary</template>
    <template #cell="{ row }">
      {{ currency(row.salary) }}
    </template>
  </SlotTableColumn>
</SlotTable>`,

  stickyColumns: `<SlotTable :rows="data" hoverable>
  <SlotTableColumn sticky="left" min-width="200px">
    <template #header>Name (pinned)</template>
    <template #cell="{ row }">{{ row.name }}</template>
  </SlotTableColumn>

  <SlotTableColumn min-width="200px">
    <template #header>Role</template>
    <template #cell="{ row }">{{ row.role }}</template>
  </SlotTableColumn>
  <SlotTableColumn min-width="200px">
    <template #header>Department</template>
    <template #cell="{ row }">{{ row.department }}</template>
  </SlotTableColumn>

  <SlotTableColumn sticky="right" align="right"
    min-width="150px">
    <template #header>Salary (pinned)</template>
    <template #cell="{ row }">
      {{ currency(row.salary) }}
    </template>
  </SlotTableColumn>
</SlotTable>`,

  columnGroups: `<SlotTable :rows="employees" bordered>
  <SlotTableColumnGroup :colspan="2">
    Identity
  </SlotTableColumnGroup>
  <SlotTableColumnGroup :colspan="2">
    Position
  </SlotTableColumnGroup>
  <SlotTableColumnGroup :colspan="1">
    Pay
  </SlotTableColumnGroup>

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
    <template #cell="{ row }">
      {{ currency(row.salary) }}
    </template>
  </SlotTableColumn>
</SlotTable>`,

  emptyState: `<SlotTable :rows="[]">
  <template #empty>
    <div class="empty-state">
      <p><strong>No data found</strong></p>
      <p>Try adjusting your filters.</p>
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
  <SlotTableColumn width="60px" align="center">
    <template #header>#</template>
    <template #cell="{ rowIndex }">
      {{ rowIndex + 1 }}
    </template>
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
    <template #cell="{ row }">
      {{ currency(row.price) }}
    </template>
  </SlotTableColumn>
</SlotTable>`,

  footer: `<SlotTable :rows="products" bordered>
  <SlotTableColumn>
    <template #header>Product</template>
    <template #cell="{ row }">{{ row.name }}</template>
    <template #footer>
      <strong>Totals / Averages</strong>
    </template>
  </SlotTableColumn>
  <SlotTableColumn align="right">
    <template #header>Price</template>
    <template #cell="{ row }">
      {{ currency(row.price) }}
    </template>
    <template #footer>
      <strong>Avg {{ currency(avgPrice) }}</strong>
    </template>
  </SlotTableColumn>
  <SlotTableColumn align="right">
    <template #header>Stock</template>
    <template #cell="{ row }">{{ row.stock }}</template>
    <template #footer>
      <strong>{{ totalStock }}</strong>
    </template>
  </SlotTableColumn>
  <SlotTableColumn align="center">
    <template #header>Rating</template>
    <template #cell="{ row }">
      {{ row.rating }}
    </template>
    <template #footer>
      <strong>{{ avgRating }}</strong>
    </template>
  </SlotTableColumn>
</SlotTable>`,

  visibility: `<template>
  <label>
    <input type="checkbox" v-model="showAge" /> Age
  </label>
  <label>
    <input type="checkbox" v-model="showDept" /> Dept
  </label>
  <label>
    <input type="checkbox" v-model="showSalary" /> Salary
  </label>

  <SlotTable :rows="employees">
    <SlotTableColumn>
      <template #header>Name</template>
      <template #cell="{ row }">{{ row.name }}</template>
    </SlotTableColumn>
    <SlotTableColumn :visible="showAge" align="center">
      <template #header>Age</template>
      <template #cell="{ row }">{{ row.age }}</template>
    </SlotTableColumn>
    <SlotTableColumn :visible="showDept">
      <template #header>Department</template>
      <template #cell="{ row }">
        {{ row.department }}
      </template>
    </SlotTableColumn>
    <SlotTableColumn :visible="showSalary" align="right">
      <template #header>Salary</template>
      <template #cell="{ row }">
        {{ currency(row.salary) }}
      </template>
    </SlotTableColumn>
  </SlotTable>
</template>`,

  loading: `<SlotTable :rows="data" :loading="isLoading">
  <template #loading>
    <div class="loading-state">
      <div class="spinner" />
      <p>Loading data...</p>
    </div>
  </template>

  <SlotTableColumn>
    <template #header>Name</template>
    <template #cell="{ row }">{{ row.name }}</template>
  </SlotTableColumn>
  <SlotTableColumn>
    <template #header>Role</template>
    <template #cell="{ row }">{{ row.role }}</template>
  </SlotTableColumn>
</SlotTable>`,

  stickyHeader: `<!-- Wrap in a container with fixed height -->
<div style="height: 250px; overflow: auto">
  <SlotTable :rows="employees" sticky-header
    striped hoverable>
    <SlotTableColumn>
      <template #header>Name</template>
      <template #cell="{ row }">
        {{ row.name }}
      </template>
    </SlotTableColumn>
    <SlotTableColumn align="center">
      <template #header>Age</template>
      <template #cell="{ row }">
        {{ row.age }}
      </template>
    </SlotTableColumn>
    <SlotTableColumn>
      <template #header>Department</template>
      <template #cell="{ row }">
        {{ row.department }}
      </template>
    </SlotTableColumn>
    <SlotTableColumn align="right">
      <template #header>Salary</template>
      <template #cell="{ row }">
        {{ currency(row.salary) }}
      </template>
    </SlotTableColumn>
  </SlotTable>
</div>`,

  cellClick: `<SlotTable
  :rows="employees"
  @cell-click="onCellClick"
>
  <SlotTableColumn>
    <template #header>Name</template>
    <template #cell="{ row }">
      <span class="clickable-cell">
        {{ row.name }}
      </span>
    </template>
  </SlotTableColumn>
  <SlotTableColumn>
    <template #header>Role</template>
    <template #cell="{ row }">{{ row.role }}</template>
  </SlotTableColumn>
</SlotTable>`,

  caption: `<SlotTable
  :rows="employees"
  caption="Q4 2025 Employee Directory"
  bordered striped
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
    <template #header>Department</template>
    <template #cell="{ row }">
      {{ row.department }}
    </template>
  </SlotTableColumn>
</SlotTable>`,
}
</script>

<template>
  <!-- Mobile menu toggle -->
  <button
    class="menu-toggle"
    aria-label="Toggle menu"
    @click="sidebarOpen = !sidebarOpen"
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <rect
        y="3"
        width="20"
        height="2"
        rx="1"
      />
      <rect
        y="9"
        width="20"
        height="2"
        rx="1"
      />
      <rect
        y="15"
        width="20"
        height="2"
        rx="1"
      />
    </svg>
  </button>

  <!-- Overlay -->
  <div
    v-if="sidebarOpen"
    class="sidebar-overlay"
    @click="sidebarOpen = false"
  />

  <!-- Sidebar -->
  <aside
    class="sidebar"
    :class="{ open: sidebarOpen }"
  >
    <div class="sidebar-header">
      <div class="sidebar-header-top">
        <a
          href="#hero"
          class="sidebar-brand"
          @click="navClick"
        >vue-slottable</a>
        <div class="sidebar-actions">
          <a class="sidebar-icon-link" href="https://github.com/muraliavarma/vue-slot-table" target="_blank" aria-label="GitHub">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
          </a>
          <a class="sidebar-icon-link" href="https://www.npmjs.com/package/vue-slottable" target="_blank" aria-label="npm">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M0 0v16h16V0H0zm13 13H8V5H5v8H3V3h10v10z"/></svg>
          </a>
          <button
            class="dark-toggle"
            :aria-label="darkMode ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleDark"
          >
            <svg
              v-if="!darkMode"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <svg
              v-else
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle
                cx="12"
                cy="12"
                r="5"
              /><line
                x1="12"
                y1="1"
                x2="12"
                y2="3"
              /><line
                x1="12"
                y1="21"
                x2="12"
                y2="23"
              /><line
                x1="4.22"
                y1="4.22"
                x2="5.64"
                y2="5.64"
              /><line
                x1="18.36"
                y1="18.36"
                x2="19.78"
                y2="19.78"
              /><line
                x1="1"
                y1="12"
                x2="3"
                y2="12"
              /><line
                x1="21"
                y1="12"
                x2="23"
                y2="12"
              /><line
                x1="4.22"
                y1="19.78"
                x2="5.64"
                y2="18.36"
              /><line
                x1="18.36"
                y1="5.64"
                x2="19.78"
                y2="4.22"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <a
        href="#hero"
        :class="{ active: activeSection === 'hero' }"
        @click="navClick"
      >Introduction</a>
      <a
        href="#features"
        :class="{ active: activeSection === 'features' }"
        @click="navClick"
      >Features</a>
      <a
        href="#installation"
        :class="{ active: activeSection === 'installation' }"
        @click="navClick"
      >Installation</a>

      <div class="nav-group">
        Examples
      </div>
      <a
        href="#ex-basic"
        :class="{ active: activeSection === 'ex-basic' }"
        @click="navClick"
      >Basic Table</a>
      <a
        href="#ex-custom"
        :class="{ active: activeSection === 'ex-custom' }"
        @click="navClick"
      >Custom Cells</a>
      <a
        href="#ex-striped"
        :class="{ active: activeSection === 'ex-striped' }"
        @click="navClick"
      >Striped &amp; Bordered</a>
      <a
        href="#ex-sizing"
        :class="{ active: activeSection === 'ex-sizing' }"
        @click="navClick"
      >Column Sizing</a>
      <a
        href="#ex-visibility"
        :class="{ active: activeSection === 'ex-visibility' }"
        @click="navClick"
      >Column Visibility</a>
      <a
        href="#ex-sorting"
        :class="{ active: activeSection === 'ex-sorting' }"
        @click="navClick"
      >Sorting</a>
      <a
        href="#ex-footer"
        :class="{ active: activeSection === 'ex-footer' }"
        @click="navClick"
      >Footer / Totals</a>
      <a
        href="#ex-row-events"
        :class="{ active: activeSection === 'ex-row-events' }"
        @click="navClick"
      >Row Events</a>
      <a
        href="#ex-cell-click"
        :class="{ active: activeSection === 'ex-cell-click' }"
        @click="navClick"
      >Cell Click</a>
      <a
        href="#ex-sticky"
        :class="{ active: activeSection === 'ex-sticky' }"
        @click="navClick"
      >Sticky Columns</a>
      <a
        href="#ex-sticky-header"
        :class="{ active: activeSection === 'ex-sticky-header' }"
        @click="navClick"
      >Sticky Header</a>
      <a
        href="#ex-groups"
        :class="{ active: activeSection === 'ex-groups' }"
        @click="navClick"
      >Column Groups</a>
      <a
        href="#ex-loading"
        :class="{ active: activeSection === 'ex-loading' }"
        @click="navClick"
      >Loading State</a>
      <a
        href="#ex-empty"
        :class="{ active: activeSection === 'ex-empty' }"
        @click="navClick"
      >Empty State</a>
      <a
        href="#ex-caption"
        :class="{ active: activeSection === 'ex-caption' }"
        @click="navClick"
      >Caption</a>

      <div class="nav-group">
        API Reference
      </div>
      <a
        href="#api-slottable"
        :class="{ active: activeSection === 'api-slottable' }"
        @click="navClick"
      >SlotTable</a>
      <a
        href="#api-column"
        :class="{ active: activeSection === 'api-column' }"
        @click="navClick"
      >SlotTableColumn</a>
      <a
        href="#api-columngroup"
        :class="{ active: activeSection === 'api-columngroup' }"
        @click="navClick"
      >SlotTableColumnGroup</a>
      <a
        href="#api-cellscope"
        :class="{ active: activeSection === 'api-cellscope' }"
        @click="navClick"
      >Cell Slot Scope</a>
    </nav>

  </aside>

  <!-- Main content -->
  <main class="main-content">
    <!-- ═══════════════════════════════════════════════ -->
    <!-- HERO -->
    <!-- ═══════════════════════════════════════════════ -->
    <section
      id="hero"
      class="hero"
    >
      <h1>vue-slottable</h1>
      <p class="hero-tagline">
        A flexible, slot-based table component for Vue 3.
      </p>
      <p class="hero-sub">
        Define columns with scoped slots. Add sticky columns, column groups, footers, sorting, and more &mdash; with zero CSS opinions.
      </p>
      <div class="hero-badges">
        <a href="https://www.npmjs.com/package/vue-slottable"><img
          src="https://img.shields.io/npm/v/vue-slottable.svg"
          alt="npm"
        ></a>
        <a href="https://github.com/muraliavarma/vue-slot-table"><img
          src="https://img.shields.io/github/license/muraliavarma/vue-slot-table.svg"
          alt="license"
        ></a>
        <a href="https://github.com/muraliavarma/vue-slot-table/actions/workflows/ci.yml"><img
          src="https://github.com/muraliavarma/vue-slot-table/actions/workflows/ci.yml/badge.svg"
          alt="CI"
        ></a>
      </div>
      <div class="hero-install">
        <code>npm install vue-slottable</code>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- FEATURES -->
    <!-- ═══════════════════════════════════════════════ -->
    <section
      id="features"
      class="doc-section"
    >
      <h2>Features</h2>
      <div class="features-grid">
        <div class="feature-card">
          <h3>Slot-Based API</h3>
          <p>Define columns as child components with <code>#header</code>, <code>#cell</code>, and <code>#footer</code> scoped slots.</p>
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
          <h3>Column Footers</h3>
          <p>Add <code>#footer</code> slots per column for totals, averages, or any summary row in <code>&lt;tfoot&gt;</code>.</p>
        </div>
        <div class="feature-card">
          <h3>Column Visibility</h3>
          <p>Toggle columns on and off with the <code>:visible</code> prop. Great for responsive layouts or user preferences.</p>
        </div>
        <div class="feature-card">
          <h3>Loading State</h3>
          <p>Show a <code>#loading</code> slot while data is being fetched. Control with the <code>:loading</code> boolean prop.</p>
        </div>
        <div class="feature-card">
          <h3>Sticky Header</h3>
          <p>Keep the <code>&lt;thead&gt;</code> pinned while scrolling with <code>sticky-header</code>. Perfect for long tables.</p>
        </div>
        <div class="feature-card">
          <h3>Cell Click Event</h3>
          <p>Handle cell-level clicks with <code>@cell-click</code>. Get the row index, column index, and row data.</p>
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
          <h3>Per-Column Classes</h3>
          <p>Apply custom classes to cells and headers with <code>td-class</code> and <code>th-class</code> props.</p>
        </div>
        <div class="feature-card">
          <h3>Table Caption</h3>
          <p>Improve accessibility with the <code>caption</code> prop. Renders a proper <code>&lt;caption&gt;</code> element.</p>
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
          <h3>TypeScript Support</h3>
          <p>Full type declarations included. Get autocomplete and type checking out of the box.</p>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- INSTALLATION -->
    <!-- ═══════════════════════════════════════════════ -->
    <section
      id="installation"
      class="doc-section"
    >
      <h2>Installation</h2>
      <p class="section-desc">
        Requires Vue 3.4+.
      </p>
      <div class="code-block">
        <div class="code-toolbar">
          <span class="code-lang">bash</span>
        </div>
        <pre><code>npm install vue-slottable</code></pre>
      </div>
      <p
        class="section-desc"
        style="margin-top: 1rem;"
      >
        Then import the components you need:
      </p>
      <div class="code-block">
        <div class="code-toolbar">
          <span class="code-lang">js</span>
        </div>
        <pre><code>import { SlotTable, SlotTableColumn, SlotTableColumnGroup } from 'vue-slottable'</code></pre>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- EXAMPLE: BASIC -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section
      id="ex-basic"
      class="doc-section"
    >
      <h2>Basic Table</h2>
      <p class="section-desc">
        The simplest usage &mdash; define columns with <code>#header</code> and <code>#cell</code> slots.
      </p>
      <div class="example-split">
        <div class="example-preview">
          <SlotTable
            :rows="employees.slice(0, 4)"
            table-class="demo-table"
          >
            <SlotTableColumn>
              <template #header>
                Name
              </template>
              <template #cell="{ row }">
                {{ row.name }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn>
              <template #header>
                Role
              </template>
              <template #cell="{ row }">
                {{ row.role }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn>
              <template #header>
                Department
              </template>
              <template #cell="{ row }">
                {{ row.department }}
              </template>
            </SlotTableColumn>
          </SlotTable>
        </div>
        <div class="example-code">
          <div class="code-toolbar">
            <span class="code-lang">vue</span>
            <button
              class="copy-btn"
              @click="copyCode('basic')"
            >
              {{ copiedKey === 'basic' ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre><code>{{ code.basic }}</code></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- EXAMPLE: CUSTOM CELLS -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section
      id="ex-custom"
      class="doc-section"
    >
      <h2>Custom Cell Rendering</h2>
      <p class="section-desc">
        Use any HTML or Vue components inside cell slots. The scoped slot receives <code>{ row, rowIndex, columnIndex }</code>.
      </p>
      <div class="example-split">
        <div class="example-preview">
          <SlotTable
            :rows="products"
            table-class="demo-table"
            hoverable
          >
            <SlotTableColumn width="100px">
              <template #header>
                SKU
              </template>
              <template #cell="{ row }">
                <code>{{ row.sku }}</code>
              </template>
            </SlotTableColumn>
            <SlotTableColumn>
              <template #header>
                Product
              </template>
              <template #cell="{ row }">
                <strong>{{ row.name }}</strong>
              </template>
            </SlotTableColumn>
            <SlotTableColumn>
              <template #header>
                Category
              </template>
              <template #cell="{ row }">
                <span
                  class="pill"
                  :class="'pill--' + row.category.toLowerCase()"
                >{{ row.category }}</span>
              </template>
            </SlotTableColumn>
            <SlotTableColumn align="right">
              <template #header>
                Price
              </template>
              <template #cell="{ row }">
                {{ currency(row.price) }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn align="center">
              <template #header>
                Rating
              </template>
              <template #cell="{ row }">
                <span class="stars">{{ stars(row.rating) }}</span>
              </template>
            </SlotTableColumn>
            <SlotTableColumn align="right">
              <template #header>
                Stock
              </template>
              <template #cell="{ row }">
                <span :class="{ 'out-of-stock': row.stock === 0 }">
                  {{ row.stock === 0 ? 'Out of stock' : row.stock }}
                </span>
              </template>
            </SlotTableColumn>
          </SlotTable>
        </div>
        <div class="example-code">
          <div class="code-toolbar">
            <span class="code-lang">vue</span>
            <button
              class="copy-btn"
              @click="copyCode('customCells')"
            >
              {{ copiedKey === 'customCells' ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre><code>{{ code.customCells }}</code></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- EXAMPLE: STRIPED & BORDERED -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section
      id="ex-striped"
      class="doc-section"
    >
      <h2>Striped &amp; Bordered</h2>
      <p class="section-desc">
        Add <code>striped</code> and <code>bordered</code> props for classic table styling.
      </p>
      <div class="example-split">
        <div class="example-preview">
          <SlotTable
            :rows="employees.slice(0, 5)"
            table-class="demo-table"
            striped
            bordered
          >
            <SlotTableColumn>
              <template #header>
                Name
              </template>
              <template #cell="{ row }">
                {{ row.name }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn align="center">
              <template #header>
                Age
              </template>
              <template #cell="{ row }">
                {{ row.age }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn>
              <template #header>
                Department
              </template>
              <template #cell="{ row }">
                {{ row.department }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn align="right">
              <template #header>
                Salary
              </template>
              <template #cell="{ row }">
                {{ currency(row.salary) }}
              </template>
            </SlotTableColumn>
          </SlotTable>
        </div>
        <div class="example-code">
          <div class="code-toolbar">
            <span class="code-lang">vue</span>
            <button
              class="copy-btn"
              @click="copyCode('stripedBordered')"
            >
              {{ copiedKey === 'stripedBordered' ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre><code>{{ code.stripedBordered }}</code></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- EXAMPLE: SORTING -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section
      id="ex-sorting"
      class="doc-section"
    >
      <h2>Sorting</h2>
      <p class="section-desc">
        Use the <code>@header-click</code> event to implement sorting. Click any column header to sort.
      </p>
      <div class="example-split">
        <div class="example-preview">
          <SlotTable
            :rows="sortedEmployees"
            table-class="demo-table"
            hoverable
            row-key="id"
            @header-click="onSortClick"
          >
            <SlotTableColumn>
              <template #header>
                <span class="sortable">Name{{ sortIndicator(0) }}</span>
              </template>
              <template #cell="{ row }">
                {{ row.name }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn align="center">
              <template #header>
                <span class="sortable">Age{{ sortIndicator(1) }}</span>
              </template>
              <template #cell="{ row }">
                {{ row.age }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn>
              <template #header>
                <span class="sortable">Role{{ sortIndicator(2) }}</span>
              </template>
              <template #cell="{ row }">
                {{ row.role }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn>
              <template #header>
                <span class="sortable">Department{{ sortIndicator(3) }}</span>
              </template>
              <template #cell="{ row }">
                {{ row.department }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn align="right">
              <template #header>
                <span class="sortable">Salary{{ sortIndicator(4) }}</span>
              </template>
              <template #cell="{ row }">
                {{ currency(row.salary) }}
              </template>
            </SlotTableColumn>
          </SlotTable>
        </div>
        <div class="example-code">
          <div class="code-toolbar">
            <span class="code-lang">vue</span>
            <button
              class="copy-btn"
              @click="copyCode('sorting')"
            >
              {{ copiedKey === 'sorting' ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre><code>{{ code.sorting }}</code></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- EXAMPLE: ROW EVENTS -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section
      id="ex-row-events"
      class="doc-section"
    >
      <h2>Row Click &amp; Dynamic Row Classes</h2>
      <p class="section-desc">
        Handle row clicks with <code>@row-click</code> and apply dynamic classes with <code>:row-class</code>. Inactive rows are dimmed.
      </p>
      <div class="example-split">
        <div class="example-preview">
          <div
            v-if="clickedRow"
            class="click-banner"
          >
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
              <template #header>
                Name
              </template>
              <template #cell="{ row }">
                {{ row.name }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn>
              <template #header>
                Role
              </template>
              <template #cell="{ row }">
                {{ row.role }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn>
              <template #header>
                Status
              </template>
              <template #cell="{ row }">
                <span
                  class="status-dot"
                  :class="'status--' + row.status"
                />
                {{ row.status }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn align="right">
              <template #header>
                Salary
              </template>
              <template #cell="{ row }">
                {{ currency(row.salary) }}
              </template>
            </SlotTableColumn>
          </SlotTable>
        </div>
        <div class="example-code">
          <div class="code-toolbar">
            <span class="code-lang">vue</span>
            <button
              class="copy-btn"
              @click="copyCode('rowEvents')"
            >
              {{ copiedKey === 'rowEvents' ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre><code>{{ code.rowEvents }}</code></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- EXAMPLE: STICKY COLUMNS -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section
      id="ex-sticky"
      class="doc-section"
    >
      <h2>Sticky Columns</h2>
      <p class="section-desc">
        Pin columns to the left or right edge with <code>sticky="left"</code> or <code>sticky="right"</code>. Scroll horizontally to see.
      </p>
      <div class="example-split example-split--full">
        <div class="example-preview scroll-container">
          <SlotTable
            :rows="employees"
            table-class="demo-table demo-table-wide"
            hoverable
          >
            <SlotTableColumn
              sticky="left"
              min-width="200px"
            >
              <template #header>
                Name (sticky)
              </template>
              <template #cell="{ row }">
                <strong>{{ row.name }}</strong>
              </template>
            </SlotTableColumn>
            <SlotTableColumn min-width="200px">
              <template #header>
                Role
              </template>
              <template #cell="{ row }">
                {{ row.role }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn min-width="200px">
              <template #header>
                Department
              </template>
              <template #cell="{ row }">
                {{ row.department }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn
              min-width="150px"
              align="center"
            >
              <template #header>
                Age
              </template>
              <template #cell="{ row }">
                {{ row.age }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn min-width="200px">
              <template #header>
                Status
              </template>
              <template #cell="{ row }">
                {{ row.status }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn
              sticky="right"
              min-width="150px"
              align="right"
            >
              <template #header>
                Salary (sticky)
              </template>
              <template #cell="{ row }">
                {{ currency(row.salary) }}
              </template>
            </SlotTableColumn>
          </SlotTable>
        </div>
        <div class="example-code">
          <div class="code-toolbar">
            <span class="code-lang">vue</span>
            <button
              class="copy-btn"
              @click="copyCode('stickyColumns')"
            >
              {{ copiedKey === 'stickyColumns' ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre><code>{{ code.stickyColumns }}</code></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- EXAMPLE: COLUMN GROUPS -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section
      id="ex-groups"
      class="doc-section"
    >
      <h2>Column Groups</h2>
      <p class="section-desc">
        Add grouped header rows with <code>&lt;SlotTableColumnGroup&gt;</code> and <code>:colspan</code>.
      </p>
      <div class="example-split">
        <div class="example-preview">
          <SlotTable
            :rows="employees.slice(0, 5)"
            table-class="demo-table"
            bordered
          >
            <SlotTableColumnGroup :colspan="2">
              Identity
            </SlotTableColumnGroup>
            <SlotTableColumnGroup :colspan="2">
              Position
            </SlotTableColumnGroup>
            <SlotTableColumnGroup :colspan="1">
              Pay
            </SlotTableColumnGroup>

            <SlotTableColumn>
              <template #header>
                Name
              </template>
              <template #cell="{ row }">
                {{ row.name }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn align="center">
              <template #header>
                Age
              </template>
              <template #cell="{ row }">
                {{ row.age }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn>
              <template #header>
                Role
              </template>
              <template #cell="{ row }">
                {{ row.role }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn>
              <template #header>
                Department
              </template>
              <template #cell="{ row }">
                {{ row.department }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn align="right">
              <template #header>
                Salary
              </template>
              <template #cell="{ row }">
                {{ currency(row.salary) }}
              </template>
            </SlotTableColumn>
          </SlotTable>
        </div>
        <div class="example-code">
          <div class="code-toolbar">
            <span class="code-lang">vue</span>
            <button
              class="copy-btn"
              @click="copyCode('columnGroups')"
            >
              {{ copiedKey === 'columnGroups' ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre><code>{{ code.columnGroups }}</code></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- EXAMPLE: EMPTY STATE -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section
      id="ex-empty"
      class="doc-section"
    >
      <h2>Empty State</h2>
      <p class="section-desc">
        Provide an <code>#empty</code> slot to display when there are no rows.
      </p>
      <div class="example-split">
        <div class="example-preview">
          <SlotTable
            :rows="emptyRows"
            table-class="demo-table"
          >
            <template #empty>
              <div class="empty-state">
                <div class="empty-icon">
                  &#128269;
                </div>
                <p><strong>No data found</strong></p>
                <p>Try adjusting your search or filters.</p>
              </div>
            </template>
            <SlotTableColumn>
              <template #header>
                Name
              </template>
              <template #cell="{ row }">
                {{ row.name }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn>
              <template #header>
                Email
              </template>
              <template #cell="{ row }">
                {{ row.email }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn>
              <template #header>
                Status
              </template>
              <template #cell="{ row }">
                {{ row.status }}
              </template>
            </SlotTableColumn>
          </SlotTable>
        </div>
        <div class="example-code">
          <div class="code-toolbar">
            <span class="code-lang">vue</span>
            <button
              class="copy-btn"
              @click="copyCode('emptyState')"
            >
              {{ copiedKey === 'emptyState' ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre><code>{{ code.emptyState }}</code></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- EXAMPLE: COLUMN SIZING -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section
      id="ex-sizing"
      class="doc-section"
    >
      <h2>Column Width &amp; Alignment</h2>
      <p class="section-desc">
        Control column sizing with <code>width</code> and <code>min-width</code>. Set text alignment with <code>align</code>.
      </p>
      <div class="example-split">
        <div class="example-preview">
          <SlotTable
            :rows="products.slice(0, 4)"
            table-class="demo-table"
            striped
          >
            <SlotTableColumn
              width="60px"
              align="center"
            >
              <template #header>
                #
              </template>
              <template #cell="{ rowIndex }">
                {{ rowIndex + 1 }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn min-width="200px">
              <template #header>
                Product
              </template>
              <template #cell="{ row }">
                {{ row.name }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn
              width="120px"
              align="center"
            >
              <template #header>
                Category
              </template>
              <template #cell="{ row }">
                {{ row.category }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn
              width="100px"
              align="right"
            >
              <template #header>
                Price
              </template>
              <template #cell="{ row }">
                {{ currency(row.price) }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn
              width="80px"
              align="right"
            >
              <template #header>
                Stock
              </template>
              <template #cell="{ row }">
                {{ row.stock }}
              </template>
            </SlotTableColumn>
          </SlotTable>
        </div>
        <div class="example-code">
          <div class="code-toolbar">
            <span class="code-lang">vue</span>
            <button
              class="copy-btn"
              @click="copyCode('columnSizing')"
            >
              {{ copiedKey === 'columnSizing' ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre><code>{{ code.columnSizing }}</code></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- EXAMPLE: FOOTER / TOTALS -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section
      id="ex-footer"
      class="doc-section"
    >
      <h2>Footer / Totals</h2>
      <p class="section-desc">
        Add a <code>#footer</code> slot to any column. The component renders a <code>&lt;tfoot&gt;</code> row automatically.
      </p>
      <div class="example-split">
        <div class="example-preview">
          <SlotTable
            :rows="products"
            table-class="demo-table"
            bordered
          >
            <SlotTableColumn>
              <template #header>
                Product
              </template>
              <template #cell="{ row }">
                {{ row.name }}
              </template>
              <template #footer>
                <strong>Totals / Averages</strong>
              </template>
            </SlotTableColumn>
            <SlotTableColumn align="right">
              <template #header>
                Price
              </template>
              <template #cell="{ row }">
                {{ currency(row.price) }}
              </template>
              <template #footer>
                <strong>Avg {{ currency(avgPrice) }}</strong>
              </template>
            </SlotTableColumn>
            <SlotTableColumn align="right">
              <template #header>
                Stock
              </template>
              <template #cell="{ row }">
                {{ row.stock }}
              </template>
              <template #footer>
                <strong>{{ totalStock }}</strong>
              </template>
            </SlotTableColumn>
            <SlotTableColumn align="center">
              <template #header>
                Rating
              </template>
              <template #cell="{ row }">
                <span class="stars">{{ stars(row.rating) }}</span>
              </template>
              <template #footer>
                <strong>{{ avgRating }}</strong>
              </template>
            </SlotTableColumn>
          </SlotTable>
        </div>
        <div class="example-code">
          <div class="code-toolbar">
            <span class="code-lang">vue</span>
            <button
              class="copy-btn"
              @click="copyCode('footer')"
            >
              {{ copiedKey === 'footer' ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre><code>{{ code.footer }}</code></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- EXAMPLE: COLUMN VISIBILITY -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section
      id="ex-visibility"
      class="doc-section"
    >
      <h2>Column Visibility</h2>
      <p class="section-desc">
        Toggle columns on and off with <code>:visible</code>. Use the checkboxes to try it live.
      </p>
      <div class="example-split">
        <div class="example-preview">
          <div class="toggle-bar">
            <label class="toggle-label"><input
              v-model="showAge"
              type="checkbox"
            > Age</label>
            <label class="toggle-label"><input
              v-model="showDepartment"
              type="checkbox"
            > Department</label>
            <label class="toggle-label"><input
              v-model="showSalary"
              type="checkbox"
            > Salary</label>
          </div>
          <SlotTable
            :rows="employees.slice(0, 5)"
            table-class="demo-table"
            hoverable
          >
            <SlotTableColumn>
              <template #header>
                Name
              </template>
              <template #cell="{ row }">
                {{ row.name }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn
              :visible="showAge"
              align="center"
            >
              <template #header>
                Age
              </template>
              <template #cell="{ row }">
                {{ row.age }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn>
              <template #header>
                Role
              </template>
              <template #cell="{ row }">
                {{ row.role }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn :visible="showDepartment">
              <template #header>
                Department
              </template>
              <template #cell="{ row }">
                {{ row.department }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn
              :visible="showSalary"
              align="right"
            >
              <template #header>
                Salary
              </template>
              <template #cell="{ row }">
                {{ currency(row.salary) }}
              </template>
            </SlotTableColumn>
          </SlotTable>
        </div>
        <div class="example-code">
          <div class="code-toolbar">
            <span class="code-lang">vue</span>
            <button
              class="copy-btn"
              @click="copyCode('visibility')"
            >
              {{ copiedKey === 'visibility' ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre><code>{{ code.visibility }}</code></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- EXAMPLE: LOADING -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section
      id="ex-loading"
      class="doc-section"
    >
      <h2>Loading State</h2>
      <p class="section-desc">
        Show a loading indicator while data is being fetched. Toggle the <code>:loading</code> prop.
      </p>
      <div class="example-split">
        <div class="example-preview">
          <div class="toggle-bar">
            <label class="toggle-label"><input
              v-model="isLoading"
              type="checkbox"
            > Simulate loading</label>
          </div>
          <SlotTable
            :rows="employees.slice(0, 3)"
            table-class="demo-table"
            :loading="isLoading"
          >
            <template #loading>
              <div class="loading-state">
                <div class="spinner" />
                <p>Loading data...</p>
              </div>
            </template>
            <SlotTableColumn>
              <template #header>
                Name
              </template>
              <template #cell="{ row }">
                {{ row.name }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn>
              <template #header>
                Role
              </template>
              <template #cell="{ row }">
                {{ row.role }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn>
              <template #header>
                Department
              </template>
              <template #cell="{ row }">
                {{ row.department }}
              </template>
            </SlotTableColumn>
          </SlotTable>
        </div>
        <div class="example-code">
          <div class="code-toolbar">
            <span class="code-lang">vue</span>
            <button
              class="copy-btn"
              @click="copyCode('loading')"
            >
              {{ copiedKey === 'loading' ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre><code>{{ code.loading }}</code></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- EXAMPLE: STICKY HEADER -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section
      id="ex-sticky-header"
      class="doc-section"
    >
      <h2>Sticky Header</h2>
      <p class="section-desc">
        Add <code>sticky-header</code> to keep the <code>&lt;thead&gt;</code> pinned while scrolling. Wrap in a fixed-height container.
      </p>
      <div class="example-split">
        <div class="example-preview">
          <div class="sticky-header-container">
            <SlotTable
              :rows="employees"
              table-class="demo-table"
              sticky-header
              striped
              hoverable
            >
              <SlotTableColumn>
                <template #header>
                  Name
                </template>
                <template #cell="{ row }">
                  {{ row.name }}
                </template>
              </SlotTableColumn>
              <SlotTableColumn align="center">
                <template #header>
                  Age
                </template>
                <template #cell="{ row }">
                  {{ row.age }}
                </template>
              </SlotTableColumn>
              <SlotTableColumn>
                <template #header>
                  Department
                </template>
                <template #cell="{ row }">
                  {{ row.department }}
                </template>
              </SlotTableColumn>
              <SlotTableColumn align="right">
                <template #header>
                  Salary
                </template>
                <template #cell="{ row }">
                  {{ currency(row.salary) }}
                </template>
              </SlotTableColumn>
            </SlotTable>
          </div>
        </div>
        <div class="example-code">
          <div class="code-toolbar">
            <span class="code-lang">vue</span>
            <button
              class="copy-btn"
              @click="copyCode('stickyHeader')"
            >
              {{ copiedKey === 'stickyHeader' ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre><code>{{ code.stickyHeader }}</code></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- EXAMPLE: CELL CLICK -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section
      id="ex-cell-click"
      class="doc-section"
    >
      <h2>Cell Click</h2>
      <p class="section-desc">
        Handle individual cell clicks with <code>@cell-click</code>. Receives <code>(rowIndex, columnIndex, row)</code>.
      </p>
      <div class="example-split">
        <div class="example-preview">
          <div
            v-if="clickedCell"
            class="click-banner"
          >
            Clicked cell [{{ clickedCell.rowIndex }}, {{ clickedCell.columnIndex }}]: <strong>{{ clickedCell.value }}</strong>
          </div>
          <SlotTable
            :rows="employees.slice(0, 4)"
            table-class="demo-table"
            @cell-click="onCellClick"
          >
            <SlotTableColumn>
              <template #header>
                Name
              </template>
              <template #cell="{ row }">
                <span class="clickable-cell">{{ row.name }}</span>
              </template>
            </SlotTableColumn>
            <SlotTableColumn>
              <template #header>
                Role
              </template>
              <template #cell="{ row }">
                {{ row.role }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn>
              <template #header>
                Department
              </template>
              <template #cell="{ row }">
                {{ row.department }}
              </template>
            </SlotTableColumn>
          </SlotTable>
        </div>
        <div class="example-code">
          <div class="code-toolbar">
            <span class="code-lang">vue</span>
            <button
              class="copy-btn"
              @click="copyCode('cellClick')"
            >
              {{ copiedKey === 'cellClick' ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre><code>{{ code.cellClick }}</code></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- EXAMPLE: CAPTION -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section
      id="ex-caption"
      class="doc-section"
    >
      <h2>Table Caption</h2>
      <p class="section-desc">
        Improve accessibility with a <code>caption</code> prop. Renders a proper <code>&lt;caption&gt;</code> element.
      </p>
      <div class="example-split">
        <div class="example-preview">
          <SlotTable
            :rows="employees.slice(0, 4)"
            table-class="demo-table"
            caption="Q4 2025 Employee Directory"
            bordered
            striped
          >
            <SlotTableColumn>
              <template #header>
                Name
              </template>
              <template #cell="{ row }">
                {{ row.name }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn>
              <template #header>
                Role
              </template>
              <template #cell="{ row }">
                {{ row.role }}
              </template>
            </SlotTableColumn>
            <SlotTableColumn>
              <template #header>
                Department
              </template>
              <template #cell="{ row }">
                {{ row.department }}
              </template>
            </SlotTableColumn>
          </SlotTable>
        </div>
        <div class="example-code">
          <div class="code-toolbar">
            <span class="code-lang">vue</span>
            <button
              class="copy-btn"
              @click="copyCode('caption')"
            >
              {{ copiedKey === 'caption' ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre><code>{{ code.caption }}</code></pre>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- API: SLOTTABLE -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section
      id="api-slottable"
      class="doc-section"
    >
      <h2>SlotTable</h2>
      <p class="section-desc">
        The main table component. Accepts rows and renders columns defined as children.
      </p>

      <h3>Props</h3>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>rows</code></td><td>Array</td><td><em>required</em></td><td>Array of row data objects</td></tr>
            <tr><td><code>table-class</code></td><td>String</td><td><code>''</code></td><td>CSS class applied to the <code>&lt;table&gt;</code></td></tr>
            <tr><td><code>row-key</code></td><td>String | Function</td><td>&mdash;</td><td>Property name or <code>(row, index) =&gt; key</code> for <code>:key</code> on each <code>&lt;tr&gt;</code></td></tr>
            <tr><td><code>row-class</code></td><td>String | Object | Function</td><td>&mdash;</td><td>Class(es) for each <code>&lt;tr&gt;</code>. Function receives <code>(row, index)</code></td></tr>
            <tr><td><code>striped</code></td><td>Boolean</td><td><code>false</code></td><td>Adds <code>.slot-table-striped</code> to odd rows</td></tr>
            <tr><td><code>hoverable</code></td><td>Boolean</td><td><code>false</code></td><td>Adds <code>.slot-table-hoverable</code> to all rows</td></tr>
            <tr><td><code>bordered</code></td><td>Boolean</td><td><code>false</code></td><td>Adds <code>.slot-table-bordered</code> to the table</td></tr>
            <tr><td><code>loading</code></td><td>Boolean</td><td><code>false</code></td><td>When true, shows the <code>#loading</code> slot instead of rows</td></tr>
            <tr><td><code>sticky-header</code></td><td>Boolean</td><td><code>false</code></td><td>Makes <code>&lt;thead&gt;</code> stick to the top of a scrollable container</td></tr>
            <tr><td><code>caption</code></td><td>String</td><td><code>''</code></td><td>Renders a <code>&lt;caption&gt;</code> element for accessibility</td></tr>
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
            <tr><td><code>cell-click</code></td><td><code>(rowIndex, columnIndex, row)</code></td><td>Fired when a data cell is clicked</td></tr>
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
            <tr><td><code>loading</code></td><td>Content displayed when <code>loading</code> is true</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- API: SLOTTABLECOLUMN -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section
      id="api-column"
      class="doc-section"
    >
      <h2>SlotTableColumn</h2>
      <p class="section-desc">
        Renderless component that defines a single column. Must be a direct child of <code>&lt;SlotTable&gt;</code>.
      </p>

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
            <tr><td><code>visible</code></td><td>Boolean</td><td><code>true</code></td><td>Show or hide the column dynamically</td></tr>
            <tr><td><code>td-class</code></td><td>String | Object</td><td>&mdash;</td><td>Custom CSS class(es) applied to <code>&lt;td&gt;</code> cells</td></tr>
            <tr><td><code>th-class</code></td><td>String | Object</td><td>&mdash;</td><td>Custom CSS class(es) applied to the <code>&lt;th&gt;</code> header</td></tr>
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
            <tr><td><code>footer</code></td><td>&mdash;</td><td>Footer content rendered in <code>&lt;tfoot&gt;</code></td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- API: SLOTTABLECOLUMNGROUP -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section
      id="api-columngroup"
      class="doc-section"
    >
      <h2>SlotTableColumnGroup</h2>
      <p class="section-desc">
        Renderless component for grouped header rows. Must be a direct child of <code>&lt;SlotTable&gt;</code>.
      </p>

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

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- API: CELL SLOT SCOPE -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section
      id="api-cellscope"
      class="doc-section"
    >
      <h2>Cell Slot Scope</h2>
      <p class="section-desc">
        The <code>#cell</code> scoped slot receives the following properties:
      </p>

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
      <p class="section-desc">
        The component applies these classes that you can style:
      </p>
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
            <tr><td><code>.slot-table-empty</code></td><td><code>&lt;td&gt;</code></td><td>The cell wrapping the <code>#empty</code> slot</td></tr>
            <tr><td><code>.slot-table-loading</code></td><td><code>&lt;td&gt;</code></td><td>The cell wrapping the <code>#loading</code> slot</td></tr>
            <tr><td><code>.slot-table-caption</code></td><td><code>&lt;caption&gt;</code></td><td>When <code>caption</code> prop is set</td></tr>
            <tr><td><code>.slot-table-sticky-header</code></td><td><code>&lt;thead&gt;</code></td><td>When <code>sticky-header</code> prop is true</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- FOOTER -->
    <!-- ═══════════════════════════════════════════════════ -->
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
   CSS CUSTOM PROPERTIES (Light / Dark)
   ═══════════════════════════════════════════════════════ */
:root {
  --bg-page: #f8fafc;
  --bg-surface: #ffffff;
  --bg-surface-alt: #f8fafc;
  --bg-hover: #eff6ff;
  --bg-code-toolbar: #0f172a;
  --bg-code: #1e293b;
  --bg-code-inline: #f1f5f9;
  --bg-install: #1e293b;
  --bg-version: #f1f5f9;
  --border: #e2e8f0;
  --border-strong: #cbd5e1;
  --border-light: #f1f5f9;
  --text-primary: #1e293b;
  --text-secondary: #475569;
  --text-muted: #64748b;
  --text-faint: #94a3b8;
  --text-heading-sub: #334155;
  --text-accent: #3b82f6;
  --text-accent-light: #60a5fa;
  --text-code: #c026d3;
  --text-code-block: #e2e8f0;
  --text-install: #e2e8f0;
  --text-banner: #1e40af;
  --bg-banner: #eff6ff;
  --border-banner: #bfdbfe;
  --shadow-sticky: rgba(0,0,0,0.06);
  --shadow-card: rgba(0,0,0,0.04);
  --gradient-start: #1e293b;
  --gradient-end: #3b82f6;
  --bg-nav-active: #eff6ff;
  color-scheme: light;
}

html.dark {
  --bg-page: #0f172a;
  --bg-surface: #1e293b;
  --bg-surface-alt: #1a2536;
  --bg-hover: #1e3a5f;
  --bg-code-toolbar: #020617;
  --bg-code: #0f172a;
  --bg-code-inline: #334155;
  --bg-install: #0f172a;
  --bg-version: #334155;
  --border: #334155;
  --border-strong: #475569;
  --border-light: #1e293b;
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --text-muted: #94a3b8;
  --text-faint: #64748b;
  --text-heading-sub: #cbd5e1;
  --text-accent: #60a5fa;
  --text-accent-light: #93c5fd;
  --text-code: #e879f9;
  --text-code-block: #e2e8f0;
  --text-install: #e2e8f0;
  --text-banner: #93c5fd;
  --bg-banner: #1e293b;
  --border-banner: #1e3a5f;
  --shadow-sticky: rgba(0,0,0,0.3);
  --shadow-card: rgba(0,0,0,0.2);
  --gradient-start: #94a3b8;
  --gradient-end: #60a5fa;
  --bg-nav-active: #1e3a5f;
  color-scheme: dark;
}

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
  background: var(--bg-page);
  color: var(--text-primary);
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
  background: var(--bg-surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow-y: auto;
}

.main-content {
  margin-left: 260px;
  max-width: 1200px;
  padding: 0 2.5rem 4rem;
}

/* ═══════════════════════════════════════════════════════
   SIDEBAR
   ═══════════════════════════════════════════════════════ */
.sidebar-header {
  padding: 1.25rem 1.5rem 0.75rem;
  border-bottom: 1px solid var(--border-light);
}

.sidebar-header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-brand {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-primary);
  text-decoration: none;
  display: block;
}

.sidebar-actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.sidebar-icon-link {
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border-radius: 6px;
  transition: color 0.15s;
}

.sidebar-icon-link:hover {
  color: var(--text-accent);
}

.dark-toggle {
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.3rem;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, border-color 0.15s;
}

.dark-toggle:hover {
  color: var(--text-accent);
  border-color: var(--text-accent);
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
  color: var(--text-muted);
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}

.sidebar-nav a:hover {
  color: var(--text-primary);
}

.sidebar-nav a.active {
  color: var(--text-accent);
  border-left-color: var(--text-accent);
  background: var(--bg-nav-active);
  font-weight: 500;
}

.nav-group {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-faint);
  font-weight: 600;
  padding: 1.25rem 1.5rem 0.3rem;
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
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  box-shadow: 0 1px 3px var(--shadow-sticky);
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
    padding: 0 1rem 3rem;
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
  background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-tagline {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
  font-weight: 500;
}

.hero-sub {
  font-size: 0.95rem;
  color: var(--text-faint);
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
  background: var(--bg-install);
  color: var(--text-install);
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
  color: var(--text-heading-sub);
}

.section-desc {
  color: var(--text-muted);
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
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem 1.15rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.feature-card:hover {
  border-color: var(--border-strong);
  box-shadow: 0 2px 8px var(--shadow-card);
}

.feature-card h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.2rem;
}

.feature-card p {
  font-size: 0.8rem;
  color: var(--text-muted);
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
  background: var(--bg-code-toolbar);
}

.code-lang {
  font-size: 0.65rem;
  color: var(--text-faint);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.code-block pre {
  background: var(--bg-code);
  color: var(--text-code-block);
  padding: 0.85rem 1rem;
  margin: 0;
  overflow-x: auto;
  font-size: 0.82rem;
  line-height: 1.55;
}

/* ═══════════════════════════════════════════════════════
   SIDE-BY-SIDE EXAMPLE BLOCKS
   ═══════════════════════════════════════════════════════ */
.example-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  min-height: 200px;
}

.example-split--full {
  grid-template-columns: 1fr;
}

.example-split--full .example-code {
  border-left: none;
  border-top: 1px solid var(--border);
}

.example-preview {
  padding: 1.25rem;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.example-code {
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.example-code .code-toolbar {
  flex-shrink: 0;
}

.example-code pre {
  background: var(--bg-code);
  color: var(--text-code-block);
  padding: 1rem;
  margin: 0;
  overflow: auto;
  font-size: 0.78rem;
  line-height: 1.55;
  flex: 1;
  max-height: 450px;
}

.scroll-container {
  overflow-x: auto;
}

@media (max-width: 1024px) {
  .example-split {
    grid-template-columns: 1fr;
  }

  .example-code {
    border-left: none;
    border-top: 1px solid var(--border);
  }

  .example-code pre {
    max-height: 350px;
  }
}

.copy-btn {
  font-size: 0.7rem;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--border-strong);
  border-radius: 4px;
  padding: 0.15rem 0.5rem;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  font-family: inherit;
}

.copy-btn:hover {
  color: var(--text-accent-light);
  border-color: var(--text-accent-light);
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
  color: var(--text-muted);
  background: var(--bg-surface-alt);
  border-bottom: 2px solid var(--border);
}

.api-table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border-light);
  vertical-align: top;
}

.api-table tbody tr:hover td {
  background: var(--bg-surface-alt);
}

/* ═══════════════════════════════════════════════════════
   DEMO TABLE STYLES
   ═══════════════════════════════════════════════════════ */
.demo-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.demo-table th,
.demo-table td {
  padding: 0.5rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
  background: var(--bg-surface);
}

.demo-table thead th {
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  border-bottom: 2px solid var(--border-strong);
}

.demo-table tfoot td {
  border-top: 2px solid var(--border-strong);
  border-bottom: none;
  font-size: 0.82rem;
  color: var(--text-heading-sub);
  background: var(--bg-surface-alt);
}

.demo-table caption {
  caption-side: top;
  text-align: left;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 0.5rem 0.75rem;
  background: var(--bg-surface-alt);
  border-bottom: 1px solid var(--border);
}

.demo-table-wide {
  min-width: 1100px;
}

/* ── Slot-table built-in class styling ─────────────── */
.slot-table-striped td {
  background: var(--bg-surface-alt);
}

.slot-table-hoverable {
  cursor: pointer;
  transition: background 0.15s;
}

.slot-table-hoverable:hover td {
  background: var(--bg-hover);
}

.slot-table-bordered td,
.slot-table-bordered th {
  border: 1px solid var(--border);
}

.slot-table-empty {
  text-align: center;
  padding: 2rem !important;
}

.slot-table-loading {
  text-align: center;
  padding: 2rem !important;
}

/* ── Sticky column backgrounds ─────────────────────── */
.demo-table .sticky-left,
.demo-table .sticky-right {
  background: var(--bg-surface);
  box-shadow: 2px 0 4px -2px var(--shadow-sticky);
}

.demo-table .sticky-right {
  box-shadow: -2px 0 4px -2px var(--shadow-sticky);
}

/* ── Sticky header backgrounds ─────────────────────── */
.demo-table .slot-table-sticky-header th {
  background: var(--bg-surface);
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

html.dark .pill--audio { background: #1e3a5f; color: #93c5fd; }
html.dark .pill--input { background: #4a1942; color: #f9a8d4; }
html.dark .pill--accessories { background: #064e3b; color: #6ee7b7; }
html.dark .pill--display { background: #78350f; color: #fcd34d; }
html.dark .pill--video { background: #312e81; color: #a5b4fc; }

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
  background: var(--bg-banner);
  border: 1px solid var(--border-banner);
  border-radius: 6px;
  padding: 0.5rem 0.85rem;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-banner);
}

.clickable-cell {
  color: var(--text-accent);
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: var(--border-banner);
  text-underline-offset: 2px;
}

.clickable-cell:hover {
  text-decoration-color: var(--text-accent);
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
  color: var(--text-faint);
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

/* ── Toggle bar for interactive demos ─────────────── */
.toggle-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
  color: var(--text-secondary);
  cursor: pointer;
  user-select: none;
}

.toggle-label input[type="checkbox"] {
  accent-color: var(--text-accent);
  width: 15px;
  height: 15px;
  cursor: pointer;
}

/* ── Loading state ────────────────────────────────── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  color: var(--text-muted);
}

.loading-state p {
  font-size: 0.85rem;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--border);
  border-top-color: var(--text-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Sticky header container ──────────────────────── */
.sticky-header-container {
  height: 250px;
  overflow: auto;
  border: 1px solid var(--border);
  border-radius: 6px;
}

code {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, monospace;
  font-size: 0.85em;
}

p code,
td code {
  background: var(--bg-code-inline);
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  font-size: 0.82em;
  color: var(--text-code);
}

/* ═══════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════ */
.doc-footer {
  margin-top: 4rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
  text-align: center;
  font-size: 0.84rem;
  color: var(--text-faint);
}

.doc-footer a {
  color: var(--text-muted);
  text-decoration: none;
}

.doc-footer a:hover {
  color: var(--text-accent);
}
</style>
