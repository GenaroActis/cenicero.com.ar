import React, { createContext } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminProvider = ({children}) =>{
    const generateNotifyError = (msg) => toast.error(msg, {
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
    const generateNotifySuccess = (msg) => toast.success(msg, {
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
    const ensureIsAdmin = async () =>{
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/admin/only`, {
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

    const ensureIsAdmOrPrem = async () =>{
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
                if(res.message === 'Success') return res.data
            } else { 
                await response.json()
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
                    generateNotifySuccess('Product added successfully!')
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
                generateNotifySuccess('Product deleted successfully!')
                setTimeout(()=>{window.location.reload()}, 2100 )
            } else {
                const error = await response.json();
                if(error.message === 'Unauthorized') generateNotifyError('You are not authorized to delete this product!')
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
                const error = await response.json();
                if(error.message === 'Unauthorized') generateNotifyError('You are not authorized to modify this product!')
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

    const getUsers = async (page, limit, key, value, sortField, sortOrder) =>{
        try{
            const token = localStorage.getItem('token');
            const url = `http://localhost:8080/api/admin/users/?${page ?? 'page=1'}&${limit ?? 'limit=5'}&${key}&${value}&${sortField ?? 'sortField=title'}&${sortOrder ?? 'sortOrder=asc'}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                },
            });
            if (response.ok) {
                const data = await response.json();
                return data.data
            } else {
                window.location.href = 'http://localhost:3000/'
                throw new Error('Error en la solicitud');
            }
        } catch (error) {
            console.log(error)
        };
    };
    
    const changeRole = async (userData) =>{
        try {
            const token = localStorage.getItem('token');
            let url = undefined
            if(userData.role === 'user') url = `http://localhost:8080/api/admin/toPremium/${userData.id}`
            if(userData.role === 'premium') url = `http://localhost:8080/api/admin/toUser/${userData.id}`
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                const res = await response.json();
                return res
            } else {
                const error = await response.json()
                console.log(error)
                throw new Error('Error en la solicitud');
                }
            }
        catch (error) {
            console.log(error)
        };
    };
    
    const getPurchases = async (page, limit, key, value, sortField, sortOrder) =>{
        try{
            const token = localStorage.getItem('token');
            const url = `http://localhost:8080/api/admin/all?${page ?? 'page=1'}&${limit ?? 'limit=5'}&${key}&${value}&${sortField ?? 'sortField=title'}&${sortOrder ?? 'sortOrder=asc'}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                },
            });
            if (response.ok) {
                const data = await response.json();
                return data.data
            } else {
                await response.json();
                window.location.href = 'http://localhost:3000/'
                throw new Error('Error en la solicitud');
            }
        } catch (error) {
            console.log(error)
        };
    };

    return(
        <AdminContext.Provider value={{getPurchases, changeRole, getUsers, ensureIsAdmOrPrem, ensureIsAdmin, deleteProduct, newProduct, updateProduct, serchProduct,}}>
        {children}
        </AdminContext.Provider>
    )
}



export default AdminProvider;  