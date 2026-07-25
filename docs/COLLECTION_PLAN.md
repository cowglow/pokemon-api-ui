# Read-Only App + Collection Plan

Captures a direction change agreed on 2026-07-25: editing pokémon
details doesn't make sense once the app is meant to show real API data
and let users curate a personal collection of pokémon, rather than
edit fields on them. This replaces the "editable core" framing in
`docs/POKEMON_FORM_EXPANSION_PLAN.md` (trimmed accordingly - the
data-shape rationale there for `types`/`abilities`/`stats`/`moves`
still stands, only the editing angle is gone).

## Decided

- **Collection persistence: Redux + localStorage sync.** A `collection`
  slice is the live source of truth (read via `useSelector` like
  everything else in the app); a small effect/saga mirrors it to
  localStorage on change, and one-time hydrates from localStorage on
  app load. Matches the pattern already used for selection persistence
  (Option B, chosen over making the URL/localStorage itself the source
  of truth) - consistent with the rest of the app's architecture.
- **Revision display: short git SHA, no tags/semver.** Computed in
  `vite.config.ts` via `execSync('git rev-parse --short HEAD')` at
  build time, exposed as a `define` constant. Works identically in CI
  and local dev - no extra workflow env vars needed.
- **Docs:** `SPRITE_ANIMATION.md` untouched (unrelated feature).
  `POKEMON_FORM_EXPANSION_PLAN.md` trimmed - the editable-core framing
  and the "should stats be editable" question are moot once editing is
  removed entirely; the data-shape survey and rationale for how
  `createPokemon` maps `types`/`abilities`/`stats`/`moves`/`cries`
  stays, since that data layer is unchanged by any of this.

## Phase 1 - Remove editing entirely

- Delete Edit/Save/Cancel buttons, `isEditing` state, and the
  `handleSave`/`handleCancel` handlers from `PokemonForm.tsx`.
