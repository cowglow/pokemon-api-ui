import {useEffect, useLayoutEffect} from "react";
import {useDispatch} from "react-redux";
import {UseFormReset} from "react-hook-form";
import {Pokemon} from "../lib/PokemonType.ts";
import {
    fetchPokemonDetailStart,
    usePokemonDetailError,
    usePokemonDetailLoading,
    usePokemonDetails
} from "../redux/reducers/pokemons.ts";

export function usePokemonDetail(name: string, url: string, reset: UseFormReset<Partial<Pokemon>>) {
    const dispatch = useDispatch()
    const data = usePokemonDetails(name)
    const error = usePokemonDetailError(name)
    const dispatched = usePokemonDetailLoading(name)
    const loading = dispatched || (!data && !error)

    useEffect(() => {
        if (!data && !dispatched && !error) dispatch(fetchPokemonDetailStart({name, url}))
    }, [data, dispatched, error, dispatch, name, url])

    useLayoutEffect(() => {
        if (data) reset(data)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return {data, loading, error}
}
