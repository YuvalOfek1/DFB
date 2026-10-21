"""Builds js/lists.js from the English lists (kept in js/lists.js's `en` set) and scripts/lists_data.py.

Usage: python3 scripts/build_lists.py   (validates every list: unique items, force word present)
"""
import json
import random
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import lists_data as d  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
AGES = {'celebrities': 47, 'movies': 185, 'travel': 2 * 1440 + 130, 'pictionary': 5 * 1440 + 300}


def mix(items, seed):
    """Deterministic shuffle so local and international items are spread through the list."""
    items = list(items)
    random.Random(seed).shuffle(items)
    return items


def lst(id_, title, force, items):
    return {'id': id_, 'title': title, 'force': force, 'ageMinutes': AGES[id_], 'items': items}


def decoys(rows):
    return [{'title': t, 'daysAgo': days, 'lines': lines} for t, days, lines in rows]


def spanish(region):
    celebs = d.ES_INTL_CELEBS + d.ES_SHARED_CELEBS + (d.ES_ES_CELEBS if region == 'es-ES' else d.ES_419_CELEBS)
    pick = 0 if region == 'es-ES' else 1
    western = [pair[pick] for pair in d.ES_MOVIE_PAIRS]
    local = d.ES_ES_FILMS if region == 'es-ES' else d.ES_419_FILMS
    movies = local + [m for m in western if m not in local]
    movies = movies[:100]
    countries = [('Estados Unidos' if c == 'España' and region == 'es-ES' else c) for c in d.ES_COUNTRIES]
    titles = {
        'es-ES': ('Famosos', 'Noche de pelis', 'Viajes pendientes', 'Ideas para Pictionary'),
        'es-419': ('Famosos', 'Noche de películas', 'Países por conocer', 'Ideas para Pictionary'),
    }[region]
    return {
        'lists': [
            lst('celebrities', titles[0], 'Shakira', mix(celebs, f'{region}-celebs')),
            lst('movies', titles[1], 'Titanic', mix(movies, f'{region}-movies')),
            lst('travel', titles[2], 'Japón', mix(countries, f'{region}-travel')),
            lst('pictionary', titles[3], 'Elefante', d.ES_PICTIONARY[region]),
        ],
        'decoys': decoys(d.ES_DECOYS[region]),
    }


def japanese():
    return {
        'lists': [
            lst('celebrities', '有名人', '大谷翔平', mix(d.JA_CELEBS, 'ja-celebs')),
            lst('movies', '観たい映画', '千と千尋の神隠し', mix(d.JA_MOVIES[:100], 'ja-movies')),
            lst('travel', '行きたい国', 'イタリア', mix(d.JA_COUNTRIES, 'ja-travel')),
            lst('pictionary', 'お絵描きゲームのお題', 'ゾウ', d.JA_PICTIONARY),
        ],
        'decoys': decoys(d.JA_DECOYS),
    }


