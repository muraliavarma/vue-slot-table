<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'SlotTableColumn',
  props: {
    sticky: {
      type: String as PropType<'' | 'left' | 'right'>,
      default: '',
    },
    align: {
      type: String as PropType<'' | 'left' | 'center' | 'right'>,
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
      type: [String, Object] as PropType<string | Record<string, boolean>>,
      default: undefined,
    },
    thClass: {
      type: [String, Object] as PropType<string | Record<string, boolean>>,
      default: undefined,
    },
  },
  setup() {
    return () => null
  },
})
</script>
