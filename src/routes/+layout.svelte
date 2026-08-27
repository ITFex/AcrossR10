<script>
	import { browser } from '$app/environment';
	import favicon from '$lib/assets/favicon.svg';
	import { locale, messages, setLocale } from '$lib/i18n/index.js';
	import { signIn, signOut } from '@auth/sveltekit/client';

	/** @type {import('./$types').LayoutData} */
	export let data;
	let session = null;

	$: if (browser) document.documentElement.lang = $locale;

	$: session = data?.session ?? null;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="top-bar">
	<div class="auth-bar">
		{#if session?.user}
			<span class="user-name">{session.user.name ?? session.user.email}</span>
			<button on:click={() => signOut()}>{$messages.auth.logout}</button>
		{:else}
			<button on:click={() => signIn('keycloak')}>{$messages.auth.login}</button>
		{/if}
	</div>
	<button class="lang-btn" on:click={() => setLocale($locale === 'de' ? 'en' : 'de')}>
		{$messages.lang.switchTo}
	</button>
</nav>

<slot />

<style>
	.top-bar {
		position: fixed;
		top: 0.5rem;
		right: 0.75rem;
		z-index: 100;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.auth-bar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.user-name {
		color: #94a3b8;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.top-bar button,
	.lang-btn {
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

	.top-bar button:hover,
	.lang-btn:hover {
		color: #f8fafc;
		border-color: #64748b;
	}
</style>
