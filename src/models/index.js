import mongoose from 'mongoose'
import User from './user.model'

export default {
    initialize(){
        mongoose.connect('mongodb://root:root@localhost:27017/crud?authSource=admin', {
            useNewUrlParser: true
        });

        global['UserModel'] = mongoose.model('User', User);
    }
}




