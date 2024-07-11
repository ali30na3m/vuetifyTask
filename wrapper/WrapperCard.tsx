/** @jsxImportSource vue */

import { defineComponent } from "vue";

export default defineComponent({
    props: {
        width:{
            type: String,
            default: "400"
        }
    },
    setup(props, { slots }) {
        return () => (
            <div class="bg-gray-300 flex w-40">
                {slots.default ? slots.default() : null}
            </div>
        );
    }
});
