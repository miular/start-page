# Storage

## Goal

Local-first and backend-independent.

## MVP

`localStorage` is acceptable for small MVP data if hidden behind an adapter.

## Interface

```ts
interface StorageAdapter {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}
```

## Keys

```text
start-page.settings
start-page.bookmarks
start-page.schema-version
```

## Serialization

JSON is acceptable.

Handle:
- missing keys
- malformed JSON
- schema mismatch
- migration failure

## Recovery

1. Do not crash.
2. Log useful diagnostics in development.
3. Recover safe defaults.
4. Avoid silently destroying recoverable data.

## Future

IndexedDB/cloud adapters should be possible without rewriting feature components.
