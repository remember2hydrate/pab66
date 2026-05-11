const trendsSection = document.getElementById('district-trends');
    const singleFigureShell = document.getElementById('singleFigureShell');
    const singleFigureShell2 = document.getElementById('singleFigureShell2');
    const singleFigureImage = document.getElementById('singleFigureImage');
    const districtCopies = document.querySelectorAll('.district-copy');

    const closingScrollSection = document.getElementById('closing-scroll');
    const closingStages = document.querySelectorAll('.closing-stage');

    const detailImages = [
      "images/Southern_prostitution_trends.png",
      "images/Tenderloin_prostitution_trends.png",
      "images/Central_prostitution_trends.png",
      "images/Northern_prostitution_trends.png",
      "images/Mission_prostitution_trends.png"
    ];

    let currentDistrictStage = null;
    let imageSwapTimeout = null;
    let ticking = false;

    function showCopy(indexOrIntro) {
      districtCopies.forEach((copy) => {
        copy.classList.remove('active');
      });

      if (indexOrIntro === 'intro') {
        const intro = document.querySelector('.district-copy[data-copy="intro"]');
        if (intro) intro.classList.add('active');
        return;
      }

      const target = document.querySelector(`.district-copy[data-copy="${indexOrIntro}"]`);
      if (target) target.classList.add('active');
    }

    function switchDistrictState(nextStage) {
      if (nextStage === currentDistrictStage) return;
      currentDistrictStage = nextStage;

      if (nextStage === -1) {
        showCopy('intro');
        singleFigureShell2.style.opacity = '0';
        return;
      }

      showCopy(nextStage);
      singleFigureShell2.style.opacity = '1';

      if (imageSwapTimeout) clearTimeout(imageSwapTimeout);

      singleFigureImage.classList.add('is-fading');

      imageSwapTimeout = setTimeout(() => {
        singleFigureImage.src = detailImages[nextStage];
        singleFigureImage.alt = "District plot";
        singleFigureImage.classList.remove('is-fading');
      }, 180);
    }

    function updateScrollScene() {
      const sectionRect = trendsSection.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const scrollable = trendsSection.offsetHeight - viewportH;

      let progress = 0;
      if (scrollable > 0) {
        progress = Math.min(Math.max(-sectionRect.top / scrollable, 0), 1);
      }

      const introEnd = 0.16;
      let desiredStage = -1;

      if (progress >= introEnd) {
        const adjusted = (progress - introEnd) / (1 - introEnd);
        desiredStage = Math.min(4, Math.floor(adjusted * 5));
      }

      switchDistrictState(desiredStage);
    }

    let currentClosingStage = -1;
    let closingStageLocked = false;
    let pendingClosingStage = null;
    const CLOSING_STAGE_TRANSITION_MS = 1000;

    const closingStageOrder = ['question', 'p1'];

    function showClosingStageByIndex(index) {
      closingStages.forEach(stage => stage.classList.remove('active'));

      if (index < 0) return;

      const stageName = closingStageOrder[index];
      const target = document.querySelector(`.closing-stage[data-stage="${stageName}"]`);
      if (target) target.classList.add('active');
    }

    function goToClosingStage(targetStage) {
      if (targetStage === currentClosingStage) return;

      if (closingStageLocked) {
        pendingClosingStage = targetStage;
        return;
      }

      closingStageLocked = true;

      if (targetStage > currentClosingStage) {
        currentClosingStage += 1;
      } else {
        currentClosingStage -= 1;
      }

      showClosingStageByIndex(currentClosingStage);

      setTimeout(() => {
        closingStageLocked = false;

        if (pendingClosingStage !== null && pendingClosingStage !== currentClosingStage) {
          const next = pendingClosingStage;
          pendingClosingStage = null;
          goToClosingStage(next);
        } else {
          pendingClosingStage = null;
        }
      }, CLOSING_STAGE_TRANSITION_MS);
    }

    // function updateClosingScene() {
    //   const sectionRect = closingScrollSection.getBoundingClientRect();
    //   const viewportH = window.innerHeight;
    //   const scrollable = closingScrollSection.offsetHeight - viewportH;

    //   let progress = 0;
    //   if (scrollable > 0) {
    //     progress = Math.min(Math.max(-sectionRect.top / scrollable, 0), 1);
    //   }

    //   let desiredStage = -1;

    //   if (progress >= 0.04 && progress < 0.34) {
    //     desiredStage = 0;
    //   } else if (progress >= 0.34) {
    //     desiredStage = 1;
    //   }

    //   goToClosingStage(desiredStage);
    // }

    // function requestTick() {
    //   if (!ticking) {
    //     ticking = true;
    //     requestAnimationFrame(() => {
    //       updateScrollScene();
    //       updateClosingScene();
    //       ticking = false;
    //     });
    //   }
    // }

    // window.addEventListener('scroll', requestTick, { passive: true });
    // window.addEventListener('resize', requestTick);
    // window.addEventListener('load', requestTick);

    const trendsEntranceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          singleFigureShell.classList.add('revealed');
          singleFigureShell2.classList.add('revealed');
        } else {
          singleFigureShell.classList.remove('revealed');
          singleFigureShell2.classList.remove('revealed');
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: "0px 0px -8% 0px"
    });

   

    const fadePair = document.querySelector('.fade-pair');
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, {
      threshold: 0.22
    });

    if (fadePair) {
      fadeObserver.observe(fadePair);
    }

