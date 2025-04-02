<script lang="ts">
    import {
        Avatar,
        Button,
        Navbar,
        NavBrand,
        Dropdown,
        DropdownItem,
        DropdownHeader,
        DropdownDivider,
        Input,
    } from "flowbite-svelte";

    import {
        ArrowLeftOutline,
        BellActiveOutline,
        CloseOutline,
        DownloadSolid,
        FileCopySolid,
        FloppyDiskSolid,
        TrashBinSolid,
    } from "flowbite-svelte-icons";

    import type { PageProps } from "./$types";
    import { usersTable } from "../../../../db/schema";

    let { data }: PageProps = $props();
    const { userInfo, roomInfo } = data;

    const notificationList = [
        {
            message: "Test 1",
            assets: {
                image: "https://f.lnwfile.com/_/f/_raw/iv/1n/yd.png",
            },
            createAt: new Date(),
        },
        {
            message: "Test 2",
            createAt: new Date(),
        },
        {
            message: "Test 3",
            createAt: new Date(),
        },
    ];

    const handleClickDownloadNotificationLog = () => {};
</script>

<title>การแจ้งเตือนของ {roomInfo?.name || ""} - Am Alert</title>

<div class="m-auto w-80">
    <div class="flex flex-col justify-center items-center mb-5">
        <Avatar src={roomInfo?.cover || ""} size="lg" class="mb-2" />
        <p class="text-xl text-center mb-2">
            การแจ้งเตือนของ {roomInfo?.name || ""}
        </p>
        <Button class="mx-auto" size="sm">
            <BellActiveOutline class="w-5 h-5 mr-2" /> รับแจ้งเตือน
        </Button>
    </div>
    <p class="text-sm text-gray-500 mb-1">ประวัติแจ้งเตือน</p>
    <div class="bg-white rounded-xl p-4 mb-2">
        {#each notificationList as item}
            <div class="mb-4">
                <div class="text-sm text-gray-500 mb-1">
                    {new Date(item.createAt || 0).toLocaleString()}
                </div>
                <div
                    class="bg-gray-100 text-gray-800 rounded-xl inline-block overflow-hidden"
                >
                    <p class="text-base px-3 pt-2 pb-1">{item.message}</p>
                    {#if item?.assets?.image}
                        <a href={item.assets.image} target="_blank">
                            <img
                                class="max-w-full"
                                src={item.assets.image}
                                alt={item.message}
                            />
                        </a>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
    <div class="flex justify-end mb-5">
        <Button
            class="border-none hover:bg-primary-50 hover:text-primary-800"
            size="sm"
            outline
            on:click={handleClickDownloadNotificationLog}
        >
            <DownloadSolid class="w-5 h-5 mr-1" />ดาวน์โหลด
        </Button>
    </div>
    {#if userInfo?.id === roomInfo.owner}
        <p class="text-sm text-gray-500 mb-1">Token</p>
        <div class="flex mb-5">
            <Input class="grow mr-2" value={roomInfo.token} readonly />
            <Button
                class="border-none p-2.5"
                size="sm"
                on:click={handleClickDownloadNotificationLog}
            >
                <FileCopySolid class="w-5 h-5" />
            </Button>
        </div>
        <p class="text-sm text-gray-500 mb-1">แก้ไขชื่อห้อง</p>
        <div class="flex mb-5">
            <Input class="grow mr-2" placeholder="ชื่อห้องใหม่" />
            <Button
                class="border-none p-2.5"
                size="sm"
                on:click={handleClickDownloadNotificationLog}
            >
                <FloppyDiskSolid class="w-5 h-5" />
            </Button>
        </div>
        <div class="flex justify-end mb-5">
            <Button
                class="border-none p-2.5"
                size="sm"
                on:click={handleClickDownloadNotificationLog}
                color="red"
                outline
            >
                <TrashBinSolid class="w-5 h-5" /> ลบห้องนี้
            </Button>
        </div>
    {/if}
</div>
