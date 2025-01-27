<template>
    <div class="relative pt-20 bg-gray-100 h-screen w-full p-4">
        <div class="divide-y divide-gray-200 rounded-lg bg-white shadow-sm max-w-7xl mx-auto">
            <div v-if="isLoading" class="px-4 py-5 sm:p-6 min-h-96 flex justify-center items-center">
                <div>
                    <Spinner class="h-16" />
                </div>
            </div>
            <div v-else-if="!isLoading" class="px-4 py-5 sm:p-6 min-h-96">
                <Chart :options="chartOptions" />
            </div>
            <div class="px-4 py-4 sm:px-6 flex items-start flex-col sm:flex-row sm:justify-between">
                <TogglesButton :labelBase="'Filière'" :label="'Global'" @update:modelValue="toggleGlobalView" />
                <TogglesButton :labelBase="'Reversed'" @update:modelValue="toggleChartTypes" />
                <TogglesButton :labelBase="'Mode ligne'" @update:modelValue="toggleLineMode" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { energyTypes, energyGreyTypes, colorMap } from "@/constants/constants";
import { convertToTWh, sortSeries } from "@/utils/utils";

const dataRenewableEnergy = ref(null);
const dataGreyEnergy = ref(null);
const isGlobal = ref(false);
const isLoading = ref(false);
const chartTypeGreen = ref("column");
const chartTypeGrey = ref("line");

const chartOptions = reactive({
    chart: { type: "column", borderRadius: 20 },
    title: {
        text: "Comparaison de l'évolution de la production d'énergies renouvelables et grises en France",
    },
    subtitle: { text: "Source: Enedis, RTE-France" },
    xAxis: { categories: [], title: { text: "Années" } },
    yAxis: {
        title: { text: "Production (TWh)" },
        type: "logarithmic",
        min: 1,
        max: 1_000,
    },

    tooltip: {
        useHTML: true,
        formatter() {
            const colorSpan = `<span class="inline-block w-2.5 h-2.5 rounded-full mr-2" style="background-color:${this.point.color};"></span>`;
            return `${colorSpan}<strong>${this.series.name}</strong>: ${this.y} TWh`;
        },
    },
    plotOptions: { column: { stacking: "normal" } },
    series: [],
});

const yearList = computed(() =>
    dataRenewableEnergy.value ? Object.keys(dataRenewableEnergy.value) : []
);

function generateSeries(arrTypes, arrData, objChartType, isGrey = false) {
    return arrTypes.map((objType) => ({
        name: objType.label || objType,
        type: objChartType.value,
        color: colorMap[objType.label || objType],
        data: yearList.value.map((strYear) => {
            const numSum = isGrey
                ? processGreyEnergyData(objType, arrData, strYear)
                : processGreenEnergyData(objType, arrData, strYear);
            return convertToTWh(numSum);
        }),
    }));
}

function processGreenEnergyData(objType, arrData, strYear) {
    let numSum = 0;
    if (arrData[strYear]) {
        for (const region of arrData[strYear]) {
            numSum += region[objType.value] || 0;
        }
    }
    return numSum;
}

function processGreyEnergyData(strType, arrData, strYear) {
    let numSum = 0;
    for (const entry of arrData) {
        if (entry.annee === strYear && entry.filieres === strType) {
            numSum += entry.value || 0;
        }
    }
    return numSum;
}

const greenEnergySeries = computed(() =>
    generateSeries(energyTypes, dataRenewableEnergy.value, chartTypeGreen)
);
const greyEnergySeries = computed(() =>
    generateSeries(energyGreyTypes, dataGreyEnergy.value, chartTypeGrey, true)
);

function generateGlobalSeries(
    strName,
    arrTypes,
    arrData,
    objChartType,
    isGrey = false
) {
    return {
        name: strName,
        type: objChartType.value,
        color: colorMap[strName],
        data: yearList.value.map((strYear) => {
            let numSum = 0;
            if (isGrey) {
                numSum = arrData
                    .filter((entry) => entry.annee === strYear)
                    .reduce((acc, entry) => acc + (entry.value || 0), 0);
            } else if (arrData[strYear]) {
                for (const region of arrData[strYear]) {
                    for (const objType of arrTypes) {
                        numSum += region[objType.value] || 0;
                    }
                }
            }
            return convertToTWh(numSum);
        }),
    };
}

const globalGreenEnergySeries = computed(() =>
    generateGlobalSeries(
        "Ensemble des énergies renouvelables",
        energyTypes,
        dataRenewableEnergy.value,
        chartTypeGreen
    )
);

const globalGreyEnergySeries = computed(() =>
    generateGlobalSeries(
        "Ensemble des énergies grises",
        energyGreyTypes,
        dataGreyEnergy.value,
        chartTypeGrey,
        true
    )
);

function updateChartSeries() {
    const arrGlobalSeries = [
        globalGreyEnergySeries.value,
        globalGreenEnergySeries.value,
    ];
    const arrFiliereSeries = [
        ...greenEnergySeries.value,
        ...greyEnergySeries.value,
    ];

    chartOptions.series = isGlobal.value
        ? sortSeries(arrGlobalSeries)
        : sortSeries(arrFiliereSeries);
}

function toggleGlobalView(boolValue) {
    isGlobal.value = boolValue;
    updateChartSeries();
}

function toggleChartTypes() {
    chartTypeGreen.value = chartTypeGreen.value === "line" ? "column" : "line";
    chartTypeGrey.value = chartTypeGrey.value === "line" ? "column" : "line";
    updateChartSeries();
}

function toggleLineMode(boolValue) {
    chartTypeGreen.value = boolValue ? "line" : "column";
    chartTypeGrey.value = "line";
    updateChartSeries();
}

async function fetchGreenEnergy() {
    const response = await $fetch("/api/green-energy-production");
    return response.dataGroupedByYear;
}

async function fetchGreyEnergy() {
    const response = await $fetch("/api/grey-energy-production");
    return response.data
        .map((item) => ({
            annee: item.Date.split("-")[0],
            filieres: item.Filière,
            value: Number(item.Valeur_TWh.replace(",", ".")) * 1_000_000,
        }))
        .filter((item) => Number(item.annee) >= 2011);
}

async function init() {
    isLoading.value = true;
    dataRenewableEnergy.value = await fetchGreenEnergy();
    dataGreyEnergy.value = await fetchGreyEnergy();
    chartOptions.xAxis.categories = yearList.value;
    updateChartSeries();
    isLoading.value = false;
}

onMounted(async () => {
    await init();
});
</script>
