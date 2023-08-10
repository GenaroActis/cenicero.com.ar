import React from 'react'
import { Link } from 'react-router-dom'

const SalesHistory = () => {
    return(
        <>
            <div className="d-flex justify-content-center m-4 p-4">
                <Link className="nav-link btn btn-primary p-4 text-white fs-4" aria-current="page" to={'/admin'}>Admin Menu</Link>
            </div>
        </>
    )
}

export default SalesHistory