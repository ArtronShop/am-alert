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
        ArrowLeftOutline
    } from "flowbite-svelte-icons";

    import type { LayoutProps } from './$types';
    import { page } from '$app/state';
    import type { UserInfoProps } from '../../types';

	interface LayoutData {
		userInfo: UserInfoProps;
	}
	
	let { data, children }: LayoutProps = $props();
	const { userInfo } = data as LayoutData;
    const currentUrl = $derived(page.url.toString());
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
        <Dropdown placement="bottom" triggeredBy="#avatar-menu">
            {#if userInfo}
                <DropdownItem>สร้างห้องแจ้งเตือนใหม่</DropdownItem>
                <DropdownItem>สำหรับนักพัฒนา</DropdownItem>
                <DropdownDivider />
                <DropdownItem href={"/logout?go=" + encodeURI(currentUrl)}>ออกจากระบบ</DropdownItem>
            {:else}
                <DropdownItem href="/login">เข้าสู่ระบบ</DropdownItem>
            {/if}
        </Dropdown>
    </Navbar>
</div>

{@render children()}
