var mysql = require("mysql");			// MySQL node package for database interaction
var inquirer = require("inquirer");		// Inquirer node package for user prompts
var Table = require("easy-table")		// Easy Table node package for table formatting


// database connection
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

// end of database connection


//Customer
var Customer = function() {

	// currentOrder is an array of the orders the customer places using the placeOrder method
	this.currentOrder = [];

	// display the result of a product query as a table using the easy-table package 
	var displayProductTable = function(result) {
		var t = new Table;
		 
		result.forEach(function(product) {
		  t.cell('ID', product.item_id)
		  t.cell('Description', product.product_name)
		  t.cell('Department', product.department_name)
		  t.cell('Price', product.price, Table.number(2))
		  t.cell('In Stock', product.stock_quantity, Table.number(0))
		  t.newRow()
		});
		 
		console.log(t.toString());

	}; // end of displayProductTable function

	// display the current order as a table using the easy-table package
	var displayCurrentOrder = function(customerOrder) {

		console.log("\nYour current order is:\r\n")

		var t = new Table;
		 
		customerOrder.forEach(function(product) {
		  t.cell('ID', product.item_id)
		  t.cell('Description', product.product_name)
		  t.cell('Department', product.department_name)
		  t.cell('Price', product.price, Table.number(2))
		  t.cell('Quantity', product.orderQuantity, Table.number(0))
		  t.cell('SubTotal', product.subTotal, Table.number(2))
		  t.total('SubTotal', {printer: Table.number(2)})
		  t.newRow()
		});
		 
		console.log(t.toString());
	}; // end of displayCurrentOrder function

	// place an order
	var placeOrder = function(currentOrder) {

		// SQL query to get current inventory
		connection.query("SELECT * FROM products", function (error, inventory) {
	
			if (error) throw error;

			displayProductTable(inventory);

			// user input
			inquirer
			.prompt(
				[{
				type: 'input',
				name: 'itemID',
				message: 'Enter the ID of the product you would like to purchase: ',
				filter: function(val) {return parseInt(val);}
				},
				{
				type: 'input',
				name: 'quantity',
				message: 'How many items would you like to purchase? ',
				filter: function(val) {return parseInt(val);}
				}]
				)
			.then(function(answer) {

				// initialise variables
				var itemIdMatch = false;				// check if user item matches inventory
				var sufficientStock = true;				// check if sufficient stock
				var orderItem = null;					// object containing an order for an item
				var newStockQuantity = 0;				// stock quantity after order is placed
				var inventoryLength = inventory.length;	// number of products in the inventory

				// loop through inventory
				for (var i = 0; i < inventoryLength; i++) {

					// check if user item matches inventory item
					if (answer.itemID === inventory[i].item_id) {

						itemIdMatch = true;

						// check if sufficient stock available
						if (answer.quantity > inventory[i].stock_quantity) {
					
							sufficientStock = false;
						}

						// if all OK, order item
						else {

							// an object representing an order for an item	
							orderItem = {
								item_id : inventory[i].item_id,
								product_name : inventory[i].product_name,
								department_name : inventory[i].department_name,
								price : inventory[i].price,
								orderQuantity : answer.quantity
							};

							// calculate subtotal for the order item
							var subTotal = orderItem.price * orderItem.orderQuantity;
							orderItem.subTotal = subTotal;
							
							// calculate stock quantity after order is placed
							newStockQuantity = inventory[i].stock_quantity - answer.quantity;
						};
					};
				};

				// display message to user if required
				if (!itemIdMatch) {
					console.log("Sorry, that product ID doesn't exist");
				}
				else {
					if (!sufficientStock) {
						console.log("Sorry, there is not enough stock to complete your order");
					}
				};

				// if there is a new order item,
				// update inventory and add order item to current order
				if(orderItem) {
					var queryString =	"UPDATE products " +
										"SET stock_quantity = " + newStockQuantity +
										" WHERE item_id = " + orderItem.item_id;

					// SQL query to update inventory
					connection.query(queryString, function (error, inventory) {

						if (error) throw error;
					});

					// add order item to current order
					currentOrder.push(orderItem);
				};

				// display the current order
				displayCurrentOrder(currentOrder);

				// see if user would like to add an item
				inquirer
				    .prompt({
				      name: "addItem",
				      type: "list",
				      message: "Would you like to add to your order?",
				      choices: ["Yes", "No"]
				    })
				    .then(function(answer) {

				    	if (answer.addItem == "No") {
				    		console.log("Thanks for visiting Bamazon!");
				    		connection.end();
				    	}
				    	else {
							placeOrder(currentOrder);    		
				    	};
				    });

			}); // end of then function

		}); // end of connection.query

	}; // end of placeOrder method

	this.placeOrder = placeOrder;
};
// end of Customer constructor

function start() {
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

    		// connect to the database
			connection.connect(function(err) {
			if (err) throw err;
			console.log("connected as id " + connection.threadId + "\n");
			});

    		var customer = new Customer();
			customer.placeOrder(customer.currentOrder);    		
    	};
    });
};

start();