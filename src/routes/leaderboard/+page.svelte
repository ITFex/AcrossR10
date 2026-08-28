<script>
	import { base } from '$app/paths';
	import { messages } from '$lib/i18n/index.js';

	/** @type {import('./$types').PageData} */
	let { data } = $props();

	const TOTAL = 10;

	/** @param {{ name: string, done: number, completedAllAt: string | null, lastCompletedAt: string | null }} rider */
	const formatDate = (value) => {
		if (!value) return '—';
		const d = new Date(value.replace(' ', 'T') + 'Z');
		if (Number.isNaN(d.getTime())) return value;
		return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
	};
</script>

<svelte:head>
	<title>{$messages.leaderboard.pageTitle} – AcrossR10</title>
</svelte:head>

<!-- ═══ HERO ═══ -->
<section class="lb-hero" id="top">
	<div class="container">
		<p class="eyebrow">{$messages.leaderboard.eyebrow}</p>
		<h1>{$messages.leaderboard.heading}</h1>
		<p class="hero-sub">{$messages.leaderboard.intro}</p>
	</div>
</section>

<!-- ═══ TABELLE ═══ -->
<section class="section" id="board">
	<div class="container">
		{#if data.leaderboard.length === 0}
			<div class="lb-empty">
				<p>{$messages.leaderboard.empty}</p>
				<a class="lb-cta" href="{base}/members">{$messages.leaderboard.emptyCta}</a>
			</div>
		{:else}
			<div class="lb-table-wrap">
				<table class="lb-table">
					<thead>
						<tr>
							<th class="lb-rank">#</th>
							<th>{$messages.leaderboard.colRider}</th>
							<th class="lb-num">{$messages.leaderboard.colProgress}</th>
							<th class="lb-last">{$messages.leaderboard.colLast}</th>
							<th>{$messages.leaderboard.colFinished}</th>
						</tr>
					</thead>
					<tbody>
						{#each data.leaderboard as rider, i}
							<tr class:champion={rider.done >= TOTAL}>
								<td class="lb-rank">
									{#if i < 3 && rider.done > 0}
										<span class="lb-medal" class:medal-gold={i === 0} class:medal-silver={i === 1} class:medal-bronze={i === 2}>
											{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
										</span>
									{:else}
										<span class="lb-pos">{i + 1}</span>
									{/if}
								</td>
								<td class="lb-name">
									<span class="rider-name">{rider.name}</span>
									{#if rider.done >= TOTAL}
										<span class="lb-champion-badge">{$messages.leaderboard.champion}</span>
									{/if}
								</td>
								<td class="lb-num">
									<span class="lb-count">{rider.done}<span class="lb-of">/{TOTAL}</span></span>
									<div class="lb-bar-wrap" role="progressbar" aria-valuenow={rider.done} aria-valuemin={0} aria-valuemax={TOTAL}>
										<div class="lb-bar" style="width: {(rider.done / TOTAL) * 100}%"></div>
									</div>
								</td>
								<td class="lb-last">{formatDate(rider.lastCompletedAt)}</td>
								<td class="lb-finished">
									{#if rider.completedAllAt}
										<span class="lb-finished-date">✓ {formatDate(rider.completedAllAt)}</span>
									{:else}
										<span class="lb-open">—</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<p class="lb-footer-note">{$messages.leaderboard.footerNote}</p>
		{/if}
	</div>
</section>

<footer>
	<p>{$messages.footer.copy}</p>
	<p class="footer-links"><a href="{base}/#top">{$messages.footer.toTop}</a></p>
</footer>

<style>
	/* ── layout ── */
	.container {
		max-width: 72rem;
		margin-inline: auto;
		padding-inline: 1.25rem;
	}
	.section { padding: 3.5rem 0 5rem; }

	/* ── hero ── */
	.lb-hero {
		background:
			radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,.15) 0%, transparent 70%),
			#0a0f1e;
		padding: 5rem 1.25rem 4rem;
		text-align: center;
	}
	.eyebrow {
		font-size: .8rem;
		font-weight: 700;
		letter-spacing: .12em;
		text-transform: uppercase;
		color: #f97316;
		margin: 0 0 .75rem;
	}
	.lb-hero h1 {
		font-size: clamp(1.6rem, 4vw, 2.8rem);
		font-weight: 800;
		line-height: 1.1;
		margin: 0 0 1rem;
		background: linear-gradient(135deg, #fff 30%, #f97316 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	.hero-sub {
		font-size: 1rem;
		color: #94a3b8;
		max-width: 56ch;
		margin: 0 auto;
	}

	/* ── empty state ── */
	.lb-empty {
		text-align: center;
		padding: 4rem 1rem;
		background: #1e293b;
		border: 1px dashed #334155;
		border-radius: 1rem;
	}
	.lb-empty p { color: #94a3b8; margin: 0 0 1.25rem; }
	.lb-cta {
		display: inline-block;
		background: #f97316;
		color: #0a0f1e;
		font-weight: 700;
		text-decoration: none;
		padding: .6rem 1.4rem;
		border-radius: .5rem;
	}
	.lb-cta:hover { background: #fb923c; }

	/* ── table ── */
	.lb-table-wrap {
		overflow-x: auto;
		border: 1px solid #1e293b;
		border-radius: 1rem;
	}
	.lb-table {
		width: 100%;
		border-collapse: collapse;
		min-width: 40rem;
	}
	.lb-table th {
		text-align: left;
		font-size: .72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: .08em;
		color: #64748b;
		padding: .9rem 1.25rem;
		border-bottom: 1px solid #1e293b;
		background: #0f172a;
	}
	.lb-table td {
		padding: 1rem 1.25rem;
		border-bottom: 1px solid #16213a;
		font-size: .92rem;
		vertical-align: middle;
	}
	.lb-table tbody tr:last-child td { border-bottom: none; }
	.lb-table tbody tr:hover { background: rgba(249,115,22,.04); }
	tr.champion {
		background: rgba(249,115,22,.08);
	}
	tr.champion td { border-bottom-color: rgba(249,115,22,.2); }

	.lb-rank { width: 3.5rem; }
	.lb-medal { font-size: 1.3rem; }
	.lb-pos { color: #64748b; font-weight: 700; }
	.lb-num { width: 14rem; }
	.lb-last { width: 8rem; color: #94a3b8; font-size: .85rem; white-space: nowrap; }

	.rider-name { color: #f1f5f9; font-weight: 700; }
	.lb-champion-badge {
		display: inline-block;
		margin-left: .5rem;
		font-size: .65rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: .06em;
		color: #0a0f1e;
		background: linear-gradient(90deg, #f97316, #fb923c);
		border-radius: 9999px;
		padding: .15rem .55rem;
		vertical-align: middle;
	}
	.lb-count {
		color: #f1f5f9;
		font-weight: 800;
	}
	.lb-of { color: #64748b; font-weight: 600; font-size: .8rem; }
	.lb-bar-wrap {
		margin-top: .4rem;
		height: 6px;
		background: #1e293b;
		border-radius: 9999px;
		overflow: hidden;
	}
	.lb-bar {
		height: 100%;
		background: linear-gradient(90deg, #f97316, #fb923c);
		border-radius: 9999px;
	}
	.lb-finished-date { color: #f97316; font-weight: 700; font-size: .85rem; white-space: nowrap; }
	.lb-open { color: #334155; }

	.lb-footer-note {
		margin-top: 1.25rem;
		color: #475569;
		font-size: .78rem;
		text-align: center;
	}

	/* ── footer ── */
	footer {
		background: #020617;
		padding: 2rem 1.25rem;
		text-align: center;
		color: #334155;
		font-size: .8rem;
	}
	footer p { margin: .25rem 0; }
	.footer-links a { color: #475569; text-decoration: none; }
	.footer-links a:hover { color: #94a3b8; }
</style>
