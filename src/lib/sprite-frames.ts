import {PokemonSprites} from "pokenode-ts";

const SKIP_KEYS = new Set(["animated"]);

function collectUrls(node: unknown): string[] {
    if (typeof node === "string") return [node]
    if (node && typeof node === "object") {
        return Object.entries(node as Record<string, unknown>)
            .filter(([key]) => !SKIP_KEYS.has(key))
            .flatMap(([, value]) => collectUrls(value))
    }
    return []
}

/**
 * Combines the base front/back/shiny sprites with every per-generation
 * sprite variant into one deduplicated list, for use as animation frames.
 * Excludes the "animated" gen-V/showdown GIFs, which are already-animated
 * images rather than static frames.
 */
export function getSpriteFrames(sprites: PokemonSprites): string[] {
    const baseFrames = [
        sprites.front_default,
        sprites.front_shiny,
        sprites.front_female,
        sprites.front_shiny_female,
        sprites.back_default,
        sprites.back_shiny,
        sprites.back_female,
        sprites.back_shiny_female,
    ].filter((url): url is string => Boolean(url))

    const versionFrames = collectUrls(sprites.versions)

    return Array.from(new Set([...baseFrames, ...versionFrames]))
}
