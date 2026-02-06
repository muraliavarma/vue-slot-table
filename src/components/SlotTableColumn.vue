<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SlotTableColumn',
  props: {
    sticky: {
      type: String,
      default: '',
    },
  },
  setup() {
    return () => null
  },
})
</script>
