import { setUser, setLoading, setError  } from "../state/auth.slice.js";
import { register, login, getMe } from "../service/auth.api.js";
import { useDispatch } from "react-redux";

export const useAuth = () => {

    const dispatch = useDispatch();

    async function handleRegister({ fullname, email, contact, password, isSeller = false }) {
        const data = await register({ fullname, email, contact, password, isSeller });
        dispatch(setUser(data.user));
        return data;
    }

    async function handleLogin({ email, password }) {
        const data = await login({ email, password });
        dispatch(setUser(data.user));
        return data;
    }

    async function handleGetMe() {
       try {

        dispatch(setLoading(true))
        const data = await getMe();
        dispatch(setUser(data.user));

       } catch (err) {
        
        console.log(err)
        
       } finally {

        dispatch(setLoading(false));

       }
    }

    return { handleRegister, handleLogin, handleGetMe };
}