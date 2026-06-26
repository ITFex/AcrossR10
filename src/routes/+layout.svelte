<script>
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { initLocale, locale, setLocale } from '$lib/stores/i18n';

	const copy = {
		de: {
			nav: {
				home: 'Start',
				checkin: 'Check-in',
				members: 'Mitglieder',
				leaderboard: 'Bestenliste',
				route: 'Rennsteig'
			},
			brandSub: 'Rennsteig Sessions · Team-Tracking · Saisonpunkte',
			languageLabel: 'Sprache',
			navLabel: 'Hauptnavigation'
		},
		en: {
			nav: {
				home: 'Home',
				checkin: 'Check-in',
				members: 'Members',
				leaderboard: 'Leaderboard',
				route: 'Rennsteig'
			},
			brandSub: 'Rennsteig Sessions · Team Tracking · Season Points',
			languageLabel: 'Language',
			navLabel: 'Main navigation'
		}
	};

	$: t = copy[$locale] ?? copy.de;

	const navItems = [
		{ href: '/', key: 'home' },
		{ href: '/checkin', key: 'checkin' },
		{ href: '/mitglieder', key: 'members' },
		{ href: '/bestenliste', key: 'leaderboard' },
		{ href: '/rennsteig', key: 'route' }
	];

	onMount(() => {
		initLocale();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="layout-shell">
	<div class="mist mist-left" aria-hidden="true"></div>
	<div class="mist mist-right" aria-hidden="true"></div>
	<header class="topbar">
		<div class="brand">
			<p class="brand-name">AcrossR10 Expedition</p>
			<p class="brand-sub">{t.brandSub}</p>
		</div>
		<div class="nav-wrap">
			<nav aria-label={t.navLabel} class="main-nav">
			{#each navItems as item}
				<a href={item.href} class:active={$page.url.pathname === item.href}>{t.nav[item.key]}</a>
			{/each}
			</nav>
			<div class="lang-switch" aria-label={t.languageLabel}>
				<button type="button" class:active={$locale === 'de'} on:click={() => setLocale('de')}>DE</button>
				<button type="button" class:active={$locale === 'en'} on:click={() => setLocale('en')}>EN</button>
			</div>
		</div>
	</header>

	<div class="content-frame">
		<slot />
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Manrope', 'Avenir Next', 'Segoe UI', sans-serif;
		color: #2f241b;
		background: #e9dfd1;
	}

	:global(h1, h2, h3) {
		font-family: 'Cormorant Garamond', 'Iowan Old Style', Georgia, serif;
		letter-spacing: 0.01em;
	}

	.layout-shell {
		position: relative;
		min-height: 100vh;
		overflow: hidden;
		background:
			radial-gradient(circle at 8% -2%, rgba(130, 96, 62, 0.24), transparent 32%),
			radial-gradient(circle at 95% 2%, rgba(86, 111, 85, 0.18), transparent 34%),
			linear-gradient(170deg, #ece3d6 0%, #e3d6c4 48%, #d9c6ae 100%);
	}

	.layout-shell::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0.16;
		background-image:
			linear-gradient(rgba(58, 43, 29, 0.2) 1px, transparent 1px),
			linear-gradient(90deg, rgba(58, 43, 29, 0.2) 1px, transparent 1px);
		background-size: 34px 34px;
	}

	.mist {
		position: absolute;
		width: clamp(18rem, 40vw, 32rem);
		height: clamp(18rem, 40vw, 32rem);
		border-radius: 50%;
		pointer-events: none;
		filter: blur(5px);
	}

	.mist-left {
		top: -7rem;
		left: -9rem;
		background: radial-gradient(circle, rgba(255, 242, 223, 0.48), transparent 70%);
	}

	.mist-right {
		top: -6rem;
		right: -10rem;
		background: radial-gradient(circle, rgba(180, 132, 79, 0.25), transparent 72%);
	}

	.topbar {
		max-width: 64rem;
		margin: 0 auto;
		padding: 1rem 1rem 0.9rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.85rem;
		position: sticky;
		top: 0;
		z-index: 20;
		background: linear-gradient(180deg, rgba(240, 229, 211, 0.88), rgba(240, 229, 211, 0.66));
		backdrop-filter: blur(10px);
		border-bottom: 1px solid rgba(95, 72, 46, 0.26);
		box-shadow: 0 12px 30px rgba(76, 56, 37, 0.15);
	}

	.brand {
		display: grid;
		gap: 0.2rem;
	}

	.brand-name,
	.brand-sub {
		margin: 0;
	}

	.brand-name {
		color: #443120;
		font-size: clamp(1.18rem, 1.5vw, 1.42rem);
		font-weight: 700;
		line-height: 1;
	}

	.brand-sub {
		color: #70553a;
		font-size: 0.79rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.main-nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.nav-wrap {
		display: grid;
		gap: 0.45rem;
	}

	.main-nav a {
		color: #5f4730;
		text-decoration: none;
		font-weight: 600;
		font-size: 0.9rem;
		padding: 0.46rem 0.78rem;
		border-radius: 999px;
		border: 1px solid rgba(122, 94, 60, 0.34);
		background: linear-gradient(180deg, rgba(255, 248, 237, 0.82), rgba(239, 224, 202, 0.8));
		transition: transform 140ms ease, border-color 140ms ease, color 140ms ease;
	}

	.main-nav a:hover {
		border-color: #9f6f3d;
		color: #3f2e1f;
		transform: translateY(-1px);
	}

	.main-nav a.active {
		background: linear-gradient(140deg, #a8753f, #82552d);
		border-color: transparent;
		color: #fff6ea;
		box-shadow: 0 9px 16px rgba(95, 60, 28, 0.28);
	}

	.lang-switch {
		display: flex;
		gap: 0.35rem;
		justify-content: flex-end;
	}

	.lang-switch button {
		border: 1px solid rgba(122, 94, 60, 0.34);
		border-radius: 999px;
		background: rgba(255, 248, 237, 0.82);
		color: #5f4730;
		font: inherit;
		font-size: 0.8rem;
		font-weight: 700;
		padding: 0.28rem 0.55rem;
		cursor: pointer;
	}

	.lang-switch button.active {
		background: linear-gradient(140deg, #a8753f, #82552d);
		border-color: transparent;
		color: #fff6ea;
	}

	.content-frame {
		position: relative;
		z-index: 2;
	}

	@media (max-width: 760px) {
		.topbar {
			padding-bottom: 0.75rem;
		}

		.brand-sub {
			display: none;
		}

		.lang-switch {
			justify-content: flex-start;
		}
	}
</style>
