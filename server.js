const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const TravelPlan = require("./model/TravelPlan.js");
const router = require("./routes/router.js");

require("dotenv").config({ path: path.resolve(__dirname, "credentials/.env") });

const portNumber = process.env.PORT;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));


main();

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING); 

    app.listen(portNumber);
    console.log(`Web server started and running at http://localhost:${portNumber}`);
    // process.stdin.write(prompt);
    // process.stdin.on("readable", async function () {
    //     const dataInput = process.stdin.read();
    //     if (dataInput !== null) {
    //         const command = dataInput.trim();
    //         if (command === "stop") {
    //             process.stdout.write("Shutting down the server\n");
    //             mongoose.disconnect();
    //             process.exit(0);
    //         }
    //     }
    // });
    app.use("/", router);
    app.post("/reviewPage", async (request, response) => {
        const {
            name,
            email,
            date,
            departure,
            destination,
            budgetAmount,
            budgetCurrency,
            desCurrency,
            flightCost,
            hotelCost,
            otherCost,
        } = request.body;

        const totalCost = Number(flightCost) + Number(hotelCost) + Number(otherCost); 

        const apiKey = process.env.EXCHANGE_RATE_API_KEY;
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${budgetCurrency}/${desCurrency}/${totalCost}`;
        const apiResponse = await fetch(url); 
        const data = await apiResponse.json(); 
        const convertedTotal = data.conversion_result; 
        const conversionRate = data.conversion_rate;

        const difference = Number(budgetAmount) - totalCost; 
        const status = difference >= 0 ? `Under budget by ${difference}` : `Over budget by ${Math.abs(difference)}`; 

        const variables = { 
            name: name, 
            email: email, 
            date: date,
            from: departure,
            destination: destination,
            budgetAmount: budgetAmount,
            budgetCurrency: budgetCurrency,
            desCurrency: desCurrency,
            flightCost: flightCost,
            hotelCost: hotelCost,
            otherCost: otherCost,
            totalCost: totalCost,
            convertedTotal: convertedTotal,
            conversionRate: conversionRate,
            status: status,
        }; 

        const plan = new TravelPlan({ 
            name: name, 
            email: email, 
            date: date,
            from: departure,
            destination: destination,
            budgetAmount: budgetAmount,
            budgetCurrency: budgetCurrency,
            desCurrency: desCurrency,
            flightCost: flightCost,
            hotelCost: hotelCost,
            otherCost: otherCost,
            totalCost: totalCost,
            convertedTotal: convertedTotal,
            conversionRate: conversionRate,
            status: status,
            createdAt: new Date()
        }); 
        await plan.save(); 

        response.render("reviewPage", variables); 
    });

    app.get("/lookupPage", (request, response) => {
      response.render("lookupPage", {error: ""});
    });

    app.post("/processLookup", async (request, response) => { 
        const email = request.body.email; 
        const filter = {email: email}; 
        const plan = await TravelPlan.findOne(filter); 

         if (!plan) {
           response.render("lookupPage", {error: "Error: No plan found for this email."});
           return;
         }

        const variables = {
            name: plan.name,
            email: plan.email,
            date: plan.date,
            from: plan.from,
            destination: plan.destination,
            budgetAmount: plan.budgetAmount,
            budgetCurrency: plan.budgetCurrency,
            desCurrency: plan.desCurrency,
            flightCost: plan.flightCost,
            hotelCost: plan.hotelCost,
            otherCost: plan.otherCost,
            totalCost: plan.totalCost,
            convertedTotal: plan.convertedTotal,
            conversionRate: plan.conversionRate,
            status: plan.status,
        }; 

        response.render("processLookup", variables); 
    }); 

    app.post("/deletePlan", async (request, response) => {
        await TravelPlan.findOneAndDelete({ email: request.body.email });
        response.redirect("/");
    });

  } catch (e) {
    console.error(e);
  }
}