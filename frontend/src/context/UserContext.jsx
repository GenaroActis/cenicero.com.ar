import React, { createContext } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export const UserContext = createContext();

const UserProvider = ({children}) =>{

    const notifyRegisterError = () => toast.error('ya existe un usuario con ese email!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        content : 0,
        theme: "colored",
    });

    const notifyLoginError = () => toast.error('Correo o contraseña equivocada!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        content : 0,
        theme: "colored",
    });

    const notifyPasswordVeryShort= () => toast.error('la contraseña debe tener mas de 6 caracteres!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        content : 0,
        theme: "colored",
    });

    const notifyIsGithub= () => toast.error('este email fue registrado desde github!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        content : 0,
        theme: "colored",
    });

    const register = async (userData) =>{
        try {
            const response = await fetch(`http://localhost:8080/api/user/register`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                window.location.href = 'http://localhost:3000/'
                await response.json();
            } else {
                const error = await response.json()
                if(error.errors){
                    if(error.errors[0].msg === 'VeryShort'){
                        notifyPasswordVeryShort()
                    }
                    if(error.errors === 'EmailAlreadyRegistered'){
                        notifyRegisterError()
                    }
                } else{
                    throw new Error('Error en la solicitud');
                }
            }
        } catch (error) {
            console.log(error)
        };
    };

    const login = async (userEmail, userPassword) =>{
        try {
            const userData = {email: userEmail, password: userPassword}
            const response = await fetch(`http://localhost:8080/api/user/login`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                const res = await response.json()
                const token = res.accessToken
                localStorage.setItem('token', token);
                window.location.href = 'http://localhost:3000/products'
            } else {
                const error= await response.json()
                if(error.errors === 'isGithub') notifyIsGithub()
                else notifyLoginError();
            };
        } catch (error) {
            console.log(error)
        };
    };

    const registerGithub = async () =>{
        try {
            window.location.href = 'http://localhost:8080/api/user/register-github'
        } catch (error) {
            console.log(error)
        };
    };

    const logout = async () =>{
        try {
            const response = await fetch(`http://localhost:8080/api/user/logout`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                await response.json();
            } else {
                throw new Error('Error en la solicitud');
            }
        } catch (error) {
            console.log(error)
        };
    };

    return(
        <UserContext.Provider value={{ register, login, registerGithub, logout}}>
        {children}
        </UserContext.Provider>
    )
}



export default UserProvider;  