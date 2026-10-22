#!/usr/bin/env bash
# Sets up what Foldwise sells on the App Store, once: the app itself is free in every territory,
# and Foldwise All Access is sold as a monthly subscription ($4.99, no trial) or a one-time
# Lifetime purchase ($29.99). Both unlock RevenueCat's `com_yuvalofek_foldwise_pro` entitlement.
#
#   scripts/asc/products.sh plan    # show what exists and what would be created
#   scripts/asc/products.sh apply   # create whatever is missing
#
# Needs ASC_APP_ID plus the API key (ASC_KEY_ID, ASC_ISSUER_ID, ASC_PRIVATE_KEY). Every step
# checks App Store Connect first, so running it again only fills in what's missing. Product IDs
# can never be reused once created, even after deleting the product.
set -euo pipefail

MODE="${1:-plan}"
APP="${ASC_APP_ID:?Set ASC_APP_ID to the numeric App Store Connect app id}"
MONTHLY_ID='com.yuvalofek.foldwise.allaccess.monthly'
LIFETIME_ID='com.yuvalofek.foldwise.lifetime'
REVIEW_SHOT='store/review/paywall.png'

say() { printf '\n== %s\n' "$*"; }
count() { jq '.data | length'; }

subscription_id() {
  asc subscriptions list --app "$APP" --paginate --output json \
    | jq -r --arg p "$MONTHLY_ID" '.data[] | select(.attributes.productId == $p) | .id'
}
lifetime_id() {
  asc iap list --app "$APP" --product-id "$LIFETIME_ID" --paginate --output json | jq -r '.data[0].id // empty'
}

say "App $APP"
asc apps info view --app "$APP" --output table || true

if [ "$MODE" = plan ]; then
  say 'App availability'
  asc pricing availability view --app "$APP" --output table || echo 'Not set yet: apply makes it available in every territory.'
  say 'App price'
  asc pricing schedule view --app "$APP" --output table || echo 'Not set yet: apply makes the app free.'
  say "Monthly subscription ($MONTHLY_ID)"
  sub=$(subscription_id); [ -n "$sub" ] && asc subscriptions view --id "$sub" --output table \
    || echo 'Missing: apply creates it at $4.99/month, no trial, every territory.'
  say "Lifetime purchase ($LIFETIME_ID)"
  iap=$(lifetime_id); [ -n "$iap" ] && asc iap view --id "$iap" --output table \
    || echo 'Missing: apply creates it at $29.99, every territory.'
  exit 0
fi
[ "$MODE" = apply ] || { echo "Unknown mode: $MODE (use plan or apply)" >&2; exit 2; }

ALL=$(asc pricing territories list --paginate --output json | jq -r '[.data[].id] | join(",")')
echo "Territories: $(tr ',' '\n' <<<"$ALL" | wc -l)"

say 'App availability: every territory'
asc pricing availability create --app "$APP" --all-territories --available true \
  --available-in-new-territories true --if-exists skip

say 'App price: free'
schedule=$(asc pricing schedule view --app "$APP" --output json 2>/dev/null | jq -r '.data.id // empty' || true)
prices=0
[ -n "$schedule" ] && prices=$(asc pricing schedule manual-prices --schedule "$schedule" --output json | count)
if [ "$prices" -gt 0 ]; then
  echo 'Already priced; left as is.'
else
  free=$(asc pricing price-points --app "$APP" --territory USA --paginate --output json \
    | jq -r '[.data[] | select((.attributes.customerPrice | tonumber) == 0)][0].id')
  asc pricing schedule create --app "$APP" --price-point "$free" --base-territory USA
fi

say "Monthly subscription: $MONTHLY_ID"
if [ -n "$(subscription_id)" ]; then
  echo 'Already exists; left as is.'
else
  asc subscriptions setup --app "$APP" \
    --group-reference-name 'Foldwise All Access' \
    --group-locale en-US --group-display-name 'Foldwise All Access' \
    --reference-name 'All Access Monthly' --product-id "$MONTHLY_ID" \
    --subscription-period ONE_MONTH \
    --locale en-US --display-name 'All Access Monthly' \
    --description 'Every Foldwise trick and list, monthly' \
    --price 4.99 --price-territory USA \
    --territories "$ALL" --available-in-new-territories \
    --review-screenshot "$REVIEW_SHOT"
fi

say "Lifetime purchase: $LIFETIME_ID"
iap=$(lifetime_id)
if [ -z "$iap" ]; then
  asc iap setup --app "$APP" --type NON_CONSUMABLE \
    --reference-name 'All Access Lifetime' --product-id "$LIFETIME_ID" \
    --locale en-US --display-name 'All Access Lifetime' \
    --description 'Every Foldwise trick and list, forever' \
    --price 29.99 --base-territory USA
  iap=$(lifetime_id)
fi
if asc iap pricing availability view --iap-id "$iap" >/dev/null 2>&1; then
  echo 'Availability already set.'
else
  asc iap pricing availability set --iap-id "$iap" --territories "$ALL"
fi
if asc iap review-screenshots view --iap-id "$iap" --output json 2>/dev/null | jq -e '.data' >/dev/null; then
  echo 'Review screenshot already uploaded.'
else
  asc iap review-screenshots create --iap-id "$iap" --file "$REVIEW_SHOT"
fi

say 'Done'
asc subscriptions pricing summary --app "$APP" --territory USA --output table || true
