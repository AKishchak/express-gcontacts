export default {
    index(req, res){
        res.render('index', { title: 'Simple Google Contacts integration', url: AuthService.getOAuthUrl() });
    }
};