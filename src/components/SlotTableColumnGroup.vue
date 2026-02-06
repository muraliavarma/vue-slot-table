<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SlotTableColumnGroup',
  props: {
    sticky: {
      type: String,
      default: '',
    },
    colspan: {
      type: Number,
      default: undefined,
    },
  },
  setup() {
    return () => null
  },
})
</script>
