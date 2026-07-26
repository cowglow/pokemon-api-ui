# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # tsc then Vite production build
npm run lint      # ESLint with TypeScript support
npm run preview   # Preview production build locally
```

No test suite is configured.

## Architecture

React + TypeScript SPA that displays a browsable Pokémon list fetched from the public PokeAPI, shown as read-only detail tabs, plus a personal "collection" of saved Pokémon persisted to `localStorage`. Built with Vite, deployed to GitHub Pages at the `/pokemon-api-ui` base path on every push to `main` (`.github/workflows/build-static-page.yml`).

**Stack:** React 19, MUI 9, Redux Toolkit + Redux Saga, TypeScript strict mode. `react-hook-form`/`@hookform/devtools` are still listed as devDependencies but are no longer imported anywhere — the form used to be editable and is not anymore (see below); `pokenode-ts` is imported for TypeScript types only, actual API calls use native `fetch`.

### Data flow

Two Redux slices, both under `src/redux/reducers/`, each with its own saga handler(s) watched by the root saga (`src/redux/saga.ts`):

1. **List + selection (`pokemons` slice).** On mount, `App` dispatches `fetchPokemonsStart(REQUEST_LIMIT_DEFAULT)`. `fetchPokemonsHandler` calls `requestPokemons` (native `fetch`, 2s artificial delay), dispatches `fetchPokemonsSuccess`, then reads a `pokemon` URL search param (`lib/url-param.ts`) and dispatches `setSelectedPokemon` for that pokemon if present in the results, else the first item. Selecting a pokemon (list click/Enter) dispatches `setSelectedPokemon`, which a second saga (`syncSelectedPokemonUrlHandler`) mirrors back into the `pokemon` URL param via `history.replaceState` (not `pushState`, so keyboard navigation doesn't spam browser history) — this is what makes the selection survive a refresh or a shared link.

2. **Detail (`pokemons` slice, `details`/`detailsLoading`/`detailsError`).** `usePokemonDetail(name, url)` (in `components/`) dispatches `fetchPokemonDetailStart` whenever there's no cached data, no in-flight request, and no prior error for that name (self-healing: this also covers cache-clearing scenarios, not just first mount). `fetchPokemonDetailHandler` does an explicit `yield delay(randomInt(800, 1200))` then calls `requestPokemonDetail`, transforms the raw response via `lib/create-pokemon.ts`, and caches the result keyed by name. `PokemonForm` is now **read-only** — there is no edit/save flow; it just renders `usePokemonDetail`'s data across `PokemonDetailTabs`.

3. **Collection (`collection` slice).** Uses `createEntityAdapter<CollectionItem>()` where `CollectionItem = {id, pokemon}` and `id` is a `crypto.randomUUID()` generated via a `createSlice` prepare-callback on `addToCollection` — the entry's identity is decoupled from the pokemon's own name/pokedex id. A saga (`syncCollectionToLocalStorageHandler`, watching both `addToCollection` and `removeFromCollection`) mirrors the collection to `localStorage`; `App` reads `localStorage` once on mount and dispatches `hydrateCollection`. Redux is the source of truth throughout — `localStorage` is purely a mirror, same pattern as the URL-selection sync above.

```
App mount → dispatch fetchPokemonsStart + hydrateCollection
  → Saga → requestPokemons (PokeAPI list)
    → fetchPokemonsSuccess, then setSelectedPokemon (from URL param or first item)
      → PokemonList renders items; selecting one → setSelectedPokemon
        → syncSelectedPokemonUrlHandler mirrors it into the URL
      → SelectedPokemon → PokemonForm → usePokemonDetail dispatches
        fetchPokemonDetailStart on demand → PokemonDetailTabs renders the cached result
      → AddToCollection FAB → addToCollection → synced to localStorage
