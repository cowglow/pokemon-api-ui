# Responsive / Mobile Layout Plan

Everything shipped so far was built desktop-first - there's currently no
breakpoint handling anywhere in the app (`grep`-ing for
`useMediaQuery`/`theme.breakpoints` across `src/` turns up nothing).
This is a plan, not yet implemented - written to align on the approach
before touching layout code, same as `docs/COLLECTION_PLAN.md` was.

## Current gaps

- **`ContentWrapper` (`src/App.Styled.ts`) is a plain `display: flex`
  row with no wrap.** `PokemonList` is a hard-coded `width: 360` `Paper`
  sitting next to `SelectedPokemon`/`PokemonForm`, which fills the rest.
  On a phone-width viewport (~375-414px) the list alone is nearly the
  whole screen; there's no room left for the detail pane, and
  `overflow: hidden` on the wrapper means it clips rather than reflows.
- **List and detail are always mounted side by side** - there's no
  "pick one screen at a time" mode for narrow viewports, which is the
  standard mobile treatment for master-detail UIs.
- **`PokemonDetailTabs`'s `Tabs` isn't scrollable.** Five tabs
  (Overview, Abilities & Types, Cries, Stats, Moves) fit fine on
  desktop but will overflow/clip on a narrow screen without
  `variant="scrollable"`.
- **`AddToCollection`'s FAB is `position: absolute` with fixed
  `bottom`/`right` offsets**, positioned relative to whatever ancestor
  has `position: relative`. Needs re-checking once the detail pane's
  container can be full-width/stacked on mobile, so the FAB doesn't
  end up misplaced or overlapping content.
- **Header/nav is already in reasonable shape** - the `AppBar` uses a
  hamburger `IconButton` + `Menu` rather than persistent nav links, and
  `SettingsDialog` is a modal, so neither needs rework for mobile.
- **`CollectionPage`'s card grid already wraps** (`flexWrap: "wrap"`,
  centered) - likely fine as-is, but worth confirming a single 240px
  card plus padding still fits a 320px-wide viewport (iPhone SE class)
  without horizontal scroll.

## Approach options for list/detail on small screens

**Option A - Master-detail view switch (recommended).** Below a
breakpoint (`theme.breakpoints.down('sm')` via `useMediaQuery`), render
only one of `PokemonList` or `SelectedPokemon` at a time instead of
both. Selecting a pokémon on mobile switches to the detail screen; a
back button (e.g. an `ArrowBackRounded` `IconButton` added to
`PokemonHeader` or a small bar above it, mobile-only) returns to the
list. This is the standard native-feeling pattern (Mail apps, Settings
apps) and matches how the collection-only filter/search already
narrows down a single list to one focused thing. Above the breakpoint,
behavior is unchanged - both panes render side by side like today.

- Needs one new piece of state: which pane is showing on mobile. Can
  likely piggyback on "is a pokémon selected" rather than adding a
  fully separate state machine, similar to how the URL-selection sync
  already treats "a pokémon is selected" as meaningful state.
- No new dependency - `useMediaQuery` + `theme.breakpoints` are already
  part of the installed MUI version.

**Option B - List as a `Drawer`.** Keep the detail pane as the primary
content at all sizes; make `PokemonList` a MUI `Drawer`
(`variant="permanent"` on desktop, `variant="temporary"` on mobile,
opened via an icon button - could reuse/extend the existing hamburger
icon in `Header`). Avoids adding back-button navigation state since
`Drawer` handles its own open/close and backdrop, but changes the
visual metaphor of the list from "a peer panel" to "an overlay you
summon", which is a bigger departure from the current desktop look.

**Option C - Stack list above detail, no navigation state.** Below the
breakpoint, just switch `ContentWrapper`'s `flex-direction` to
`column` and let both panes go full-width, stacked vertically with
normal page scroll. Simplest change (one `sx` breakpoint value, no new
state), but means scrolling past the whole ~150-item list to reach the
detail pane every time - poor discoverability for what's meant to be
the primary content once a pokémon is selected.

**Recommendation: Option A.** It's the standard pattern for exactly
this kind of list/detail UI, keeps the desktop layout completely
unchanged above the breakpoint, and the added state is small and
mirrors a pattern (derive UI mode from "is something selected") the
app already uses elsewhere.

## Supporting fixes (needed regardless of which option is picked)

- `PokemonDetailTabs`: add `variant="scrollable" scrollButtons="auto"
  allowScrollButtonsMobile` to the `Tabs`.
- `PokemonList`'s `Paper`: responsive `width` (e.g. `{ xs: '100%', sm:
  360 }`) instead of a hard-coded `360`.
- Re-verify `AddToCollection`'s FAB placement once the detail pane can
  be full-width/stacked on mobile - confirm the `position: relative`
  ancestor is still the right one and the FAB doesn't overlap tab
  content or get clipped by `overflow: hidden`.
- Spot-check tap target sizes on mobile: dense `ListItemButton` rows,
  the small `IconButton`s in `PokemonCollectionCard` and the
  collection-only `ToggleButton` are all fairly compact and may need a
  touch-friendly size bump.
- Confirm `CollectionPage`'s card grid at a 320px viewport width.

## Decided (2026-07-26)

- **Option A**, breakpoint at MUI's default `sm` (600px) via
  `theme.breakpoints.down('sm')`.
- **Bonus, inspired by Option B**: the nav `Menu` popover in `Header`
  (currently two `MenuItem`s anchored under the hamburger icon) becomes
  a MUI `Drawer` instead - the same idea Option B proposed for the
  pokémon list, applied to the existing top-level nav instead of
  introducing a second drawer for the list itself. A vertical `List` of
  the same two destinations (Pokémon / My Collection) sits at the top
  of the drawer.

## Implementation notes

- `App.tsx` gets a `useMediaQuery(theme.breakpoints.down('sm'))` check
  to decide which of `PokemonList`/`SelectedPokemon` to render when a
  pokémon is selected (both render unconditionally at `sm` and up,
  unchanged from today). The `AddToCollection` FAB is gated on the same
  condition as the detail pane, since it doesn't make sense floating
  over the list when the matching detail isn't visible.
- Back navigation lives as a small `IconButton` in `PokemonHeader`,
  threaded down via a new optional `onBack` prop
  (`SelectedPokemon` -> `PokemonForm` -> `PokemonHeader`). It's always
  rendered when the prop is passed, hidden above `sm` purely via `sx`
  breakpoint display - no separate mobile check duplicated at that
  layer.
- No FAB repositioning turned out to be needed - it was already
  `position: absolute` with no positioned ancestor anywhere in the
  tree, so it's anchored to the viewport already (confirmed via
  `grep` - no `position: relative` exists in `src/`), which is exactly
  what floating-above-everything mobile behavior wants.
