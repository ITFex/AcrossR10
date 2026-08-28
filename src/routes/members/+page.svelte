<script>
	import { locale, messages } from '$lib/i18n/index.js';

	/** @type {import('./$types').PageData} */
	let { data, form } = $props();

	// Server-side state; after an action `form` holds the fresh result.
	let crossings = $derived(
		/** @type {boolean[]} */ (form?.crossings ?? data.crossings)
	);
	let doneCount = $derived(crossings.filter(Boolean).length);
	let myPlan = $derived(form?.myPlan ?? data.myPlan);
	let todaysRiders = $derived(/** @type {any[]} */ (form?.todaysRiders ?? data.todaysRiders));
	let upcoming = $derived(/** @type {any[]} */ (form?.upcoming ?? data.upcoming));

	/** @param {string} iso YYYY-MM-DD */
	const prettyDate = (iso) => {
		const d = new Date(iso + 'T00:00:00');
		if (Number.isNaN(d.getTime())) return iso;
		return d.toLocaleDateString($locale === 'de' ? 'de-DE' : 'en-GB', {
			weekday: 'short',
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};
</script>

<svelte:head>
	<title>{$messages.members.pageTitle} – AcrossR10</title>
</svelte:head>

<!-- ═══ HERO ═══ -->
<section class="members-hero" id="top">
	<div class="container">
		<p class="eyebrow">{$messages.members.greeting}, {data.session.user.name ?? data.session.user.email} 👋</p>
		<h1>{$messages.members.pageTitle}</h1>
		<p class="hero-sub">{$messages.members.pageIntro}</p>
	</div>
</section>

<!-- ═══ PROGRESS ═══ -->
<section class="section" id="progress">
	<div class="container">
		<h2>{$messages.members.progress.heading}</h2>
		<p class="section-intro">{$messages.members.progress.intro}</p>
		<p class="progress-note">{$messages.members.progress.persistNote}</p>

		<div class="progress-bar-wrap"
			role="progressbar"
			aria-valuenow={doneCount}
			aria-valuemin={0}
			aria-valuemax={data.total}
			aria-label={$messages.members.progress.heading}>
			<div class="progress-bar" style="width: {(doneCount / data.total) * 100}%"></div>
		</div>
		<p class="progress-summary">{$messages.members.progress.summary(doneCount, data.total)}</p>

		<form method="POST" action="?/toggle" class="crossings-form">
			<div class="crossings-grid">
				{#each crossings as done, i}
					<div class="crossing-card" class:done>
						<span class="crossing-num">{$messages.members.progress.crossingLabel} {i + 1}</span>
						<span class="crossing-status">{done ? $messages.members.progress.done : $messages.members.progress.notDone}</span>
						<button class="crossing-btn" class:btn-undo={done} type="submit"
							name="toggle" value={i + 1 + ':' + (done ? '0' : '1')}>
							{done ? $messages.members.progress.markUndone : $messages.members.progress.markDone}
						</button>
					</div>
				{/each}
			</div>
		</form>
	</div>
</section>

<!-- ═══ TOUR-PLANUNG ═══ -->
<section class="section section-dark" id="tourplan">
	<div class="container">
		<h2>{$messages.members.tourplan.heading}</h2>
		<p class="section-intro">{$messages.members.tourplan.intro}</p>

		<!-- Heute am Start -->
		<div class="today-card">
			<h3 class="today-heading">🚴 {$messages.members.tourplan.todayHeading}</h3>
			{#if todaysRiders.length === 0}
				<p class="today-zero">{$messages.members.tourplan.todayZero}</p>
			{:else}
				<p class="today-count">{$messages.members.tourplan.todayCount(todaysRiders.length)}</p>
				<ul class="today-names">
					{#each todaysRiders as r}
						<li>
							{r.name}
							<span class="dir-badge">{r.direction === 'return' ? $messages.members.tourplan.dirBadgeReturn : $messages.members.tourplan.dirBadgeForward}</span>
							<span class="today-done">{r.done}/{data.total}</span>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<!-- Meine Planung -->
		<div class="plan-card">
			<h3>{$messages.members.tourplan.myPlanHeading}</h3>
			{#if myPlan.date}
				<p class="my-plan-summary">{$messages.members.tourplan.myPlanSummary(prettyDate(myPlan.date), myPlan.direction)}</p>
			{:else}
				<p class="no-plan">{$messages.members.tourplan.noPlan}</p>
			{/if}

			<form method="POST" action="?/plan" class="plan-form">
				<div class="plan-field">
					<label for="plan-date">{$messages.members.tourplan.dateLabel}</label>
					<input id="plan-date" type="date" name="date" value={myPlan.date ?? ''} required />
					<p class="field-hint">{$messages.members.tourplan.dateHint}</p>
				</div>
				<div class="plan-field">
					<label for="plan-direction">{$messages.members.tourplan.directionLabel}</label>
					<select id="plan-direction" name="direction">
						<option value="forward">{$messages.members.tourplan.directionForward}</option>
						<option value="return">{$messages.members.tourplan.directionReturn}</option>
					</select>
				</div>
				<div class="plan-actions">
					<button type="submit" class="plan-save">{$messages.members.tourplan.save}</button>
					{#if myPlan.date}
						<button type="submit" name="clear" value="1" class="plan-clear">{$messages.members.tourplan.clear}</button>
					{/if}
				</div>
			</form>
		</div>

		<!-- Community-Pläne der nächsten 7 Tage -->
		<h3 class="upcoming-heading">📅 {$messages.members.tourplan.upcomingHeading}</h3>
		{#if upcoming.length === 0}
			<p class="upcoming-empty">{$messages.members.tourplan.upcomingEmpty}</p>
		{:else}
			<div class="upcoming-list">
				{#each upcoming as day}
					<div class="upcoming-day">
						<div class="upcoming-day-head">
							<span class="upcoming-date">{prettyDate(day.date)}</span>
							<span class="upcoming-count">{$messages.members.tourplan.upcomingCount(day.riders.length, prettyDate(day.date))}</span>
						</div>
						<ul class="upcoming-riders">
							{#each day.riders as r}
								<li>
									{r.name}
									<span class="dir-badge">{r.direction === 'return' ? $messages.members.tourplan.dirBadgeReturn : $messages.members.tourplan.dirBadgeForward}</span>
									<span class="today-done">{r.done}/{data.total}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- ═══ VERPFLEGUNG ═══ -->
<section class="section" id="catering">
	<div class="container">
		<h2>{$messages.members.catering.heading}</h2>
		<p class="section-intro">{$messages.members.catering.intro}</p>

		<div class="catering-list">
			{#each $messages.members.catering.points as point}
				<div class="catering-card">
					<span class="catering-icon">{point.icon}</span>
					<div class="catering-body">
						<div class="catering-header">
							<strong class="catering-name">{point.name}</strong>
							<span class="catering-km">{point.km}</span>
						</div>
						<p class="catering-details">{point.details}</p>
					</div>
				</div>
			{/each}
		</div>

		<p class="water-note">{$messages.members.catering.waterNote}</p>
	</div>
</section>

<!-- ═══ STVO ═══ -->
<section class="section section-dark" id="stvo">
	<div class="container">
		<h2>{$messages.members.stvo.heading}</h2>
		<p class="section-intro">{$messages.members.stvo.intro}</p>

		<div class="rules-grid">
			{#each $messages.members.stvo.rules as rule}
				<div class="rule-card">
					<span class="rule-icon">{rule.icon}</span>
					<div>
						<h3>{rule.title}</h3>
						<p>{rule.body}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ═══ TIPPS ═══ -->
<section class="section" id="tips">
	<div class="container">
		<h2>{$messages.members.tips.heading}</h2>
		<p class="section-intro">{$messages.members.tips.intro}</p>

		<ul class="tips-list">
			{#each $messages.members.tips.items as tip}
				<li class="tip-item">
					<span class="tip-icon">{tip.icon}</span>
					<span>{tip.text}</span>
				</li>
			{/each}
		</ul>
	</div>
</section>

<footer>
	<p>{$messages.footer.copy}</p>
	<p class="footer-links"><a href="#top">{$messages.footer.toTop}</a></p>
</footer>

<style>
	/* ── layout ── */
	.container {
		max-width: 72rem;
		margin-inline: auto;
		padding-inline: 1.25rem;
	}
	.section { padding: 5rem 0; }
	.section-dark { background: #0f172a; }
	.section-intro {
		color: #94a3b8;
		max-width: 56ch;
		margin: 0 0 1rem;
	}
	.progress-note {
		color: #64748b;
		font-size: .8rem;
		font-weight: 600;
		margin: 0 0 2rem;
	}

	/* ── hero ── */
	.members-hero {
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
	.members-hero h1 {
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
		max-width: 52ch;
		margin: 0;
	}

	/* ── progress ── */
	h2 {
		font-size: clamp(1.4rem, 3vw, 2rem);
		font-weight: 800;
		margin: 0 0 1.25rem;
		color: #f1f5f9;
	}
	h3 { font-size: 1rem; font-weight: 700; margin: 0 0 .4rem; color: #f1f5f9; }

	.progress-bar-wrap {
		background: #1e293b;
		border-radius: 9999px;
		height: 10px;
		overflow: hidden;
		margin-bottom: .75rem;
		max-width: 40rem;
	}
	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, #f97316, #fb923c);
		border-radius: 9999px;
		transition: width 300ms ease;
	}
	.progress-summary {
		font-size: .85rem;
		color: #64748b;
		margin: 0 0 2rem;
		font-weight: 600;
	}

	.crossings-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
		gap: 1rem;
	}
	.crossing-card {
		background: #1e293b;
		border: 1px solid #334155;
		border-radius: .75rem;
		padding: 1.25rem 1rem;
		display: flex;
		flex-direction: column;
		gap: .5rem;
		transition: border-color 150ms ease;
	}
	.crossing-card.done {
		border-color: #f97316;
		background: rgba(249,115,22,.07);
	}
	.crossing-num {
		font-size: .75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: .07em;
		color: #64748b;
	}
	.crossing-status {
		font-size: .95rem;
		font-weight: 700;
		color: #94a3b8;
	}
	.crossing-card.done .crossing-status { color: #f97316; }

	.crossing-btn {
		margin-top: .25rem;
		background: #0f172a;
		border: 1px solid #334155;
		border-radius: .375rem;
		color: #94a3b8;
		font-size: .75rem;
		font-weight: 700;
		padding: .3rem .75rem;
		cursor: pointer;
		transition: color 120ms ease, border-color 120ms ease, background 120ms ease;
		text-align: center;
	}
	.crossing-btn:hover { color: #f8fafc; border-color: #64748b; }
	.crossing-btn.btn-undo { border-color: #f97316; color: #f97316; }
	.crossing-btn.btn-undo:hover { background: rgba(249,115,22,.1); }

	/* ── tour plan ── */
	.today-card {
		background: rgba(249,115,22,.07);
		border: 1px solid rgba(249,115,22,.35);
		border-radius: 1rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}
	.today-heading {
		font-size: 1.05rem;
		color: #f97316;
		margin: 0 0 .75rem;
	}
	.today-zero { color: #94a3b8; margin: 0; font-size: .95rem; }
	.today-count {
		color: #f1f5f9;
		font-weight: 800;
		font-size: 1.1rem;
		margin: 0 0 .75rem;
	}
	.today-names {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: .5rem 1.5rem;
	}
	.today-names li {
		color: #cbd5e1;
		font-weight: 600;
		font-size: .9rem;
		display: flex;
		align-items: center;
		gap: .4rem;
	}
	.dir-badge {
		display: inline-block;
		background: #1e293b;
		border: 1px solid #334155;
		border-radius: .25rem;
		padding: 0 .35rem;
		font-size: .75rem;
		color: #94a3b8;
		line-height: 1.4;
	}
	.today-done {
		font-size: .75rem;
		color: #64748b;
		font-weight: 700;
	}

	.plan-card {
		background: #1e293b;
		border: 1px solid #334155;
		border-radius: 1rem;
		padding: 1.5rem;
		margin-bottom: 2.5rem;
	}
	.my-plan-summary {
		color: #f97316;
		font-weight: 700;
		margin: 0 0 1rem;
	}
	.no-plan {
		color: #64748b;
		margin: 0 0 1rem;
		font-size: .9rem;
	}
	.plan-form {
		display: flex;
		flex-wrap: wrap;
		gap: 1.25rem 2rem;
		align-items: flex-start;
	}
	.plan-field {
		display: flex;
		flex-direction: column;
		gap: .4rem;
	}
	.plan-field label {
		font-size: .75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: .07em;
		color: #64748b;
	}
	.plan-field input[type='date'],
	.plan-field select {
		background: #0f172a;
		border: 1px solid #334155;
		border-radius: .375rem;
		color: #e2e8f0;
		padding: .5rem .75rem;
		font-size: .9rem;
		font-family: inherit;
	}
	.plan-field input[type='date'] { color-scheme: dark; }
	.plan-field input:focus,
	.plan-field select:focus {
		outline: none;
		border-color: #f97316;
	}
	.field-hint {
		font-size: .75rem;
		color: #475569;
		margin: 0;
	}
	.plan-actions {
		display: flex;
		gap: .75rem;
		padding-top: 1.4rem;
	}
	.plan-save {
		background: #f97316;
		color: #0a0f1e;
		font-weight: 700;
		font-size: .85rem;
		border: none;
		border-radius: .375rem;
		padding: .5rem 1.25rem;
		cursor: pointer;
		transition: background 120ms ease;
	}
	.plan-save:hover { background: #fb923c; }
	.plan-clear {
		background: transparent;
		border: 1px solid #334155;
		border-radius: .375rem;
		color: #94a3b8;
		font-size: .85rem;
		font-weight: 600;
		padding: .5rem 1.25rem;
		cursor: pointer;
		transition: color 120ms ease, border-color 120ms ease;
	}
	.plan-clear:hover { color: #f8fafc; border-color: #64748b; }

	.upcoming-heading {
		font-size: 1.05rem;
		margin: 0 0 1rem;
		color: #f1f5f9;
	}
	.upcoming-empty {
		color: #64748b;
		margin: 0;
		font-size: .9rem;
	}
	.upcoming-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: 1rem;
	}
	.upcoming-day {
		background: #1e293b;
		border: 1px solid #334155;
		border-radius: .75rem;
		padding: 1rem 1.25rem;
	}
	.upcoming-day-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		flex-wrap: wrap;
		gap: .5rem;
		margin-bottom: .6rem;
	}
	.upcoming-date {
		font-weight: 800;
		color: #f1f5f9;
		font-size: .9rem;
	}
	.upcoming-count {
		font-size: .72rem;
		color: #f97316;
		font-weight: 700;
	}
	.upcoming-riders {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: .3rem;
	}
	.upcoming-riders li {
		color: #cbd5e1;
		font-size: .85rem;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: .4rem;
	}

	/* ── catering ── */
	.catering-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 56rem;
	}
	.catering-card {
		display: flex;
		gap: 1.25rem;
		align-items: flex-start;
		background: #1e293b;
		border: 1px solid #334155;
		border-radius: .75rem;
		padding: 1.25rem;
	}
	.catering-icon { font-size: 2rem; flex-shrink: 0; }
	.catering-body { flex: 1; }
	.catering-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		flex-wrap: wrap;
		gap: .5rem;
		margin-bottom: .35rem;
	}
	.catering-name { color: #f1f5f9; font-size: 1rem; }
	.catering-km { color: #f97316; font-weight: 700; font-size: .85rem; }
	.catering-details { color: #94a3b8; font-size: .88rem; margin: 0; line-height: 1.6; }

	.water-note {
		margin-top: 1.5rem;
		padding: 1rem 1.25rem;
		background: rgba(249,115,22,.08);
		border: 1px solid rgba(249,115,22,.25);
		border-radius: .75rem;
		color: #cbd5e1;
		font-size: .88rem;
		max-width: 56rem;
	}

	/* ── rules ── */
	.rules-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
		gap: 1.25rem;
	}
	.rule-card {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		background: #0f172a;
		border: 1px solid #1e293b;
		border-radius: 1rem;
		padding: 1.5rem;
		transition: border-color 150ms ease;
	}
	.rule-card:hover { border-color: #f97316; }
	.rule-icon { font-size: 1.75rem; flex-shrink: 0; }
	.rule-card p { color: #94a3b8; font-size: .875rem; margin: 0; line-height: 1.65; }

	/* ── tips ── */
	.tips-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: .75rem;
		max-width: 56rem;
	}
	.tip-item {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		background: #1e293b;
		border: 1px solid #334155;
		border-radius: .75rem;
		padding: 1rem 1.25rem;
		font-size: .9rem;
		color: #94a3b8;
		line-height: 1.6;
	}
	.tip-icon { font-size: 1.4rem; flex-shrink: 0; }

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
