import {
    PokemonAbility,
    PokemonForm,
    PokemonMove,
    PokemonSpecies,
    PokemonSprites,
    PokemonStat,
    PokemonType
} from "pokenode-ts";

interface PokemonAbstract {
    id: number
    name: string
    order: number
}

// type PokemonSpeciesName = string
// type PokemonSpeciesUrl = string
// type PokemonSpecies = Record<PokemonSpeciesName, PokemonSpeciesUrl>
//
// type PokemonStatsName = string
// type PokemonStats = Record<PokemonStatsName, {
//     baseStat: number
//     effort: number
//     url: string
// }>
//
// type PokemonFormsName = string
// type PokemonFormsUrl = string
// type PokemonForms = Record<PokemonFormsName, PokemonFormsUrl>

export type PokemonAbilitySummary = {
    name: string
    isHidden: boolean
}

export type PokemonStatSummary = {
    name: string
    baseStat: number
    effort: number
}

export type PokemonMoveSummary = {
    name: string
    method: string
    level: number | null
}

// Not in pokenode-ts's PokemonSprites/etc. types (they're out of date
// relative to the live API), so hand-typed here.
export type PokemonCries = {
    latest: string
    legacy: string
}

export type Pokemon = PokemonAbstract & {
    abilities: PokemonAbilitySummary[]
    avatar: string | null
    cries: PokemonCries
    experience: number
    forms?:PokemonForm[]
    height: number
    moves: PokemonMoveSummary[]
    name: string
    species?: PokemonSpecies[]
    spriteFrames: string[]
    stats: PokemonStatSummary[]
    types: string[]
    weight: number
}

/**
 * ## Pokemon
 * Pokémon are the creatures that inhabit the world of the Pokémon games.
 * They can be caught using Pokéballs and trained by battling with other Pokémon.
 * Each Pokémon belongs to a specific species but may take on a variant
 * which makes it differ from other Pokémon of the same species, such as base stats, available abilities and typings.
 * - See [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_(species)) for greater detail.
 * - Also see [Pokemon Model](https://github.com/Gabb-c/pokenode-ts/blob/main/src/models/Pokemon/pokemon.ts)
 */
export type PokemonResponse = {
    abilities: PokemonAbility[]
    base_experience: number
    cries: PokemonCries
    forms: PokemonForm[]
    height: number
    id: number
    moves: PokemonMove[]
    name: string
    order: number
    species: PokemonSpecies[]
    sprites: PokemonSprites
    stats: PokemonStat[]
    types: PokemonType[]
    weight: number
}