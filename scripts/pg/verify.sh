#!/usr/bin/env bash
set -euo pipefail
if [[ "${PGHOST:-}" != "127.0.0.1" || "${PGPORT:-}" != "5432" || "${PGUSER:-}" != "postgres" || "${PGPASSWORD:-}" != "babybudget-fixture-only" ]]; then
  echo "Refusing to run outside disposable CI fixture" >&2
  exit 3
fi
psql -X -v ON_ERROR_STOP=1 -d postgres -f scripts/pg/bootstrap.sql > /dev/null
psql -X -v ON_ERROR_STOP=1 -d postgres -f docs/proposed-audit-hardening.sql > /dev/null
psql -X -v ON_ERROR_STOP=1 -d postgres -f scripts/pg/assertions.sql > /dev/null
if psql -X -v ON_ERROR_STOP=1 -d postgres -f docs/proposed-audit-hardening.sql > /tmp/bb-second-apply.log 2>&1; then
  echo "Second migration run unexpectedly succeeded" >&2
  exit 1
fi
grep -q 'Audit migration already applied' /tmp/bb-second-apply.log
echo "PostgreSQL fixture: PASS"
