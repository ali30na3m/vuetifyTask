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

    return () => (
      props.show ? (
        <div class="fixed top-0 right-0 left-0 bottom-0 flex items-center justify-center z-50" style="backdrop-filter: blur(5px);z-index:9998;">
          <div class={`${props.theme == 'light' ? 'bg-black' : 'bg-white'} rounded-lg shadow-lg`} style="width: 40%; padding: 20px;z-index:9998;">
            <div class="flex justify-between items-center py-4 border-b">
              <h3 class="text-xl font-semibold">{props.title}</h3>
              <button class="text-5xl p-2 rounded-full bg-gray-300 font-bold cursor-pointer" onClick={closeModal}>x</button>
            </div>
            <div class="flex items-center justify-between mt-4">
              <p>{props.contentTitle} : </p>
              <p>{props.content}</p>
            </div>
          </div>
          <div class="fixed inset-0 bg-black bg-opacity-50"></div>
        </div>
      ) : null
    )
  }
})
