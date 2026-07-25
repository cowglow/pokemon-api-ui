import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {
    fetchPokemonDetailStart,
    usePokemonDetailError,
    usePokemonDetailLoading,
    usePokemonDetails
} from "../redux/reducers/pokemons.ts";

export function usePokemonDetail(name: string, url: string) {
    const dispatch = useDispatch()
    const data = usePokemonDetails(name)
    const error = usePokemonDetailError(name)
    const dispatched = usePokemonDetailLoading(name)
    const loading = dispatched || (!data && !error)

    useEffect(() => {
        if (!data && !dispatched && !error) dispatch(fetchPokemonDetailStart({name, url}))
    }, [data, dispatched, error, dispatch, name, url])

    return {data, loading, error}
}
