<script lang="ts">
    import {
        Badge,
        Table, 
        TableBody, 
        TableBodyCell, 
        TableBodyRow, 
        TableHead, 
        TableHeadCell
    } from "flowbite-svelte";
</script>

<title>คู่มือนักพัฒนา - Am Alert</title>

<div class="m-auto max-w-2xl mb-10">
    <div class="bg-white rounded-xl p-4 mb-2">
        <h1 class="text-2xl mb-4">คู่มือนักพัฒนา</h1>
        <div class="text-sm text-gray-700 mb-4">การส่งข้อความเข้าห้องเพื่อแจ้งเตือนไปยังกลุ่มผู้รับแจ้งเตือนของห้อง ทำผ่าน REST API โดยส่ง Method POST ไปที่ <Badge color="dark">/api/push</Badge> มีรายละเอียดดังนี้</div>
        
        <h2 class="text-md mb-2">Request Header</h2>
        <Table striped={true} class="mb-4">
            <TableBody tableBodyClass="divide-y">
                <TableBodyRow>
                    <TableBodyCell>Method</TableBodyCell>
                    <TableBodyCell>POST</TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                    <TableBodyCell>Content-Type</TableBodyCell>
                    <TableBodyCell>application/json</TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                    <TableBodyCell>Authorization</TableBodyCell>
                    <TableBodyCell>Bearer [Room Token]</TableBodyCell>
                </TableBodyRow>
            </TableBody>
        </Table>

        <h2 class="text-md mb-2">Body (Payload)</h2>
        <Table striped={true} class="mb-4">
            <TableHead>
                <TableHeadCell>Key</TableHeadCell>
                <TableHeadCell>Data type</TableHeadCell>
                <TableHeadCell>Value</TableHeadCell>
            </TableHead>
            <TableBody tableBodyClass="divide-y">
                <TableBodyRow>
                    <TableBodyCell>message</TableBodyCell>
                    <TableBodyCell><Badge color="blue">string</Badge></TableBodyCell>
                    <TableBodyCell>ข้อความแจ้งเตือน</TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                    <TableBodyCell>image</TableBodyCell>
                    <TableBodyCell><Badge color="blue">URL</Badge></TableBodyCell>
                    <TableBodyCell>ลิ้งรูปภาพ</TableBodyCell>
                </TableBodyRow>
            </TableBody>
        </Table>

        <h2 class="text-md mb-2">Response</h2>
        <Table striped={true} class="mb-4">
            <TableHead>
                <TableHeadCell>Key</TableHeadCell>
                <TableHeadCell>Data type</TableHeadCell>
                <TableHeadCell>Value</TableHeadCell>
            </TableHead>
            <TableBody tableBodyClass="divide-y">
                <TableBodyRow>
                    <TableBodyCell>ok</TableBodyCell>
                    <TableBodyCell><Badge color="blue">Boolean</Badge></TableBodyCell>
                    <TableBodyCell>
                        <p>ผลการส่งข้อความ</p>
                        <ul>
                            <li>true - ส่งข้อความสำเร็จ</li>
                            <li>false - ส่งข้อความไม่สำเร็จ</li>
                        </ul>
                    </TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                    <TableBodyCell>roomId</TableBodyCell>
                    <TableBodyCell><Badge color="blue">number</Badge></TableBodyCell>
                    <TableBodyCell>หมายเลขห้องที่ส่งข้อความ</TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                    <TableBodyCell>notificationId</TableBodyCell>
                    <TableBodyCell><Badge color="blue">number</Badge></TableBodyCell>
                    <TableBodyCell>หมายเลขข้อความ</TableBodyCell>
                </TableBodyRow>
            </TableBody>
        </Table>
        
        <h2 class="text-md mb-2">ตัวอย่าง HTTP Request</h2>
        <p class="text-sm text-gray-700 mb-2">ส่งข้อความอย่างเดียว</p>
        <pre class="bg-gray-50 text-sm p-3 rounded-lg mb-3 text-gray-700">POST /api/push HTTP/1.1
Host: alert.artronshop.co.th
Content-Type: application/json
Authorization: Bearer [Room Token]
Content-Length: 45

&#123;
    &quot;message&quot;: &quot;แผ่นดินไหวมาแล้ว 4 +++&quot;
&#125;</pre>
        <p class="text-sm text-gray-700 mb-2">ส่งข้อความพร้อมรูปภาพ</p>
        <pre class="bg-gray-50 text-sm p-3 rounded-lg mb-4 text-gray-700">POST /api/push HTTP/1.1
Host: alert.artronshop.co.th
Content-Type: application/json
Authorization: Bearer [Room Token]
Content-Length: 106

&#123;
    &quot;message&quot;: &quot;แผ่นดินไหวมาแล้ว 4 +++&quot;,
    &quot;image&quot;: &quot;https://f.lnwfile.com/_/f/_raw/fw/3b/wm.png&quot;
&#125;</pre>

        <h2 class="text-md mb-2">ตัวอย่าง Response</h2>
        <pre class="bg-gray-50 text-sm p-3 rounded-lg mb-4 text-gray-700">&#123;
    "ok": true,
    "roomId": 14,
    "notificationId": 41
&#125;</pre>
    </div>
</div>