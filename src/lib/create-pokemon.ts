import {PokemonMove} from "pokenode-ts";
import {Pokemon, PokemonMoveSummary, PokemonResponse} from "./PokemonType.ts";
import {getSpriteFrames} from "./sprite-frames.ts";

// A move can be relearned across many version groups (different games);
// collapse that down to one representative row per move rather than
// showing every per-game duplicate. Prefer the lowest level-up level
// (the "earliest" way to learn it); fall back to whatever method is
// listed first (machine/egg/tutor/etc, which have no meaningful level).
function summarizeMove({move, version_group_details}: PokemonMove): PokemonMoveSummary {
    const levelUpDetails = version_group_details.filter(({move_learn_method}) => move_learn_method.name === "level-up")
    if (levelUpDetails.length > 0) {
        const lowestLevel = Math.min(...levelUpDetails.map(({level_learned_at}) => level_learned_at))
        return {name: move.name, method: "level-up", level: lowestLevel}
    }
    return {name: move.name, method: version_group_details[0].move_learn_method.name, level: null}
}

function compareMoves(a: PokemonMoveSummary, b: PokemonMoveSummary) {
    if (a.method === "level-up" && b.method === "level-up") return (a.level ?? 0) - (b.level ?? 0)
    if (a.method === "level-up") return -1
    if (b.method === "level-up") return 1
    return a.name.localeCompare(b.name)
}

export default function createPokemon(data: PokemonResponse): Pokemon {
    return {
        id: data.id,
        name: data.name,
        order: data.order,
        avatar: data.sprites.front_default,
        experience: data.base_experience,
        height: data.height,
        weight: data.weight,
        spriteFrames: getSpriteFrames(data.sprites),
        cries: data.cries,
        types: [...data.types]
            .sort((a, b) => a.slot - b.slot)
            .map(({type}) => type.name),
        abilities: [...data.abilities]
            .sort((a, b) => a.slot - b.slot)
            .map(({ability, is_hidden}) => ({name: ability.name, isHidden: is_hidden})),
        stats: data.stats.map(({stat, base_stat, effort}) => ({name: stat.name, baseStat: base_stat, effort})),
        moves: data.moves.map(summarizeMove).sort(compareMoves)
    }
}
