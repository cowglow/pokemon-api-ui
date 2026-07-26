const USER_NAME_KEY = "pokemon-user-name"
const USER_SKIPPED_KEY = "pokemon-user-skipped"

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

export function getStoredUserSkipped(): boolean {
    try {
        return window.localStorage.getItem(USER_SKIPPED_KEY) === "1"
    } catch {
        return false
    }
}

export function setStoredUserSkipped() {
    window.localStorage.setItem(USER_SKIPPED_KEY, "1")
}
