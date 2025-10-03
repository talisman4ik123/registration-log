const Router = require("express").Router;
const router = new Router();
const controller = require("../controller/controller");

router.post("/create", controller.createNote);
router.post("/currentNotes", controller.getCurrentNotes);

module.exports = router;