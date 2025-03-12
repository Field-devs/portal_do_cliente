// ToastContext.jsx
import { ReactNode, createContext, useContext } from 'react';
import { toast } from 'react-toastify';

const ToastContext = createContext({ showToast: (message: string) => { } });

export const ToastProvider = ({ children }: { children: ReactNode }) => {

    const showToast = (message: string) => {
        toast(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        console.log(message);
    };


    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    return useContext(ToastContext);
};