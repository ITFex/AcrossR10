<script>
	import { messages } from '$lib/i18n/index.js';

	/** @type {import('./$types').PageData} */
	let { data } = $props();

	const TOTAL = 10;

	/** @param {number} birthYear @returns {string} */
	function ageClass(birthYear) {
		const age = new Date().getFullYear() - birthYear;
		if (age < 30) return $messages.leaderboard.ageClasses.u30;
		if (age < 40) return $messages.leaderboard.ageClasses.ak30;
		if (age < 50) return $messages.leaderboard.ageClasses.ak40;
		if (age < 60) return $messages.leaderboard.ageClasses.ak50;
		return $messages.leaderboard.ageClasses.ak60;
	}

	/** @param {string | null} iso @returns {string} */
	function fmtDate(iso) {
		if (!iso) return '—';
		return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso));
	}

	/** @type {'all' | 'M' | 'W' | 'D'} */
	let filter = $state('all');

	let filtered = $derived(
		filter === 'all' ? data.entries : data.entries.filter((e) => e.gender === filter)
	);

	/** @param {typeof filtered} entries */
	function groupByAgeClass(entries) {
		/** @type {Map<string, typeof entries>} */
		const map = new Map();
		for (const e of entries) {
			const cls = ageClass(e.birth_year);
			if (!map.has(cls)) map.set(cls, []);
			map.get(cls).push(e);
		}
		return map;
	}

	let grouped = $derived(groupByAgeClass(filtered));
</script>

<svelte:head>
	<title>{$messages.leaderboard.pageTitle} – AcrossR10</title>
</svelte:head>

<!-- ═══ HERO ═══ -->
<section class="lb-hero">
	<div class="container">
		<p class="eyebrow">{$messages.leaderboard.eyebrow}</p>
		<h1>{$messages.leaderboard.pageTitle}</h1>
		<p class="hero-sub">{$messages.leaderboard.pageIntro}</p>
	</div>
</section>

<!-- ═══ FILTER ═══ -->
<section class="section" id="leaderboard">
	<div class="container">
		<div class="filter-bar">
			{#each ['all', 'M', 'W', 'D'] as f}
				<button
					class="filter-btn"
					class:active={filter === f}
					onclick={() => (filter = f)}
				>
					{$messages.leaderboard.filters[f]}
				</button>
			{/each}
		</div>

		{#if filtered.length === 0}
			<p class="empty">{$messages.leaderboard.empty}</p>
		{:else}
			{#each [...grouped.entries()] as [cls, entries]}
				<div class="age-group">
					<h2 class="group-title">{cls}</h2>
					<div class="table-wrap">
						<table>
							<thead>
								<tr>
									<th class="col-rank">{$messages.leaderboard.colRank}</th>
									<th class="col-name">{$messages.leaderboard.colName}</th>
									<th class="col-gender">{$messages.leaderboard.colGender}</th>
									<th class="col-cross">{$messages.leaderboard.colCrossings}</th>
									<th class="col-date">{$messages.leaderboard.colDate}</th>
								</tr>
							</thead>
							<tbody>
								{#each entries as entry, i}
									<tr class:gold={i === 0} class:silver={i === 1} class:bronze={i === 2}>
										<td class="col-rank">
											{#if i === 0}🥇{:else if i === 1}🥈{:else if i === 2}🥉{:else}{i + 1}.{/if}
										</td>
										<td class="col-name">{entry.user_name}</td>
										<td class="col-gender">{entry.gender}</td>
										<td class="col-cross">{entry.crossings}/{TOTAL}</td>
										<td class="col-date">{fmtDate(entry.completed_at)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/each}
		{/if}

		<p class="hint">{$messages.leaderboard.hint}</p>
	</div>
</section>

<footer>
	<p>{$messages.footer.copy}</p>
	<p class="footer-links"><a href="#top">{$messages.footer.toTop}</a></p>
</footer>

<style>
	.container {
		max-width: 72rem;
		margin-inline: auto;
		padding-inline: 1.25rem;
	}
	.section { padding: 4rem 0; }

	/* hero */
	.lb-hero {
		background:
			radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,.15) 0%, transparent 70%),
			#0a0f1e;
		padding: 5rem 1.25rem 4rem;
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
	.hero-sub { color: #94a3b8; max-width: 52ch; margin: 0; }

	/* filter */
	.filter-bar {
		display: flex;
		gap: .5rem;
		flex-wrap: wrap;
		margin-bottom: 2.5rem;
	}
	.filter-btn {
		background: #1e293b;
		border: 1px solid #334155;
		border-radius: .5rem;
		color: #94a3b8;
		font-size: .8rem;
		font-weight: 700;
		padding: .4rem 1rem;
		cursor: pointer;
		transition: color 120ms ease, border-color 120ms ease, background 120ms ease;
	}
	.filter-btn:hover { color: #f8fafc; border-color: #64748b; }
	.filter-btn.active { background: #f97316; border-color: #f97316; color: #0a0f1e; }

	/* groups */
	.age-group { margin-bottom: 3rem; }
	.group-title {
		font-size: 1rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: .08em;
		color: #f97316;
		margin: 0 0 1rem;
	}

	/* table */
	.table-wrap { overflow-x: auto; }
	table {
		width: 100%;
		border-collapse: collapse;
		font-size: .9rem;
	}
	thead th {
		text-align: left;
		font-size: .7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: .07em;
		color: #64748b;
		padding: .5rem .75rem;
		border-bottom: 1px solid #1e293b;
	}
	tbody tr {
		border-bottom: 1px solid #0f172a;
		transition: background 100ms ease;
	}
	tbody tr:hover { background: rgba(255,255,255,.03); }
	tbody tr.gold   { background: rgba(250,204,21,.06); }
	tbody tr.silver { background: rgba(148,163,184,.05); }
	tbody tr.bronze { background: rgba(180,120,60,.05); }
	td { padding: .65rem .75rem; color: #cbd5e1; }
	.col-rank { width: 3rem; text-align: center; font-size: 1.1rem; }
	.col-name { font-weight: 600; color: #f1f5f9; }
	.col-gender { width: 4rem; text-align: center; }
	.col-cross { width: 5rem; text-align: center; color: #f97316; font-weight: 700; }
	.col-date { width: 7rem; color: #64748b; font-size: .8rem; }

	.empty {
		color: #475569;
		text-align: center;
		padding: 3rem 0;
		font-size: 1rem;
	}
	.hint {
		margin-top: 2rem;
		color: #475569;
		font-size: .8rem;
	}

	/* footer */
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
