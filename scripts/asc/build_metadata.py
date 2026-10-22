"""Writes App Store Connect metadata for `asc metadata push` from store/listings.json.

    python3 scripts/asc/build_metadata.py OUT_DIR VERSION

Creates OUT_DIR/app-info/<locale>.json (name, subtitle, privacy policy) and
OUT_DIR/version/<VERSION>/<locale>.json (description, keywords, promotional text, support URL)
for every locale in the listings, after checking Apple's length limits.
"""
import json
import pathlib
import sys

PAGES = 'https://yuvalofek1.github.io/DFB/legal'
LIMITS = {'name': 30, 'subtitle': 30, 'keywords': 100, 'promotional': 170, 'description': 4000}


def main(out_dir, version):
    listings = json.loads(pathlib.Path('store/listings.json').read_text())
    out = pathlib.Path(out_dir)
    for locale, listing in listings.items():
        for field, limit in LIMITS.items():
            if len(listing[field]) > limit:
                sys.exit(f'{locale}.{field} is {len(listing[field])} characters (limit {limit})')
        write(out / 'app-info' / f'{locale}.json', {
            'name': listing['name'],
            'subtitle': listing['subtitle'],
            'privacyPolicyUrl': f'{PAGES}/privacy.html',
        })
        write(out / 'version' / version / f'{locale}.json', {
            'description': listing['description'],
            'keywords': listing['keywords'],
            'promotionalText': listing['promotional'],
            'supportUrl': f'{PAGES}/support.html',
        })
    print(f'Wrote metadata for {len(listings)} locales to {out}')


def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main(*sys.argv[1:3])
