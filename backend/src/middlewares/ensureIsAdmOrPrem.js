export const ensureIsAdmOrPrem = (req, res, next) => {
    const userRole = req.user.role
    if(userRole === "admin"  || userRole === "premium" )  {
        return next(); 
    }else{
        res.json({msg:'the user does not have permission'})
    }
}