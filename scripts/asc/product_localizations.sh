#!/usr/bin/env bash
# Translates the names Apple shows on its purchase and Manage Subscriptions sheets: the subscription
# group, the monthly subscription and the Lifetime purchase, in every language the store listing
# has. Without them those sheets say "All Access Monthly" in English to everyone.
#
#   scripts/asc/product_localizations.sh plan    # show which translations are missing
#   scripts/asc/product_localizations.sh apply   # add them
#
# Run products.sh first (it creates the products and their English names). Existing translations
# are left as they are; edit those in App Store Connect.
set -euo pipefail

MODE="${1:-plan}"
APP="${ASC_APP_ID:?Set ASC_APP_ID to the numeric App Store Connect app id}"
MONTHLY_ID='com.yuvalofek.foldwise.allaccess.monthly'
LIFETIME_ID='com.yuvalofek.foldwise.lifetime'
GROUP_NAME='Foldwise All Access'
[ "$MODE" = plan ] || [ "$MODE" = apply ] || { echo "Unknown mode: $MODE (use plan or apply)" >&2; exit 2; }

# locale | monthly name | monthly description | lifetime name | lifetime description
# (names up to 30 characters, descriptions up to 45)
TRANSLATIONS=$(cat <<'TSV'
en-US|All Access Monthly|Every Foldwise trick and list, monthly|All Access Lifetime|Every Foldwise trick and list, forever
es-ES|All Access mensual|Todos los trucos y listas, cada mes|All Access de por vida|Todos los trucos y listas, para siempre
es-MX|All Access mensual|Todos los trucos y listas, cada mes|All Access de por vida|Todos los trucos y listas, para siempre
fr-FR|All Access mensuel|Tous les tours et listes, chaque mois|All Access à vie|Tous les tours et listes, à vie
de-DE|All Access monatlich|Alle Tricks und Listen, monatlich|All Access dauerhaft|Alle Tricks und Listen, dauerhaft
it|All Access mensile|Tutti i trucchi e le liste, ogni mese|All Access a vita|Tutti i trucchi e le liste, per sempre
pt-BR|All Access mensal|Todos os truques e listas, todo mês|All Access vitalício|Todos os truques e listas, para sempre
he|All Access חודשי|כל הטריקים והרשימות, בכל חודש|All Access לכל החיים|כל הטריקים והרשימות, לתמיד
ja|All Access 月額|すべてのマジックとリスト(月額)|All Access 買い切り|すべてのマジックとリスト(永久)
ko|All Access 월간|모든 마술과 목록, 월간 이용|All Access 평생 이용권|모든 마술과 목록, 평생 이용
TSV
)

say() { printf '\n== %s\n' "$*"; }
# The locales an App Store Connect localizations listing already has, one per line.
locales() { jq -r '.data[].attributes.locale'; }

sub=$(asc subscriptions list --app "$APP" --paginate --output json \
  | jq -r --arg p "$MONTHLY_ID" '.data[] | select(.attributes.productId == $p) | .id')
iap=$(asc iap list --app "$APP" --product-id "$LIFETIME_ID" --paginate --output json | jq -r '.data[0].id // empty')
group=$(asc subscriptions groups list --app "$APP" --paginate --output json \
  | jq -r --arg n "$GROUP_NAME" '.data[] | select(.attributes.referenceName == $n) | .id')
[ -n "$sub" ] && [ -n "$iap" ] && [ -n "$group" ] || { echo 'Run products.sh first: a product or the group is missing.' >&2; exit 1; }

# Translations belong to a version of each product, and only a version still being prepared
# (PREPARE_FOR_SUBMISSION) can change; one that is ready for or in review can't. Use the editable
# version, or create one (apply only).
editable_version() { # what (for messages), list command..., -- create command...
  local what=$1; shift
  local list=() create=()
  while [ "$1" != -- ]; do list+=("$1"); shift; done; shift; create=("$@")
  local versions id
  versions=$("${list[@]}" --paginate --output json)
  echo "$what versions: $(jq -r '[.data[] | "\(.attributes.version // "?"):\(.attributes.state)"] | join(", ")' <<<"$versions")" >&2
  id=$(jq -r '[.data[] | select(.attributes.state == "PREPARE_FOR_SUBMISSION")][0].id // empty' <<<"$versions")
  if [ -z "$id" ] && [ "$MODE" = apply ]; then
    echo "$what: no editable version, creating one" >&2
    id=$("${create[@]}" --output json | jq -r '.data.id // empty') || id=''
  fi
  echo "$id"
}
say 'Product versions'
group_version=$(editable_version Group asc subscriptions groups versions list --group-id "$group" -- \
  asc subscriptions groups versions create --group-id "$group")
sub_version=$(editable_version Monthly asc subscriptions versions list --subscription-id "$sub" -- \
  asc subscriptions versions create --subscription-id "$sub")
iap_version=$(editable_version Lifetime asc iap versions list --iap-id "$iap" -- \
  asc iap versions create --iap-id "$iap")
if [ "$MODE" = apply ] && { [ -z "$group_version" ] || [ -z "$sub_version" ] || [ -z "$iap_version" ]; }; then
  echo '::error::App Store Connect has no editable version of a product and refused to create one (see above). Add these translations in App Store Connect instead.' >&2
  exit 1
fi
# Plan only reads: with no editable version yet, compare against nothing (everything is listed).
list_locales() { [ -n "$2" ] && "$1" "$2" || true; }

sub_locales() { asc subscriptions versions localizations list --version-id "$1" --paginate --output json | locales; }
iap_locales() { asc iap versions localizations list --version-id "$1" --paginate --output json | locales; }
group_locales() { asc subscriptions groups versions localizations list --version-id "$1" --paginate --output json | locales; }
have_sub=$(list_locales sub_locales "$sub_version")
have_iap=$(list_locales iap_locales "$iap_version")
have_group=$(list_locales group_locales "$group_version")

missing=0
failed=0
while IFS='|' read -r locale m_name m_desc l_name l_desc; do
  say "$locale"
  if grep -qx "$locale" <<<"$have_group"; then echo "Group: already translated"; else
    missing=$((missing + 1)); echo "Group: add \"$GROUP_NAME\""
    if [ "$MODE" = apply ]; then
      asc subscriptions groups versions localizations create --version-id "$group_version" \
      --locale "$locale" --name "$GROUP_NAME" --output table || failed=$((failed + 1))
    fi
  fi
  if grep -qx "$locale" <<<"$have_sub"; then echo "Monthly: already translated"; else
    missing=$((missing + 1)); echo "Monthly: add \"$m_name\" / \"$m_desc\""
    if [ "$MODE" = apply ]; then
      asc subscriptions versions localizations create --version-id "$sub_version" \
      --locale "$locale" --name "$m_name" --description "$m_desc" --output table || failed=$((failed + 1))
    fi
  fi
  if grep -qx "$locale" <<<"$have_iap"; then echo "Lifetime: already translated"; else
    missing=$((missing + 1)); echo "Lifetime: add \"$l_name\" / \"$l_desc\""
    if [ "$MODE" = apply ]; then
      asc iap versions localizations create --version-id "$iap_version" \
      --locale "$locale" --name "$l_name" --description "$l_desc" --output table || failed=$((failed + 1))
    fi
  fi
done <<<"$TRANSLATIONS"

if [ "$MODE" = apply ]; then
  say "Done: $((missing - failed)) of $missing translation(s) added"
  [ "$failed" -eq 0 ] || { echo "::error::$failed translation(s) failed; see the errors above." >&2; exit 1; }
else
  say "Done: $missing translation(s) to add (run apply)"
fi
