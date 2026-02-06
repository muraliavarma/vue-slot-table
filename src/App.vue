<script setup>
import { ref } from 'vue'
import { SlotTable, SlotTableColumn, SlotTableColumnGroup } from './index.js'

const rows = ref([
  { id: 1, name: 'Alice Johnson', age: 28, role: 'Engineer', department: 'Frontend', salary: 95000 },
  { id: 2, name: 'Bob Smith', age: 34, role: 'Designer', department: 'UX', salary: 88000 },
  { id: 3, name: 'Carol Williams', age: 41, role: 'Manager', department: 'Engineering', salary: 120000 },
  { id: 4, name: 'David Brown', age: 25, role: 'Intern', department: 'Backend', salary: 45000 },
  { id: 5, name: 'Eva Martinez', age: 31, role: 'Engineer', department: 'Backend', salary: 102000 },
])

const lastClickedRow = ref(null)

function onRowClick(rowIndex) {
  lastClickedRow.value = rowIndex
}

function formatSalary(value) {
  return `$${value.toLocaleString()}`
}
</script>

<template>
  <div class="demo">
    <h1>Vue SlotTable Demo</h1>
    <p class="subtitle">A flexible, slot-based table component for Vue 3</p>

    <div class="card">
      <h2>Employee Directory</h2>
      <p v-if="lastClickedRow !== null" class="click-info">
        Last clicked row: {{ lastClickedRow }} ({{ rows[lastClickedRow].name }})
      </p>

      <div class="table-wrapper">
        <SlotTable :rows="rows" table-class="demo-table" @row-click="onRowClick">
          <SlotTableColumnGroup sticky="left" :colspan="2">
            Identity
          </SlotTableColumnGroup>
          <SlotTableColumnGroup :colspan="2">
            Position
          </SlotTableColumnGroup>
          <SlotTableColumnGroup sticky="right" :colspan="1">
            Compensation
          </SlotTableColumnGroup>

          <SlotTableColumn sticky="left">
            <template #header>Name</template>
            <template #cell="{ row }">
              <strong>{{ row.name }}</strong>
            </template>
          </SlotTableColumn>

          <SlotTableColumn sticky="left">
            <template #header>Age</template>
            <template #cell="{ row }">{{ row.age }}</template>
          </SlotTableColumn>

          <SlotTableColumn>
            <template #header>Role</template>
            <template #cell="{ row }">
              <span class="badge" :class="'badge--' + row.role.toLowerCase()">
                {{ row.role }}
              </span>
            </template>
          </SlotTableColumn>

          <SlotTableColumn>
            <template #header>Department</template>
            <template #cell="{ row }">{{ row.department }}</template>
          </SlotTableColumn>

          <SlotTableColumn sticky="right">
            <template #header>Salary</template>
            <template #cell="{ row }">
              <span class="salary">{{ formatSalary(row.salary) }}</span>
            </template>
          </SlotTableColumn>
        </SlotTable>
      </div>
    </div>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
  color: #333;
}

.demo {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: #666;
  margin-bottom: 2rem;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.card h2 {
  margin-bottom: 0.75rem;
}

.click-info {
  color: #0066cc;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.table-wrapper {
  overflow-x: auto;
}

.demo-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.demo-table th,
.demo-table td {
  padding: 0.625rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  background: white;
}

.demo-table thead th {
  font-weight: 600;
  color: #555;
  border-bottom: 2px solid #ccc;
}

.demo-table tbody tr {
  cursor: pointer;
  transition: background 0.15s;
}

.demo-table tbody tr:hover {
  background: #f0f7ff;
}

.demo-table tbody tr:hover td {
  background: #f0f7ff;
}

.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.badge--engineer {
  background: #e3f2fd;
  color: #1565c0;
}

.badge--designer {
  background: #fce4ec;
  color: #c62828;
}

.badge--manager {
  background: #e8f5e9;
  color: #2e7d32;
}

.badge--intern {
  background: #fff3e0;
  color: #e65100;
}

.salary {
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}
</style>
