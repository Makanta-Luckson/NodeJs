module.exports = {
    ensureAthenticated : function(req, res, next) {
         if (req.isAuthenticated()) { 
             return next()
         }
         req.flash('error_msg', 'Please login first to view this resource')
            res.redirect('/user/login');
    }
}