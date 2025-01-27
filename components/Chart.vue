<template>
    <div id="chartContainer"></div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import Highcharts from 'highcharts'

// Définir les props
const props = defineProps({
    options: {

        required: true,
    },
})

let chart = null

onMounted(() => {
    chart = Highcharts.chart('chartContainer', props.options)
})

watch(
    () => props.options,
    (newOptions) => {
        if (chart) {
            chart.update(newOptions, true, true)
        }
    },
    { deep: true }
)
</script>

<style scoped></style>
