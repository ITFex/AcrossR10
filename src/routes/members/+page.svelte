<script>
	import { messages } from '$lib/i18n/index.js';

	/** @type {import('./$types').PageData} */
	let { data } = $props();

	const TOTAL = 10;
	const STORAGE_KEY = 'acrossr10_crossings';

	/** @type {boolean[]} */
	let crossings = $state(Array(TOTAL).fill(false));

	$effect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed) && parsed.length === TOTAL) {
					crossings = parsed.map(Boolean);
				}
			}
		} catch {
			// ignore parse errors
		}
	});

	function toggle(i) {
		crossings = crossings.map((v, idx) => (idx === i ? !v : v));
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(crossings));
		} catch {
			// ignore storage errors
		}
		if (profileSaved) syncToServer();
	}

	let doneCount = $derived(crossings.filter(Boolean).length);

	// ── Profile ──────────────────────────────────────────────────────────────
	/** @type {'M' | 'W' | 'D' | ''} */
	let gender = $state(data.profile?.gender ?? '');
	let birthYear = $state(data.profile?.birthYear?.toString() ?? '');
	let isPublic = $state(data.profile?.isPublic ?? true);
	let profileSaved = $state(!!data.profile);
	let profileEditing = $state(!data.profile);
	let profileSaving = $state(false);
	let profileError = $state('');

	async function saveProfile() {
		profileError = '';
		const year = parseInt(birthYear, 10);
		const currentYear = new Date().getFullYear();
		if (!gender) { profileError = $messages.members.profile.errorGender; return; }
		if (!year || year < 1920 || year > currentYear - 10) { profileError = $messages.members.profile.errorYear; return; }
		profileSaving = true;
		try {
			const res = await fetch('/api/profile', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ gender, birthYear: year, crossings: doneCount, isPublic })
			});
			if (!res.ok) throw new Error(await res.text());
			profileSaved = true;
			profileEditing = false;
		} catch (e) {
			profileError = $messages.members.profile.errorSave;
		} finally {
			profileSaving = false;
		}
	}

	async function syncToServer() {
		if (!profileSaved) return;
		try {
			await fetch('/api/profile', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ gender, birthYear: parseInt(birthYear, 10), crossings: doneCount, isPublic })
			});
		} catch {
			// silent sync failure
		}
	}
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

		<div class="progress-bar-wrap"
			role="progressbar"
			aria-valuenow={doneCount}
			aria-valuemin={0}
			aria-valuemax={TOTAL}
			aria-label={$messages.members.progress.heading}>
			<div class="progress-bar" style="width: {(doneCount / TOTAL) * 100}%"></div>
		</div>
		<p class="progress-summary">{$messages.members.progress.summary(doneCount, TOTAL)}</p>

		<div class="crossings-grid">
			{#each crossings as done, i}
				<div class="crossing-card" class:done>
					<span class="crossing-num">{$messages.members.progress.crossingLabel} {i + 1}</span>
					<span class="crossing-status">{done ? $messages.members.progress.done : $messages.members.progress.notDone}</span>
					<button class="crossing-btn" class:btn-undo={done} type="button" aria-pressed={done} onclick={() => toggle(i)}>
						{done ? $messages.members.progress.markUndone : $messages.members.progress.markDone}
					</button>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ═══ BESTENLISTE / PROFIL ═══ -->
<section class="section" id="profile">
	<div class="container">
		<h2>{$messages.members.profile.heading}</h2>
		<p class="section-intro">{$messages.members.profile.intro}</p>

		{#if doneCount >= TOTAL}
			<div class="completed-banner">
				🏆 {$messages.members.profile.completedBanner}
				<a href="/leaderboard" class="btn-primary banner-btn">{$messages.members.profile.leaderboardLink}</a>
			</div>
		{/if}

		{#if profileEditing}
			<form class="profile-form" onsubmit={(e) => { e.preventDefault(); saveProfile(); }}>
				<div class="form-row">
					<label class="form-label">{$messages.members.profile.genderLabel}</label>
					<div class="gender-btns">
						{#each ['M', 'W', 'D'] as g}
							<button
								type="button"
								class="gender-btn"
								class:selected={gender === g}
								onclick={() => (gender = g)}
							>
								{$messages.members.profile.genderOptions[g]}
							</button>
						{/each}
					</div>
				</div>

				<div class="form-row">
					<label class="form-label" for="birth-year">{$messages.members.profile.birthYearLabel}</label>
					<input
						id="birth-year"
						class="form-input"
						type="number"
						min="1920"
						max={new Date().getFullYear() - 10}
						placeholder="z.B. 1985"
						bind:value={birthYear}
					/>
				</div>

				<div class="form-row form-row-check">
					<input id="is-public" type="checkbox" bind:checked={isPublic} />
					<label for="is-public">{$messages.members.profile.publicLabel}</label>
				</div>

				{#if profileError}
					<p class="form-error">{profileError}</p>
				{/if}

				<div class="form-actions">
					<button class="btn-primary" type="submit" disabled={profileSaving}>
						{profileSaving ? $messages.members.profile.saving : $messages.members.profile.save}
					</button>
					{#if profileSaved}
						<button type="button" class="btn-ghost-sm" onclick={() => (profileEditing = false)}>
							{$messages.members.profile.cancel}
						</button>
					{/if}
				</div>
			</form>
		{:else}
			<div class="profile-card">
				<div class="profile-row">
					<span class="profile-key">{$messages.members.profile.genderLabel}</span>
					<span class="profile-val">{$messages.members.profile.genderOptions[gender] ?? gender}</span>
				</div>
				<div class="profile-row">
					<span class="profile-key">{$messages.members.profile.birthYearLabel}</span>
					<span class="profile-val">{birthYear}</span>
				</div>
				<div class="profile-row">
					<span class="profile-key">{$messages.members.profile.publicLabel}</span>
					<span class="profile-val">{isPublic ? '✓' : '✗'}</span>
				</div>
				<button class="btn-ghost-sm" onclick={() => (profileEditing = true)}>
					{$messages.members.profile.edit}
				</button>
			</div>
		{/if}
	</div>
</section>

<!-- ═══ VERPFLEGUNG ═══ -->
<section class="section section-dark" id="catering">
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
<section class="section" id="stvo">
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
<section class="section section-dark" id="tips">
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
		margin: 0 0 2.5rem;
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

	/* ── buttons ── */
	.btn-primary {
		display: inline-block;
		background: #f97316;
		color: #0a0f1e;
		font-weight: 700;
		font-size: .9rem;
		padding: .75rem 1.75rem;
		border-radius: .5rem;
		text-decoration: none;
		border: none;
		cursor: pointer;
		transition: background 150ms ease, transform 100ms ease;
	}
	.btn-primary:hover { background: #fb923c; transform: translateY(-1px); }
	.btn-primary:disabled { opacity: .6; cursor: not-allowed; transform: none; }

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

	/* ── profile ── */
	.completed-banner {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		background: rgba(249,115,22,.1);
		border: 1px solid rgba(249,115,22,.35);
		border-radius: .75rem;
		padding: 1rem 1.25rem;
		color: #fed7aa;
		font-weight: 700;
		margin-bottom: 1.5rem;
	}
	.banner-btn { font-size: .8rem; padding: .4rem 1rem; }
	.profile-form {
		background: #1e293b;
		border: 1px solid #334155;
		border-radius: 1rem;
		padding: 1.5rem;
		max-width: 36rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}
	.form-row { display: flex; flex-direction: column; gap: .4rem; }
	.form-row-check { flex-direction: row; align-items: center; gap: .6rem; }
	.form-label { font-size: .8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .07em; }
	.form-input {
		background: #0f172a;
		border: 1px solid #334155;
		border-radius: .5rem;
		color: #f1f5f9;
		font-size: .95rem;
		padding: .5rem .75rem;
		width: 10rem;
	}
	.form-input:focus { outline: 2px solid #f97316; border-color: transparent; }
	.gender-btns { display: flex; gap: .5rem; }
	.gender-btn {
		background: #0f172a;
		border: 1px solid #334155;
		border-radius: .5rem;
		color: #94a3b8;
		font-size: .9rem;
		font-weight: 700;
		padding: .4rem 1rem;
		cursor: pointer;
		transition: color 120ms ease, border-color 120ms ease, background 120ms ease;
	}
	.gender-btn.selected { background: #f97316; border-color: #f97316; color: #0a0f1e; }
	.form-error { color: #f87171; font-size: .85rem; margin: 0; }
	.form-actions { display: flex; gap: .75rem; align-items: center; flex-wrap: wrap; }
	.btn-ghost-sm {
		background: none;
		border: 1px solid #334155;
		border-radius: .375rem;
		color: #64748b;
		font-size: .8rem;
		font-weight: 600;
		padding: .35rem .875rem;
		cursor: pointer;
		transition: color 120ms ease, border-color 120ms ease;
	}
	.btn-ghost-sm:hover { color: #94a3b8; border-color: #64748b; }
	.profile-card {
		background: #1e293b;
		border: 1px solid #334155;
		border-radius: 1rem;
		padding: 1.25rem 1.5rem;
		max-width: 36rem;
		display: flex;
		flex-direction: column;
		gap: .75rem;
	}
	.profile-row { display: flex; gap: 1rem; align-items: baseline; }
	.profile-key { font-size: .75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .07em; min-width: 8rem; }
	.profile-val { color: #f1f5f9; font-weight: 600; }

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
