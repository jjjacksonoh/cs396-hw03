"use strict";

const resetDB = require("../config/scripts/populateDB")

const Companion = require("./schema/Companion");
const Doctor = require("./schema/Doctor");

const express = require("express");
const router = express.Router();


// completely resets your database.
// really bad idea irl, but useful for testing
router.route("/reset")
    .get((_req, res) => {
        resetDB(() => {
            res.status(200).send({
                message: "Data has been reset."
            });
        });
    });

router.route("/")
    .get((_req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running."
        });
    });
    
// ---------------------------------------------------
// Edit below this line
// ---------------------------------------------------
router.route("/doctors")
    .get((req, res) => {
        console.log("GET /doctors");

        // already implemented:
        Doctor.find({})
            .sort('ordering')
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /doctors");
        const newDoc = req.body;
            /*newDoc.doc_id = "d" + Date.now();*/
            Doctor.create(newDoc).save()
                .then(doc => {
                    res.status(201).send(doc);
                })
                .catch(err => {
                    res.status(500).send({
                        message: "wheres the data ???"
                    });
                })
    });

// optional:
router.route("/doctors/favorites")
    .get((req, res) => {
        console.log(`GET /doctors/favorites`);
        res.status(501).send();
    })
    .post((req, res) => {
        console.log(`POST /doctors/favorites`);
        res.status(501).send();
    });
    
router.route("/doctors/:id")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}`);
        const identity = req.params["id"];
        Doctor.findById(identity)
            .sort('ordering')
            .then(identity => {
                res.status(200).send(identity);
            })
            .catch(err => {
                res.status(404).send()
            })
    })
    .patch((req, res) => {
        console.log(`PATCH /doctors/${req.params.id}`);
        const identity = req.params["id"];
        let newDocInfo = req.body;
        Doctor.findOneAndUpdate( {_id: identity}, newDocInfo, {new: true})
            .then(doc => {
                res.status(200).send(doc);
            })
            .catch(err => {
                res.status(404).send();
            })
    })
    .delete((req, res) => {
        console.log(`DELETE /doctors/${req.params.id}`);
        const identity = req.params["id"]
        Doctor.findOneAndDelete({_id:identity})
            .then( () => {
                res.status(200).send()
            })
            .catch( err => {
                res.status(404).send()
            })
    });
    
router.route("/doctors/:id/companions")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/companions`);
        const identity = req.params["id"];
        Companion.find({ doctors: {$in: identity}})
            .sort('ordering')
            .then( companions => {
                res.status(200).send(companions);
            })
            .catch(err => {
                res.status(404).send();
            })
    });
    

router.route("/doctors/:id/goodparent")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/goodparent`);
        const identity = req.params["id"];
        let good = true;
        Companion.find({ doctors: {$in: identity}})
            .sort('ordering')
            .then( companions => {
                let i = 0
                while(i < companions.length - 1){
                    if(companions[i].alive == false){
                        good = false;
                    }
                    i++;
                }
                res.status(200).send(good);
            })
            .catch(err => {
                res.status(404).send();
            })
    });

// optional:
router.route("/doctors/favorites/:doctor_id")
    .delete((req, res) => {
        console.log(`DELETE /doctors/favorites/${req.params.doctor_id}`);
        res.status(501).send();
    });

router.route("/companions")
    .get((req, res) => {
        console.log("GET /companions");
        // already implemented:
        Companion.find({})
            .sort('ordering')
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /companions");
        const newComp = req.body
        Companion.create(newComp).save()
            .then(comp => {
                res.status(201).send(comp);
            })
            .catch(err => {
                res.status(500).send({
                    message: "not enough info :(("
                })
            })
    });

router.route("/companions/crossover")
    .get((req, res) => {
        console.log(`GET /companions/crossover`);
        Companion.find({doctors: {$not: {$size: 1}}})
            .sort('ordering')
            .then(companions => {
                res.status(200).send(companions);
            })
            .catch(err => {
                res.status(404).send();
            })
    });

// optional:
router.route("/companions/favorites")
    .get((req, res) => {
        console.log(`GET /companions/favorites`);
        res.status(501).send();
    })
    .post((req, res) => {
        console.log(`POST /companions/favorites`);
        res.status(501).send();
    })

router.route("/companions/:id")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}`);
        const identity = req.params["id"];
        Companion.findById(identity)
        .sort('ordering')
            .then(identity => {
                res.status(200).send(identity);
            })
            .catch(err => {
                res.status(404).send()
            })
    })
    .patch((req, res) => {
        console.log(`PATCH /companions/${req.params.id}`);
        const identity = req.params["id"];
        let newCompInfo = req.body;
        Companion.findOneAndUpdate( {_id: identity}, newCompInfo, {new: true})
            .then(comp => {
                res.status(200).send(comp);
            })
            .catch(err => {
                res.status(404).send();
            })
    })
    .delete((req, res) => {
        console.log(`DELETE /companions/${req.params.id}`);
        const identity = req.params["id"];
        Companion.findOneAndDelete({_id:identity})
            .then(() => {
                res.status(200).send()
            })
            .catch(err => {
                res.status(404).send()
            })
    });

router.route("/companions/:id/doctors")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/doctors`);
        const identity = req.params["id"];
        Companion.findById(identity)
            .sort('ordering')
            .then( identity => {
                return identity.doctors;
            })
            .then(doctorIds => {
                return Doctor.find({_id: {$in: doctorIds}})
            })
            .then(doctors => {
                res.status(201).send(doctors);
            })
            .catch(err => {
                res.status(404).send();
            })
    });

router.route("/companions/:id/friends")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/friends`);
        const identity = req.params["id"];
        Companion.findById(identity)
            .sort('ordering')
            .then(identity => {
                return identity.seasons;
            })
            .then(compSeasons => {
                return Companion.find({$and: [ {seasons: {$in: compSeasons}}, {_id: {$ne: identity}} ] })
            })
            .then(companions => {
                res.status(200).send(companions);
            })
            .catch(err => {
                res.status(404).send();
            })
    });

// optional:
router.route("/companions/favorites/:companion_id")
    .delete((req, res) => {
        console.log(`DELETE /companions/favorites/${req.params.companion_id}`);
        res.status(501).send();
    });

module.exports = router;