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
    const { userInfo, roomList } = data;

    const handleClickAddRoom = () => {
        const addRoomIdInput = document.querySelector("#add-room-id") as HTMLInputElement;
        const roomId = +(addRoomIdInput?.value || 0);
        alert(roomId);
        addRoomIdInput.value = "";
    };
</script>

<title>การแจ้งเตือนของฉัน - Am Alert</title>

<div class="m-auto w-80">
    <p class="text-sm text-gray-500 mb-1">การแจ้งเตือนของฉัน</p>
    <Listgroup active class="mb-5">
        {#each (roomList || []) as item}
            <ListgroupItem
                class="focus:ring-0 flex flex-row items-center"
                href={`/room/${item.id}`}
            >
                <Avatar src={item.cover || ""} size="md" />
                <div class="flex flex-col ml-3">
                    <p class="text-lg text-gray-600">{item.name}</p>
                    <p class="text-sm text-gray-400">sdsdsd</p>
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
        <Button on:click={handleClickAddRoom}><PlusOutline class="w-5 h-5" /></Button>
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
