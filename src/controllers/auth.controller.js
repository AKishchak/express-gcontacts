export default {
    async oAuthAccept(req, res){
        try{
            let user = AuthService.handleRedirectAndCreateUser(req.query['code']);
            res.render('authAccepted', { message: user.name });
        } catch (e) {
            res.render('authAccepted', { errors: 'Unable to retrieve the token' });
        }
    }
};