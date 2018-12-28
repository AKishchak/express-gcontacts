import {parseString} from "xml2js";
import request from "request";
import fs from 'fs';
import path from 'path';

export default class ContactsService {

    constructor() {
        this.client = GoogleService.createOAuthClient();
    }

    setUser(user){
        this.user = user;
        this.client.setCredentials({
            access_token: user.token,
            refresh_token: user.refreshToken
        });
        this.client.on('tokens', (tokens) => {
            if (tokens.refresh_token) {
                this.user.refresh_token = tokens.refresh_token;
            }
            this.user.token = tokens.access_token;
            this.user.save();
        });
    }

    loadContacts(){
        return new Promise((resolve, reject) => {
            this.client.request({
                url: "https://www.google.com/m8/feeds/contacts/default/full"
            })
            .then((result) => {
                parseString(result.data, (err, result) => {
                    this._loadNextPage(result, this._extractContacts(result))
                        .then(resolve)
                        .catch(reject)
                });
            })
            .catch((err) => {
                reject(err);
            })
        });
    }

    _loadByLink(link, contacts){
        return this.client.request({
            url: link
        })
        .then((result) => {
            return new Promise((resolve) => {
                parseString(result.data, (err, result) => {
                    this._loadNextPage(result, contacts.concat(this._extractContacts(result)))
                        .then(resolve)
                });
            });
        });
    }

    _loadNextPage(result, accumulator){
        return new Promise((resolve) => {
            let link = null;

            if(result.feed && result.feed.link){
                result.feed.link.forEach(l => {
                    if(l['$'] && l['$']['rel'] === 'next'){
                        link = l['$']['href'];
                    }
                });
            }

            if(link){
                this._loadByLink(link, accumulator).then(resolve);
            }
            else {
                return resolve(accumulator);
            }
        });
    }

    _extractContacts(contacts){
        let result = [];
        contacts.feed.entry.forEach((contact) => {
            let name = null, email = null, phone = null;
            if(contact.title && contact.title.length > 0 && contact.title[0]['_']){
                name = contact.title.map(obj => obj['_']);
            }

            if(contact['gd:email']){
                email = contact['gd:email'].map(obj => obj['$']);
            }

            if(contact['gd:phoneNumber']){
                phone = contact['gd:phoneNumber'].map(obj => obj['$']);
            }

            result.push({
                id: contact.id,
                name,
                email,
                phone
            });
        });

        return result;
    }

    createContact(){
        return new Promise((resolve, reject) => {
            let file = fs.readFileSync(path.resolve(__dirname, './create.parent.xml')).toString();

            let token = this.client.credentials.access_token;
            request({
                method: 'POST',
                url: `https://www.google.com/m8/feeds/contacts/${this.user.email}/full?access_token=${token}`,
                body: file,
                headers: {
                    'content-type': 'application/atom+xml',
                    'GData-Version': '3.0'
                },
            }, (err, response, body) => {
                if(err) return reject(err);
                resolve(body);
            });
        });
    }

    getContact(id){
        return new Promise((resolve, reject) => {
            let token = this.client.credentials.access_token;
            request({
                method: 'GET',
                url: `https://www.google.com/m8/feeds/contacts/${this.user.email}/full/${id}?access_token=${token}`,
                headers: {
                    'GData-Version': '3.0'
                },
            }, (err, response, body) => {
                parseString(body, (err, result) => {
                    if(err) return reject(err);
                    resolve(result);
                });
            });
        });
    }

    deleteContact(id){
        return new Promise((resolve, reject) => {
            let token = this.client.credentials.access_token;
            this.getContact(id)
                .then(contact => {
                    request({
                        method: 'DELETE',
                        url: `https://www.google.com/m8/feeds/contacts/${this.user.email}/full/${id}?access_token=${token}`,

                        headers: {
                            'GData-Version': '3.0',
                            'If-Match': contact.entry['$']['gd:etag']
                        },
                    }, (err, response, body) => {
                        parseString(body, (err, result) => {
                            if(err) return reject(err);
                            resolve(result);
                        });
                    });
                });
        });
    }
}