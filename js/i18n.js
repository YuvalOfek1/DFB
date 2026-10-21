// Interface text in every supported language. The Notes disguise uses the wording iOS itself shows in
// that language, so a spectator sees exactly what their own phone would show.
//
// Lookup order: exact locale (es-ES, es-419) → base language (es) → English.
// A value is a string, or a function taking parameters (counts, names, prices).

export const LOCALES = ['en', 'es-ES', 'es-419', 'ja'];

export const LANGUAGE_NAMES = {
  en: 'English',
  'es-ES': 'Español (España)',
  'es-419': 'Español (Latinoamérica)',
  ja: '日本語',
};

// `preference` is the user's choice ('auto' or a locale); `languages` is navigator.languages.
export function resolveLocale(preference, languages = []) {
  if (LOCALES.includes(preference)) return preference;
  for (const raw of languages) {
    const lang = String(raw).toLowerCase();
    if (lang.startsWith('ja')) return 'ja';
    if (lang === 'es-es') return 'es-ES';
    if (lang.startsWith('es')) return 'es-419';
    if (lang.startsWith('en')) return 'en';
  }
  return 'en';
}

const EN = {
  // Notes disguise
  folders: 'Folders',
  notes: 'Notes',
  search: 'Search',
  today: 'Today',
  yesterday: 'Yesterday',
  previous7: 'Previous 7 Days',
  previous30: 'Previous 30 Days',
  noText: 'No additional text',
  noteCount: (n) => `${n} Notes`,
  noteDate: (date, time) => `${date} at ${time}`,

  // Common
  done: 'Done',
  close: 'Close',
  setup: 'Setup',

  // Setup
  setupIntro: 'Spectators never see this screen. Long-press the “Notes” title to open it again.',
  unlockEverything: 'Unlock Everything',
  freeFooter: (title) => `Free: the ${title} list with its force word. All Access unlocks every list, your own lists and force words, and every new trick.`,
  lists: 'Lists',
  listsFooter: 'Each list appears as its own note. Tap a list to change its items or force word.',
  itemCount: (n) => `${n} items`,
  forceIs: (word) => `Force: ${word}`,
  noForce: 'No force word',
  hidden: 'Hidden',
  free: 'Free',
  addList: 'Add List',
  newList: 'New list',
  subscription: 'Subscription',
  manageSubscription: 'Manage Subscription',
  restorePurchases: 'Restore Purchases',
  help: 'Help',
  howToPerform: 'How to Perform',
  installWelcome: 'Install & Welcome',
  language: 'Language',
  restoreDefaults: 'Restore Default Lists',
  restoreDefaultsConfirm: 'Replace all lists with the built-in ones? Your changes will be lost.',

  // Language
  automatic: 'Automatic',
  languageFooter: 'Automatic follows your phone’s language, so the disguise matches the real Notes app.',
  replaceListsConfirm: (lang) => `Also replace your lists with the built-in ${lang} lists? Your changes to the current lists will be lost.`,

  // List
  list: 'List',
  noteTitle: 'Note title',
  untitled: 'Untitled',
  showInNotes: 'Show in Notes',
  forceWord: 'Force word',
  notSet: 'Not set',
  forcePick: 'Pick the word you want the spectator to “find”.',
  forceSwaps: (n) => `It’s in the list, so it swaps places with whatever is at their number. The list always keeps the same ${n} items.`,
  forceReplaces: 'It’s not in the list, so it replaces the item at their number.',
  itemsHeader: (n) => `Items · ${n}`,
  itemsPlaceholder: 'One item per line',
  itemsFooter: 'One per line, in the order they appear in the note. Ask the spectator for a number in that range.',
  deleteList: 'Delete List',
  deleteListConfirm: (title) => `Delete “${title}”?`,

  // Force word picker
  forceWordTitle: 'Force Word',
  searchList: 'Search this list',
  custom: 'Custom',
  customPlaceholder: 'Type any word…',
  customFooter: 'A word that isn’t in the list replaces the item at their number.',
  fromList: 'From this list',
  emptyList: 'This list is empty',

  // How to perform
  routine: 'The routine',
  routineSteps: [
    ['Make a prediction.', 'Write the force word of the list you’ll use on a piece of paper and give it to someone to hold.'],
    ['Show the list.', 'Open the note and let the spectator scroll through it. All the items are different.'],
    ['Get a number.', 'Ask for any number from 1 to the length of the list. Let them change their mind.'],
    ['Enter it secretly.', 'While they look at the prediction, tap anywhere on the note. The number pad opens but nothing you type appears. Type their number, then tap the note again.'],
    ['Reveal.', 'Turn the screen to them, scroll to their number and let them read the item out loud. Then open the prediction.'],
  ],
  goodToKnow: 'Good to know',
  goodToKnowSteps: [
    ['Force a different word on the spot.', 'Long-press the note instead of tapping. The letter keyboard opens: type the number and the word, like “17 Banana”, then press return.'],
    ['Nothing is missing.', 'If the force word is already in the list, it swaps places with the item at their number, so the list still holds exactly the same items.'],
    ['Reset is automatic.', 'Going back to the notes list (button or swipe from the left edge) restores the original order.'],
    ['Timing.', 'Do the secret entry while attention is elsewhere, and slow down afterwards. Practice until you can do it without looking.'],
  ],

  // Welcome
  welcome: 'Welcome',
  welcomeHero: 'Welcome to Foldwise',
  welcomeIntro: 'Magic tricks hidden in ordinary-looking apps. Your first trick looks exactly like the Notes app: spectators see ordinary lists and pick any number, and secretly the item at their number becomes the word you predicted.',
  installed: 'Installed',
  installedText: 'You’re running from the Home Screen, so it opens full screen and works offline.',
  installHeader: 'Install on your iPhone',
  installSteps: [
    ['Open this page in Safari.', 'Other browsers can’t add it to the Home Screen.'],
    ['Tap Share, then “Add to Home Screen”.', 'It’s already named “Notes” with a Notes icon.'],
    ['Open it once while online.', 'After that it works with no signal.'],
  ],
  secretMenu: 'The secret menu',
  secretMenuText: 'Long-press the big “Notes” title to open Setup. There you choose each list’s force word, edit lists, or add your own.',
  setUpLists: 'Set Up Lists',

  // Subscription
  allAccess: 'All Access',
  allAccessHero: 'Foldwise All Access',
  allAccessIntro: 'One subscription, every trick and list included.',
  features: [
    'Every built-in list: celebrities, movies, countries and more',
    'Choose the force word for each list, or type one on the spot',
    'Create your own lists',
    'Every new trick as it’s released',
  ],
  loading: 'Loading…',
  unavailableNow: 'Unavailable right now',
  subscriptionsUnavailable: 'Subscriptions unavailable',
  subscribeFor: (price) => `Subscribe for ${price} / month`,
  period: (n, unit) => `${n} ${{ DAY: 'day', WEEK: 'week', MONTH: 'month', YEAR: 'year' }[unit] ?? unit.toLowerCase()}${n > 1 ? 's' : ''}`,
  freeTrial: (length, price) => `Free for ${length}, then ${price} / month.`,
  introOffer: (introPrice, length, price) => `${introPrice} for ${length}, then ${price} / month.`,
  legal: (store) => `Payment is charged to your ${store} account. The subscription renews automatically each month unless cancelled at least 24 hours before the end of the current period. Manage or cancel it in your account settings.`,
  appleAccount: 'Apple Account',
  terms: 'Terms of Use',
  privacy: 'Privacy Policy',
  restored: 'Your subscription has been restored.',
  nothingToRestore: 'No active subscription was found for this account.',
  restoreFailed: 'Could not restore purchases. Check your connection and try again.',
  purchaseFailed: 'The purchase could not be completed. Please try again.',
};

