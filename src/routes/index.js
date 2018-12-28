import express from 'express';

import {
    HomeController,
    AuthController,
    UsersController,
    ContactsController
} from '../controllers';

export default {
    initialize(app){
        let router = express.Router();
        router.get('/', HomeController.index);
        router.get('/auth/google-accept', AuthController.oAuthAccept);

        // ======== REST API ===========
        router.get('/users', UsersController.getAllUsers);

        router.get('/users/:userId/contacts', ContactsController.getUserContacts);
        router.post('/users/:userId/contacts', ContactsController.createContact);
        router.post('/users/:userId/sync-contacts', ContactsController.importContactsFromGoogle);

        router.put('/users/:userId/contacts/:contactId', ContactsController.updateContact);
        router.delete('/users/:userId/contacts/:contactId', ContactsController.deleteContact);

        app.use(router);
    }
};
