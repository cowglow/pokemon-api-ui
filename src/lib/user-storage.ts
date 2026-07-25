const USER_NAME_KEY = "pokemon-user-name"

export function getStoredUserName(): string | null {
    try {
        return window.localStorage.getItem(USER_NAME_KEY)
    } catch {
        return null
    }
}

export function setStoredUserName(name: string) {
    window.localStorage.setItem(USER_NAME_KEY, name)
}
