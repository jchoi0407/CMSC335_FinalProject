const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
    response.render("index");
});

router.get("/inputPage", (request, response) => {
    response.render("inputPage");
});

module.exports = router;