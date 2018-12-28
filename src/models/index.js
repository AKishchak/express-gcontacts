import mongoose from 'mongoose'
import User from './user.model'

export default {
    initialize(){
        mongoose.connect(process.env.DB_CONNECTION_STRING, {
            useNewUrlParser: true
        });

        global['UserModel'] = mongoose.model('User', User);
    }
}




