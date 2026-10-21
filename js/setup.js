// The hidden setup sheet: manage lists, pick force words, and read how to perform.
// Styled like iOS Settings, with its own push/pop page stack inside the sheet.
import { IOS_EASE } from './motion.js';
import { defaultLists, newList, parseItems } from './store.js';
import { t, getLocale, LOCALES, LANGUAGE_NAMES, resolveLocale } from './i18n.js';
import { CONFIG } from './config.js';
import { isFreeList } from './access.js';

const PAGE_MS = 450;

// Horizontal page offset in %, mirrored for right-to-left languages.
const x = (percent) => `translate3d(${(document.documentElement.dir === 'rtl' ? -1 : 1) * percent}%,0,0)`;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function chevron() {
  const span = el('span', 'row-chevron');
  span.innerHTML = '<svg viewBox="0 0 8 14"><path d="m1 1 6 6-6 6" /></svg>';
  return span;
}

function checkmark() {
  const span = el('span', 'row-check');
  span.innerHTML = '<svg viewBox="0 0 16 13"><path d="m1.5 7 4.5 4.5L14.5 1.5" /></svg>';
  return span;
}

function section({ header, footer, children, className = '' }) {
  const wrap = el('div', 'set-section');
  if (header) wrap.append(el('div', 'set-header', header));
  const group = el('div', `set-group ${className}`.trim());
  group.append(...children);
  wrap.append(group);
  if (footer) wrap.append(typeof footer === 'string' ? el('div', 'set-footer', footer) : footer);
  return wrap;
}

function row({ label, sublabel, value, onClick, chevron: withChevron, check, tone }) {
  const node = el(onClick ? 'button' : 'div', `set-row${tone ? ` ${tone}` : ''}`);
  if (onClick) {
    node.type = 'button';
    node.addEventListener('click', onClick);
  }
  const text = el('span', 'row-text');
  text.append(el('span', 'row-label', label));
  if (sublabel) text.append(el('span', 'row-sub', sublabel));
  node.append(text);
  if (value != null) node.append(el('span', 'row-value', value));
  if (check) node.append(checkmark());
  if (withChevron) node.append(chevron());
  return node;
}

function navButton({ label, onClick, back, bold }) {
  const button = el('button', `sheet-nav-btn${bold ? ' bold' : ''}`);
  button.type = 'button';
  if (back) button.innerHTML = '<svg viewBox="0 0 12 20" class="chevron"><path d="M10 2 2 10l8 8" /></svg>';
  button.append(label);
  button.addEventListener('click', onClick);
  return button;
}

