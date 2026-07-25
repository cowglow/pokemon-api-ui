import {useDispatch, useSelector} from "react-redux";
import {fetchPokemonsStart, getPokemons} from "./redux/reducers/pokemons.ts";
import {useEffect} from "react";
import SelectedPokemon from "./components/SelectedPokemon.tsx";
// import AddPokemon from "./components/Fab/AddPokemon.tsx";
// import PokemonTabs from "./components/PokemonTabs.tsx";
import Layout from "./ui/Layout.tsx";
import {ContentWrapper} from "./App.Styled.ts";
import PokemonList from "./components/PokemonList.tsx";
import {useUrlSearchParam} from "./hooks/useUrlSearchParam.ts";

export default function App() {
    const dispatch = useDispatch()
    const pokemons = useSelector(getPokemons)
    const [selectedName, setSelectedName] = useUrlSearchParam("pokemon")
    const selectedPokemon = pokemons.find(({name}) => name === selectedName) ?? null

    useEffect(() => {
        dispatch(fetchPokemonsStart(200))
    }, [dispatch])

    useEffect(() => {
        if (pokemons.length === 0) return
        if (!pokemons.some(({name}) => name === selectedName)) setSelectedName(pokemons[0].name)
    }, [pokemons, selectedName, setSelectedName])


    // const onAddPokemon = () => {
    //     dispatch(fetchPokemonsStart(pokemons.length + 20))
    // }

    return (
        <Layout>
            <ContentWrapper>
                <PokemonList/>
                {/*<PokemonTabs/>*/}
                <SelectedPokemon pokemon={selectedPokemon}/>
                {/*<AddPokemon onClick={onAddPokemon}/>*/}
            </ContentWrapper>
        </Layout>
    );
}
