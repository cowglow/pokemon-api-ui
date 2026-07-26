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
    try {
        window.localStorage.setItem(USER_NAME_KEY, name)
    } catch (error) {
        console.warn("Failed to persist user name to localStorage", error)
    }
}

export function getStoredUserSkipped(): boolean {
    try {
        return window.localStorage.getItem(USER_SKIPPED_KEY) === "1"
    } catch {
        return false
    }
}

export function setStoredUserSkipped() {
    try {
        window.localStorage.setItem(USER_SKIPPED_KEY, "1")
    } catch (error) {
        console.warn("Failed to persist skipped onboarding to localStorage", error)
    }
}
