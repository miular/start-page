# Data Model

## Bookmark

```ts
type Bookmark = {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category?: string;
  order: number;
};
```

## Search engine

```ts
type SearchEngine = {
  id: string;
  name: string;
  urlTemplate: string;
};
```

## Settings

```ts
type ThemeMode = "system" | "light" | "dark";

type Settings = {
  theme: ThemeMode;
  searchEngineId: string;
  showQuote: boolean;
  quoteLanguage?: string;
};
```

## Quote

```ts
type Quote = {
  id: string;
  text: string;
  author?: string;
  source?: string;
};
```

## Persistence envelope

```ts
type Persisted<T> = {
  version: number;
  data: T;
};
```

## IDs

Use stable IDs. Do not use array position as identity. Ordering is separate from identity.

## Migration

Future schema changes require explicit migration or compatibility decisions. Never assume local data is disposable.