- Delete the `setPokemonDetails` action/reducer case (only ever used by
  the manual-save path - `fetchPokemonDetailSuccess` is the only other
  writer of `details[name]`, and that's unaffected).
- Overview tab's fields: switch `StyledTextInput` from the default
  outlined variant to `variant="standard"`, permanently `disabled` (no
  more toggle).
- Simplify `PokemonDetailTabs.tsx`'s visibility handling: each panel's
  `content` is already conditionally rendered
  (`{activeTab === index && tab.content}`), so the wrapping `Box` for
  an inactive tab is always empty - `hidden`, `sx.visibility`, and
  `sx.display` are three mechanisms fighting to hide something with
  nothing in it. Skip rendering the wrapper `Box` at all when inactive
  instead of toggling all three.

## Phase 2 - Repurpose the FAB for "add to collection"

- The reset-cache FAB no longer has a purpose (nothing local to reset
  once there's no editing). Repurpose it: icon back to a "+"
  (`AddRounded`, undoing the `RestartAltRounded` swap from the reset
  feature), behavior changed to add the currently-viewed pokémon to
  the collection.
- Delete the now-unused `resetPokemonDetails` action/reducer/selector
  and its saga wiring, if any.

## Phase 3 - Collection slice + localStorage sync (done)

- `redux/reducers/collection.ts` uses Redux Toolkit's
  `createEntityAdapter<CollectionItem>()`, where
  `CollectionItem = {id: string, pokemon: Pokemon}` and `id` is a
  `crypto.randomUUID()` generated via `createSlice`'s prepare-callback
  on `addToCollection` - the entry's own identity is decoupled from the
  pokemon's name/pokedex id (matters if duplicate catches of the same
  species are ever wanted later; the UI still only allows one add per
  species for now, via the FAB disabling itself). Callers still just
  call `dispatch(addToCollection(pokemon))` - the uuid wrapping is
  invisible to them.
- `isInCollection(name)` is a memoized `createSelector` deriving a
  `Set<name>` from the entities, so the check stays O(1) without
  re-scanning on every render. This selector now drives a star icon
  next to the pokemon name in `PokemonHeader` when the viewed pokemon
  is already collected.
- A saga (`syncCollectionToLocalStorageHandler`, watched via
  `takeEvery` on `addToCollection`) writes the collection to
  `localStorage` on every add; `App.tsx` reads `localStorage` once on
  mount and dispatches `hydrateCollection(items)` before anything else
  touches collection state.
- No "remove from collection" affordance yet - not asked for; flag as
  a natural follow-up once the add path is solid.

## Phase 4 - "My Collection" view (done)

- `CollectionView.tsx`: empty state is a centered `Paper` prompting the
  user to add pokémon from the list; populated state is a centered,
  wrapping flex grid of `PokemonCollectionCard.tsx`.
- Each card: name + HP (from `stats`) top row, sprite art (`avatar`) on
  a tinted background, type chips at the bottom, bordered in the
  pokemon's primary type's color (`lib/type-colors.ts`, the ~18
  standard type colors). All read-only, no new fetches - the same
  `createPokemon`-shaped data already cached everywhere else.
- Hit a real bug building this: MUI's `styled()` is Emotion-based, not
  styled-components, so a `$`-prefixed "transient prop" convention
  (`$accent`) doesn't auto-filter the way it would with
  styled-components - it leaked through as an invalid DOM attribute
  (`Invalid attribute name: $accent`, visible in the console). Fixed
  with an explicit `shouldForwardProp` on the `styled(...)` call
  instead of relying on prop-name convention.

## Phase 5 - List search/filter (done)

- A `TextField` at the top of `PokemonList`'s scrolling `Box`, magnifying-glass
  icon (`SearchRoundedIcon`) as a `slotProps.input.startAdornment`
  inside the field (not a separate button) - MUI 9 deprecated the older
  `InputProps` prop in favor of `slotProps`.
- Plain client-side substring filter over the list's names - scaffold
  only, layout polish deferred to the user per their own note.
- The one real wrinkle: keyboard arrow-navigation and the
  currently-selected highlight both used to index directly into the
  full `labels`/`pokemons` arrays. Filtering meant those had to become
  two different index spaces - `filteredItems` now carries both the
  filtered-list's local index (for arrow-key wraparound math and ref
  assignment, so ArrowDown/Up only ever move between *visible* rows)
  and each item's original index into the full list (for dispatching
  `setSelectedPokemon(pokemons[index])` and the `selected={selectedTab
  === index}` highlight check, since `getSelectedPokemonIndex` is
  computed against the unfiltered list).

## Phase 6 - AppBar navigation + settings dialog

- ~~Nav menu~~ **done** - built alongside phase 4 so the collection view
  was actually reachable to test. `Header.tsx` has a menu icon button
  opening a classic MUI `Menu` with two `MenuItem`s - "Pokémon" and "My
  Collection" - controlling a top-level `view` state lifted to
  `App.tsx` (`AppView`, exported from `Header.tsx`) and threaded through
  `Layout.tsx`. No router; two views, plain state is enough, consistent
  with not reaching for `react-router` earlier for the URL-param work
  either.
- Settings (cogwheel) dialog - not yet built. Still: an `IconButton`
  anchored on the right opens an MUI `Dialog` showing the repo name, a
  link to the GitHub repo, and the build-time revision (see "Decided"
  above).

## Phase 7 - Remove the Footer

- Delete `Footer.tsx`, remove it from `Layout.tsx`, delete the
  now-unused `assets/github-mark.svg` (only consumer was the Footer -
  the repo link moves into the settings dialog instead).
- `App.Styled.ts`'s `ContentWrapper` height calc
  (`calc(100svh - 78px - 40px - 18px)`) has one of those magic numbers
  accounting for footer height - needs adjusting once the footer is
  gone, verified visually rather than guessed.

## Later / not in scope now

- Regenerating `CLAUDE.md` - it's increasingly stale (still describes
  the pre-saga `fetch`-in-`defaultValues` pattern, no mention of tabs,
  sprite animation, URL-based selection, or any of this). Worth a pass
  with the `init` skill once this round of changes lands, not bundled
  into it.
- Removing a pokémon from the collection.
- Any of the still-deferred items from `POKEMON_FORM_EXPANSION_PLAN.md`
  (`game_indices`, species flavor text).
