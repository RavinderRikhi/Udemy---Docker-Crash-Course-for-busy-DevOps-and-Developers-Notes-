const express = require("express");
const { Command } = require("commander");

const LayoutController = require('./controllers/index');

const program = new Command();

program
    .option('--app-port <app-port>', 'Port to run the app on', '8080')
    .option('--db-url <db-url>', 'Url on which the db is running', 'localhost')
    .option('--db-port <db-port>', 'Port number on which the db is runnning', '27017')
    .option('--db-name <db-name>', 'Name of the data base')

program.parse(process.argv);

const options = program.opts();

const layoutControllerObj = new LayoutController(options);

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

const router = express.Router();

router.post("/data", async (req, res) => { await layoutControllerObj.save(req, res) });
router.get("/data", async (req, res) => { await layoutControllerObj.get(req, res) });
router.get('/', (req, res) => res.render("layout",{message: null, data: []}));

app.use('/', router);

const port = options.appPort;
app.listen(parseInt(port, 10), console.info(`Node server started listening on port ${port}`));