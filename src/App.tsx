import {useDispatch, useSelector} from "react-redux";
import {fetchPokemonsStart, getSelectedPokemon, usePokemonDetails} from "./redux/reducers/pokemons.ts";
import {addToCollection, hydrateCollection, useIsInCollection} from "./redux/reducers/collection.ts";
import {getStoredCollection} from "./lib/collection-storage.ts";
import {useEffect, useState} from "react";
import SelectedPokemon from "./components/SelectedPokemon.tsx";
import AddToCollection from "./components/Fab/AddToCollection.tsx";
import CollectionView from "./components/CollectionView.tsx";
// import PokemonTabs from "./components/PokemonTabs.tsx";
import Layout from "./ui/Layout.tsx";
import {AppView} from "./ui/Header.tsx";
import {ContentWrapper} from "./App.Styled.ts";
import PokemonList from "./components/PokemonList.tsx";
import {REQUEST_LIMIT_DEFAULT} from "./lib/constants.ts";

export default function App() {
    const dispatch = useDispatch()
    const [view, setView] = useState<AppView>("pokemons")
    const selectedPokemon = useSelector(getSelectedPokemon)
    const selectedDetails = usePokemonDetails(selectedPokemon?.name ?? "")
    const alreadyInCollection = useIsInCollection(selectedPokemon?.name ?? "")

    useEffect(() => {
        dispatch(fetchPokemonsStart(REQUEST_LIMIT_DEFAULT))
    }, [dispatch])

    useEffect(() => {
        dispatch(hydrateCollection(getStoredCollection()))
    }, [dispatch])

    const onAddToCollection = () => {
        if (selectedDetails) dispatch(addToCollection(selectedDetails))
    }

    return (
        <Layout view={view} onViewChange={setView}>
            <ContentWrapper>
                {view === "pokemons" ? (
                    <>
                        <PokemonList/>
                        <SelectedPokemon pokemon={selectedPokemon}/>
                        <AddToCollection onClick={onAddToCollection} disabled={!selectedDetails || alreadyInCollection}/>
                    </>
                ) : (
                    <CollectionView/>
                )}
            </ContentWrapper>
        </Layout>
    );
}
