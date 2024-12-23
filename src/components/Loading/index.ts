import { Transition, defineComponent, h } from 'vue'
import ins from './LoadingOne.vue'

export const LoadingOne = defineComponent({
  setup(props, { expose }) {
    // 控制显示隐藏
    const visiable = ref(true)
    // 加载文字，（支持html）
    const text = ref('')
    expose({
      visiable,
      text
    })
    return () =>
      h(
        Transition,
        { name: 'fade', appear: true },
        {
          default: () => {
            return [visiable.value ? h(ins, { text: text.value }) : h('span')]
          }
        }
      )
  }
})
