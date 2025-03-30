<script lang="ts">
    import type { PageProps } from './$types';
    import { Card, Button, Label, Input, Checkbox } from "flowbite-svelte";

    let { data, form }: PageProps = $props();

    let showError = $state(true);

    const handleInputKeyup = () => showError = false;
</script>

<title>เข้าสู่ระบบ - Am Alert</title>

<div class="mx-auto w-80 my-8">
    <Card>
        <form class="flex flex-col space-y-6" method="POST">
            <h3 class="text-xl font-medium text-gray-900 mb-2 text-center">เข้าสู่ระบบ</h3>
            <Label class="space-y-2 mb-3">
                <div class="mb-1">อีเมล์</div>
                <Input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
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
            {#if form?.incorrect && showError}
                <p class="text-red-500">อีเมล์หรือรหัสผ่านไม่ถูกต้อง</p>
            {/if}
            <div class="flex items-start mb-3">
                <Checkbox name="remember" value="yes">จดจำฉัน</Checkbox>
                <a
                    href="/"
                    class="ms-auto text-sm text-primary-700 hover:underline dark:text-primary-500"
                >ลืมรหัสผ่าน ?</a>
            </div>
            <Button type="submit" class="w-full mb-3">เข้าสู่ระบบ</Button>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                ยังไม่ได้เป็นสมาชิก? <a
                    href="/sign-up"
                    class="text-primary-700 hover:underline dark:text-primary-500"
                >
                    สมัครสมาชิก
                </a>
            </div>
        </form>
    </Card>
</div>
