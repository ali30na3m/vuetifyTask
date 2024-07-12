import { defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { VSnackbar } from 'vuetify/lib/components/index.mjs';
import type { PropType } from 'vue'

export default defineComponent({
  props: {
    snackBar: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    snackbarText: {
      type: String as PropType<string>,
      required: true,
    },
    colorSet: {
      type: String as PropType<string>,
      required: true,
    },
    timeout: {
      type: Number as PropType<number>,
      required: true,
    },
  },
  emits: ['update:snackBar'],
  setup(props, { emit }) {
    const { locale } = useI18n();
    const localSnackBar = ref(props.snackBar);

    watch(localSnackBar, (newVal) => {
      emit('update:snackBar', newVal);
    });

    watch(
      () => props.snackBar,
      (newVal) => {
        localSnackBar.value = newVal;
      }
    );

    return () => (
      <VSnackbar
        v-model={localSnackBar.value}
        color={props.colorSet}
        timeout={props.timeout}
        location={locale.value === 'en' ? 'top right' : 'top left'}
      >
        {props.snackbarText}
      </VSnackbar>
    );
  },
});
