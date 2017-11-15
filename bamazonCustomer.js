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

	// query the products table using a provided query string
	this.productQuery = function(queryString) {

		// pass the displayProductTable method to this method
		//var displayProductTable = this.displayProductTable;

		// connect to the database
		connection.connect(function(err) {
		if (err) throw err;
		console.log("connected as id " + connection.threadId + "\n");
		});
		
		// SQL query
		connection.query(queryString, function (error, result) {
	
			if (error) throw error;

			displayProductTable(result);

			connection.end();
		});

	}; // end of productQuery method

	// place an order
	this.placeOrder = function(currentOrder) {

		// connect to the database
		connection.connect(function(err) {
		if (err) throw err;
		console.log("connected as id " + connection.threadId + "\n");
		});
		
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

				var itemIdMatch = false;
				var sufficientStock = true;
				var inventoryLength = inventory.length;

				// loop through inventory
				for (var i = 0; i < inventoryLength; i++) {
					if (answer.itemID === inventory[i].item_id) {

						itemIdMatch = true;

						if (answer.quantity > inventory[i].stock_quantity) {
					
							sufficientStock = false;
						}
						else {
							orderItem = {
								item_id : inventory[i].item_id,
								product_name : inventory[i].product_name,
								department_name : inventory[i].department_name,
								price : inventory[i].price,
								orderQuantity : answer.quantity
							};
							
							currentOrder.push(orderItem);
							console.log(currentOrder);
						};
					};
				};

				// message to user
				if (!itemIdMatch) {
					console.log("Sorry, that product ID doesn't exist");
				}
				else {
					if (!sufficientStock) {
						console.log("Sorry, there is not enough stock to complete your order");
					}
					else {
						console.log("item has been added to order");
					};
				};
			});

			connection.end();
		});

	}; // end of placeOrder method


			// else update database and provide customer total cost
};
// end of Customer constructor

var customer = new Customer();

customer.placeOrder(customer.currentOrder);
