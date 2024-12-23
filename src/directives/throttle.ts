/**
* @description 防止按钮在短时间内被多次点击，使用节流函数限制规定时间内只能点击一次。
*/
import type { Directive, DirectiveBinding } from 'vue';
interface ElType extends HTMLElement {
  _click: () => any;
  disabled: boolean;
}
const throttle: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    if (typeof binding.value !== 'function') {
      throw 'v-debounce指令必须指向一个函数';
    }

    const time = binding.arg ? Number(binding.arg) : 500

    let timer: NodeJS.Timeout | null = null;
    el._click = function () {
      if (timer) {
        clearTimeout(timer);
      }
      if (!el.disabled) {
        el.disabled = true;
        binding.value();
        timer = setTimeout(() => {
          el.disabled = false;
        }, time);
      }
    };
    el.addEventListener('click', el._click);
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener('click', el._click);
  },
};

export default throttle;
