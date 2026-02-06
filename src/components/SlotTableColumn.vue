<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SlotTableColumn',
  props: {
    sticky: {
      type: String,
      default: '',
    },
    align: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '',
    },
    minWidth: {
      type: String,
      default: '',
    },
  },
  setup() {
    return () => null
  },
})
</script>
