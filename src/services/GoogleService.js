import {google} from 'googleapis';

const GOOGLE_CONFIG = {
    clientId: process.env.GOOGLE_APP_CLIENT_ID,
    clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET,
    redirect: process.env.GOOGLE_APP_CLIENT_REDIRECT,
};


export default class GoogleService {
    createOAuthClient() {
        return new google.auth.OAuth2(
            GOOGLE_CONFIG.clientId,
            GOOGLE_CONFIG.clientSecret,
            GOOGLE_CONFIG.redirect
        );
    }

    getCredentials(){
        return GOOGLE_CONFIG;
    }
}