/** @jsxImportSource vue */

import { useI18n } from "vue-i18n";
import { defineComponent } from "vue";
import { useTheme } from "vuetify";
import { VCard, VCardText, VCardTitle } from "vuetify/components/VCard";
import { VDialog } from "vuetify/components/VDialog";
import { VBtn } from "vuetify/lib/components/index.mjs";

export default defineComponent({
    props: {
        isOpenDialog: {
            type: Boolean,
            required: true,
        },
        headerTitle : {
            type: String,
            required: true,
        }
    },
    emits: ['update:isOpenDialog', 'updateTodo'],
    setup(props, { emit, slots }) {
        const theme = useTheme();
        const {t} = useI18n()

        const closeDialog = () => {
            emit('update:isOpenDialog', false);
        };

        const updateTodo = () => {
            emit('updateTodo');
        };

        return () => (
            <VDialog modelValue={props.isOpenDialog} onUpdate:modelValue={(value) => emit('update:isOpenDialog', value)} persistent max-width="500px" maxHeight="400px">
                <VCard>
                    <VCardTitle class="!text-2xl !font-bold text-center">{props.headerTitle}</VCardTitle>
                    <div class="flex flex-col items-center justify-center px-6">
                        {slots.default ? slots.default() : null}
                    </div>
                    <div class="w-full flex items-center justify-between px-6 my-6">
                        <VBtn
                            class="child:!text-[#6c63ff] child:!font-bold !border-[#6c63ff] !border-2"
                            color={theme.global.name.value === 'dark' ? '#3f3f46' : 'white'}
                            onClick={closeDialog}
                        >
                            {t('no')}
                        </VBtn>
                        <VBtn color="#6c63ff" onClick={updateTodo}>
                            {t('yes')}
                        </VBtn>
                    </div>
                </VCard>
            </VDialog>
        );
    }
});
