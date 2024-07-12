/** @jsxImportSource vue */
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: ''
    },
    contentTitle: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const closeModal = () => {
      emit('update:show', false)
    }

    const onBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        closeModal()
      }
    }

    return () => (
      props.show ? (
          <div class={`fixed inset-0 z-[9997] flex items-center justify-center backdrop-blur-sm transition-all`} onClick={onBackdropClick}>
            <div class={`${props.theme == 'light' ? 'bg-zinc-700' : 'bg-[#2E2E2E]'} text-white rounded-lg shadow-lg p-5 w-[250px]`} onClick={(e) => e.stopPropagation()}>
              <div class="flex justify-between items-center py-4 border-b">
                <h3 class="text-xl font-semibold">{props.title}</h3>
                <button class="text-2xl p-2 rounded-full hover:bg-gray-300 font-bold cursor-pointer w-12 transition-all duration-300" onClick={closeModal}>x</button>
              </div>
              <div class="flex items-center justify-between mt-4">
                <p>{props.contentTitle} : </p>
                <p>{props.content}</p>
              </div>
            </div>
          </div>
      ) : null
    )
  }
})