const ES = {
  folders: 'Carpetas',
  notes: 'Notas',
  search: 'Buscar',
  today: 'Hoy',
  yesterday: 'Ayer',
  previous7: '7 días anteriores',
  previous30: '30 días anteriores',
  noText: 'No hay texto adicional',
  noteCount: (n) => `${n} notas`,
  noteDate: (date, time) => `${date}, ${time}`,

  done: 'OK',
  close: 'Cerrar',
  setup: 'Configuración',

  setupIntro: 'Los espectadores nunca ven esta pantalla. Mantén pulsado el título “Notas” para volver a abrirla.',
  unlockEverything: 'Desbloquear todo',
  freeFooter: (title) => `Gratis: la lista ${title} con su palabra a forzar. All Access desbloquea todas las listas, tus propias listas y palabras, y cada truco nuevo.`,
  lists: 'Listas',
  listsFooter: 'Cada lista aparece como una nota. Toca una lista para cambiar sus elementos o la palabra a forzar.',
  itemCount: (n) => `${n} elementos`,
  forceIs: (word) => `Forzar: ${word}`,
  noForce: 'Sin palabra a forzar',
  hidden: 'Oculta',
  free: 'Gratis',
  addList: 'Añadir lista',
  newList: 'Lista nueva',
  subscription: 'Suscripción',
  manageSubscription: 'Gestionar suscripción',
  restorePurchases: 'Restaurar compras',
  help: 'Ayuda',
  howToPerform: 'Cómo hacer el truco',
  installWelcome: 'Instalación y bienvenida',
  language: 'Idioma',
  restoreDefaults: 'Restaurar listas predeterminadas',
  restoreDefaultsConfirm: '¿Reemplazar todas las listas por las predeterminadas? Se perderán tus cambios.',

  automatic: 'Automático',
  languageFooter: 'Automático usa el idioma de tu teléfono, para que el disfraz coincida con la app Notas real.',
  replaceListsConfirm: (lang) => `¿Reemplazar también tus listas por las predeterminadas en ${lang}? Se perderán los cambios de las listas actuales.`,

  list: 'Lista',
  noteTitle: 'Título de la nota',
  untitled: 'Sin título',
  showInNotes: 'Mostrar en Notas',
  forceWord: 'Palabra a forzar',
  notSet: 'Sin definir',
  forcePick: 'Elige la palabra que el espectador “encontrará”.',
  forceSwaps: (n) => `Está en la lista, así que intercambia su lugar con lo que haya en su número. La lista siempre conserva los mismos ${n} elementos.`,
  forceReplaces: 'No está en la lista, así que reemplaza el elemento de su número.',
  itemsHeader: (n) => `Elementos · ${n}`,
  itemsPlaceholder: 'Un elemento por línea',
  itemsFooter: 'Uno por línea, en el orden en que aparecen en la nota. Pide al espectador un número dentro de ese rango.',
  deleteList: 'Eliminar lista',
  deleteListConfirm: (title) => `¿Eliminar «${title}»?`,

  forceWordTitle: 'Palabra a forzar',
  searchList: 'Buscar en esta lista',
  custom: 'Personalizada',
  customPlaceholder: 'Escribe cualquier palabra…',
  customFooter: 'Una palabra que no está en la lista reemplaza el elemento de su número.',
  fromList: 'De esta lista',
  emptyList: 'Esta lista está vacía',

  routine: 'La rutina',
  routineSteps: [
    ['Haz una predicción.', 'Escribe en un papel la palabra a forzar de la lista que vas a usar y dáselo a alguien para que lo guarde.'],
    ['Muestra la lista.', 'Abre la nota y deja que el espectador la recorra. Todos los elementos son distintos.'],
    ['Pide un número.', 'Pide cualquier número del 1 al total de la lista. Deja que cambie de opinión.'],
    ['Introdúcelo en secreto.', 'Mientras miran la predicción, toca cualquier parte de la nota. Se abre el teclado numérico, pero no aparece nada de lo que escribes. Escribe su número y vuelve a tocar la nota.'],
    ['Revela.', 'Gira la pantalla hacia ellos, baja hasta su número y deja que lean el elemento en voz alta. Después abre la predicción.'],
  ],
  goodToKnow: 'Conviene saber',
  goodToKnowSteps: [
    ['Forzar otra palabra en el momento.', 'Mantén pulsada la nota en lugar de tocarla. Se abre el teclado de letras: escribe el número y la palabra, por ejemplo “17 Plátano”, y pulsa Intro.'],
    ['No falta nada.', 'Si la palabra a forzar ya está en la lista, intercambia su lugar con el elemento de su número, así que la lista sigue teniendo exactamente los mismos elementos.'],
    ['Se reinicia sola.', 'Al volver a la lista de notas (con el botón o deslizando desde el borde izquierdo) se recupera el orden original.'],
    ['El momento justo.', 'Haz la entrada secreta mientras la atención está en otra parte y tómatelo con calma después. Practica hasta poder hacerlo sin mirar.'],
  ],

  welcome: 'Bienvenida',
  welcomeHero: 'Te damos la bienvenida a Foldwise',
  welcomeIntro: 'Trucos de magia escondidos en apps de apariencia normal. Tu primer truco se ve exactamente como la app Notas: los espectadores ven listas normales y eligen cualquier número, y en secreto el elemento de ese número se convierte en la palabra que predijiste.',
  installed: 'Instalada',
  installedText: 'Se está ejecutando desde la pantalla de inicio, así que se abre a pantalla completa y funciona sin conexión.',
  installHeader: 'Instalar en tu iPhone',
  installSteps: [
    ['Abre esta página en Safari.', 'Otros navegadores no pueden añadirla a la pantalla de inicio.'],
    ['Toca Compartir y luego “Añadir a pantalla de inicio”.', 'Ya se llama “Notas” y tiene un icono de Notas.'],
    ['Ábrela una vez con conexión.', 'Después funciona sin señal.'],
  ],
  secretMenu: 'El menú secreto',
  secretMenuText: 'Mantén pulsado el título grande “Notas” para abrir la configuración. Ahí eliges la palabra a forzar de cada lista, editas las listas o creas las tuyas.',
  setUpLists: 'Configurar listas',

  allAccess: 'All Access',
  allAccessHero: 'Foldwise All Access',
  allAccessIntro: 'Una suscripción con todos los trucos y listas.',
  features: [
    'Todas las listas incluidas: famosos, películas, países y más',
    'Elige la palabra a forzar de cada lista o escríbela en el momento',
    'Crea tus propias listas',
    'Cada truco nuevo en cuanto salga',
  ],
  loading: 'Cargando…',
  unavailableNow: 'No disponible en este momento',
  subscriptionsUnavailable: 'Suscripciones no disponibles',
  subscribeFor: (price) => `Suscribirse por ${price} al mes`,
  period: (n, unit) => {
    const [one, many] = { DAY: ['día', 'días'], WEEK: ['semana', 'semanas'], MONTH: ['mes', 'meses'], YEAR: ['año', 'años'] }[unit] ?? [unit, unit];
    return `${n} ${n > 1 ? many : one}`;
  },
  freeTrial: (length, price) => `Gratis durante ${length}; después, ${price} al mes.`,
  introOffer: (introPrice, length, price) => `${introPrice} durante ${length}; después, ${price} al mes.`,
  legal: (store) => `El pago se carga a tu ${store}. La suscripción se renueva automáticamente cada mes, salvo que la canceles al menos 24 horas antes de que termine el periodo actual. Puedes gestionarla o cancelarla en los ajustes de tu cuenta.`,
  appleAccount: 'cuenta de Apple',
  terms: 'Términos de uso',
  privacy: 'Política de privacidad',
  restored: 'Se restauró tu suscripción.',
  nothingToRestore: 'No se encontró ninguna suscripción activa en esta cuenta.',
  restoreFailed: 'No se pudieron restaurar las compras. Revisa tu conexión e inténtalo de nuevo.',
  purchaseFailed: 'No se pudo completar la compra. Inténtalo de nuevo.',
};