// ── Navbar section-reveal logic (disabled — navbar is always visible) ──────
// const siteNav = document.getElementById('siteNav');

// const navSectionMap = {
//   'hero':           document.querySelector('.hero'),
//   'content':        document.getElementById('content'),
//   'district-trends':document.getElementById('district-trends'),
//   'eu-dashboard':document.getElementById('eu-dashboard'),
//   'eu-correlations':document.getElementById('eu-correlations'),
//   'article-grid':   document.getElementById('article-grid'),
//   'conclusion':     document.getElementById('conclusion'),
// };

// const navItems = document.querySelectorAll('.nav-item[data-nav]');

// const navSectionObserver = new IntersectionObserver((entries) => {
//   entries.forEach(entry => {
//     const sectionId = entry.target.dataset.observedNav;
//     const navItem = document.querySelector(`.nav-item[data-nav="${sectionId}"]`);
//     if (!navItem) return;

//     if (entry.isIntersecting) {
//       siteNav.classList.add('nav-visible');
//       navItem.classList.add('link-visible');
//       // Mark as active, remove from all others
//       navItems.forEach(i => i.querySelector('.nav-link').classList.remove('active'));
//       navItem.querySelector('.nav-link').classList.add('active');
//     }
//     // Never remove link-visible — items accumulate and stay
//   });
// }, { threshold: 0.15 });

// Object.entries(navSectionMap).forEach(([id, el]) => {
//   if (el) {
//     el.dataset.observedNav = id;
//     navSectionObserver.observe(el);
//   }
// });


// ─────────────────────────────────────────────────────────────
//  CONFIG
//  Adjust the PLOTS functions to match your Python output paths.
//
//  Assumed folder layout:
//    plots/
//      map/     gdp_2018.html … ability_keep_warm_2025.html   (40 files)
//      life/    life_satisfaction_2018.html … _2025.html        (8 files)
//      trust/   social_trust_2018.html … _2025.html             (8 files)
//      mental/  mental_health_2018.html … _2025.html            (8 files)
//
//  The three right-hand plots are year-only (no metric dimension).
//  If your Python script also varies them by metric, just add the
//  metric token to the template strings below.
// ─────────────────────────────────────────────────────────────
const YEARS   = [2018, 2019, 2020, 2021, 2022, 2023, 2024];

const METRICS = [
  'GDP',
  'Mean Income',
  'Median Income',
  'People at risk of poverty',
  'Inability to keep home warm',
];

const PLOTS = {
  // Left map — changes with metric + year
  map: (metric, year) => `visualizations/${metric}_${year}.html`,

  // Right panels — year-only (tabs don't affect these).
  // Replace null with a function once you have the files, e.g.:
  //   life:   year => `visualizations/Life_Satisfaction_${year}.html`,
  //   trust:  year => `visualizations/Social_Trust_${year}.html`,
  //   mental: year => `visualizations/Mental_Health_${year}.html`,
  life:   null,
  trust:  null,
  mental: null,
  happiness: year => `visualizations/Mental_health_${year}.html`,
};

// DOM refs
const frameMap    = document.getElementById('frame-map');
// DISABLED: individual panel refs replaced by single happiness frame
// const frameLife   = document.getElementById('frame-life');
// const frameTrust  = document.getElementById('frame-trust');
// const frameMental = document.getElementById('frame-mental');
const frameHappiness = document.getElementById('frame-happiness');
const slider         = document.getElementById('timeline');
const yearDisplay    = document.getElementById('year-display');
const euTabBar   = document.getElementById('euTabBar');
const tabButtons = euTabBar.querySelectorAll('.eu-tab');


// State — must match the data-metric of the first .eu-tab exactly
let currentMetric = 'GDP';
let currentYear   = 2018;

// ── Year tick marks ──────────────────────────────────────────
(function buildTicks() {
  const container = document.getElementById('year-ticks');
  YEARS.forEach(y => {
    const s = document.createElement('span');
    s.textContent = y;
    s.dataset.year = y;
    container.appendChild(s);
  });
})();

