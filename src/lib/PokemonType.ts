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

export type Pokemon = PokemonAbstract & {
    avatar: string | null
    experience: number
    forms?:PokemonForm[]
    height: number
    name: string
    species?: PokemonSpecies[]
    spriteFrames: string[]
    stats?: PokemonStat[]
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