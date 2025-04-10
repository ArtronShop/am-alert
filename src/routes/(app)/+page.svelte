<script lang="ts">
    import {
        Listgroup,
        ListgroupItem,
        Avatar,
        Button,
        Input,
        FooterCopyright,
        Badge,
    } from "flowbite-svelte";

    import {
        ArrowRightOutline,
    } from "flowbite-svelte-icons";

    import type { PageProps } from './$types';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import type { RoomJoinListProps } from "../../types";
    import { formatFacebookTimeTH } from "$lib/formatFacebookTimeTH";

    let { data }: PageProps = $props();
    const { userInfo, roomList } = data;

    const handleClickAddRoom = () => {
        const addRoomIdInput = document.querySelector("#add-room-id") as HTMLInputElement;
        const roomId = +(addRoomIdInput?.value || 0);
        goto("/room/" + roomId);
        addRoomIdInput.value = "";
    };

    let roomJoinList = $state(roomList || []);

    onMount(async () => {
        let roomJoinListId: number[] = [];
        try {
            const RoomJoinList: RoomJoinListProps = JSON.parse(localStorage.getItem("RoomJoinList") || "[]");
            roomJoinListId = RoomJoinList.map(a => a.roomId);
        } catch(e) {
            // don't care
        }

        const roomOwnerList = (roomList || [])?.map(a => a.id);
        roomJoinListId = roomJoinListId.filter(a => !roomOwnerList.includes(a));
        
        if(roomJoinListId.length === 0) {
            return;
        }

        // Fetch room info
        const res = await fetch("/api/rooms?ids=" + roomJoinListId.join(","));
        if (res.ok) {
            const roomJoinListLocalInfo: any[] = await res.json();
            
            roomJoinList = (roomJoinList || []).concat(roomJoinListLocalInfo);
        }
    });
</script>

<title>การแจ้งเตือนของฉัน - Am Alert</title>

<div class="m-auto w-80">
    <p class="text-sm text-gray-500 mb-1">การแจ้งเตือนของฉัน</p>
    <Listgroup active class="mb-5">
        {#each (roomJoinList || []) as item}
            <ListgroupItem
                class="focus:ring-0 flex flex-row items-center"
                href={`/room/${item.id}`}
            >
                <Avatar src={item.cover || ""} size="md" dot={(item.owner === userInfo?.id && ({ placement: 'bottom-right', color: 'green' })) || undefined} />
                <div class="flex flex-col ml-3 grow">
                    <div class="flex flex-row justify-between items-center">
                        <p class="text-lg text-gray-600">{item.name}</p>
                        {#if item?.lastNotification?.createAt}
                            <Badge color="dark">{formatFacebookTimeTH(new Date(item?.lastNotification?.createAt))}</Badge>
                        {/if}
                    </div>
                    <p class="text-sm text-gray-400">{item?.lastNotification?.message || ""}</p>
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
        <Button on:click={handleClickAddRoom}><ArrowRightOutline class="w-5 h-5" /></Button>
    </div>

    <hr class="my-3 border-gray-300" />
    <FooterCopyright href="https://www.artronshop.co.th" target="_blank" by="ArtronShop CO.,LTD." />
</div>
