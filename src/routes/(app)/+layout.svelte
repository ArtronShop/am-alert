<script lang="ts">
	import '../../app.css';

	import {
		Avatar,
        Navbar,
        NavBrand,
        Dropdown,
        DropdownItem,
        DropdownDivider,
        Button,
    } from "flowbite-svelte";

    import {
        ArrowLeftOutline,
        DownloadOutline,
    } from "flowbite-svelte-icons";

    import type { LayoutProps } from './$types';
    import { page } from '$app/state';
    import type { UserInfoProps } from '../../types';
    import { onMount } from 'svelte';

	interface LayoutData {
		userInfo: UserInfoProps;
	}
	
	let { data, children }: LayoutProps = $props();
	const { userInfo } = data as LayoutData;
    const currentUrl = $derived(page.url.toString());

    let installAppDialogShow = $state(false);
    let deferredInstallPrompt = $state(null);

    onMount(() => {
        window.addEventListener("beforeinstallprompt", evt => {
            // console.log("beforeinstallprompt event", evt);
            deferredInstallPrompt = evt;

            installAppDialogShow = true;
        });

        window.addEventListener("appinstalled", evt => {
            console.log('App installed.', evt);
            installAppDialogShow = false;
        });
    });

    const handleClickInstallApp = async () => {
        deferredInstallPrompt.prompt();

        const { outcome } = await deferredInstallPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the A2HS prompt', choice);
            installAppDialogShow = false;
        } else {
            console.log('User dismissed the A2HS prompt', choice);
        }

        deferredInstallPrompt = null;
    }
</script>

<div class="m-auto w-80">
    <Navbar class="mb-5 rounded-b-lg">
        {#if !currentUrl.endsWith("/")}
            <Button
                class="border-0 p-0 hover:bg-white text-gray-500 hover:text-gray-700 focus:ring-0"
                outline
                href="/"
            >
                <ArrowLeftOutline class="w-8 h-8" />
            </Button>
        {/if}
        <NavBrand href="/">
            <img src="" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
        </NavBrand>
        <div class="flex items-center md:order-2">
            <Avatar id="avatar-menu" src="" />
        </div>
        <Dropdown placement="bottom" triggeredBy="#avatar-menu" >
            {#if userInfo}
                {#if currentUrl.endsWith("/")}
                    <DropdownItem href="/create-room">สร้างห้องแจ้งเตือนใหม่</DropdownItem>
                {/if}
                {#if currentUrl.indexOf("/room/") >= 0}
                    <DropdownItem href={currentUrl + "/edit"}>แก้ไขข้อมูลห้อง</DropdownItem>
                {/if}
                <DropdownItem>สำหรับนักพัฒนา</DropdownItem>
                <DropdownDivider />
                <DropdownItem href={"/logout?go=" + encodeURIComponent(currentUrl)}>ออกจากระบบ</DropdownItem>
            {:else}
                <DropdownItem href={"/login?go=" + encodeURIComponent(currentUrl)}>เข้าสู่ระบบ</DropdownItem>
            {/if}
        </Dropdown>
    </Navbar>
</div>

<div class="fixed bottom-3 w-80 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl p-3 z-50">
    <p class="text-sm mb-1">เพื่อประสบการณ์ที่ดีขึ้น ขอแนะนำให้ติดตั้งแอพนี้ลงในอุปกรณ์ของคุณ</p>
    <div class="flex justify-end">
        <Button size="sm" on:click={handleClickInstallApp} color="blue">
            <DownloadOutline class="w-5 h-5 mr-1" /><span>ติดตั้ง</span>
        </Button>
    </div>
</div>

{@render children()}
