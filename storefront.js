var mysql = require("mysql");         // MySQL node package for database interaction
var inquirer = require("inquirer");   // Inquirer node package for user prompts

// this script requires the customer constructor
var Customer = require("./bamazonCustomer.js");

// function to start the app
var start = function() {
  inquirer
    .prompt({
      name: "startOrder",
      type: "list",
      message: "Welcome to Bamazon, would you like to place an order?",
      choices: ["Yes", "No"]
    })
    .then(function(answer) {
    	if (answer.startOrder == "No") {
    		console.log("Thanks for visiting Bamazon!");
    	}
    	else {

        var customer = new Customer();
        customer.placeOrder(customer.currentOrder);    		
    	};
    });
};

// start the app
start();