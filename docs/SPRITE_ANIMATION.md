# Sprite Animation

A cosmetic effect on `PokemonForm`'s avatar: instead of a single static
sprite image, it cycles through every available sprite variant for the
selected Pokémon at a deliberately low fps, giving it a retro,
flipbook-style animation. Split out from
`docs/POKEMON_FORM_EXPANSION_PLAN.md` since it's a self-contained
cosmetic feature, not part of the data/form-expansion work tracked there.

## How the frame list is built

`lib/sprite-frames.ts`'s `getSpriteFrames(sprites)` combines two sources
from the PokeAPI response's `sprites` object into one deduplicated list:

- The base front/back/shiny(/female) sprites (8 possible fields, nulls
  filtered out).
- Every per-generation sprite variant under `sprites.versions`, found by
  recursively walking that nested version/game structure (games and
  their available fields differ per generation, so this is a generic
  walk rather than hand-enumerating every generation's shape).

The walk explicitly skips the `animated` key. Gen-V (`generation-v.
black-white.animated`) and `sprites.other.showdown` sprites are already
animated GIFs sourced from Pokémon Showdown's battle sprites - genuinely
different from a manually-stepped flipbook, and mixing an
already-looping GIF into a set of otherwise-static frames would look
inconsistent (it would just keep auto-playing while it happened to be
"the current frame").

`createPokemon` exposes the result as `Pokemon.spriteFrames: string[]`.

## How the animation plays

`components/useSpriteAnimation.ts`:

1. Preloads every frame image up front (`new Image()` + `onload`),
   so swapping the displayed frame doesn't flicker or show a
   broken-image pop-in the first time each URL is shown.
2. Once preloading finishes, steps through the frames on a plain
   `setInterval` at a configurable fps (3 by default).

`setInterval` was chosen over `requestAnimationFrame` deliberately - at
2-4fps the timing drift `rAF` avoids is imperceptible, and `setInterval`
is simpler. The low frame rate isn't a limitation to work around, it's
the effect itself.

`components/AnimatedSprite.tsx` is the presentational wrapper around
the hook (`image-rendering: pixelated`, for crisp sprite edges instead
of blurry upscaling), and is what actually replaced the old static
`<Image src={avatar}>` in `PokemonForm`.

## Frame sizes are wildly inconsistent

Combining base sprites with every generation's version sprites means
the frame list mixes genuinely different intrinsic image sizes -
modern sprites are 96x96, but plenty of older-generation ones are much
smaller (32x32, 40x40, etc). Left unconstrained, the `<img>` would
resize to each frame's native dimensions and visibly jump around on
every swap. `AnimatedSprite` takes a `size` prop (96 by default,
matching the loading `Skeleton`'s dimensions in `PokemonForm` so there's
no jump on the loading->loaded transition either) and fixes the
rendered `<img>`'s `width`/`height` to it with `object-fit: contain` -
the box never changes size, only the image scaled to fit within it
does, and `image-rendering: pixelated` keeps the smaller sprites crisp
rather than blurry when scaled up.

## A lint fix along the way

The hook originally reset `frameIndex`/`ready` with synchronous
`setState` calls at the top of an effect (when the `frames` prop
changed). `eslint-plugin-react-hooks` 7's `set-state-in-effect` rule
flags that pattern (it causes a cascading extra render). Fixed by using
React's recommended "adjust state during render" pattern instead:
compare the incoming `frames` array against a stored previous
reference, and call `setState` conditionally during render rather than
inside an effect body.

In practice this branch rarely triggers here - `SelectedPokemon`
already remounts `PokemonForm` per selection (`key={form-${name}}`), so
each animation normally starts fresh via a brand new hook instance
anyway. It's kept as a defensive guard in case `useSpriteAnimation`/
`AnimatedSprite` is ever reused somewhere without a remount-per-item
key.

## Verification

`npm run build`/`npm run lint` clean (aside from the pre-existing,
unrelated `_action` unused-var error). Playwright-tested: frames
genuinely advance over time at roughly the expected 3fps interval, and
rapid selection switching (8 arrow-key moves in quick succession) still
leaves the animation running cleanly afterward with zero console
errors.
