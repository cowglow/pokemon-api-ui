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

React + TypeScript SPA that displays a browsable Pokémon list fetched from the public PokeAPI. Built with Vite, deployed to GitHub Pages at the `/pokemon-api-ui` base path.

**Stack:** React 18, MUI 5, Redux Toolkit + Redux Saga, React Hook Form, TypeScript strict mode.

### Data flow

There are two distinct data-loading phases:

1. **List phase** — On mount, `App` dispatches `fetchPokemonsStart(200)`. The saga calls `requestPokemons` (native `fetch` to PokeAPI list endpoint, with an artificial 2-second delay), then dispatches `fetchPokemonsSuccess` and auto-selects the first item.

2. **Detail phase** — When a pokemon is selected, `PokemonForm` independently fetches full details from the pokemon's own URL (random 800–1200 ms delay) using React Hook Form's async `defaultValues` callback. This is entirely outside Redux.

```
App mount → dispatch fetchPokemonsStart
  → Saga → requestPokemons (PokeAPI list)
    → dispatch fetchPokemonsSuccess + setSelectedPokemon
      → PokemonList renders items; PokemonForm fetches detail on selection
```

### Redux state shape

```typescript
{
  pokemons: {
    items: Pokemon[],
    selectedPokemon: Pokemon | null,
    loading: boolean,
    error: unknown
  }
}
```

Key actions: `fetchPokemonsStart`, `fetchPokemonsSuccess`, `fetchPokemonsFailure`, `setSelectedPokemon`.
Selectors live in `src/redux/reducers/pokemons.ts`: `isLoading`, `getPokemons`, `getPokemonNames`, `getSelectedPokemon`, `getSelectedPokemonIndex`.

### Key source directories

| Path | Purpose |
|---|---|
| `src/redux/` | Store config, root saga, saga handlers, API request functions, reducers |
| `src/components/` | Feature components (`PokemonList`, `PokemonForm`, `SelectedPokemon`) |
| `src/ui/` | Layout shells (`Layout`, `Header`, `Footer`) |
| `src/lib/` | Data transformer (`create-pokemon.ts`) and `PokemonType.ts` |
| `src/types/` | Redux state type definitions |

### Styling

All styles use MUI's `styled()` CSS-in-JS API. No separate CSS files. `FormComponent.Styled.ts` in `src/components/RHF/` holds shared styled wrappers.

### Keyboard navigation

`PokemonList` implements full keyboard accessibility: arrow-key navigation between items, ref-based focus management, and auto-selection on focus. Preserve this when modifying the list.

### Unused / stub code

`PokemonCard.tsx`, `PokemonTabs.tsx`, `Fab/AddPokemon.tsx`, and `RangeSlider/` exist but are not wired into `App.tsx`. `pokenode-ts` is imported for TypeScript types only; actual API calls use native `fetch`.