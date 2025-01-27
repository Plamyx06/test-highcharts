<template>
    <Disclosure as="nav" class="bg-white shadow-sm absolute z-10 w-full" v-slot="{ open }">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div class="relative flex h-16 justify-between">

                <!-- Mobile menu button -->

                <div class="flex justify-between items-center w-full">
                    <div class="flex flex-1 ml-6 xl:items-stretch xl:justify-between">
                        <div class="flex shrink-0 items-center space-x-4">
                            <img class="h-12 w-auto"
                                src="https://www.totalenergies.fr/typo3conf/ext/de_site_package/Resources/Public/Dist/Images/Logo/totalenergies--vertical.svg"
                                alt="Your Company" />
                            <p class="text-primary font-semibold text-xs">Renouvelables</p>
                        </div>
                        <div class="hidden xl:ml-6 xl:flex xl:items-center xl:space-x-5 ">
                            <!-- Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" -->
                            <a v-for="(item, index) in navigations" :key="index" :href="item.href"
                                class="inline-flex h-full items-center border-b-2 border-transparent px-1 pt-1 text-sm font-base text-gray-800 hover:border-primary transition duration-700 ease-in-out">
                                {{ item.name }}</a>
                            <MagnifyingGlassIcon class="block size-6 text-gray-500" aria-hidden="true" />
                        </div>
                    </div>
                    <DisclosureButton
                        class="inline-flex items-center justify-center rounded-md p-2 text-primary space-x-4 xl:hidden">
                        <MagnifyingGlassIcon class="block size-7" aria-hidden="true" />
                        <Bars3Icon v-if="!open" class="block size-8" aria-hidden="true" />
                        <XMarkIcon v-else class="block size-8" aria-hidden="true" />
                    </DisclosureButton>
                </div>
            </div>
        </div>

        <DisclosurePanel class="xl:hidden">
            <div class="pt-2 pb-4">
                <!-- Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" -->
                <div v-for="item in navigations"
                    class="flex justify-between items-center my-4 border-l-4 border-transparent py-2 pr-4 pl-3 text-base font-light text-gray-700">
                    <a :href="item.href">{{ item.name }}</a>
                    <ChevronRightIcon class="text-primary h-4" aria-hidden="true" />
                </div>

            </div>
        </DisclosurePanel>
    </Disclosure>

</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { Bars3Icon, MagnifyingGlassIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const navigations = ref([
    { name: "La société", href: "#", current: false },
    { name: "Nos metiers", href: "#", current: false },
    { name: "Soyer acteurs", href: "#", current: false },
    { name: "Nos projets", href: "#", current: false },
    { name: "Media", href: "#", current: false },
]);


</script>