// The hidden setup sheet: manage lists, pick force words, and read how to perform.
// Styled like iOS Settings, with its own push/pop page stack inside the sheet.
import { IOS_EASE } from './motion.js';
import { defaultSettings, newList, parseItems } from './store.js';

const PAGE_MS = 450;

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

export function createSetup({ root, getSettings, setSettings, close }) {
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
    const anims = [page.node.animate([{ transform: 'translate3d(100%,0,0)' }, { transform: 'translate3d(0,0,0)' }], options)];
    if (below) anims.push(below.node.animate([{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(-30%,0,0)' }], options));
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
      page.node.animate([{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(100%,0,0)' }], options).finished,
      below.node.animate([{ transform: 'translate3d(-30%,0,0)' }, { transform: 'translate3d(0,0,0)' }], options).finished,
    ]).catch(() => {});
    page.node.remove();
    animating = false;
  }

  function reset(build) {
    stack = [makePage(build)];
    root.replaceChildren(stack[0].node);
  }

  const done = { label: 'Done', bold: true, onClick: () => close() };
  const back = (label) => ({ label, back: true, onClick: pop });

  // ----- Pages -----

  function mainPage() {
    const { lists } = getSettings();
    const listRows = lists.map((list) => row({
      label: list.title,
      sublabel: [
        `${list.items.length} items`,
        list.force ? `Force: ${list.force}` : 'No force word',
        list.visible ? null : 'Hidden',
      ].filter(Boolean).join(' · '),
      chevron: true,
      onClick: () => push(() => listPage(list.id)),
    }));
    const add = row({
      label: 'Add List',
      tone: 'accent',
      onClick: () => {
        const list = newList(getSettings());
        update((s) => s.lists.push(list));
        push(() => listPage(list.id));
      },
    });

    return {
      title: 'Setup',
      right: done,
      body: [
        el('p', 'set-intro', 'Spectators never see this screen. Long-press the “Notes” title to open it again.'),
        section({ header: 'Lists', children: [...listRows, add], footer: 'Each list appears as its own note. Tap a list to change its items or force word.' }),
        section({
          header: 'Help',
          children: [
            row({ label: 'How to Perform', chevron: true, onClick: () => push(() => howToPage()) }),
            row({ label: 'Install & Welcome', chevron: true, onClick: () => push(() => welcomePage(true)) }),
          ],
        }),
        section({
          children: [row({
            label: 'Restore Default Lists',
            tone: 'danger',
            onClick: () => {
              if (!confirm('Replace all lists with the built-in ones? Your changes will be lost.')) return;
              update((s) => { s.lists = defaultSettings().lists; });
              stack.at(-1).refresh();
            },
          })],
        }),
      ],
    };
  }

  function listPage(id) {
    const list = findList(id);
    if (!list) return { title: '', left: back('Setup'), body: [] };

    const title = el('input', 'set-input');
    Object.assign(title, { type: 'text', value: list.title, placeholder: 'Note title', autocomplete: 'off' });
    title.setAttribute('autocapitalize', 'sentences');
    title.addEventListener('input', () => {
      update((s) => { s.lists.find((l) => l.id === id).title = title.value.trim() || 'Untitled'; });
    });

    const toggle = el('label', 'set-row');
    const toggleText = el('span', 'row-text');
    toggleText.append(el('span', 'row-label', 'Show in Notes'));
    const sw = el('input', 'switch');
    Object.assign(sw, { type: 'checkbox', checked: list.visible });
    sw.addEventListener('change', () => update((s) => { s.lists.find((l) => l.id === id).visible = sw.checked; }));
    toggle.append(toggleText, sw);

    const forceFooter = el('div', 'set-footer');
    const itemsHeader = el('div', 'set-header');
    const describe = (items, force) => {
      itemsHeader.textContent = `Items · ${items.length}`;
      if (!force) forceFooter.textContent = 'Pick the word you want the spectator to “find”.';
      else if (items.some((w) => w.toLowerCase() === force.toLowerCase())) forceFooter.textContent = `It’s in the list, so it swaps places with whatever is at their number. The list always keeps the same ${items.length} items.`;
      else forceFooter.textContent = 'It’s not in the list, so it replaces the item at their number.';
    };

    const items = el('textarea', 'set-textarea');
    Object.assign(items, { rows: 12, value: list.items.join('\n'), placeholder: 'One item per line' });
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
    itemsSection.append(itemsHeader, itemsGroup, el('div', 'set-footer', 'One per line, in the order they appear in the note. Ask the spectator for a number in that range.'));

    return {
      title: 'List',
      left: back('Setup'),
      body: [
        section({ header: 'Note title', children: [title] }),
        section({ children: [toggle] }),
        section({
          header: 'Force word',
          children: [row({ label: list.force || 'Not set', tone: list.force ? '' : 'muted', chevron: true, onClick: () => push(() => forcePage(id)) })],
          footer: forceFooter,
        }),
        itemsSection,
        section({
          children: [row({
            label: 'Delete List',
            tone: 'danger',
            onClick: () => {
              if (!confirm(`Delete “${list.title}”?`)) return;
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
    Object.assign(search, { type: 'search', placeholder: 'Search this list', autocomplete: 'off' });

    const custom = el('input', 'set-input');
    Object.assign(custom, { type: 'text', placeholder: 'Type any word…', value: inList ? '' : list?.force ?? '', enterKeyHint: 'done', autocomplete: 'off' });
    custom.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && custom.value.trim()) setForce(custom.value);
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
      title: 'Force Word',
      left: back('List'),
      body: [
        search,
        section({ header: 'Custom', children: [custom], footer: 'A word that isn’t in the list replaces the item at their number.' }),
        section({ header: 'From this list', children: rows.length ? rows : [row({ label: 'This list is empty', tone: 'muted' })] }),
      ],
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

  function howToPage(backLabel = 'Setup') {
    return {
      title: 'How to Perform',
      left: back(backLabel),
      body: [
        section({
          header: 'The routine',
          children: [steps([
            ['Make a prediction.', 'Write the force word of the list you’ll use on a piece of paper and give it to someone to hold.'],
            ['Show the list.', 'Open the note and let the spectator scroll through it. All the items are different.'],
            ['Get a number.', 'Ask for any number from 1 to the length of the list. Let them change their mind.'],
            ['Enter it secretly.', 'While they look at the prediction, tap anywhere on the note. The number pad opens but nothing you type appears. Type their number, then tap the note again.'],
            ['Reveal.', 'Turn the screen to them, scroll to their number and let them read the item out loud. Then open the prediction.'],
          ])],
        }),
        section({
          header: 'Good to know',
          children: [steps([
            ['Force a different word on the spot.', 'Long-press the note instead of tapping. The letter keyboard opens: type the number and the word, like “17 Banana”, then press return.'],
            ['Nothing is missing.', 'If the force word is already in the list, it swaps places with the item at their number, so the list still holds exactly the same items.'],
            ['Reset is automatic.', 'Going back to the notes list (button or swipe from the left edge) restores the original order.'],
            ['Timing.', 'Do the secret entry while attention is elsewhere, and slow down afterwards. Practice until you can do it without looking.'],
          ])],
        }),
      ],
    };
  }

  function welcomePage(pushed = false) {
    const installed = isStandalone();
    return {
      title: 'Welcome',
      left: pushed ? back('Setup') : null,
      right: done,
      body: [
        el('h2', 'set-hero', 'A magic trick hidden in Notes'),
        el('p', 'set-intro', 'This app looks exactly like the iPhone Notes app. Spectators see ordinary lists, and pick any number. Secretly, the item at their number becomes the word you predicted.'),
        section({
          header: installed ? 'Installed' : 'Install on your iPhone',
          children: [installed
            ? el('p', 'set-text', 'You’re running from the Home Screen, so it opens full screen and works offline.')
            : steps([
              ['Open this page in Safari.', 'Other browsers can’t add it to the Home Screen.'],
              ['Tap Share, then “Add to Home Screen”.', 'It’s already named “Notes” with a Notes icon.'],
              ['Open it once while online.', 'After that it works with no signal.'],
            ])],
        }),
        section({
          header: 'The secret menu',
          children: [el('p', 'set-text', 'Long-press the big “Notes” title to open Setup. There you choose each list’s force word, edit lists, or add your own.')],
        }),
        section({
          children: [
            row({ label: 'How to Perform', chevron: true, onClick: () => push(() => howToPage('Welcome')) }),
            ...(pushed ? [] : [row({ label: 'Set Up Lists', chevron: true, onClick: () => push(mainPage) })]),
          ],
        }),
      ],
    };
  }

  return {
    show(name) {
      reset(name === 'welcome' ? () => welcomePage(false) : mainPage);
    },
  };
}
