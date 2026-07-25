# Pokémon Form & Data Expansion Plan

Captures the discussion on (1) moving detail-fetching to a redux-saga
and (2) extending `createPokemon`/the form with more of the PokeAPI
response. Part 1 is being implemented now; the rest is future work.

## 1. Detail fetching: saga instead of inline `fetch` (done)

`PokemonForm` used to fetch via a raw `fetch(url)` inside React Hook
Form's async `defaultValues` callback, bypassing the redux-saga pattern
already used for the list phase (`fetchPokemonsStart` ->
`fetchPokemonsHandler` -> `requestPokemons`).

Implemented approach:

- Mirrored the existing pattern: `fetchPokemonDetailStart/Success/Failure`
  actions, a `requestPokemonDetail` saga-request, a
  `fetchPokemonDetailHandler` saga-handler, watched via `takeEvery`
  (safe here since results are cached by pokemon name - a late-resolving
  stale request can't clobber a newer selection's data).
- Dropped RHF's async `defaultValues` entirely. `defaultValues` can't
  `await` a saga result (that only resolves through the store, not a
  promise `defaultValues` can hold onto) without an awkward manual
  `store.subscribe` in the component. Instead: dispatch the fetch on
  mount, drive the loading skeleton off a `detailsLoading` selector,
  and call `methods.reset(detail)` once the data lands in Redux. This
  keeps the detail phase consistent with how the list phase already
  reads loading/data through selectors.

### 1a. Follow-up cleanup

A first pass wired the above directly into `PokemonForm` (inline
`useSelector((state: RootState) => ...)` calls and two bare
`useEffect`s in the component body), then a review pass tightened it:

- **Selector hooks instead of inline `RootState` lambdas.**
  `usePokemonDetails(name)`, `usePokemonDetailLoading(name)`,
  `usePokemonDetailError(name)` live next to the plain selectors in
  `redux/reducers/pokemons.ts`, each just wrapping `useSelector` +
  the existing selector. `PokemonForm` no longer imports `RootState`
  or `useSelector` at all.
- **One hook to own the fetch-orchestration effects.**
  `usePokemonDetail(name, url, reset)`, colocated next to
  `PokemonForm.tsx`, takes RHF's `methods.reset` as a parameter, owns
  both effects (dispatch-on-mount, reset-on-arrival) internally, and
  returns `{data, loading, error}`. `PokemonForm` itself has no
  `useEffect`/`useDispatch` left in it - it just calls the hook and
  renders.
- **Delay separated from the request function.** The artificial
  800-1200ms delay used to be `await`ed inside `requestPokemonDetail`,
  mixing timing/demo concerns into what should be a plain "fetch and
  parse" function. Moved to an explicit `yield delay(ms)` (redux-saga's
  own effect creator) in `fetchPokemonDetailHandler`, with the random
  range extracted to a small `randomInt(min, max)` helper. This makes
  `requestPokemonDetail` pure I/O, and the delay a one-line, visible,
  trivially-removable step in the saga instead of buried in network
  code.

## 2. Response shape survey

Pulled a live `GET /pokemon/1` (Bulbasaur, ~271KB) to see what's
actually available beyond what `createPokemon` currently maps
(`id`, `name`, `order`, `avatar` <- `sprites.front_default`,
`experience` <- `base_experience`, `height`, `weight`).

| Field | Shape | Notes |
|---|---|---|
| `cries` | `{latest, legacy}` | Direct `.ogg` URLs, no secondary fetch. Easy `<audio>` embed. |
| `sprites` | nested | Far more than `front_default`: back/shiny/female variants, plus `sprites.other.official-artwork/home/dream_world/showdown`, plus `sprites.versions` by generation. |
| `stats` | fixed array of 6 | `hp`, `attack`, `defense`, `special-attack`, `special-defense`, `speed`, each `{base_stat, effort}`. Fixed shape - easy to model as numeric inputs. |
| `types` | small array | `{slot, type: {name, url}}`. Name only, no secondary fetch needed for display. |
| `abilities` | small array | `{ability: {name, url}, is_hidden, slot}`. Name only; full effect text would need a fetch to the ability's own URL. |
| `moves` | 86 entries | Each has a `version_group_details` array (level/method/version-group). No power/type/accuracy inline - needs a per-move fetch for that. Needs filtering (e.g. by version group) before it's usable in a UI; dumping all 86 raw is not a good v1. |
| `game_indices` | 46 entries | `{game_index, version}`. Low practical value, closer to trivia. |
| `held_items`, `past_abilities/stats/types`, `location_area_encounters` | mostly empty/rare | Skipping for now. |
| `species` | `{name, url}` pointer only | Flavor text/genus lives at the species endpoint - would need a chained secondary fetch. Out of scope for now. |

## 3. Proposed grouping (MUI Tabs)

**Editable core** (registered RHF inputs, current pattern):
`name`, `height`, `weight`, `experience` (the field-name/`base_experience`
mismatch found while touching this code is fixed as part of the saga
change - see PR). `stats` is a good candidate to join this bucket since
it's a fixed 6-key numeric shape.

**Reference/display tabs** (not scalar-editable, shown as read-only
panels):
- Abilities & Types - simple chip/list display, no extra fetch.
- Cries - audio players for `latest`/`legacy`.
- ~~Sprites - gallery of the sprite variants~~ **done, but as a cosmetic
  animation instead of a gallery tab** - see `docs/SPRITE_ANIMATION.md`
  (its own doc, since it's a self-contained cosmetic effect rather than
  part of this data/form-expansion track).

**Deferred / later**:
- Moves tab - needs version-group filtering first, otherwise it's an
  unreadable 86-row dump.
- `game_indices` - low value, maybe skip entirely or add as trivia only.
- Species flavor text - would introduce a second chained API fetch;
  revisit once the above is settled.

## Open questions for the deferred work

- Should `stats` actually be user-editable, or reference-only like
  abilities/types?
- Is a chained species-detail fetch (for flavor text) worth the added
  saga complexity?
- How do we filter `moves` down to something browsable - latest version
  group only? Search/filter UI?
