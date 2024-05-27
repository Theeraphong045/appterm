import { createContext, useContext, useEffect, useState } from 'react';
import { getUserData } from './actions/getUserData';
import { getSettingData } from './actions/getSettingData';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});
const SettingContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(undefined);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const data = await getUserData(token);
                setUser(data);
            } catch (error) {
                console.error(error);
                Cookies.remove('token', { path: '/' });
                setUser(undefined);
            }
        } else {
            setUser(undefined);
        }
        setLoading(false);
    };
    useEffect(() => {

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading, update_user: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export const AdminRoute = ({ children }) => {
    const router = useRouter();
    const { loading, isAuthenticated, user } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated || !user?.permission) {
                router.push('/');
            }
        }
    }, [loading, isAuthenticated, user, router]);

    if (loading || !isAuthenticated || !user?.permission) {
        return null;
    }

    return children;
};

export const SettingProvider = ({ children }) => {
    const [setting, setSetting] = useState({});

    useEffect(() => {
        const fetchSetting = async () => {
            try {
                const data = await getSettingData();
                setSetting(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSetting();
    }, []);

    return (
        <SettingContext.Provider value={{ setting, updateSetting: getSettingData }}>
            {children}
        </SettingContext.Provider>
    );
};

export const useSetting = () => useContext(SettingContext);
