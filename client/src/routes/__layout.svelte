<script>
	import '../app.css';
	import { browser } from '$app/env';

	if (browser) {
		if (localStorage.getItem('uuid') === null) {
			localStorage.setItem('uuid', crypto.randomUUID());
		}
	}
</script>

<slot />
