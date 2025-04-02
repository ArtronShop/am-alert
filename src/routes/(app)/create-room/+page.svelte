<script lang="ts">
    import {
        Avatar,
        Button,
        Input,
        Alert,
    } from "flowbite-svelte";

    import { UploadOutline, FloppyDiskOutline } from "flowbite-svelte-icons";

    import { enhance } from '$app/forms';
    import type { PageProps } from "./$types";

    let { form }: PageProps = $props();

    let roomCover = $state("");

    const handleSelectCoverButton = () => {
        (document.querySelector("#cover-image") as HTMLButtonElement)?.click();
    };

    const handleCoverImageChange = (event: Event) => {
        const target = event.target as HTMLInputElement;

        if (target.files && target.files.length > 0) {
            const file = target.files[0]; // Get the first selected file

            const reader = new FileReader();
            reader.onload = function (e) {
                roomCover = e.target?.result?.toString() || "";
            };
            reader.readAsDataURL(file);
        }
    };
</script>

<title>สร้างห้องแจ้งเตือนใหม่ - Am Alert</title>

<div class="m-auto w-80">
    {#if form?.incorrect}
        <Alert color="red" class="mb-3">{form.incorrect}</Alert>
    {/if}

    <form method="POST" use:enhance enctype="multipart/form-data">
        <div class="flex flex-col justify-center items-center mb-3">
            <Avatar src={roomCover} size="lg" class="mb-2" />
            <Button
                class="mx-auto"
                size="sm"
                on:click={handleSelectCoverButton}
            >
                <UploadOutline class="w-5 h-5 mr-2" /> เลือกรูปของห้อง
            </Button>
            <input
                type="file"
                id="cover-image"
                name="cover-image"
                accept=".png, .jpg, .jpeg, .gif"
                class="hidden"
                onchange={handleCoverImageChange}
            />
        </div>
        <div class="mb-3">
            <label class="text-sm text-gray-500 mb-1" for="room-name">ชื่อห้อง</label>
            <Input type="text" id="room-name" name="room-name" class="w-full" required />
        </div>
        <div class="mb-5 flex justify-end">
            <Button on:click={() => 1} type="submit">
                <FloppyDiskOutline class="w-5 h-5 mr-2" />สร้างห้อง
            </Button>
        </div>
    </form>
</div>
