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
		  t.total('SubTotal')
		  t.newRow()
		});
		 
		console.log(t.toString());
	}; // end of displayCurrentOrder function

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

				// initialise variables
				var itemIdMatch = false;
				var sufficientStock = true;
				var orderItem = null;
				var newStockQuantity = 0;
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

							var subTotal = orderItem.price * orderItem.orderQuantity;
							orderItem.subTotal = subTotal;
							
							newStockQuantity = inventory[i].stock_quantity - answer.quantity;
						};
					};
				};

				// message to user if required
				if (!itemIdMatch) {
					console.log("Sorry, that product ID doesn't exist");
				}
				else {
					if (!sufficientStock) {
						console.log("Sorry, there is not enough stock to complete your order");
					}
				};

				// update inventory and current order status
				if(orderItem) {
					var queryString =	"UPDATE products " +
										"SET stock_quantity = " + newStockQuantity +
										" WHERE item_id = " + orderItem.item_id;

					// SQL query to update inventory
					connection.query(queryString, function (error, inventory) {

						if (error) throw error;

						// add order item to current order
						currentOrder.push(orderItem);
						displayCurrentOrder(currentOrder);

					});
				};

			}); // end of then function

		}); // end of connection.query

	}; // end of placeOrder method
};
// end of Customer constructor

var customer = new Customer();

customer.placeOrder(customer.currentOrder);