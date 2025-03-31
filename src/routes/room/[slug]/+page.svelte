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
    } from "flowbite-svelte";

    import {
        ArrowLeftOutline,
        BellActiveOutline,
        CloseOutline,
        DownloadSolid,
    } from "flowbite-svelte-icons";

    import cookieCutter from "cookie-cutter";

    import type { PageProps } from "./$types";
    import type { UserInfoProps } from "../../../types";

    let { data }: PageProps = $props();
    const { roomInfo } = data;

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

    let userInfo: UserInfoProps | null = $state(data.userInfo);

    const handleLogout = () => {
        cookieCutter.set("auth", "");
        userInfo = null;
    };

    const handleClickDownloadNotificationLog = () => {};
</script>

<title>การแจ้งเตือนของ {roomInfo?.name || ""} - Am Alert</title>

<div class="m-auto w-80">
    <Navbar class="mb-5 rounded-b-lg">
        <Button
            class="border-0 p-0 hover:bg-white text-gray-500 hover:text-gray-700 focus:ring-0"
            outline
            href="/"
        >
            <ArrowLeftOutline class="w-8 h-8" />
        </Button>
        <NavBrand href="/">
            <img src="" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
        </NavBrand>
        <div class="flex items-center md:order-2">
            <Avatar id="avatar-menu" src="" />
        </div>
        <Dropdown placement="bottom" triggeredBy="#avatar-menu">
            {#if userInfo}
                <DropdownItem>สำหรับนักพัฒนา</DropdownItem>
                <DropdownDivider />
                <DropdownItem on:click={handleLogout}>ออกจากระบบ</DropdownItem>
            {:else}
                <DropdownItem href="/login">เข้าสู่ระบบ</DropdownItem>
            {/if}
        </Dropdown>
    </Navbar>

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
</div>