// Spain uses ES as written; Latin America differs in a few everyday words.
const ES_419 = {
  setupIntro: 'Los espectadores nunca ven esta pantalla. Mantén presionado el título “Notas” para volver a abrirla.',
  addList: 'Agregar lista',
  manageSubscription: 'Administrar suscripción',
  deleteListConfirm: (title) => `¿Eliminar “${title}”?`,
  goodToKnowSteps: [
    ['Forzar otra palabra en el momento.', 'Mantén presionada la nota en lugar de tocarla. Se abre el teclado de letras: escribe el número y la palabra, por ejemplo “17 Plátano”, y presiona Intro.'],
    ['No falta nada.', 'Si la palabra a forzar ya está en la lista, intercambia su lugar con el elemento de su número, así que la lista sigue teniendo exactamente los mismos elementos.'],
    ['Se reinicia sola.', 'Al volver a la lista de notas (con el botón o deslizando desde el borde izquierdo) se recupera el orden original.'],
    ['El momento justo.', 'Haz la entrada secreta mientras la atención está en otra parte y tómatelo con calma después. Practica hasta poder hacerlo sin mirar.'],
  ],
  routineSteps: [
    ['Haz una predicción.', 'Escribe en un papel la palabra a forzar de la lista que vas a usar y dáselo a alguien para que lo guarde.'],
    ['Muestra la lista.', 'Abre la nota y deja que el espectador la recorra. Todos los elementos son distintos.'],
    ['Pide un número.', 'Pide cualquier número del 1 al total de la lista. Deja que cambie de opinión.'],
    ['Ingrésalo en secreto.', 'Mientras miran la predicción, toca cualquier parte de la nota. Se abre el teclado numérico, pero no aparece nada de lo que escribes. Escribe su número y vuelve a tocar la nota.'],
    ['Revela.', 'Gira la pantalla hacia ellos, baja hasta su número y deja que lean el elemento en voz alta. Después abre la predicción.'],
  ],
  installSteps: [
    ['Abre esta página en Safari.', 'Otros navegadores no pueden agregarla a la pantalla de inicio.'],
    ['Toca Compartir y luego “Agregar a inicio”.', 'Ya se llama “Notas” y tiene un ícono de Notas.'],
    ['Ábrela una vez con conexión.', 'Después funciona sin señal.'],
  ],
  secretMenuText: 'Mantén presionado el título grande “Notas” para abrir la configuración. Ahí eliges la palabra a forzar de cada lista, editas las listas o creas las tuyas.',
  legal: (store) => `El pago se carga a tu ${store}. La suscripción se renueva automáticamente cada mes, a menos que la canceles al menos 24 horas antes de que termine el periodo actual. Puedes administrarla o cancelarla en la configuración de tu cuenta.`,
};

