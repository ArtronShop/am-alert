<script lang="ts">
    import type { PageProps } from './$types';
    import { Card, Button, Label, Input, Checkbox, Alert } from "flowbite-svelte";

    let { data, form }: PageProps = $props();

    let showError = $state(true);

    const handleInputKeyup = () => showError = false;
    
    let isSignUp = $state(false);

    let acceptAgreement: boolean = $state(false);
</script>

<title>{!isSignUp ? "เข้าสู่ระบบ" : "สมัครสมาชิก"} - Am Alert</title>

<div class="mx-auto w-80 my-8">
    <Card>
        <form class="flex flex-col space-y-6" method="POST" action={!isSignUp ? "?/login" : "?/register"}>
            <h3 class="text-xl font-medium text-gray-900 mb-2 text-center">{!isSignUp ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}</h3>
            {#if form?.incorrect && showError}
                <Alert color="red">{form.incorrect}</Alert>
            {/if}
            <Label class="space-y-2 mb-3">
                <div class="mb-1">อีเมล์</div>
                <Input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    required
                    on:keyup={handleInputKeyup}
                />
            </Label>
            <Label class="space-y-2 mb-3">
                <div class="mb-1">รหัสผ่าน</div>
                <Input
                    type="password"
                    name="password"
                    placeholder="•••••"
                    required
                    on:keyup={handleInputKeyup}
                />
            </Label>
            {#if !isSignUp}
                <div class="flex items-start mb-3">
                    <Checkbox name="remember" value="yes">จดจำฉัน</Checkbox>
                    <a
                        href="/"
                        class="ms-auto text-sm text-primary-700 hover:underline dark:text-primary-500"
                    >ลืมรหัสผ่าน ?</a>
                </div>
                <Button type="submit" class="w-full mb-3">เข้าสู่ระบบ</Button>
                <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                    ยังไม่ได้เป็นสมาชิก? <button
                        class="text-primary-700 hover:underline dark:text-primary-500 cursor-pointer"
                        onclick={(e) => { isSignUp = true; }}
                    >
                        สมัครสมาชิก
                    </button>
                </div>
            {/if}
            {#if isSignUp}
                <Label class="space-y-2 mb-3">
                    <div class="mb-1">ยืนยันรหัสผ่าน</div>
                    <Input
                        type="password"
                        name="re-password"
                        placeholder="•••••"
                        required
                        on:keyup={handleInputKeyup}
                    />
                </Label>
                <Label class="space-y-2 mb-3">
                    <div class="mb-1">ชื่อ</div>
                    <Input
                        type="text"
                        name="name"
                        placeholder="นายเอ นามสมมุติ"
                        required
                        on:keyup={handleInputKeyup}
                    />
                </Label>
                <div class="flex items-start mb-3">
                    <Checkbox bind:checked={acceptAgreement}>ฉันยอมรับ
                        <a href="/" target="_blank" class="ml-1 text-sm text-primary-700 hover:underline dark:text-primary-500">เงื่อนไขการให้บริการ</a>
                    </Checkbox>
                </div>
                <Button type="submit" class="w-full mb-3" disabled={!acceptAgreement}>สมัครสมาชิก</Button>
                <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                    เป็นสมาชิกอยู่แล้ว? <button
                        class="text-primary-700 hover:underline dark:text-primary-500 cursor-pointer"
                        onclick={(e) => { isSignUp = false; }}
                    >
                        เข้าสู่ระบบ
                    </button>
                </div>
            {/if}
        </form>
    </Card>
</div>
