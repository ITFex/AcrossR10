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
		background:
			radial-gradient(circle at 0% 0%, rgba(205, 177, 140, 0.2), transparent 40%),
			radial-gradient(circle at 100% 20%, rgba(176, 142, 102, 0.18), transparent 42%),
			#f3e7d5;
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
		background: linear-gradient(180deg, rgba(244, 232, 214, 0.96), rgba(244, 232, 214, 0.84));
		backdrop-filter: blur(7px);
		border-bottom: 1px solid #d8c2a2;
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
		color: #4f3a25;
		font-size: 1.18rem;
		font-weight: 700;
	}

	.brand-sub {
		color: #7c6243;
		font-size: 0.82rem;
	}

	.main-nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.main-nav a {
		color: #6e5437;
		text-decoration: none;
		font-weight: 600;
		font-size: 0.9rem;
		padding: 0.42rem 0.72rem;
		border-radius: 999px;
		border: 1px solid #ccb18a;
		background: rgba(247, 237, 223, 0.86);
		transition: 120ms ease-in-out;
	}

	.main-nav a:hover {
		border-color: #b8824a;
		color: #4f3a25;
	}

	.main-nav a.active {
		background: linear-gradient(135deg, #b8824a, #9f6f3d);
		border-color: transparent;
		color: #fff9ef;
	}
</style>