function updateTicks(year) {
  document.querySelectorAll('#year-ticks span').forEach(s =>
    s.classList.toggle('active-tick', +s.dataset.year === year)
  );
}

function updateSliderFill(year) {
  const pct = ((year - 2018) / (2024 - 2018)) * 100;
  slider.style.setProperty('--pct', pct + '%');
}

// ── Background preload ───────────────────────────────────────
//  One hidden <iframe> per file. The browser fetches them all
//  lazily. By the time the user reaches any given combination,
//  it's already in the HTTP cache → instant visible swap.
const preloadPool  = document.getElementById('preload-pool');
const preloadCache = new Set();

function preloadAll() {
  // Map: varies by metric AND year
  YEARS.forEach(year => {
    METRICS.forEach(metric => {
      const src = PLOTS.map(metric, year);
      if (preloadCache.has(src)) return;
      preloadCache.add(src);
      const f = document.createElement('iframe');
      f.src = src;
      f.setAttribute('loading', 'lazy');
      f.setAttribute('sandbox', 'allow-scripts allow-same-origin');
      preloadPool.appendChild(f);
    });
  });

  // Right panels: year-only, skip if not yet configured
  ['life', 'trust', 'mental'].forEach(slot => {
    if (!PLOTS[slot]) return;
    YEARS.forEach(year => {
      const src = PLOTS[slot](year);
      if (preloadCache.has(src)) return;
      preloadCache.add(src);
      const f = document.createElement('iframe');
      f.src = src;
      f.setAttribute('loading', 'lazy');
      f.setAttribute('sandbox', 'allow-scripts allow-same-origin');
      preloadPool.appendChild(f);
    });
  });

  // Happiness panel: preload one file per year
  YEARS.forEach(year => {
    const src = `visualizations/Mental_health_${year}.html`;
    if (preloadCache.has(src)) return;
    preloadCache.add(src);
    const f = document.createElement('iframe');
    f.src = src;
    f.setAttribute('loading', 'lazy');
    f.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    preloadPool.appendChild(f);
  });
}

// ── Shimmer helpers ──────────────────────────────────────────
function showShimmer(id) { document.getElementById(id).classList.remove('done'); }
function hideShimmer(id) { document.getElementById(id).classList.add('done');    }

// ── Slot loader ──────────────────────────────────────────────
//  Skips the reload if the iframe already shows the target src.
//  Pass src=null to leave the panel in its placeholder state.
function loadSlot(frameEl, shimmerId, src, onLoaded) {
  if (!src || !frameEl) {
    // No file configured for this slot — leave the broken-file placeholder hidden
    if (shimmerId) hideShimmer(shimmerId);
    return;
  }

  // normalise: strip protocol+host so we compare just the path
  const current = frameEl.src.replace(location.origin, '');
  const target  = src.startsWith('/') ? src : '/' + src;
  if (current === target) {
    // Already showing the right src — still run the callback (e.g. on first init)
    if (onLoaded) onLoaded(frameEl);
    return;
  }

  showShimmer(shimmerId);
  frameEl.classList.add('loading');

  frameEl.onload = () => {
    frameEl.classList.remove('loading');
    hideShimmer(shimmerId);
    if (onLoaded) onLoaded(frameEl);
  };
  frameEl.onerror = () => {
    frameEl.classList.remove('loading');
    hideShimmer(shimmerId);
    console.warn('Failed to load:', src);
  };

  frameEl.src = src;
}

// ── Master update ────────────────────────────────────────────
// updateMap  — reloads ONLY the left map (metric + year)
// updateYear — reloads ONLY the year-driven panels (happiness)
// update     — reloads everything (used on slider change / init)

function updateMap() {
  loadSlot(frameMap, 'shimmer-map', PLOTS.map(currentMetric, currentYear));
}

function scrollHappinessToTopRight(frame) {
  // Give the inner document a moment to finish rendering before scrolling
  setTimeout(() => {
    try {
      const doc = frame.contentDocument || frame.contentWindow.document;
      const win = frame.contentWindow;
      win.scrollTo(doc.body.scrollWidth, 0);
    } catch (e) {
      // Cross-origin guard — silently ignore
    }
  }, 120);
}

function updateYear() {
  updateSliderFill(currentYear);
  updateTicks(currentYear);
  yearDisplay.textContent = currentYear;
  loadSlot(frameHappiness, 'shimmer-happiness', PLOTS.happiness(currentYear), scrollHappinessToTopRight);
}

function update() {
  updateYear();
  updateMap();
}

