<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<title>การแจ้งเตือนของ {data.name}</title>
<h1>This room : {data.name}</h1>
