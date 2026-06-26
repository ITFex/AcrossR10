<script>
  import { locale } from '$lib/stores/i18n';

  const copy = {
    de: {
      heroTitle: 'Dein digitales Basislager für den Rennsteig',
      heroText:
        'Starte deine Session, verfolge Teambewegungen und nutze die aktualisierte Übersicht zum 195 km langen Rennsteig-Radwanderweg für Orientierung und Tourplanung.',
      startSession: 'Session starten',
      openLeaderboard: 'Bestenliste öffnen',
      cards: {
        checkin: {
          kicker: 'Check-in',
          title: 'Live Check-in',
          text: 'Standortfreigabe aktivieren, POI treffen und Punkte sofort sichern.',
          link: 'Zum Check-in Bereich'
        },
        ranking: {
          kicker: 'Ranking',
          title: 'Ewige Bestenliste',
          text: 'Langfristig messen: Punkte, Check-ins und POI-Abdeckung im direkten Vergleich.',
          link: 'Zur Bestenliste'
        },
        members: {
          kicker: 'Mitglieder',
          title: 'Internes Live-Tracking',
          text: 'Nur für Mitglieder: aktuelle Positionen in einer Live-Karte verfolgen.',
          link: 'Zum Mitgliederbereich'
        },
        route: {
          kicker: 'Strecke',
          title: 'Rennsteig-Radweg',
          text: '195 km von Hörschel bis Blankenstein mit Kurzübersicht, Streckencharakter und offiziellen Planungslinks.',
          link: 'Route ansehen'
        }
      }
    },
    en: {
      heroTitle: 'Your digital base camp for Rennsteig',
      heroText:
        'Start your session, track team movements and use the updated overview of the 195 km Rennsteig cycle route for navigation and planning.',
      startSession: 'Start session',
      openLeaderboard: 'Open leaderboard',
      cards: {
        checkin: {
          kicker: 'Check-in',
          title: 'Live Check-in',
          text: 'Enable location sharing, reach a POI and secure points instantly.',
          link: 'Open check-in area'
        },
        ranking: {
          kicker: 'Ranking',
          title: 'All-time Leaderboard',
          text: 'Compare points, check-ins and POI coverage over time.',
          link: 'Go to leaderboard'
        },
        members: {
          kicker: 'Members',
          title: 'Internal Live Tracking',
          text: 'Members only: follow current positions on a live map.',
          link: 'Open member area'
        },
        route: {
          kicker: 'Route',
          title: 'Rennsteig Cycle Route',
          text: '195 km from Hörschel to Blankenstein with route summary, profile and official planning links.',
          link: 'View route'
        }
      }
    }
  };

  $: t = copy[$locale] ?? copy.de;
</script>

