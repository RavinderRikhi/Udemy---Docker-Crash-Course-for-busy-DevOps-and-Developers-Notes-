const { MongoClient } = require("mongodb");
const { isValid } = require("./utils");

const connect = async ({url='localhost', port='27017', db = '', log = console}) => {
    isValid({url, db});

    const mongoUrl = `mongodb://${url}:${port}`;
    var client;

    try {
        client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        log.debug(`Sucessfully connected to mongo: ${mongoUrl}`);
        const myDb = client.db(db);
        return myDb;
    } catch (err) {
        log.error('Error while connecting to mongo ', err);
        // if the client is connected then close the connection
        if(client){
            client.close();
        }
        throw err;
    }

};

const initMongo = async (mongoOptions) => {
    // connect to mongo using mongo options and return the active connection
    return await connect(mongoOptions);
};

module.exports = initMongo;