const JA = {
  folders: 'フォルダ',
  notes: 'メモ',
  search: '検索',
  today: '今日',
  yesterday: '昨日',
  previous7: '過去7日間',
  previous30: '過去30日間',
  noText: '追加テキストなし',
  noteCount: (n) => `${n}件のメモ`,
  noteDate: (date, time) => `${date} ${time}`,

  done: '完了',
  close: '閉じる',
  setup: '設定',

  setupIntro: '観客にはこの画面は見えません。もう一度開くには「メモ」のタイトルを長押しします。',
  unlockEverything: 'すべてをアンロック',
  freeFooter: (title) => `無料:「${title}」リストとそのフォースする言葉。All Accessでは、すべてのリスト、自分で作るリストや言葉、新しいマジックがすべて使えます。`,
  lists: 'リスト',
  listsFooter: 'リストはそれぞれ1つのメモとして表示されます。タップすると項目やフォースする言葉を変更できます。',
  itemCount: (n) => `${n}項目`,
  forceIs: (word) => `フォース: ${word}`,
  noForce: 'フォースする言葉なし',
  hidden: '非表示',
  free: '無料',
  addList: 'リストを追加',
  newList: '新しいリスト',
  subscription: 'サブスクリプション',
  manageSubscription: 'サブスクリプションを管理',
  restorePurchases: '購入を復元',
  help: 'ヘルプ',
  howToPerform: '演じ方',
  installWelcome: 'インストールとはじめに',
  language: '言語',
  restoreDefaults: '標準のリストに戻す',
  restoreDefaultsConfirm: 'すべてのリストを標準のリストに置き換えますか?変更内容は失われます。',

  automatic: '自動',
  languageFooter: '「自動」はiPhoneの言語に合わせるので、本物の「メモ」アプリと同じ表示になります。',
  replaceListsConfirm: (lang) => `リストも${lang}の標準リストに置き換えますか?今のリストの変更内容は失われます。`,

  list: 'リスト',
  noteTitle: 'メモのタイトル',
  untitled: '無題',
  showInNotes: 'メモに表示',
  forceWord: 'フォースする言葉',
  notSet: '未設定',
  forcePick: '観客に「見つけて」もらう言葉を選びます。',
  forceSwaps: (n) => `リストに含まれているので、選ばれた番号の項目と入れ替わります。リストの${n}項目は常に同じです。`,
  forceReplaces: 'リストにないため、選ばれた番号の項目と置き換わります。',
  itemsHeader: (n) => `項目 · ${n}`,
  itemsPlaceholder: '1行に1項目',
  itemsFooter: '1行に1つ、メモに表示される順番で入力します。観客にはこの範囲の番号を言ってもらいます。',
  deleteList: 'リストを削除',
  deleteListConfirm: (title) => `「${title}」を削除しますか?`,

  forceWordTitle: 'フォースする言葉',
  searchList: 'このリストを検索',
  custom: 'カスタム',
  customPlaceholder: '好きな言葉を入力…',
  customFooter: 'リストにない言葉は、選ばれた番号の項目と置き換わります。',
  fromList: 'このリストから',
  emptyList: 'このリストは空です',

  routine: '手順',
  routineSteps: [
    ['予言を書く。', '使うリストのフォースする言葉を紙に書き、誰かに持っていてもらいます。'],
    ['リストを見せる。', 'メモを開き、観客に自由にスクロールしてもらいます。項目はすべて違うものです。'],
    ['番号を選んでもらう。', '1からリストの項目数までの好きな番号を言ってもらいます。気が変わってもかまいません。'],
    ['こっそり入力する。', '観客が予言の紙を見ている間に、メモのどこかをタップします。数字キーボードが開きますが、入力した内容は表示されません。番号を入力したら、もう一度メモをタップします。'],
    ['明かす。', '画面を観客に向け、その番号までスクロールして項目を読み上げてもらいます。最後に予言を開きます。'],
  ],
  goodToKnow: '知っておくと便利',
  goodToKnowSteps: [
    ['その場で別の言葉をフォースする。', 'タップの代わりにメモを長押しします。文字キーボードが開くので、「17 バナナ」のように番号と言葉を入力して改行を押します。'],
    ['何も欠けない。', 'フォースする言葉がリストにある場合は、選ばれた番号の項目と入れ替わるだけなので、リストの中身はまったく同じままです。'],
    ['自動でリセット。', 'メモの一覧に戻る(ボタンまたは左端からスワイプ)と、元の順番に戻ります。'],
    ['タイミング。', '注意がほかに向いている間に入力し、そのあとは落ち着いて進めましょう。見なくてもできるまで練習してください。'],
  ],

  welcome: 'ようこそ',
  welcomeHero: 'Foldwiseへようこそ',
  welcomeIntro: '普通のアプリにしか見えないマジック。最初のマジックは「メモ」アプリそっくりです。観客は普通のリストを見て好きな番号を選びますが、その番号の項目は、あなたが予言した言葉にこっそり入れ替わります。',
  installed: 'インストール済み',
  installedText: 'ホーム画面から起動しているので、全画面で開き、オフラインでも動作します。',
  installHeader: 'iPhoneにインストール',
  installSteps: [
    ['このページをSafariで開く。', 'ほかのブラウザではホーム画面に追加できません。'],
    ['共有をタップし、「ホーム画面に追加」を選ぶ。', 'すでに「メモ」という名前とメモのアイコンになっています。'],
    ['オンラインで一度開く。', 'そのあとは電波がなくても使えます。'],
  ],
  secretMenu: '秘密のメニュー',
  secretMenuText: '大きな「メモ」のタイトルを長押しすると設定が開きます。各リストのフォースする言葉の選択、リストの編集や追加ができます。',
  setUpLists: 'リストを設定',

  allAccess: 'All Access',
  allAccessHero: 'Foldwise All Access',
  allAccessIntro: '1つのサブスクリプションで、すべてのマジックとリストが使えます。',
  features: [
    '標準リストすべて:有名人、映画、国など',
    'リストごとにフォースする言葉を選べる、その場で入力も可能',
    '自分だけのリストを作成',
    '新しいマジックも追加され次第すぐに',
  ],
  loading: '読み込み中…',
  unavailableNow: '現在利用できません',
  subscriptionsUnavailable: 'サブスクリプションは利用できません',
  subscribeFor: (price) => `${price}/月で登録`,
  period: (n, unit) => `${n}${{ DAY: '日間', WEEK: '週間', MONTH: 'か月', YEAR: '年間' }[unit] ?? unit}`,
  freeTrial: (length, price) => `${length}無料、その後${price}/月`,
  introOffer: (introPrice, length, price) => `${length}は${introPrice}、その後${price}/月`,
  legal: (store) => `お支払いは${store}に請求されます。現在の期間が終了する24時間前までに解約しない限り、サブスクリプションは毎月自動更新されます。管理や解約はアカウント設定から行えます。`,
  appleAccount: 'Appleアカウント',
  terms: '利用規約',
  privacy: 'プライバシーポリシー',
  restored: 'サブスクリプションを復元しました。',
  nothingToRestore: 'このアカウントで有効なサブスクリプションが見つかりませんでした。',
  restoreFailed: '購入を復元できませんでした。接続を確認して、もう一度お試しください。',
  purchaseFailed: '購入を完了できませんでした。もう一度お試しください。',
};

export const STRINGS = { en: EN, es: ES, 'es-419': ES_419, ja: JA };

let current = 'en';

export function setLocale(locale) {
  current = LOCALES.includes(locale) ? locale : 'en';
}

export const getLocale = () => current;

export function translate(locale, key, ...args) {
  const base = locale.split('-')[0];
  const value = STRINGS[locale]?.[key] ?? STRINGS[base]?.[key] ?? EN[key];
  if (value === undefined) throw new Error(`Missing string: ${key}`);
  return typeof value === 'function' ? value(...args) : value;
}

export const t = (key, ...args) => translate(current, key, ...args);
