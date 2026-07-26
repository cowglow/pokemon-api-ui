export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// crypto.randomUUID() is only exposed in secure contexts (HTTPS/localhost) - fall back to a
// non-cryptographic v4-shaped id when testing over plain HTTP (e.g. a LAN dev server URL).
export function generateId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID()
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
        const random = Math.random() * 16 | 0
        const value = char === "x" ? random : (random & 0x3 | 0x8)
        return value.toString(16)
    })
}
