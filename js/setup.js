// The hidden setup sheet: manage lists, pick force words, and read how to perform.
// Styled like iOS Settings, with its own push/pop page stack inside the sheet.
import { IOS_EASE } from './motion.js';
import { defaultLists, newList, parseItems } from './store.js';
import { t, getLocale, LOCALES, LANGUAGE_NAMES, resolveLocale } from './i18n.js';
import { CONFIG } from './config.js';
import * as appIcon from './appicon.js';

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

  // Opens a page outside the app. In the native apps the web view hands any navigation to another
  // site over to the system (Safari, or the App Store's subscriptions page); a window.open after an
  // await would be blocked there as a popup.
  function openExternal(url) {
    if (purchases.isNative) window.location.href = url;
    else window.open(url, '_blank');
  }

  function update(mutate) {
    const next = structuredClone(getSettings());
    mutate(next);
    setSettings(next);
    return next;
  }

  const findList = (id) => getSettings().lists.find((l) => l.id === id);

  // The home-screen icon in use; read once from the phone, then kept in step with each change.
  let iconName = 'Foldwise';
  if (appIcon.supported) appIcon.current().then((name) => { iconName = name; stack.at(-1)?.refresh(); });

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
    const listRows = lists.map((list) => row({
      label: list.title,
      sublabel: [
        t('itemCount', list.items.length),
        list.force ? t('forceIs', list.force) : t('noForce'),
        list.visible ? null : t('hidden'),
      ].filter(Boolean).join(' · '),
      chevron: true,
      onClick: () => push(() => listPage(list.id)),
    }));
    const add = row({
      label: t('addList'),
      tone: 'accent',
      onClick: () => {
        const list = newList(getSettings(), t('newList'));
        update((s) => s.lists.push(list));
        push(() => listPage(list.id));
      },
    });

    return {
      title: t('setup'),
      right: done(),
      body: [
        el('p', 'set-intro', t('setupIntro')),
        section({ header: t('lists'), children: [...listRows, add], footer: t('listsFooter') }),
        ...(purchases.isNative && allAccess ? [section({
          header: t('subscription'),
          children: [
            row({
              label: t('manageSubscription'),
              chevron: true,
              onClick: async () => {
                if (await purchases.presentCustomerCenter()) return;
                const url = await purchases.managementUrl();
                if (url) openExternal(url);
              },
            }),
            row({ label: t('restorePurchases'), onClick: () => restore() }),
          ],
        })] : []),
        section({
          header: t('help'),
          children: [
            row({ label: t('language'), value: languageLabel(getSettings().language), chevron: true, onClick: () => push(languagePage) }),
            ...(appIcon.supported ? [row({ label: t('appIcon'), value: t(`icon${iconName}`), chevron: true, onClick: () => push(appIconPage) })] : []),
            ...CONFIG.tricks.map((trick) => row({ label: t(`${trick.id}Trick`), sublabel: t('trickTutorial'), chevron: true, onClick: () => push(() => trickPage(trick, t('setup'))) })),
            row({ label: t('howToPerform'), chevron: true, onClick: () => push(() => howToPage()) }),
            row({ label: t('welcome'), chevron: true, onClick: () => push(() => welcomePage(true)) }),
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

  function languagePage(backLabel = t('setup')) {
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
      left: back(backLabel),
      body: [section({ children: options, footer: t('languageFooter') })],
    };
  }

  // Our own notepad designs only (nothing resembling Apple's Notes icon), chosen by the user, with
  // Foldwise always available to go back: App Store guideline 4.6.
  function appIconPage() {
    const choose = async (icon) => {
      if (icon === iconName) return;
      try {
        await appIcon.set(icon);
        iconName = icon;
      } catch {
        alert(t('appIconFailed'));
      }
      stack.at(-1)?.refresh();
    };
    const options = appIcon.ICONS.map((icon) => {
      const node = row({ label: t(`icon${icon}`), check: icon === iconName, onClick: () => choose(icon) });
      const thumb = el('img', 'icon-thumb');
      thumb.src = `icons/app-icons/${icon}.png`;
      thumb.alt = '';
      node.prepend(thumb);
      return node;
    });
    return {
      title: t('appIcon'),
      left: back(t('setup')),
      body: [section({ children: options, footer: t('appIconFooter') })],
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

  // The welcome: what Foldwise teaches and, above all, how to open Setup, shown as a looping
  // long-press on the "Notes" title. Shown once on first use (its button closes the sheet onto the
  // disguise and points at the title); Setup → Help opens it again.
  function welcomePage(pushed = false) {
    const start = el('button', 'paywall-buy', t('welcomeStart'));
    start.type = 'button';
    start.addEventListener('click', () => close({ hint: true }));
    const demo = el('div', 'press-demo');
    demo.setAttribute('aria-hidden', 'true');
    demo.append(el('span', 'press-demo-title', t('notes')), el('span', 'press-demo-touch'));
    return {
      title: t('welcome'),
      left: pushed ? back(t('setup')) : null,
      right: pushed ? done() : null,
      body: [
        el('h2', 'set-hero', t('welcomeHero')),
        el('p', 'set-intro', t('welcomeTagline')),
        section({ header: t('welcomeKeyHeader'), children: [demo, el('p', 'set-text', t('welcomeKeyText'))] }),
        section({ header: t('welcomeLearnHeader'), children: [steps(t('welcomeLearnSteps'))] }),
        ...(pushed ? [] : [start]),
      ],
    };
  }

  async function restore() {
    try {
      const unlocked = await purchases.restore();
      alert(unlocked ? t('restored') : t('nothingToRestore'));
    } catch {
      alert(t('restoreFailed'));
    }
  }

  // ----- Home (no subscription): tricks, demos, how-to and the plans -----

  const BRAND = 'Foldwise';

  function unlockButton() {
    const button = el('button', 'paywall-buy', t('unlockFoldwise'));
    button.type = 'button';
    button.addEventListener('click', async () => {
      button.disabled = true;
      // A purchase unlocks the app through purchases.onChange, which switches to the welcome.
      const outcome = await purchases.presentPaywall();
      button.disabled = false;
      if (outcome === 'unavailable') alert(t('paywallUnavailable'));
    });
    return button;
  }

  function homePage() {
    const tricks = CONFIG.tricks.map((trick) => row({
      label: t(`${trick.id}Trick`),
      sublabel: t(`${trick.id}TrickTagline`),
      chevron: true,
      onClick: () => push(() => trickPage(trick)),
    }));
    return {
      title: BRAND,
      body: [
        el('h2', 'set-hero', t('homeHero')),
        el('p', 'set-intro', t('homeIntro')),
        unlockButton(),
        section({ header: t('tricks'), children: tricks, footer: t('moreTricksSoon') }),
        section({
          header: t('help'),
          children: [
            row({ label: t('language'), value: languageLabel(getSettings().language), chevron: true, onClick: () => push(() => languagePage(BRAND)) }),
            row({ label: t('restorePurchases'), tone: 'accent', onClick: () => restore() }),
          ],
        }),
      ],
    };
  }

  // A trick's page. Before paying it shows only what the audience experiences (never the method);
  // after paying, the demo video and How to Perform.
  function trickPage(trick, backLabel = BRAND) {
    const name = t(`${trick.id}Trick`);
    if (!purchases.hasAllAccess()) {
      return {
        title: name,
        left: back(backLabel),
        body: [
          el('p', 'set-intro', t(`${trick.id}TrickDescription`)),
          section({ header: t('effectHeader'), children: [steps(t(`${trick.id}EffectSteps`))] }),
          unlockButton(),
        ],
      };
    }
    const body = [];
    if (trick.video) {
      const video = el('video', 'demo-video');
      Object.assign(video, { src: trick.video, poster: trick.poster ?? '', controls: true, playsInline: true, preload: 'metadata' });
      video.setAttribute('playsinline', '');
      body.push(video, el('p', 'set-footer demo-caption', t('demoCaption')));
    }
    body.push(
      el('p', 'set-intro', t(`${trick.id}TrickDescription`)),
      section({ children: [row({ label: t('howToPerform'), chevron: true, onClick: () => push(() => howToPage(name)) })] }),
    );
    return { title: name, left: back(backLabel), body };
  }

  return {
    show(name) {
      if (name === 'welcome') reset(() => welcomePage(false));
      else if (name === 'home') reset(homePage);
      else reset(mainPage);
    },
  };
}
