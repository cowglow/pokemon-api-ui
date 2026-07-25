import {useDispatch, useSelector} from "react-redux";
import {useMediaQuery, useTheme} from "@mui/material";
import {fetchPokemonsStart, getSelectedPokemon, setSelectedPokemon, usePokemonDetails} from "./redux/reducers/pokemons.ts";
import {hydrateCollection} from "./redux/reducers/collection.ts";
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
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const [view, setView] = useState<AppView>("pokemons")
    const selectedPokemon = useSelector(getSelectedPokemon)
    const selectedDetails = usePokemonDetails(selectedPokemon?.name ?? "")

    useEffect(() => {
        dispatch(fetchPokemonsStart(REQUEST_LIMIT_DEFAULT))
    }, [dispatch])

    useEffect(() => {
        dispatch(hydrateCollection(getStoredCollection()))
    }, [dispatch])

    const showDetail = !isMobile || Boolean(selectedPokemon)
    const showList = !isMobile || !selectedPokemon

    return (
        <Layout view={view} onViewChange={setView}>
            <ContentWrapper>
                {view === "pokemons" ? (
                    <>
                        {showList && <PokemonList/>}
                        {showDetail && (
                            <>
                                <SelectedPokemon
                                    pokemon={selectedPokemon}
                                    onBack={isMobile ? () => dispatch(setSelectedPokemon(null)) : undefined}
                                />
                                <AddToCollection pokemon={selectedDetails}/>
                            </>
                        )}
                    </>
                ) : (
                    <CollectionView/>
                )}
            </ContentWrapper>
        </Layout>
    );
}
