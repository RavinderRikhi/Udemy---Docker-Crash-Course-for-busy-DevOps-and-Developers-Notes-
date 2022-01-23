const assert = require("assert");
const { expect } = require("chai");
const { ObjectId } = require("mongodb");
const { MongoMemoryServer } = require('mongodb-memory-server');
const LayoutController = require('../controllers/index');

describe("Testing APIs module", () => {

    let mongod;
    let dbName;
    let mongoUrl;
    let mongoPort;
    let appInstance;
    const collectionName = 'User';
    const firstname = "Ravinder";
    const lastname = "Rikhi";
    const email = "ravinder18rikhi@gmail.com";

    before(async function () {
        
        mongod = await MongoMemoryServer.create();
        const uri = await mongod.getUri();
        const [ _, __, mongoConnectionString, db ] = uri.split("/");
        [ mongoUrl, mongoPort ] = mongoConnectionString.split(":");
        [dbName] = db.split("?");
        
        const programOptions = {
            dbUrl: mongoUrl,
            dbPort: mongoPort,
            dbName: dbName
        };

        appInstance = new LayoutController(programOptions);
        
    });

    it("Testing save function", async function() {

        const req = {
            body: {
                firstname,
                lastname,
                email
            }
        };
        const callback = (_, result) => {
            const { status, data } = result;
            expect(status).to.equal(200);
            expect(data.length).to.equal(1);
            const [ savedInfo ] = data;
            const { firstname: savedFirstName, lastname: savedLastName, email: savedEmail } = savedInfo;
            expect(savedFirstName).to.equal(firstname);
            expect(savedLastName).to.equal(lastname);
            expect(savedEmail).to.equal(email);
            expect(ObjectId.isValid(savedInfo.id)).to.equal(true);
        };
        const res = {
            render: callback
        };
        await appInstance.save(req, res);
        // check mongo saved Data
        const savedData = await appInstance
            .db
            .connection
            .collection(collectionName)
            .find({firstname})
            .toArray();
        expect(savedData.length).to.equal(1);
    });

    it("Testing fetch API with no record matching with query", async function () {
        
        const requestNameToSaved = "Shruti";

        const req = {
            query: {
                firstname: requestNameToSaved
            }
        };

        const callback = (_, result) => {
            const { status, data } = result;
            expect(status).to.equal(200);
            expect(Array.isArray(data)).to.equal(true);;
            expect(data.length).to.equal(0);
        };
        const res = {
            render: callback
        };
        await appInstance.get(req, res);
    });

    it("Testing fetch API with record found with query", async function () {
        
        const requestNameToSaved = firstname;

        const req = {
            query: {
                firstname: requestNameToSaved
            }
        };

        const callback = (_, result) => {
            const { status, data } = result;
            expect(status).to.equal(200);
            expect(Array.isArray(data)).to.equal(true);
            const [ savedInfo ] = data;
            const { firstname: savedFirstName, lastname: savedLastName, email: savedEmail, _id } = savedInfo;
            expect(savedFirstName).to.equal(firstname);
            expect(savedLastName).to.equal(lastname);
            expect(savedEmail).to.equal(email);
            expect(ObjectId.isValid(_id)).to.equal(true);
        };
        const res = {
            render: callback
        };
        await appInstance.get(req, res);
    });

    after(async () => {
        await mongod.stop();
    });
});