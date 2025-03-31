<script lang="ts">
    import {
        Listgroup,
        ListgroupItem,
        Avatar,
        Button,
        Input,
        FooterCopyright,
    } from "flowbite-svelte";
    import {
        Navbar,
        NavBrand,
        NavLi,
        NavUl,
        NavHamburger,
        Dropdown,
        DropdownItem,
        DropdownHeader,
        DropdownDivider,
    } from "flowbite-svelte";

    import {
        AdjustmentsHorizontalSolid,
        DownloadSolid,
        MessagesSolid,
        UserCircleSolid,
        PlusOutline,
    } from "flowbite-svelte-icons";

    import type { PageProps } from './$types';

	let { data }: PageProps = $props();
    const { userInfo } = data;

    let icons = [
        { id: 1, name: "ฟาร์มไก่ 1", icon: UserCircleSolid },
        { id: 2, name: "แปลงผัก 2", icon: AdjustmentsHorizontalSolid },
        { id: 3, name: "Messages", icon: MessagesSolid },
        { id: 4, name: "เทส ๆ 345", icon: DownloadSolid },
    ];

    const handleClickAddRoom = () => {
        const addRoomIdInput = document.querySelector("#add-room-id") as HTMLInputElement;
        const roomId = +(addRoomIdInput?.value || 0);
        alert(roomId);
        addRoomIdInput.value = "";
    };
</script>

<title>การแจ้งเตือนของฉัน - Am Alert</title>

<div class="m-auto w-80">
    <Navbar class="mb-5 rounded-b-lg">
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
                <DropdownItem href={"/logout?go=/"}>ออกจากระบบ</DropdownItem>
            {:else}
                <DropdownItem href="/login">เข้าสู่ระบบ</DropdownItem>
            {/if}
        </Dropdown>
    </Navbar>

    <p class="text-sm text-gray-500 mb-1">การแจ้งเตือนของฉัน</p>
    <Listgroup active class="mb-5">
        {#each icons as item, index}
            <ListgroupItem
                class="focus:ring-0 flex flex-row align-middle"
                href={`/room/${item.id}`}
            >
                <Avatar src=" " size="md" />
                <div class="flex flex-col ml-3">
                    <p class="text-list-header">{item.name}</p>
                    <p class="text-list-body">Line 2 OK !</p>
                </div>
            </ListgroupItem>
        {/each}
    </Listgroup>

    <p class="text-sm text-gray-500 mb-1">เพิ่มห้อง</p>
    <div class="flex flex-row mb-6">
        <Input
            type="text"
            id="add-room-id"
            placeholder="หมายเลขห้อง"
            class="grid-rows-1 mr-3"
        />
        <Button on:click={handleClickAddRoom}
            ><PlusOutline class="w-5 h-5" /></Button
        >
    </div>

    <hr class="my-3 border-gray-300" />
    <FooterCopyright href="/" by="ArtronShop CO.,LTD." />
</div>

<style>
    .main-box {
        display: flex;
        justify-content: center;
        flex-direction: row;
    }

    .text-list-header {
        font-size: 18px;
        color: #2c3e50;
        font-weight: normal;
    }

    .text-list-body {
        font-size: 14px;
        color: #808b96;
        font-weight: normal;
    }
</style>