// ── Event listeners ──────────────────────────────────────────
// Tab clicks: only the map changes — happiness panel stays put
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMetric = btn.dataset.metric;
    updateMap();   // ← map only, happiness panel untouched
  });
});

// 'input' fires while dragging — update both map and happiness panel
slider.addEventListener('input', () => {
  currentYear = +slider.value;
  update();   // year changed → reload both panels
});

// ── Init ─────────────────────────────────────────────────────
updateSliderFill(currentYear);
updateTicks(currentYear);
update();

// Start background preloading ~400ms after first paint so the
// visible frames get priority bandwidth first.
requestAnimationFrame(() => setTimeout(preloadAll, 400));

// ── Responsive happiness reload on window resize ─────────────
// Single file per year — no breakpoint variants, nothing to do.


// ─────────────────────────────────────────────────────────────
//  CORRELATIONS SECTION
// ─────────────────────────────────────────────────────────────
const COR_PLOTS = {
  'GDP':                        'visualizations/Correlations_GDP.html',
  'Mean Income':                'visualizations/Correlations_Mean Income.html',
  'Median Income':              'visualizations/Correlations_Median Income.html',
  'People at risk of poverty':  'visualizations/Correlations_People at risk of poverty.html',
  'Inability to keep home warm':'visualizations/Correlations_Inability to keep home warm.html',
};

const frameCor   = document.getElementById('frame-cor');
const corTabBar  = document.getElementById('corTabBar');

let currentCorMetric = 'GDP';

// ── Insight text switcher ────────────────────────────────────
const corInsights = document.querySelectorAll('.cor-insight');

function showCorInsight(metric) {
  corInsights.forEach(p => {
    const match = p.dataset.corMetric === metric;
    p.classList.toggle('active', match);
  });
}

function updateCor() {
  const src = COR_PLOTS[currentCorMetric];
  loadSlot(frameCor, 'shimmer-cor', src);   // reuses the existing loadSlot() helper
  showCorInsight(currentCorMetric);          // swap the insight text
}

corTabBar.querySelectorAll('.eu-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    corTabBar.querySelectorAll('.eu-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCorMetric = btn.dataset.metric;
    updateCor();
  });
});

// Init — load iframe + show matching insight text
updateCor();



// Scroll-to-top-right on happiness frame is now handled via
// scrollHappinessToTopRight() passed as a callback into loadSlot().

// ─────────────────────────────────────────────────────────────
//  AGE DASHBOARD — static files, no year dimension
// ─────────────────────────────────────────────────────────────
const AGE_FINANCIAL_PLOTS = {
  'Mean Income':               'visualizations/Mean_income_age_bar_line.html',
  'Median Income':             'visualizations/Median_income_age_bar_line.html',
  'People at risk of poverty': 'visualizations/Risk_of_poverty_age_bar_line.html',
};

const AGE_MENTAL_PLOTS = {
  'Self Perceived Health':   'visualizations/Self_perceived_health_age_bar_line.html',
  'Trust in People':         'visualizations/Trust_in_persons_age_bar_line.html',
  'Self Harm':               'visualizations/Deaths_self_harm_age_bar_line.html',
  'Death by Alcohol Mental': 'visualizations/Deaths_alcohol_mental_disorders_age_bar_line.html',
  'Overall Satisfaction':    'visualizations/Overall_satisfaction_age_bar_line.html',
};

(function initAgeDashboard() {
  const frameFinancial  = document.getElementById('frame-age-financial');
  const frameMental     = document.getElementById('frame-age-mental');
  const financialTabBar = document.getElementById('ageFinancialBar');
  const mentalTabBar    = document.getElementById('ageMentalBar');

  if (!frameFinancial || !frameMental || !financialTabBar || !mentalTabBar) return;

  let ageCurrentFinancial = 'Mean Income';
  let ageCurrentMental    = 'Self Perceived Health';

  function updateAgeFinancial() {
    const src = AGE_FINANCIAL_PLOTS[ageCurrentFinancial];
    if (src) loadSlot(frameFinancial, 'shimmer-age-financial', src);
  }

  function updateAgeMental() {
    const src = AGE_MENTAL_PLOTS[ageCurrentMental];
    if (src) loadSlot(frameMental, 'shimmer-age-mental', src);
  }

  // Tab listeners
  financialTabBar.querySelectorAll('.eu-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      financialTabBar.querySelectorAll('.eu-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      ageCurrentFinancial = btn.dataset.metric;
      updateAgeFinancial();
    });
  });

  mentalTabBar.querySelectorAll('.eu-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      mentalTabBar.querySelectorAll('.eu-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      ageCurrentMental = btn.dataset.metric;
      updateAgeMental();
    });
  });

  // Init — load default tab for each panel on page load
  updateAgeFinancial();
  updateAgeMental();
})();