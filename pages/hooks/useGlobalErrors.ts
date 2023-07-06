import { useEffect, useState } from "react";
import Snackbar from 'awesome-snackbar';
import { useRouter } from "next/router";
import Error from "../types/errorInterface";

const useGlobalErrorsHook = () => {
    const [errors, setErrors] = useState<Error>({
        message: '',
        type: ''
    });
    const router = useRouter();

    useEffect(() => {
        if (errors.message === 'Unauthorized!') {
            localStorage.removeItem('sessionStorage');

            new Snackbar('Please login!');

            setTimeout(() => {
                setErrors(prevErrors => ({ ...prevErrors, message: '', type: '' }));
            }, 3000);

            router.push('/login');
        } else {
            if (errors?.type === 'loading') {
                if (errors?.message !== '') {
                    new Snackbar(errors.message, { iconSrc: './loading-gif.gif', timeout: 1500 });
                }
            } else if (errors?.type === 'remove image') {
                new Snackbar(`Image has been removed!`, {
                    position: 'bottom-center',
                    timeout: 1500,
                    style: {
                        container: [
                            ['background-color', 'red'],
                            ['border-radius', '5px']
                        ]
                    }
                });

            } else if (errors?.type === 'logged') {
                new Snackbar(`Welcome, `, {
                    theme: 'dark',
                    position: 'top-center',
                    actionText: `${errors.message}! 😇`,
                });

            } else {
                if (errors?.message !== '') {
                    new Snackbar(errors.message);

                    setTimeout(() => {
                        setErrors(prevErrors => ({ ...prevErrors, message: '', type: '' }));
                    }, 3000);
                }
            }
        }
    }, [errors.message, errors.type]);

    return [errors, setErrors] as const;
}

export default useGlobalErrorsHook;