import {useDispatch} from "react-redux";
import {Navigate, Outlet, Route, Routes} from "react-router-dom";
import {useEffect} from "react";
import {fetchPokemonsStart} from "./redux/reducers/pokemons.ts";
import {hydrateCollection} from "./redux/reducers/collection.ts";
import {getStoredCollection} from "./lib/collection-storage.ts";
import {hydrateSkipped, hydrateUserName} from "./redux/reducers/user.ts";
import {getStoredUserName, getStoredUserSkipped} from "./lib/user-storage.ts";
import PokemonsPage from "./pages/PokemonsPage.tsx";
import CollectionPage from "./pages/CollectionPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import Layout from "./ui/Layout.tsx";
import {ContentWrapper} from "./App.Styled.ts";
import {REQUEST_LIMIT_DEFAULT} from "./lib/constants.ts";

function AppShell() {
    return (
        <Layout>
            <ContentWrapper>
                <Outlet/>
            </ContentWrapper>
        </Layout>
    )
}

export default function App() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchPokemonsStart(REQUEST_LIMIT_DEFAULT))
    }, [dispatch])

    useEffect(() => {
        dispatch(hydrateCollection(getStoredCollection()))
    }, [dispatch])

    useEffect(() => {
        dispatch(hydrateUserName(getStoredUserName()))
    }, [dispatch])

    useEffect(() => {
        dispatch(hydrateSkipped(getStoredUserSkipped()))
    }, [dispatch])

    return (
        <Routes>
            <Route element={<AppShell/>}>
                <Route index element={<PokemonsPage/>}/>
                <Route path="collection" element={<CollectionPage/>}/>
                <Route path="settings" element={<SettingsPage/>}/>
            </Route>
            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    );
}
