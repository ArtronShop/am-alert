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
        PlusOutline,
    } from "flowbite-svelte-icons";

    import type { PageProps } from './$types';

    import { onMount } from 'svelte';

    let { data }: PageProps = $props();
    const { userInfo, roomList } = data;

    const handleClickAddRoom = () => {
        const addRoomIdInput = document.querySelector("#add-room-id") as HTMLInputElement;
        const roomId = +(addRoomIdInput?.value || 0);
        alert(roomId);
        addRoomIdInput.value = "";
    };

    let roomJoinList = $state(roomList || []);

    onMount(async () => {
        let roomJoinListId: number[] = [];
        try {
            roomJoinListId = JSON.parse(localStorage.getItem("RoomJoinList") || "[]");
        } catch(e) {
            // don't care
        }

        if(roomJoinListId.length === 0) {
            return;
        }

        const roomOwnerList = (roomList || [])?.map(a => a.id);
        roomJoinListId = roomJoinListId.filter(a => !roomOwnerList.includes(a));

        // Fetch room info
        const res = await fetch("/api/rooms?ids=" + roomJoinListId.join(","));
        if (res.ok) {
            const roomJoinListLocalInfo: {
                id: number;
                name: string;
                cover: string | null;
                owner: number;
                token: string | null;
            }[] = await res.json();
            
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
