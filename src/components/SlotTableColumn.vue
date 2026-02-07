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
    visible: {
      type: Boolean,
      default: true,
    },
    tdClass: {
      type: [String, Object],
      default: undefined,
    },
    thClass: {
      type: [String, Object],
      default: undefined,
    },
  },
  setup() {
    return () => null
  },
})
</script>
