import AuthService from './AuthenticationService'
import GoogleService from './GoogleService';
import ContactsService from './contacts/ContactsService';

global.GoogleService = new GoogleService();
global.AuthService = new AuthService();
global.ContactsService = ContactsService;
