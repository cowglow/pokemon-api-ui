import {useCallback, useSyncExternalStore} from "react";

const URL_SEARCH_PARAM_CHANGE = "url-search-param-change";

function subscribe(callback: () => void) {
    window.addEventListener("popstate", callback)
    window.addEventListener(URL_SEARCH_PARAM_CHANGE, callback)
    return () => {
        window.removeEventListener("popstate", callback)
        window.removeEventListener(URL_SEARCH_PARAM_CHANGE, callback)
    }
}

export function useUrlSearchParam(key: string) {
    const value = useSyncExternalStore(subscribe, () =>
        new URLSearchParams(window.location.search).get(key)
    )

    const setValue = useCallback((next: string | null) => {
        const url = new URL(window.location.href)
        if (next) url.searchParams.set(key, next)
        else url.searchParams.delete(key)
        window.history.replaceState(null, "", url)
        window.dispatchEvent(new Event(URL_SEARCH_PARAM_CHANGE))
    }, [key])

    return [value, setValue] as const
}