export function createSetup({ root, purchases, getSettings, setSettings, close }) {
  let stack = []; // [{ node, refresh }]
  let animating = false;

  const isStandalone = () => window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;

  function update(mutate) {
    const next = structuredClone(getSettings());
    mutate(next);
    setSettings(next);
    return next;
  }

  const findList = (id) => getSettings().lists.find((l) => l.id === id);

  // ----- Page shell -----

  function makePage(build) {
    const node = el('div', 'setup-page');
    const page = {
      node,
      refresh() {
        const scroll = node.querySelector('.setup-scroll');
        const top = scroll?.scrollTop ?? 0;
        const { title, left, right, body } = build();
        const nav = el('header', 'sheet-nav');
        nav.append(left ? navButton(left) : el('span'), el('strong', 'sheet-title', title), right ? navButton(right) : el('span'));
        const content = el('div', 'scroll setup-scroll');
        content.append(...body);
        node.replaceChildren(nav, content);
        content.scrollTop = top;
      },
    };
    page.refresh();
    return page;
  }

  async function push(build) {
    if (animating) return;
    animating = true;
    const page = makePage(build);
    const below = stack.at(-1);
    stack.push(page);
    root.append(page.node);
    const options = { duration: PAGE_MS, easing: IOS_EASE };
    const anims = [page.node.animate([{ transform: x(100) }, { transform: x(0) }], options)];
    if (below) anims.push(below.node.animate([{ transform: x(0) }, { transform: x(-30) }], options));
    await Promise.all(anims.map((a) => a.finished)).catch(() => {});
    below?.node.classList.add('covered');
    animating = false;
  }

  async function pop() {
    if (animating || stack.length < 2) return;
    animating = true;
    document.activeElement?.blur();
    const page = stack.pop();
    const below = stack.at(-1);
    below.refresh();
    below.node.classList.remove('covered');
    const options = { duration: PAGE_MS - 60, easing: IOS_EASE };
    await Promise.all([
      page.node.animate([{ transform: x(0) }, { transform: x(100) }], options).finished,
      below.node.animate([{ transform: x(-30) }, { transform: x(0) }], options).finished,
    ]).catch(() => {});
    page.node.remove();
    animating = false;
  }

  function reset(build) {
    stack = [makePage(build)];
    root.replaceChildren(stack[0].node);
  }

  const done = () => ({ label: t('done'), bold: true, onClick: () => close() });
  const back = (label) => ({ label, back: true, onClick: pop });

  // ----- Pages -----

  function mainPage() {
    const { lists } = getSettings();
    const allAccess = purchases.hasAllAccess();
    const toPaywall = () => push(() => paywallPage(true));
    const listRows = lists.map((list) => row({
      label: list.title,
      sublabel: allAccess
        ? [
          t('itemCount', list.items.length),
          list.force ? t('forceIs', list.force) : t('noForce'),
          list.visible ? null : t('hidden'),
        ].filter(Boolean).join(' · ')
        : (isFreeList(list) ? `${t('free')} · ${t('forceIs', list.force)}` : t('allAccess')),
      chevron: true,
      onClick: allAccess ? () => push(() => listPage(list.id)) : toPaywall,
    }));
    const add = row({
      label: t('addList'),
      tone: 'accent',
      onClick: allAccess
        ? () => {
          const list = newList(getSettings(), t('newList'));
          update((s) => s.lists.push(list));
          push(() => listPage(list.id));
        }
        : toPaywall,
    });

    return {
      title: t('setup'),
      right: done(),
      body: [
        el('p', 'set-intro', t('setupIntro')),
        ...(allAccess ? [] : [section({
          children: [row({ label: t('unlockEverything'), sublabel: t('allAccessHero'), tone: 'accent', chevron: true, onClick: toPaywall })],
          footer: t('freeFooter', lists.find(isFreeList)?.title ?? ''),
        })]),
        section({ header: t('lists'), children: [...listRows, add], footer: t('listsFooter') }),
        ...(purchases.isNative && allAccess ? [section({
          header: t('subscription'),
          children: [
            row({
              label: t('manageSubscription'),
              chevron: true,
              onClick: async () => {
                const url = await purchases.managementUrl();
                if (url) window.open(url, '_blank');
              },
            }),
            row({ label: t('restorePurchases'), onClick: () => restore() }),
          ],
        })] : []),
        section({
          header: t('help'),
          children: [
            row({ label: t('language'), value: languageLabel(getSettings().language), chevron: true, onClick: () => push(languagePage) }),
            row({ label: t('howToPerform'), chevron: true, onClick: () => push(() => howToPage()) }),
            row({ label: t(purchases.isNative ? 'welcomeGuide' : 'installWelcome'), chevron: true, onClick: () => push(() => welcomePage(true)) }),
          ],
        }),
        section({
          children: [row({
            label: t('restoreDefaults'),
            tone: 'danger',
            onClick: () => {
              if (!confirm(t('restoreDefaultsConfirm'))) return;
              update((s) => { s.lists = defaultLists(getLocale()); });
              stack.at(-1).refresh();
            },
          })],
        }),
      ],
    };
  }

  function listPage(id) {
    const list = findList(id);
    if (!list) return { title: '', left: back(t('setup')), body: [] };

    const title = el('input', 'set-input');
    Object.assign(title, { type: 'text', value: list.title, placeholder: t('noteTitle'), autocomplete: 'off' });
    title.setAttribute('autocapitalize', 'sentences');
    title.addEventListener('input', () => {
      update((s) => { s.lists.find((l) => l.id === id).title = title.value.trim() || t('untitled'); });
    });

    const toggle = el('label', 'set-row');
    const toggleText = el('span', 'row-text');
    toggleText.append(el('span', 'row-label', t('showInNotes')));
    const sw = el('input', 'switch');
    Object.assign(sw, { type: 'checkbox', checked: list.visible });
    sw.addEventListener('change', () => update((s) => { s.lists.find((l) => l.id === id).visible = sw.checked; }));
    toggle.append(toggleText, sw);

    const forceFooter = el('div', 'set-footer');
    const itemsHeader = el('div', 'set-header');
    const describe = (items, force) => {
      itemsHeader.textContent = t('itemsHeader', items.length);
      if (!force) forceFooter.textContent = t('forcePick');
      else if (items.some((w) => w.toLowerCase() === force.toLowerCase())) forceFooter.textContent = t('forceSwaps', items.length);
      else forceFooter.textContent = t('forceReplaces');
    };

    const items = el('textarea', 'set-textarea');
    Object.assign(items, { rows: 12, value: list.items.join('\n'), placeholder: t('itemsPlaceholder') });
    items.setAttribute('autocapitalize', 'words');
    items.addEventListener('input', () => {
      const parsed = parseItems(items.value);
      const next = update((s) => { s.lists.find((l) => l.id === id).items = parsed; });
      describe(parsed, next.lists.find((l) => l.id === id).force);
    });
    describe(list.items, list.force);

    const itemsSection = el('div', 'set-section');
    const itemsGroup = el('div', 'set-group');
    itemsGroup.append(items);
    itemsSection.append(itemsHeader, itemsGroup, el('div', 'set-footer', t('itemsFooter')));

    return {
      title: t('list'),
      left: back(t('setup')),
      body: [
        section({ header: t('noteTitle'), children: [title] }),
        section({ children: [toggle] }),
        section({
          header: t('forceWord'),
          children: [row({ label: list.force || t('notSet'), tone: list.force ? '' : 'muted', chevron: true, onClick: () => push(() => forcePage(id)) })],
          footer: forceFooter,
        }),
        itemsSection,
        section({
          children: [row({
            label: t('deleteList'),
            tone: 'danger',
            onClick: () => {
              if (!confirm(t('deleteListConfirm', list.title))) return;
              update((s) => { s.lists = s.lists.filter((l) => l.id !== id); });
              pop();
            },
          })],
        }),
      ],
    };
  }

  function forcePage(id) {
    const list = findList(id);
    const setForce = (word) => {
      update((s) => { s.lists.find((l) => l.id === id).force = word.trim(); });
      pop();
    };
    const current = (list?.force ?? '').toLowerCase();
    const inList = list?.items.some((w) => w.toLowerCase() === current);

    const search = el('input', 'set-search');
    Object.assign(search, { type: 'search', placeholder: t('searchList'), autocomplete: 'off' });

    const custom = el('input', 'set-input');
    Object.assign(custom, { type: 'text', placeholder: t('customPlaceholder'), value: inList ? '' : list?.force ?? '', enterKeyHint: 'done', autocomplete: 'off' });
    custom.addEventListener('keydown', (e) => {
      // isComposing / 229: return that confirms Japanese input, not "done".
      if (e.key === 'Enter' && !e.isComposing && e.keyCode !== 229 && custom.value.trim()) setForce(custom.value);
    });
    custom.addEventListener('change', () => { if (custom.value.trim()) setForce(custom.value); });

    const rows = (list?.items ?? []).map((word, i) => {
      const r = row({ label: word, value: String(i + 1), check: word.toLowerCase() === current, onClick: () => setForce(word) });
      r.dataset.word = word.toLowerCase();
      return r;
    });
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      for (const r of rows) r.hidden = q && !r.dataset.word.includes(q);
    });

    return {
      title: t('forceWordTitle'),
      left: back(t('list')),
      body: [
        search,
        section({ header: t('custom'), children: [custom], footer: t('customFooter') }),
        section({ header: t('fromList'), children: rows.length ? rows : [row({ label: t('emptyList'), tone: 'muted' })] }),
      ],
    };
  }

  const languageLabel = (pref) => (LOCALES.includes(pref) ? LANGUAGE_NAMES[pref] : t('automatic'));

  function languagePage() {
    const current = getSettings().language;
    const choose = (pref) => {
      if (pref === current) return pop();
      const before = getLocale();
      update((s) => { s.language = pref; });
      // Offer the new language's built-in lists, asked in the new language.
      const after = resolveLocale(pref, navigator.languages ?? []);
      if (after !== before && confirm(t('replaceListsConfirm', LANGUAGE_NAMES[after]))) {
        update((s) => { s.lists = defaultLists(after); });
      }
      pop();
    };
    const options = ['auto', ...LOCALES].map((pref) => row({
      label: pref === 'auto' ? t('automatic') : LANGUAGE_NAMES[pref],
      check: pref === current,
      onClick: () => choose(pref),
    }));
    return {
      title: t('language'),
      left: back(t('setup')),
      body: [section({ children: options, footer: t('languageFooter') })],
    };
  }

  function steps(items) {
    const ol = el('ol', 'set-steps');
    for (const [title, text] of items) {
      const li = el('li');
      li.append(el('strong', null, title), el('span', null, text));
      ol.append(li);
    }
    return ol;
  }

  function howToPage(backLabel = t('setup')) {
    return {
      title: t('howToPerform'),
      left: back(backLabel),
      body: [
        section({
          header: t('routine'),
          children: [steps(t('routineSteps'))],
        }),
        section({
          header: t('goodToKnow'),
          children: [steps(t('goodToKnowSteps'))],
        }),
      ],
    };
  }

  function welcomePage(pushed = false) {
    const installed = isStandalone();
    return {
      title: t('welcome'),
      left: pushed ? back(t('setup')) : null,
      right: done(),
      body: [
        el('h2', 'set-hero', t('welcomeHero')),
        el('p', 'set-intro', t('welcomeIntro')),
        // The store apps need no install steps; they get a getting-started guide instead.
        ...(purchases.isNative ? [section({ header: t('gettingStarted'), children: [steps(t('gettingStartedSteps'))] })] : [section({
          header: installed ? t('installed') : t('installHeader'),
          children: [installed
            ? el('p', 'set-text', t('installedText'))
            : steps(t('installSteps'))],
        })]),
        section({
          header: t('secretMenu'),
          children: [el('p', 'set-text', t('secretMenuText'))],
        }),
        section({
          children: [
            row({ label: t('howToPerform'), chevron: true, onClick: () => push(() => howToPage(t('welcome'))) }),
            ...(pushed ? [] : [row({ label: t('setUpLists'), chevron: true, onClick: () => push(mainPage) })]),
          ],
        }),
      ],
    };
  }

  async function restore() {
    try {
      const unlocked = await purchases.restore();
      alert(unlocked ? t('restored') : t('nothingToRestore'));
      if (unlocked) reset(mainPage);
    } catch {
      alert(t('restoreFailed'));
    }
  }

  function paywallPage(pushed = false) {
    const store = t(purchases.platform === 'android' ? 'googlePlayAccount' : 'appleAccount');
    const buy = el('button', 'paywall-buy', t('loading'));
    buy.type = 'button';
    buy.disabled = true;
    const trial = el('p', 'paywall-trial');

    let pkg = null;
    purchases.getPackage().then((found) => {
      pkg = found;
      if (!pkg) {
        buy.textContent = purchases.canPurchase() ? t('unavailableNow') : t('subscriptionsUnavailable');
        return;
      }
      const product = pkg.product;
      buy.textContent = t('subscribeFor', product.priceString);
      buy.disabled = false;
      if (product.introPrice) {
        const intro = product.introPrice;
        const length = t('period', intro.periodNumberOfUnits, intro.periodUnit);
        trial.textContent = intro.price === 0 ? t('freeTrial', length, product.priceString) : t('introOffer', intro.priceString, length, product.priceString);
      }
    });
    buy.addEventListener('click', async () => {
      if (!pkg) return;
      buy.disabled = true;
      try {
        if (await purchases.purchase(pkg)) reset(mainPage);
      } catch {
        alert(t('purchaseFailed'));
      } finally {
        buy.disabled = false;
      }
    });

    const features = el('ul', 'paywall-features');
    for (const text of t('features')) features.append(el('li', null, text));

    const legal = el('p', 'set-footer paywall-legal',
      t('legal', store));
    const links = el('p', 'set-footer paywall-links');
    const link = (label, url) => { const a = el('a', null, label); a.href = url; a.target = '_blank'; return a; };
    if (CONFIG.termsUrl) links.append(link(t('terms'), CONFIG.termsUrl));
    if (CONFIG.privacyUrl) links.append(link(t('privacy'), CONFIG.privacyUrl));

    return {
      title: t('allAccess'),
      left: pushed ? back(t('setup')) : null,
      right: pushed ? null : { label: t('close'), onClick: () => close() },
      body: [
        el('h2', 'set-hero', t('allAccessHero')),
        el('p', 'set-intro', t('allAccessIntro')),
        section({ children: [features] }),
        buy,
        trial,
        section({ children: [row({ label: t('restorePurchases'), tone: 'accent', onClick: () => restore() })] }),
        legal,
        links,
      ],
    };
  }

  return {
    show(name) {
      reset(name === 'welcome' ? () => welcomePage(false) : mainPage);
    },
  };
}