```

### Redux state shape

```typescript
{
  pokemons: {
    items: Pokemon[],
    selectedPokemon: Pokemon | null,
    loading: boolean,
    error: unknown,
    details: Record<string, PokemonDetail>,       // keyed by pokemon name
    detailsLoading: Record<string, boolean>,
    detailsError: Record<string, unknown>
  },
  collection: EntityState<CollectionItem>          // createEntityAdapter's {ids, entities}
}
```

Selectors/hooks live next to each slice (`src/redux/reducers/pokemons.ts`, `collection.ts`) — plain selectors take `(state, ...)`, and each has a matching `use*` hook wrapping `useSelector` so components never write inline `useSelector((state: RootState) => ...)` lambdas. Notable ones: `isInCollection`/`useIsInCollection(name)`, `getCollectionItemId`/`useCollectionItemId(name)` (for the remove flow), `getCollectedNames`/`useCollectedNames()` (a memoized `Set<name>`, used to filter the whole list — can't call a per-name hook in a loop).

### Key source directories

| Path | Purpose |
|---|---|
| `src/redux/` | Store config, root saga, `saga-handlers/` (one per side-effect), `saga-requests/` (plain `fetch` wrappers, no timing/delay logic), `reducers/` (slice + selectors + hooks together) |
| `src/components/` | Feature components. `PokemonForm`/`PokemonDetailTabs`/`PokemonHeader` render one selected pokemon's read-only detail tabs (Overview, Abilities & Types, Cries, Stats, Moves); `CollectionPage`/`PokemonCollectionCard` render the saved-pokemon grid |
| `src/ui/` | Layout shells (`Layout`, `Header` — nav menu + settings dialog) |
| `src/lib/` | `create-pokemon.ts` (raw API response → app `Pokemon` shape), `PokemonType.ts`, `url-param.ts`, `collection-storage.ts`, `type-colors.ts`, `format-name.ts`, `random.ts`, `sprite-frames.ts`, `constants.ts` |
| `src/types/` | The list-item `Pokemon` type (`{name, url}`) — distinct from `lib/PokemonType.ts`'s fully-fetched detail `Pokemon` shape |

### Styling

All styles use MUI's `styled()` CSS-in-JS API. No separate CSS files. `src/components/RHF/FormComponet.Styled.ts` holds shared styled wrappers (`StyledForm`, `StyledTextInput`) — the `RHF` directory name is a holdover from when the form used `react-hook-form`; it's now just layout styling for the read-only fields.

### Keyboard navigation & selection

`PokemonList` implements full keyboard accessibility, but **arrow keys and confirmation are decoupled**: `ArrowUp`/`ArrowDown` only move focus between rows (ref-based, wrapping at the ends); pressing `Enter` on the focused row is what dispatches `setSelectedPokemon`. Mouse clicks still select immediately. Preserve this distinction when modifying the list — it's easy to accidentally reintroduce select-on-focus. The list also has a text search box and a single collection-only `ToggleButton` (both client-side filters over `getPokemonNames`, composable), which is why keyboard nav math is done against a filtered index list, not the raw array — see `filteredItems` in `PokemonList.tsx`.

### Sprite animation

The avatar shown in `PokemonHeader` isn't a static image — `lib/sprite-frames.ts` collects every static sprite variant PokeAPI has for a pokemon (base + all per-generation versions, explicitly excluding the already-animated Gen-V/Showdown GIFs) and `components/useSpriteAnimation.ts`/`AnimatedSprite.tsx` step through them on a slow `setInterval` for a deliberate retro flipbook effect. Full rationale in `docs/SPRITE_ANIMATION.md`.

### Build-time git revision

`vite.config.ts` runs `execSync('git rev-parse --short HEAD')` and exposes it as the `__GIT_REVISION__` define constant (declared in `src/vite-env.d.ts`), shown in `SettingsDialog` alongside the repo link. Works identically for `npm run dev` and CI builds.

### Unused / stub code

`PokemonCard.tsx`, `PokemonTabs.tsx` (an alternate vertical-tabs pokemon *selector*, not to be confused with `PokemonDetailTabs.tsx`), and `RangeSlider/` exist but are not wired into `App.tsx`.

### Further reading

`docs/` holds design-rationale docs for non-obvious past decisions (not just historical changelogs — genuinely explains *why* things are shaped the way they are): `COLLECTION_PLAN.md` (the collection feature, entity-adapter/uuid choice, localStorage-sync pattern), `POKEMON_FORM_EXPANSION_PLAN.md` (why `createPokemon` maps `types`/`abilities`/`stats`/`moves`/`cries` the way it does), `SPRITE_ANIMATION.md` (the avatar animation above).