<main>
  <section class="hero panel">
    <div class="hero-copy">
      <p class="kicker">AcrossR10</p>
      <h1>{t.heroTitle}</h1>
      <p>{t.heroText}</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="/checkin">{t.startSession}</a>
        <a class="btn btn-secondary" href="/bestenliste">{t.openLeaderboard}</a>
      </div>
    </div>
  </section>

  <section class="focus-grid">
    <article class="panel focus-card">
      <p class="mini-kicker">{t.cards.checkin.kicker}</p>
      <h2>{t.cards.checkin.title}</h2>
      <p>{t.cards.checkin.text}</p>
      <a href="/checkin">{t.cards.checkin.link}</a>
    </article>

    <article class="panel focus-card card-highlight">
      <p class="mini-kicker">{t.cards.ranking.kicker}</p>
      <h2>{t.cards.ranking.title}</h2>
      <p>{t.cards.ranking.text}</p>
      <a href="/bestenliste">{t.cards.ranking.link}</a>
    </article>

    <article class="panel focus-card">
      <p class="mini-kicker">{t.cards.members.kicker}</p>
      <h2>{t.cards.members.title}</h2>
      <p>{t.cards.members.text}</p>
      <a href="/mitglieder">{t.cards.members.link}</a>
    </article>

    <article class="panel focus-card">
      <p class="mini-kicker">{t.cards.route.kicker}</p>
      <h2>{t.cards.route.title}</h2>
      <p>{t.cards.route.text}</p>
      <a href="/rennsteig">{t.cards.route.link}</a>
    </article>
  </section>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Manrope:wght@500;600;700;800&display=swap');

  main {
    max-width: 64rem;
    margin: 0 auto;
    padding: 1rem 1rem 1.8rem;
    display: grid;
    gap: 1.05rem;
  }

  .panel {
    position: relative;
    overflow: hidden;
    background: linear-gradient(162deg, rgba(250, 241, 229, 0.97), rgba(236, 219, 195, 0.97));
    border: 1px solid rgba(104, 77, 49, 0.34);
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: 0 14px 34px rgba(82, 57, 31, 0.17);
  }

  .panel::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.2), transparent 38%);
  }

  .hero {
    display: grid;
    gap: 1rem;
    border-color: rgba(130, 93, 51, 0.46);
    background:
      radial-gradient(circle at 18% 2%, rgba(250, 236, 216, 0.74), transparent 42%),
      radial-gradient(circle at 85% 8%, rgba(178, 129, 75, 0.24), transparent 44%),
      linear-gradient(140deg, rgba(224, 205, 177, 0.96), rgba(243, 230, 213, 0.98));
    animation: revealUp 520ms ease-out;
  }

  .hero-copy {
    display: grid;
    gap: 0.7rem;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
  }

  .btn {
    width: fit-content;
    text-decoration: none;
    border-radius: 999px;
    padding: 0.56rem 0.88rem;
    font-size: 0.9rem;
    font-weight: 700;
    transition: transform 140ms ease, box-shadow 140ms ease;
  }

  .btn:hover {
    transform: translateY(-1px);
  }

  .btn-primary {
    color: #fff9ef;
    background: linear-gradient(135deg, #9f6a35, #7d4e29);
    box-shadow: 0 10px 18px rgba(104, 66, 33, 0.3);
  }

  .btn-secondary {
    color: #61462d;
    background: rgba(248, 238, 223, 0.88);
    border: 1px solid rgba(129, 96, 62, 0.38);
  }

  .kicker {
    margin: 0;
    color: #84562e;
    text-transform: uppercase;
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.11em;
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  .hero h1 {
    font-size: clamp(1.45rem, 2.5vw, 2.3rem);
    max-width: 20ch;
    line-height: 1.08;
    color: #372515;
  }

  .hero p {
    color: #553c24;
    max-width: 56ch;
  }

  .focus-grid {
    display: grid;
    gap: 0.9rem;
    animation: revealUp 840ms ease-out;
  }

  .focus-card {
    display: grid;
    gap: 0.45rem;
  }

  .mini-kicker {
    margin: 0;
    color: #7c5732;
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
  }

  .focus-card h2 {
    color: #392616;
  }

  .focus-card p {
    color: #62472c;
  }

  .focus-card a {
    width: fit-content;
    text-decoration: none;
    color: #fff9ef;
    background: linear-gradient(135deg, #9a6534, #7b4c29);
    border-radius: 999px;
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .card-highlight {
    border-color: rgba(146, 102, 58, 0.52);
    background: linear-gradient(160deg, rgba(228, 205, 172, 0.98), rgba(244, 229, 203, 0.98));
  }

  @keyframes revealUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (min-width: 860px) {
    .hero {
      grid-template-columns: 1fr;
      align-items: stretch;
    }

    .focus-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 600px) {
    main {
      padding-top: 0.75rem;
      gap: 0.85rem;
    }

    .hero {
      padding: 0.9rem;
    }

    .hero h1 {
      font-size: clamp(1.4rem, 7vw, 1.9rem);
    }

    .focus-grid {
      gap: 0.75rem;
    }
  }
</style>
