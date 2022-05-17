import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut } from "firebase/auth"
import { app } from "./firebase"

export const login = (): Promise<never> => {
    // TODO: 言語設定などの設定変更
    const provider = new GoogleAuthProvider()
    const auth = getAuth(app)
    return signInWithRedirect(auth, provider)
};

export const logout = (): Promise<void> => {
    const auth = getAuth(app)
    return signOut(auth)
};
