import { ObjectDirective } from 'vue';
// import { usePermission } from '@/hooks/web/usePermission';

const directive: ObjectDirective = {
  mounted(el: HTMLButtonElement, binding) {
    // if (binding.value == undefined) return;
    // const { action, effect } = binding.value;
    // const { hasPermission } = usePermission();
    // if (!hasPermission(action)) {
    //   if (effect == 'disabled') {
    //     el.disabled = true;
    //     // @ts-ignore
    //     el.style['disabled'] = 'disabled';
    //     el.classList.add('n-button--disabled');
    //   } else {
    //     el.remove();
    //   }
    // }
  },
};


export default directive