def english():
    out = subprocess.run(
        ['node', '-e', "import('./js/lists.js').then(m => console.log(JSON.stringify(m.LIST_SETS ? m.LIST_SETS.en : {lists: m.DEFAULT_LISTS, decoys: m.DECOYS})))"],
        cwd=ROOT, capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def validate(locale, data):
    expected = {'celebrities': 100, 'movies': 100, 'travel': 60, 'pictionary': 30}
    for l in data['lists']:
        items = l['items']
        assert len(items) == expected[l['id']], (locale, l['id'], len(items))
        assert len({i.lower() for i in items}) == len(items), (locale, l['id'], 'duplicates',
                                                                sorted({i for i in items if items.count(i) > 1}))
        assert l['force'] in items, (locale, l['id'], 'force not in list')


def unique(items):
    seen, out = set(), []
    for item in items:
        if item.lower() not in seen:
            seen.add(item.lower())
            out.append(item)
    return out


# (column in WESTERN_FILMS_EU, titles, forces, local data) per language using the shared Latin-script lists.
LATIN = {
    'fr': (0, ('Célébrités', 'Soirée ciné', 'Voyages à faire', 'Idées Pictionary'),
           ('Kylian Mbappé', 'Intouchables', 'Japon', 'Éléphant'), d.FR_CELEBS, d.FR_FILMS, d.FR_COUNTRIES, d.FR_PICTIONARY, d.FR_DECOYS),
    'de': (1, ('Promis', 'Filmabend', 'Reiseziele', 'Pictionary-Ideen'),
           ('Michael Schumacher', 'Das Boot', 'Japan', 'Elefant'), d.DE_CELEBS, d.DE_FILMS, d.DE_COUNTRIES, d.DE_PICTIONARY, d.DE_DECOYS),
    'it': (2, ('Celebrità', 'Serata film', 'Viaggi da fare', 'Idee per Pictionary'),
           ('Valentino Rossi', 'La vita è bella', 'Giappone', 'Elefante'), d.IT_CELEBS, d.IT_FILMS, d.IT_COUNTRIES, d.IT_PICTIONARY, d.IT_DECOYS),
    'pt-BR': (3, ('Famosos', 'Noite de filme', 'Viagens dos sonhos', 'Ideias pro Imagem & Ação'),
              ('Anitta', 'Cidade de Deus', 'Japão', 'Elefante'), d.PT_CELEBS, d.PT_FILMS, d.PT_COUNTRIES, d.PT_PICTIONARY, d.PT_DECOYS),
}


def latin(locale):
    col, titles, forces, celebs, films, countries, pictionary, fakes = LATIN[locale]
    movies = unique(films + [row[col] for row in d.WESTERN_FILMS_EU])[:100]
    people = unique(celebs + d.INTL_LATIN)[:100]
    return {
        'lists': [
            lst('celebrities', titles[0], forces[0], mix(people, f'{locale}-celebs')),
            lst('movies', titles[1], forces[1], mix(movies, f'{locale}-movies')),
            lst('travel', titles[2], forces[2], mix(countries, f'{locale}-travel')),
            lst('pictionary', titles[3], forces[3], pictionary),
        ],
        'decoys': decoys(fakes),
    }


def own_script(locale, titles, forces, celebs, movies, countries, pictionary, fakes):
    return {
        'lists': [
            lst('celebrities', titles[0], forces[0], mix(unique(celebs)[:100], f'{locale}-celebs')),
            lst('movies', titles[1], forces[1], mix(unique(movies)[:100], f'{locale}-movies')),
            lst('travel', titles[2], forces[2], mix(countries, f'{locale}-travel')),
            lst('pictionary', titles[3], forces[3], pictionary),
        ],
        'decoys': decoys(fakes),
    }


SETS = {
    'en': english(),
    'es-ES': spanish('es-ES'),
    'es-419': spanish('es-419'),
    'fr': latin('fr'),
    'de': latin('de'),
    'it': latin('it'),
    'pt-BR': latin('pt-BR'),
    'he': own_script('he', ('מפורסמים', 'ערב סרט', 'מקומות לטייל', 'רעיונות לפיקשנרי'), ('גל גדות', 'טיטאניק', 'יפן', 'פיל'),
                     d.HE_CELEBS, d.HE_MOVIES, d.HE_COUNTRIES, d.HE_PICTIONARY, d.HE_DECOYS),
    'ja': japanese(),
    'ko': own_script('ko', ('유명인', '볼 영화', '가고 싶은 나라', '그림 퀴즈 제시어'), ('손흥민', '기생충', '일본', '코끼리'),
                     d.KO_CELEBS, d.KO_MOVIES, d.KO_COUNTRIES, d.KO_PICTIONARY, d.KO_DECOYS),
}
for locale, data in SETS.items():
    validate(locale, data)

js = ['// GENERATED by scripts/build_lists.py from scripts/lists_data.py (and the English set below). Edit those, then rebuild.',
      '// Built-in content per language. Each list is shown as its own note; `ageMinutes` is how long ago the note',
      '// was "last edited", which drives the date labels in the folder view. Ids match across languages.', '',
      f'export const LIST_SETS = {json.dumps(SETS, ensure_ascii=False, indent=2)};', '',
      '// The English set: also the base for migrating older settings.',
      'export const DEFAULT_LISTS = LIST_SETS.en.lists;',
      'export const DECOYS = LIST_SETS.en.decoys;', '',
      'export function listSet(locale) {',
      '  return LIST_SETS[locale] ?? LIST_SETS.en;',
      '}', '']
(ROOT / 'js/lists.js').write_text('\n'.join(js))
for locale, data in SETS.items():
    print(locale, ', '.join(f"{l['title']} ({len(l['items'])}, force {l['force']})" for l in data['lists']))
