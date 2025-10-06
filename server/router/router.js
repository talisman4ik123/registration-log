const Router = require("express").Router;
const router = new Router();
const controller = require("../controller/controller");

router.post("/create", controller.createNote);
router.post("/currentNotes", controller.getCurrentNotes);
router.delete("/delete", controller.deleteNote);
router.patch("/complete", controller.completeNote);
router.patch("/update", controller.updateNote);

module.exports = router;