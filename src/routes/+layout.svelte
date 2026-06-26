<script>
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';

	const navItems = [
		{ href: '/', label: 'Start' },
		{ href: '/checkin', label: 'Check-in' },
		{ href: '/bestenliste', label: 'Bestenliste' },
		{ href: '/guide', label: 'Guide' },
		{ href: '/rennsteig', label: 'Rennsteig' }
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="layout-shell">
	<header class="topbar">
		<div class="brand">
			<p class="brand-name">AcrossR10</p>
			<p class="brand-sub">Route · Check-in · Planung</p>
		</div>
		<nav aria-label="Hauptnavigation" class="main-nav">
			{#each navItems as item}
				<a href={item.href} class:active={$page.url.pathname === item.href}>{item.label}</a>
			{/each}
		</nav>
	</header>

	<slot />
</div>

<style>
	.layout-shell {
		min-height: 100vh;
	}

	.topbar {
		max-width: 64rem;
		margin: 0 auto;
		padding: 1rem 1rem 0.7rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.85rem;
		position: sticky;
		top: 0;
		z-index: 20;
		background: linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.8));
		backdrop-filter: blur(7px);
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
		color: #f8fafc;
		font-size: 1.18rem;
		font-weight: 700;
	}

	.brand-sub {
		color: #cbd5e1;
		font-size: 0.82rem;
	}

	.main-nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.main-nav a {
		color: #cbd5e1;
		text-decoration: none;
		font-weight: 600;
		font-size: 0.9rem;
		padding: 0.42rem 0.72rem;
		border-radius: 999px;
		border: 1px solid #35506c;
		background: rgba(15, 23, 42, 0.55);
		transition: 120ms ease-in-out;
	}

	.main-nav a:hover {
		border-color: #60a5fa;
		color: #f8fafc;
	}

	.main-nav a.active {
		background: linear-gradient(135deg, #0284c7, #1d4ed8);
		border-color: transparent;
		color: #f8fafc;
	}
</style>
