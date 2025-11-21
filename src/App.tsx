import {useDispatch, useSelector} from "react-redux";
import {fetchPokemonsStart, getSelectedPokemon} from "./redux/reducers/pokemons.ts";
import {useEffect} from "react";
import SelectedPokemon from "./components/SelectedPokemon.tsx";
// import AddPokemon from "./components/Fab/AddPokemon.tsx";
// import PokemonTabs from "./components/PokemonTabs.tsx";
import Layout from "./ui/Layout.tsx";
import {ContentWrapper} from "./App.Styled.ts";
import PokemonList from "./components/PokemonList.tsx";

export default function App() {
    const dispatch = useDispatch()
    // const pokemons = useSelector(getPokemons)
    const selectedPokemon = useSelector(getSelectedPokemon)

    useEffect(() => {
        dispatch(fetchPokemonsStart(200))
    }, [dispatch])


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
