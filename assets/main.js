/*=====================================================
  DAIKIBO IIoT — MAIN JS
  Responsibilities:
  1. Data conversion logic (mirrors main.py)
  2. Fetch the three JSON files and populate cards
  3. Wire up the interactive demo
  4. Reveal animation (Intersection Observer)
  5. Header scroll state + mobile menu
=====================================================*/

/*=============== CONVERSION LOGIC ===============*/

// Format 1 -> Unified
function convertFromFormat1(obj) {
    const locationParts = obj.location.split('/');

    return {
        deviceID: obj.deviceID,
        deviceType: obj.deviceType,
        timestamp: obj.timestamp, // already in ms
        location: {
            country: locationParts[0],
            city:    locationParts[1],
            area:    locationParts[2],
            factory: locationParts[3],
            section: locationParts[4],
        },
        data: {
            status:      obj.operationStatus,
            temperature: obj.temp,
        },
    };
}

// Format 2 -> Unified
function convertFromFormat2(obj) {
    // ISO 8601 string -> milliseconds since epoch
    const ms = new Date(obj.timestamp).getTime();

    return {
        deviceID: obj.device.id,
        deviceType: obj.device.type,
        timestamp: ms,
        location: {
            country: obj.country,
            city:    obj.city,
            area:    obj.area,
            factory: obj.factory,
            section: obj.section,
        },
        data: obj.data, // already { status, temperature }
    };
}

// Router
function main(obj) {
    if (obj.device === undefined) {
        return convertFromFormat1(obj);
    }
    return convertFromFormat2(obj);
}

/*=============== DOM ELEMENTS ===============*/

const els = {
    json1:       document.getElementById('json-1'),
    json2:       document.getElementById('json-2'),
    jsonResult:  document.getElementById('json-result'),
    demoResult:  document.getElementById('demo-result'),
    demoStatus:  document.getElementById('demo-status'),
    select:      document.getElementById('input-select'),
    convertBtn:  document.getElementById('convert-btn'),
    header:      document.getElementById('header'),
    nav:         document.getElementById('nav'),
    navToggle:   document.getElementById('nav-toggle'),
};

let data1 = null;
let data2 = null;

/*=============== LOAD JSON DATA ===============*/

async function loadData() {
    try {
        const [r1, r2, r3] = await Promise.all([
            fetch('data-1.json'),
            fetch('data-2.json'),
            fetch('data-result.json'),
        ]);

        data1 = await r1.json();
        data2 = await r2.json();
        const result = await r3.json();

        els.json1.textContent      = JSON.stringify(data1, null, 2);
        els.json2.textContent      = JSON.stringify(data2, null, 2);
        els.jsonResult.textContent = JSON.stringify(result, null, 2);
    } catch (err) {
        els.json1.textContent      = '// Error loading data-1.json';
        els.json2.textContent      = '// Error loading data-2.json';
        els.jsonResult.textContent = '// Error loading data-result.json';
        console.error('Failed to load JSON data:', err);
    }
}

/*=============== DEMO ===============*/

function setDemoStatus(text, state) {
    els.demoStatus.textContent = text;
    els.demoStatus.classList.remove('is-done', 'is-error');
    if (state) els.demoStatus.classList.add(state);
}

function runConversion() {
    const choice = els.select.value;
    const input  = choice === '1' ? data1 : data2;

    if (!input) {
        setDemoStatus('waiting for data', 'is-error');
        els.demoResult.textContent = '// Data not loaded yet. Please wait a moment.';
        return;
    }

    try {
        const result = main(input);
        els.demoResult.textContent = JSON.stringify(result, null, 2);
        setDemoStatus('ok', 'is-done');
    } catch (err) {
        els.demoResult.textContent = '// Conversion failed:\n' + err.message;
        setDemoStatus('error', 'is-error');
    }
}

if (els.convertBtn) {
    els.convertBtn.addEventListener('click', runConversion);
}

/*=============== REVEAL ON SCROLL ===============*/

function initReveal() {
    const targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    // Respect user preference for reduced motion
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
        targets.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger siblings slightly
                    const delay = Math.min(i * 80, 320);
                    entry.target.style.setProperty('--reveal-delay', `${delay}ms`);
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
}

/*=============== HEADER SCROLL ===============*/

function initHeaderScroll() {
    if (!els.header) return;
    const onScroll = () => {
        els.header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

/*=============== MOBILE MENU ===============*/

function initMobileMenu() {
    if (!els.navToggle || !els.nav) return;

    const closeMenu = () => {
        els.nav.classList.remove('is-open');
        els.navToggle.classList.remove('is-open');
        els.navToggle.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
        els.nav.classList.add('is-open');
        els.navToggle.classList.add('is-open');
        els.navToggle.setAttribute('aria-expanded', 'true');
    };

    els.navToggle.setAttribute('aria-expanded', 'false');

    els.navToggle.addEventListener('click', () => {
        if (els.nav.classList.contains('is-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close when a link is clicked
    els.nav.querySelectorAll('.nav__link').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!els.nav.classList.contains('is-open')) return;
        if (els.nav.contains(e.target) || els.navToggle.contains(e.target)) return;
        closeMenu();
    });
}

/*=============== INIT ===============*/

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initReveal();
    initHeaderScroll();
    initMobileMenu();
});