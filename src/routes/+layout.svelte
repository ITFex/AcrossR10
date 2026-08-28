<script>
	import { browser } from '$app/environment';
	import favicon from '$lib/assets/favicon.svg';
	import { locale, messages, setLocale } from '$lib/i18n/index.js';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { base } from '$app/paths';

	/** @type {import('./$types').LayoutData} */
	let { data } = $props();

	let menuOpen = $state(false);
	let session = $derived(/** @type {any} */ (data?.session ?? null));
	let registrationUrl = $derived(data?.registrationUrl ?? null);

	const navLinks = [
		{ href: '#event',   labelKey: 'navEvent' },
		{ href: '#gpx',     labelKey: 'navRoute' },
		{ href: '#region',  labelKey: 'navRegion' },
		{ href: '#faq',     labelKey: 'navFaq' },
		{ href: '#contact', labelKey: 'navContact' },
	];

	/** @param {MouseEvent} e */
	function toggleMenu(e) {
		e.preventDefault();
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}
</script>

<svelte:head>
	<title>AcrossR10 – 10× über den Rennsteig</title>
	<meta name="description" content="Gravel-Challenge: den Rennsteig 10-mal mit dem Gravelbike überqueren. GPX-Download, Streckeninfos, FAQ." />
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="site-nav">
	<a class="nav-brand" href="{base}/#top">AcrossR10</a>
	<nav class="nav-links" class:open={menuOpen}>
		{#each navLinks as l}
			<a href="{base}/{l.href}" onclick={closeMenu}>{$messages.nav[l.labelKey]}</a>
		{/each}
		<a href="{base}/leaderboard" class="nav-leaderboard" onclick={closeMenu}>{$messages.nav.navLeaderboard}</a>
		{#if session?.user}
			<a href="{base}/members" class="nav-members" onclick={closeMenu}>{$messages.nav.navMembers}</a>
		{/if}
	</nav>
	<div class="auth-bar">
		{#if session?.user}
			<span class="user-name">{session.user.name ?? session.user.email}</span>
			<button class="auth-btn" onclick={() => signOut()}>{$messages.auth.logout}</button>
		{:else}
			<button class="auth-btn" onclick={() => signIn('keycloak')}>{$messages.auth.login}</button>
			<!--
				Registration goes through the same Auth.js sign-in flow as login
				(state/PKCE cookies are set there), just with kc_action=REGISTRATION
				so Keycloak opens the registration form directly.
			-->
			<button class="auth-btn register-btn" onclick={() => signIn('keycloak', undefined, { kc_action: 'REGISTRATION' })}>
				{$messages.auth.register}
			</button>
		{/if}
	</div>
	<button class="lang-btn" onclick={() => setLocale($locale === 'de' ? 'en' : 'de')}>
		{$messages.lang.switchTo}
	</button>
	<button class="nav-toggle" aria-expanded={menuOpen} aria-label={$messages.nav.toggleMenu} onclick={toggleMenu}>
		<span class="nav-toggle-icon" class:is-open={menuOpen}></span>
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
	.nav-links .nav-leaderboard { color: #94a3b8; }
	.nav-links .nav-leaderboard:hover { color: #f97316; }
	.nav-links .nav-members { color: #f97316; }
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
	.register-btn {
		border-color: #f97316;
		color: #f97316;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
	}
	.register-btn:hover { background: #f97316; color: #0a0f1e; border-color: #f97316; }

	/* ── mobile hamburger ── */
	.nav-toggle {
		display: none;
		background: none;
		border: 1px solid #334155;
		border-radius: .375rem;
		padding: .4rem .5rem;
		cursor: pointer;
		flex-shrink: 0;
	}
	.nav-toggle-icon,
	.nav-toggle-icon::before,
	.nav-toggle-icon::after {
		display: block;
		width: 18px;
		height: 2px;
		background: #94a3b8;
		border-radius: 2px;
		transition: transform 180ms ease, opacity 180ms ease;
	}
	.nav-toggle-icon { position: relative; }
	.nav-toggle-icon::before,
	.nav-toggle-icon::after {
		content: '';
		position: absolute;
		left: 0;
	}
	.nav-toggle-icon::before { top: -6px; }
	.nav-toggle-icon::after { top: 6px; }
	.nav-toggle-icon.is-open { background: transparent; }
	.nav-toggle-icon.is-open::before { transform: translateY(6px) rotate(45deg); }
	.nav-toggle-icon.is-open::after { transform: translateY(-6px) rotate(-45deg); }

	@media (max-width: 640px) {
		.nav-toggle { display: inline-flex; }
		.nav-links {
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			flex-direction: column;
			gap: 0;
			background: rgba(10,15,30,.98);
			border-bottom: 1px solid #1e293b;
			padding: .25rem 0;
			display: none;
		}
		.nav-links.open { display: flex; }
		.nav-links a {
			padding: .7rem 1.5rem;
			font-size: .85rem;
		}
		.auth-bar .user-name { display: none; }
	}
</style>
