import {PropsWithChildren} from "react";
import Header, {AppView} from "./Header.tsx";
import {LayoutWrapper} from "../App.Styled.ts";

type LayoutProps = PropsWithChildren<{
    view: AppView
    onViewChange: (view: AppView) => void
}>

export default function Layout({children, view, onViewChange}: LayoutProps) {
    return (
        <LayoutWrapper>
            <header>
                <Header view={view} onViewChange={onViewChange}/>
            </header>
            <main>
                {children}
            </main>
        </LayoutWrapper>
    )
}
