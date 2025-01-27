<script setup>
import { ref } from 'vue'
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'

const enabled = ref(false)
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    labelBase: {
        required: true,
    },
    label: {
        required: false,
    },
})

watch(() => enabled.value, (value) => {
    emit('update:modelValue', value)
})


</script>

<template>
    <SwitchGroup as="div" class="flex items-center mt-2 sm:mt-0">
        <SwitchLabel as="span" class="mr-4 text-sm">
            <span class="font-medium text-gray-900">{{ props.labelBase }}</span>
            {{ ' ' }}

        </SwitchLabel>
        <Switch v-model="enabled"
            :class="[enabled ? 'bg-blue-300' : 'bg-gray-200', 'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ']">
            <span aria-hidden="true"
                :class="[enabled ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block size-5 transform rounded-full bg-white ring-0 shadow-sm transition duration-200 ease-in-out']" />
        </Switch>
        <SwitchLabel as="span" class="ml-4 text-sm">
            <span class="font-medium text-gray-900">{{ props.label }}</span>
            {{ ' ' }}
        </SwitchLabel>
    </SwitchGroup>
</template>