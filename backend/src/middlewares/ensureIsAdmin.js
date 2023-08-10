export const ensureIsAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        return next(); 
    }else{
        res.json({msg:'the user does not have permission'})
    }
}