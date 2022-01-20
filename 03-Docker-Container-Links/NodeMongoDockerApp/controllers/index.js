const DbOperations = require("../utilities/dbOperations");
const { isValid } = require("../utilities/utils");

// const myDbOperations = DbOperations({url, port, dbName});
class LayoutController {
    
    constructor(options) {
        const { dbUrl, dbPort, dbName } = options;
        isValid({dbUrl, dbPort, dbName});
        // initialize db 
        this.db = new DbOperations({url: dbUrl, port: dbPort, dbName});
    }

    async save(req, res) {
        const { body, log = console } = req;
        const { firstname, lastname, email } = body;
        let result;
        let message = 'Successfully saved used info.';
        try {
            result = await this.db.save({collectionName: 'User', objectToBeSaved: [{firstname, lastname, email}]});
            log.info(message);
        } catch (err) {
            message = 'Error while saving user records';
            log.error(message, err);
            message += '. Please try again after sometime.';
        } finally {
            res.render("layout",{
                status: !!result ? 200: 500,
                message,
                data: result
            });
        }
        
    };

    async get(req, res) {
        const { query, log = console } = req;
        const { firstname } = query;
        let result;
        let message;
        try {
            result = await this.db.find({collectionName: 'User', query: {firstname}});
            message = !result.length ? 'Users not found.' : null;
            log.info(message);
        } catch (err) {
            message = 'Error while fetching user records';
            log.error(message, err);
            message += '. Please try again after sometime.';
        } finally {
            res.render("layout",{
                status: !!result ? 200: 500,
                message,
                data: result
            });
        }
        
    }

}

module.exports = LayoutController;