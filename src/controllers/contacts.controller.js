export default {
    // TODO: Uncomment if want to use Direct external API calls
    // async index(req, res){
    //     let user = await UserModel.findById(req.params['userId']);
    //
    //     let service = new ContactsService();
    //     service.setUser(user);
    //     service.loadContacts()
    //         .then((data) => {
    //             res.json({
    //                 data
    //             })
    //         })
    //         .catch(() => {
    //             res.json({
    //                 error: true
    //             })
    //         })
    // },
    //
    // async createContact(req, res){
    //     let user = await UserModel.findById(req.params['userId']);
    //
    //     let service = new ContactsService();
    //     service.setUser(user);
    //     service.createContact()
    //         .then((data) => {
    //             res.json({
    //                 data
    //             })
    //         })
    //         .catch((data) => {
    //             res.json({
    //                 error: true,
    //                 data
    //             });
    //         });
    // },
    //
    // async getSingleContact(req, res){
    //     let user = await UserModel.findById(req.params['userId']);
    //
    //     let service = new ContactsService();
    //     service.setUser(user);
    //     service.getContact(req.params['contactId'])
    //         .then((data) => {
    //             res.json({
    //                 data
    //             })
    //         })
    //         .catch((data) => {
    //             res.json({
    //                 error: true,
    //                 data
    //             });
    //         });
    // },
    //
    // async deleteContact(req, res){
    //     let user = await UserModel.findById(req.params['userId']);
    //     let service = new ContactsService();
    //     service.setUser(user);
    //     service.deleteContact(req.params['contactId'])
    //         .then((data) => {
    //             res.json({
    //                 data
    //             })
    //         })
    //         .catch((data) => {
    //             res.json({
    //                 error: true,
    //                 data
    //             });
    //         });
    // },

    async getUserContacts(req, res){
        let user = await UserModel.findById(req.params['userId'], ['contacts']);
        res.json({
            contacts: user.contacts
        });
    },

    async createContact(req, res) {
        let user = await UserModel.findById(req.params['userId']);
        let params = req.body;

        user.contacts.push({
            name: params['name'],
            email: params['email'],
            phone: params['phone']
        });

        await user.save();

        res.json({
            status: 'created'
        });
    },

    async updateContact(req, res){
        let user = await UserModel.findById(req.params['userId']);
        let params = req.body;

        let contact = user.contacts.id(req.params['contactId']);
        contact.set(params);

        await user.save();
        res.json({
            status: 'updated',
            contact
        });
    },

    async deleteContact(req, res){
        let user = await UserModel.findById(req.params['userId']);
        user.contacts.id(req.params['contactId']).remove();
        await user.save();
        res.json({
            status: 'deleted'
        });
    },

    async importContactsFromGoogle(req, res){
        let user = await UserModel.findById(req.params['userId']);

        let service = new ContactsService();
        service.setUser(user);
        let contacts = await service.loadContacts();
        let mapped = { };

        contacts.forEach(c => {
            mapped[c.id[0]] = {
                googleRef: c.id[0],
                name: c.name ? c.name[0] : 'Unnamed',
                phone: c.phone ? c.phone.map(p => p.uri) : [],
                email: c.email ? c.email.map(e => e.address) : []
            };
        });

        user.contacts.forEach(contact => {
            if(contact.googleRef){
                if(mapped.hasOwnProperty(contact.googleRef)){
                    contact.set(mapped[contact.googleRef]);
                    delete mapped[contact.googleRef];
                }else{
                    contact.remove();
                }
            }
        });

        for(let i in mapped){
            user.contacts.push(mapped[i]);
        }

        await user.save();

        res.json({
            contacts: user.contacts
        });
    }
};