<script>
	import { browser } from '$app/environment';
	import favicon from '$lib/assets/favicon.svg';
	import { locale, messages, setLocale } from '$lib/i18n/index.js';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { base } from '$app/paths';

	/** @type {import('./$types').LayoutData} */
	export let data;
	let session = null;

	$: if (browser) document.documentElement.lang = $locale;

	$: session = data?.session ?? null;

	const navLinks = [
		{ href: '#event',   labelKey: 'navEvent' },
		{ href: '#gpx',     labelKey: 'navRoute' },
		{ href: '#region',  labelKey: 'navRegion' },
		{ href: '#faq',     labelKey: 'navFaq' },
		{ href: '#contact', labelKey: 'navContact' },
	];</script>

<svelte:head>
	<title>AcrossR10 – 10× über den Rennsteig</title>
	<meta name="description" content="Gravel-Challenge: den Rennsteig 10-mal mit dem Gravelbike überqueren. GPX-Download, Streckeninfos, FAQ." />
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="site-nav">
	<a class="nav-brand" href="{base}/#top">AcrossR10</a>
	<nav class="nav-links">
		{#each navLinks as l}
			<a href="{base}/{l.href}">{$messages.nav[l.labelKey]}</a>
		{/each}
		{#if session?.user}
			<a href="{base}/members" class="nav-members">{$messages.nav.navMembers}</a>
		{/if}
		<a href="{base}/leaderboard" class="nav-leaderboard">{$messages.nav.navLeaderboard}</a>
	</nav>
	<div class="auth-bar">
		{#if session?.user}
			<span class="user-name">{session.user.name ?? session.user.email}</span>
			<button class="auth-btn" on:click={() => signOut()}>{$messages.auth.logout}</button>
		{:else}
			<button class="auth-btn" on:click={() => signIn('keycloak')}>{$messages.auth.login}</button>
		{/if}
	</div>
	<button class="lang-btn" on:click={() => setLocale($locale === 'de' ? 'en' : 'de')}>
		{$messages.lang.switchTo}
	</button>
</header>

<slot />

<style>
	/* ── base ── */
	:global(*, *::before, *::after) { box-sizing: border-box; }
	:global(html) { scroll-behavior: smooth; }
	:global(body) {
		margin: 0;
		font-family: Inter, system-ui, sans-serif;
		background: #0a0f1e;
		color: #e2e8f0;
		line-height: 1.65;
	}
	:global(a) { color: #f97316; }

	/* ── nav ── */
	.site-nav {
		position: sticky;
		top: 0;
		z-index: 200;
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: .75rem 1.25rem;
		background: rgba(10,15,30,.92);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid #1e293b;
	}
	.nav-brand {
		font-weight: 800;
		font-size: 1rem;
		color: #f97316;
		text-decoration: none;
		flex-shrink: 0;
	}
	.nav-links {
		display: flex;
		gap: 1.25rem;
		flex: 1;
		flex-wrap: wrap;
	}
	.nav-links a {
		font-size: .8rem;
		font-weight: 600;
		color: #64748b;
		text-decoration: none;
		text-transform: uppercase;
		letter-spacing: .07em;
		transition: color 120ms ease;
	}
	.nav-links a:hover { color: #f1f5f9; }
	.nav-links .nav-members { color: #f97316; }
	.nav-links .nav-leaderboard { color: #fbbf24; }
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
	.auth-btn,
	.lang-btn {
		background: #1e293b;
		border: 1px solid #334155;
		border-radius: .375rem;
		color: #94a3b8;
		font-size: .75rem;
		font-weight: 600;
		padding: .25rem .625rem;
		cursor: pointer;
		flex-shrink: 0;
		transition: color 120ms ease, border-color 120ms ease;
	}
	.auth-btn:hover,
	.lang-btn:hover { color: #f8fafc; border-color: #64748b; }

	@media (max-width: 640px) {
		.nav-links { display: none; }
	}
</style>
