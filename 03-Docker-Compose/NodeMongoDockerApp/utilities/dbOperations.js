const initMongo = require("./initMongo");
const { isValid } = require("./utils");

class DbOperations {
    
    constructor(mongoDbOptions={}) {

        const { url = '', port = '', dbName = '' } = mongoDbOptions;

        isValid({url,port,dbName});

        this.dbUrl = url;
        this.dbPort = port;
        this.dbName = dbName;
        this.connection;
        this.log = console;
    }

    async getConnection() {
        if (!this.isConnected()) {
            const mongoOptions = {url: this.dbUrl, port: this.dbPort, db: this.dbName};
            this.connection = await initMongo(mongoOptions);
        } else {
            this.log.debug(`Db is already connected @ ${this.getConnectionString()}`);
        }
        return this.connection;
    }

    async save({collectionName='', objectToBeSaved = []}) {

        isValid({collectionName, objectToBeSaved});

        const connection = await this.getConnection();
        const collection = connection.collection(collectionName);
        let result = await collection.insertMany(objectToBeSaved);
        if (result.insertedIds) {
            result = Object.keys(result.insertedIds).map(key => ({ 
                ...objectToBeSaved[key], 
                id: result.insertedIds[key]
            }));
        }  
        return result;
    }

    async find({collectionName='',query={}}) {
        
        isValid({collectionName, query});
        
        const connection = await this.getConnection();

        const collection = connection.collection(collectionName);
        const result = await collection.find(query).toArray();
        return result;
    }

    getConnectionString() {
        return `mongodb://${this.dbUrl}${this.dbPort.trim().length ? `:${this.dbPort}` : ''}/${this.dbName}`;
    }

    isConnected() {
        return !!this.connection;
    }

    // close() {
    //     if (this.isConnected()) {
    //         // close the connection if connection is active
    //         this.connection.close();
    //     }
    // }

}

module.exports = DbOperations;