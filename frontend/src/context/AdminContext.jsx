import React, { createContext } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminProvider = ({children}) =>{
    const notifyAddProdSuccessful = () => toast.success('Product added successfully!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        }
    )
    const notifyDeleteProdSuccessful = () => toast.success('Product deleted successfully!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        }
    )

    const ensureIsAdmin= async () =>{
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/admin`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                },
            });
            if (response.ok) {
                const res = await response.json()
                if(res.data === 'Authorized user') return res.data
            } else {
                window.location.href = 'http://localhost:3000/'
                throw new Error('Unauthorized user');
            }
        } catch (error) {
            console.log(error)
        };
    };

    const newProduct = async (prodData) =>{
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/products`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify(prodData),
            });
            if (response.ok) {
                const res = await response.json()
                if (res.data === 'the user does not have permission'){
                    window.location.href = 'http://localhost:3000/'
                } else{
                    notifyAddProdSuccessful()
                    return res.data
                }
            } else {
                throw new Error('Error en la solicitud');
            }
        } catch (error) {
            console.log(error)
        };
    };

    const deleteProduct = async (prodId) =>{
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/products/${prodId}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                },
            });
            if (response.ok) {
                await response.json();
                notifyDeleteProdSuccessful();
                setTimeout(()=>{window.location.reload()}, 2100 )
            } else {
                throw new Error('Error en la solicitud');
            }
        } catch (error) {
            console.log(error)
        };
    };

    const updateProduct = async (prodId, prodUpdated) =>{
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/products/${prodId}`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify(prodUpdated),
            });
            if (response.ok) {
                const res = await response.json();
                window.location.reload();
                return res.data
            } else {
                throw new Error('Error en la solicitud');
            }
        } catch (error) {
            console.log(error)
        };
    };

    const serchProduct = async (key, value) =>{
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/products/search/${key}/${value}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                },
            });
            if (response.ok) {
                await response.json();
            } else {
                window.location.href = 'http://localhost:3000/'
                throw new Error('Error en la solicitud');
            }
        } catch (error) {
            console.log(error)
        };
    };

    return(
        <AdminContext.Provider value={{ ensureIsAdmin, deleteProduct, newProduct, updateProduct, serchProduct,}}>
        {children}
        </AdminContext.Provider>
    )
}



export default AdminProvider;  