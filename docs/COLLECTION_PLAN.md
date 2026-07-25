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

## Phase 3 - Collection slice + localStorage sync

- New `redux/reducers/collection.ts` slice: `items: Pokemon[]` (or
  keyed by name, TBD during implementation - whichever avoids
  duplicate adds most simply), `addToCollection(pokemon)` action.
- A saga (or a small effect) watches `addToCollection` and writes the
  updated collection to `localStorage`; on app start, read
  `localStorage` once and dispatch a `hydrateCollection(items)` action
  before anything else touches collection state.
- No "remove from collection" affordance yet - not asked for; flag as
  a natural follow-up once the add path is solid.

## Phase 4 - "My Collection" view

- New view showing every collected pokémon as a centered, responsive
  grid of cards styled to evoke a real pokémon card (art, name, types
  at minimum - exact contents TBD, scaffold first and iterate on
  layout/polish afterward, same as the list-search phase).
- All read-only - the same `createPokemon`-shaped data already used
  everywhere else, no new fetches.
- Empty state: centered message inside a `Paper`, prompting the user
  to add pokémon from the list.

## Phase 5 - List search/filter

- A `TextField` at the top of `PokemonList`'s scrolling `Box`, magnifying-glass
  icon as an `InputAdornment` inside the field (not a separate button).
- Plain client-side substring filter over the list's names - scaffold
  only, layout polish deferred to the user per their own note.

## Phase 6 - AppBar navigation + settings dialog

- `Header.tsx`: a menu icon button opening a classic MUI `Menu` with
  two `MenuItem`s - "Pokémon" (the current default view) and "My
  Collection" - controlling a simple top-level view switch in `App.tsx`
  (no router; two views, plain state is enough, consistent with not
  reaching for `react-router` earlier for the URL-param work either).
- A settings (cogwheel) `IconButton` anchored on the right opens an MUI
  `Dialog` showing: the repo name, a link to the GitHub repo, and the
  build-time revision (see "Decided" above).

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
