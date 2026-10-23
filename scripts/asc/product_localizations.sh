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

# Translations belong to a version of each product; use the newest one.
sub_version=$(asc subscriptions versions list --subscription-id "$sub" --output json | jq -r '.data[0].id // empty')
iap_version=$(asc iap versions list --iap-id "$iap" --output json | jq -r '.data[0].id // empty')
group_version=$(asc subscriptions groups versions list --group-id "$group" --output json | jq -r '.data[0].id // empty')
[ -n "$sub_version" ] && [ -n "$iap_version" ] && [ -n "$group_version" ] \
  || { echo 'A product has no version to translate yet. Check it in App Store Connect.' >&2; exit 1; }

have_sub=$(asc subscriptions versions localizations list --version-id "$sub_version" --paginate --output json | locales)
have_iap=$(asc iap versions localizations list --version-id "$iap_version" --paginate --output json | locales)
have_group=$(asc subscriptions groups versions localizations list --version-id "$group_version" --paginate --output json | locales)

missing=0
while IFS='|' read -r locale m_name m_desc l_name l_desc; do
  say "$locale"
  if grep -qx "$locale" <<<"$have_group"; then echo "Group: already translated"; else
    missing=$((missing + 1)); echo "Group: add \"$GROUP_NAME\""
    [ "$MODE" = apply ] && asc subscriptions groups versions localizations create --version-id "$group_version" \
      --locale "$locale" --name "$GROUP_NAME" --output table
  fi
  if grep -qx "$locale" <<<"$have_sub"; then echo "Monthly: already translated"; else
    missing=$((missing + 1)); echo "Monthly: add \"$m_name\" / \"$m_desc\""
    [ "$MODE" = apply ] && asc subscriptions versions localizations create --version-id "$sub_version" \
      --locale "$locale" --name "$m_name" --description "$m_desc" --output table
  fi
  if grep -qx "$locale" <<<"$have_iap"; then echo "Lifetime: already translated"; else
    missing=$((missing + 1)); echo "Lifetime: add \"$l_name\" / \"$l_desc\""
    [ "$MODE" = apply ] && asc iap versions localizations create --version-id "$iap_version" \
      --locale "$locale" --name "$l_name" --description "$l_desc" --output table
  fi
done <<<"$TRANSLATIONS"

say "Done: $missing translation(s) $([ "$MODE" = apply ] && echo added || echo 'to add (run apply)')"
