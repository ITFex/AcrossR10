<script>
	import { browser } from '$app/environment';
	import favicon from '$lib/assets/favicon.svg';
	import { locale, messages, setLocale } from '$lib/i18n/index.js';

	$: if (browser) document.documentElement.lang = $locale;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="lang-bar">
	<button on:click={() => setLocale($locale === 'de' ? 'en' : 'de')}>
		{$messages.lang.switchTo}
	</button>
</nav>

<slot />

<style>
	.lang-bar {
		position: fixed;
		top: 0.5rem;
		right: 0.75rem;
		z-index: 100;
	}

	.lang-bar button {
		background: #1e293b;
		border: 1px solid #334155;
		border-radius: 0.5rem;
		color: #94a3b8;
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.625rem;
		cursor: pointer;
		transition: color 120ms ease, border-color 120ms ease;
	}

	.lang-bar button:hover {
		color: #f8fafc;
		border-color: #64748b;
	}
</style>
