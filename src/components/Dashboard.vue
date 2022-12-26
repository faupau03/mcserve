<template>
    <div id="app" class="gap-3 block w-full">
        Minecraft Server
        <div class="gap-2 card block">
            <!-- controls -->
            <button class="btn btn-success flex">
                Start
                <PlayIcon class="w-6" />
            </button>
            <button class="btn btn-error flex">
                Stop
                <StopIcon class="w-6" />
            </button>
        </div>
        <div class="card bg-neutral p-3 relative max-w-[calc(100%)] h-min min-h-[20rem] overflow-none">
            <button class="btn btn-sm btn-primary absolute w-min right-3" @click="getLogs()">
                <ArrowPathIcon class="h-5 w-5" />
            </button>{{ log }}
            <div id="logs" class="overflow-scroll max-h-[80vh] min-h-[16rem] mb-5 py-1 w-full text-xs pb-4">
                <pre>{{ logs }}</pre>
            </div>
            <form @submit.prevent="sendCmd" class="mb-0 mt-auto">
                <input v-model="cmd" @update="sendCmd" type="text" placeholder="Type here" class="input w-full" />
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ArrowPathIcon, PlayIcon, StopIcon } from "@heroicons/vue/24/outline";

const log = ref("");
const logs = ref("");
const cmd = ref("");
const evtSource = ref(null);


onMounted(() => {
    getLogs();

})

const sendCmd = async () => {
    const response = await fetch("http://192.168.178.3:3000/send?cmd=" + cmd.value);
    const data = await response.json();
}

const getLogs = async () => {
    // const response = await fetch("http://192.168.178.3:2375/containers/json?all=1");
    // const data = await response.json();
    // log.value = data;
    if (evtSource.value) {
        evtSource.value.close();
    }
    evtSource.value = new EventSource("http://192.168.178.3:3000/logs_sse");
    evtSource.value.onmessage = (event) => {
        logs.value += event.data + "\n";
        document.getElementById("logs").scrollTop = document.getElementById("logs").scrollHeight - 50;
    }
}

</script>