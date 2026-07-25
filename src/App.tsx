import {useDispatch, useSelector} from "react-redux";
import {fetchPokemonsStart, getSelectedPokemon, resetPokemonDetails} from "./redux/reducers/pokemons.ts";
import {useEffect} from "react";
import SelectedPokemon from "./components/SelectedPokemon.tsx";
import ResetCache from "./components/Fab/ResetCache.tsx";
// import PokemonTabs from "./components/PokemonTabs.tsx";
import Layout from "./ui/Layout.tsx";
import {ContentWrapper} from "./App.Styled.ts";
import PokemonList from "./components/PokemonList.tsx";

export default function App() {
    const dispatch = useDispatch()
    const selectedPokemon = useSelector(getSelectedPokemon)

    useEffect(() => {
        dispatch(fetchPokemonsStart(200))
    }, [dispatch])

    const onResetCache = () => {
        dispatch(resetPokemonDetails())
    }

    return (
        <Layout>
            <ContentWrapper>
                <PokemonList/>
                {/*<PokemonTabs/>*/}
                <SelectedPokemon pokemon={selectedPokemon}/>
                <ResetCache onClick={onResetCache}/>
            </ContentWrapper>
        </Layout>
    );
}
