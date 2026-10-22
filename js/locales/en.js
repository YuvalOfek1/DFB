// English: the reference. Every other language must define every key.
export default {
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
  lists: 'Lists',
  listsFooter: 'Each list appears as its own note. Tap a list to change its items or force word.',
  itemCount: (n) => `${n} items`,
  forceIs: (word) => `Force: ${word}`,
  noForce: 'No force word',
  hidden: 'Hidden',
  addList: 'Add List',
  newList: 'New list',
  subscription: 'Subscription',
  manageSubscription: 'Manage Subscription',
  restorePurchases: 'Restore Purchases',
  help: 'Help',
  howToPerform: 'How to Perform',
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
    ['Show the list.', 'Open the note and let the spectator scroll through the whole list. All the items are different.'],
    ['Get a number.', 'Take the phone back first, so they choose without seeing the list. Ask for any number from 1 to the length of the list. Let them change their mind.'],
    ['Enter it secretly.', 'Right after they say their number, point to the folded prediction and remind everyone it was written before they chose. While all eyes are on it, tap anywhere on the note. The number pad opens but nothing you type appears. Type their number, then tap the note again.'],
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
  welcomeTagline: 'Mind-reading magic, hidden inside an app that looks just like Notes.',
  welcomeKeyHeader: 'The one thing to remember',
  welcomeKeyText: 'Touch and hold the big “Notes” title to open Setup. That’s where you choose the word you’ll predict, edit the lists and find the tutorial. Your audience never sees it.',
  welcomeLearnHeader: 'What you’ll learn',
  welcomeLearnSteps: [
    ['The Notes Trick', 'A friend names any number and finds your prediction there.'],
    ['How to perform it', 'A demo video and a step-by-step guide: what to say, when to make the secret move and how to reveal.'],
    ['Your own lists', 'Celebrities, movies, places, or anything you write.'],
    ['New tricks', 'Every new trick as it’s released.'],
  ],
  welcomeStart: 'Try it now',

  // Subscription
  allAccess: 'All Access',
  allAccessHero: 'Foldwise All Access',
  allAccessIntro: 'Choose a plan. Every trick and list included.',
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
  legal: (store) => `Payment is charged to your ${store}. The subscription renews automatically each month unless cancelled at least 24 hours before the end of the current period. Manage or cancel it in your account settings.`,
  appleAccount: 'Apple Account',
  googlePlayAccount: 'Google Play account',
  terms: 'Terms of Use',
  privacy: 'Privacy Policy',
  restored: 'Your subscription has been restored.',
  nothingToRestore: 'No active subscription was found for this account.',
  restoreFailed: 'Could not restore purchases. Check your connection and try again.',
  purchaseFailed: 'The purchase could not be completed. Please try again.',

  // Welcome page

  // Free uses and plans
  planMonthly: 'Monthly',
  planLifetime: 'Lifetime',
  perMonth: (price) => `${price} / month`,
  oneTime: (price) => `${price} one time`,
  lifetimeNote: 'Pay once, keep everything forever, including new tricks.',
  buyLifetime: (price) => `Buy for ${price}`,
  lifetimeLegal: 'Lifetime is a one-time purchase, not a subscription.',

  // Home screen (without a subscription)
  homeHero: 'Magic in your pocket',
  homeIntro: 'Mind-reading tricks hidden in ordinary-looking apps. See what your audience experiences, then unlock Foldwise for the demo video, the method and the trick itself.',
  unlockFoldwise: 'Unlock Foldwise',
  tricks: 'Tricks',
  notesTrick: 'The Notes Trick',
  notesTrickTagline: 'They pick any number. Your prediction is there.',
  notesTrickDescription: 'It looks like an ordinary note: a numbered list of celebrities, movies or places. A spectator scrolls through the whole list, then, without looking at it, names any number. At that number they find the word you predicted. Nothing to set up, no sleight of hand.',
  moreTricksSoon: 'More tricks are on the way. All Access includes every new one.',
  demoCaption: 'How it looks on your phone',
  trickTutorial: 'Demo video and how to perform',
  effectHeader: 'What your audience sees',
  notesEffectSteps: [
    ['A prediction.', 'You hand a friend a folded piece of paper before anything happens.'],
    ['An ordinary note.', 'You show a note on your phone: a numbered list of 100 celebrities, all different. They scroll through the whole list themselves.'],
    ['A free choice.', 'With the list out of sight, they think of any number from 1 to 100 and say it out loud. They can change their mind as often as they want.'],
    ['Their name.', 'You hand them the phone. They scroll to their number and read the name there out loud.'],
    ['The reveal.', 'They open the prediction. It’s the same name.'],
  ],
};
