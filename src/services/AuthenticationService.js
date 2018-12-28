import {google} from 'googleapis';

const SCOPES = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/contacts'
];

export default class AuthenticationService {

    getOAuthUrl() {
        const auth = GoogleService.createOAuthClient();
        return auth.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
            prompt: 'consent'
        });
    }

    async handleRedirectAndCreateUser(code){
        const auth = GoogleService.createOAuthClient();
        let {tokens} = await auth.getToken(code);
        console.log("TOKEN RECEIVED >>>>>>>");
        console.log(tokens);
        auth.setCredentials(tokens);

        const plus = google.plus({version: 'v1', auth});

        let plusUser = await plus.people.get({ userId: 'me' });
        plusUser = plusUser.data;

        if(plusUser){
            let localUser = await UserModel.findOne({
                googleId: plusUser.id
            });

            const payload = {
                name: plusUser['displayName'],
                email: plusUser.emails[0].value,
                googleId: plusUser.id,
                image: plusUser.image.url,
                token: tokens.access_token,
                refreshToken: tokens.refresh_token,
            };

            if(localUser){
                localUser = await localUser.update(payload);
            }else{
                localUser = await UserModel.create(payload);
            }

            return localUser;
        }
    }
}