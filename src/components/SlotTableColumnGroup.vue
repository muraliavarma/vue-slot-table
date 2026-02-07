<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'SlotTableColumnGroup',
  props: {
    sticky: {
      type: String as PropType<'' | 'left' | 'right'>,
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
