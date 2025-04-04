<script lang="ts">
    import {
    Alert,
        Avatar,
        Button,
        Input,
    } from "flowbite-svelte";

    import {
        BellActiveOutline,
        DownloadSolid,
        FileCopySolid,
        FloppyDiskSolid,
        TrashBinSolid,
        CloseOutline,
        InfoCircleSolid,
    } from "flowbite-svelte-icons";

    import type { PageProps } from "./$types";
    import { onMount } from 'svelte';
    import type { RoomJoinListProps } from "../../../../types";

    let { data }: PageProps = $props();
    const { userInfo, roomInfo, publicVapidKey } = data;

    let subscriptionId: number | null = $state(null);

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

    const getRoomJoinListFromLocalStorage = () => {
        let roomJoinList: RoomJoinListProps = [];
        try {
            roomJoinList = JSON.parse(localStorage.getItem("RoomJoinList") || "[]");
        } catch(e) {
            // don't care
        }
        return roomJoinList;
    }

    let loadingSubscriptionInfo = $state(true);
    let browserNotSupport = $state(true);

    onMount(async () => {
        if ('PushManager' in window) {
            browserNotSupport = false;

            const roomJoinList = getRoomJoinListFromLocalStorage();
            const roomJoinInfo = roomJoinList.find(a => a.roomId === roomInfo.id);
            if(roomJoinInfo) {
                subscriptionId = roomJoinInfo.subscriptionId;
            }
        } else {
            browserNotSupport = true;
        }
        loadingSubscriptionInfo = false;
    });

    function urlBase64ToUint8Array(base64String: string) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, "+")
            .replace(/_/g, "/");

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    const registerServiceWorker = async () => {
        console.log("Registering service worker...");
        let register = await navigator.serviceWorker.getRegistration("/sw.js");
        if (!register) {
            register = await navigator.serviceWorker.register("/sw.js", {
                scope: "/",
            });
            await navigator.serviceWorker.ready;
        }
        console.log("Service Worker Registered...", register);

        return register;
    }

    const handleClickSubscribe = async () => {
        // Register Service Worker
        const register = await registerServiceWorker();

        const push_options = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        };

        // Check permission
        console.log("Checking permission...");
        const permission = await register.pushManager.permissionState(push_options);
        console.log("permission is", permission);
        if (permission === "denied") {
            alert("การแจ้งเตือนไม่สามารถเปิดใช้งานได้ เนื่องจากคุณไม่ให้สิทธิ์การแจ้งเตือน");
            return;
        }

        // Check subscription Push
        let subscription = await register.pushManager.getSubscription();
        if (!subscription) {
            // Register Push
            console.log("Registering Push...");
            subscription = await register.pushManager.subscribe(push_options);
            console.log("Push Registered...", subscription);
        } else {
            console.log("Push Already Registered...", subscription);
        }

        console.log("Subscription sent to server...");
        try {
            const response = await fetch(`/api/room/${roomInfo.id}/subscribe`, {
                method: "POST",
                body: JSON.stringify(subscription),
                headers: {
                    "content-type": "application/json",
                },
            });

            if (!response.ok) {
                const error = response.statusText + ", data:" + await response.text();
                console.error(error);
                alert("การแจ้งเตือนไม่สามารถเปิดใช้งานได้ เนื่องจากเกิดข้อผิดพลาดทางเซิร์ฟเวอร์ : " + error);
                return;
            }

            const data = await response.json();

            subscriptionId = data.subscriptionId;
        } catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
                alert("การแจ้งเตือนไม่สามารถเปิดใช้งานได้ เนื่องจากเกิดข้อผิดพลาดทางเครือข่าย : " + e.message);
            } else {
                console.error("Unknown error", e);
                alert("เกิดข้อผิดพลาดที่ไม่รู้จัก");
            }
            return;
        }

        const roomJoinList = getRoomJoinListFromLocalStorage();
        if (!roomJoinList.map(a => a.roomId).includes(roomInfo.id)) {
            roomJoinList.push({ 
                roomId: roomInfo.id,
                subscriptionId
            });
        }
        localStorage.setItem("RoomJoinList", JSON.stringify(roomJoinList));

        alert("การแจ้งเตือนได้รับการเปิดใช้งานแล้ว");
    }

    const handleClickUnsubscribe = async () => {
        if (subscriptionId) {
            try {
                const response = await fetch(`/api/room/${roomInfo.id}/subscribe`, {
                    method: "DELETE",
                    body: JSON.stringify({ subscriptionId }),
                    headers: {
                        "content-type": "application/json",
                    },
                });

                const json = await response.json();
                if (!json.ok) {
                    console.error(json.error);
                    alert("การแจ้งเตือนไม่สามารถปิดใช้งานได้");
                    return;
                }
            } catch (e) {
                if (e instanceof Error) {
                    console.error(e.message);
                    alert("การแจ้งเตือนไม่สามารถปิดใช้งานได้");
                } else {
                    console.error("Unknown error", e);
                    alert("เกิดข้อผิดพลาดที่ไม่รู้จัก");
                }
            }
        }

        let roomJoinList = getRoomJoinListFromLocalStorage();
        roomJoinList = roomJoinList.filter(a => a.roomId !== roomInfo.id);
        localStorage.setItem("RoomJoinList", JSON.stringify(roomJoinList));
        subscriptionId = null;
    }

    const handleClickDownloadNotificationLog = () => {};
</script>

<title>การแจ้งเตือนของ {roomInfo?.name || ""} - Am Alert</title>

<div class="m-auto w-80">
    <div class="flex flex-col justify-center items-center mb-5">
        <Avatar src={roomInfo?.cover || ""} size="lg" class="mb-2" />
        <p class="text-xl text-center mb-2">
            การแจ้งเตือนของ {roomInfo?.name || ""}
        </p>
        {#if !loadingSubscriptionInfo}
            {#if browserNotSupport}
                <Alert color="red">
                    <InfoCircleSolid slot="icon" class="w-5 h-5" />
                    <span>เบราว์เซอร์ของคุณไม่รองรับ Push Notification โปรดเปิดเว็บไซต์นี้ใน Google Chrome (Android/Windows) หรือ Safari (iOS) เวอร์ชั่นล่าสุด</span>
                </Alert>
            {/if}
            {#if !subscriptionId}
            <Button class="mx-auto" size="sm" on:click={handleClickSubscribe}>
                <BellActiveOutline class="w-5 h-5 mr-2" /> รับแจ้งเตือน
            </Button>
            {:else}
            <Button class="mx-auto" size="sm" on:click={handleClickUnsubscribe} color="red">
                <CloseOutline class="w-5 h-5 mr-2" /> เลิกรับแจ้งเตือน
            </Button>
            {/if}
        {/if}
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
