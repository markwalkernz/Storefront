var mysql = require("mysql");         // MySQL node package for database interaction
var inquirer = require("inquirer");   // Inquirer node package for user prompts
var Table = require("easy-table")		// Easy Table node package for table formatting

// database connection details
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "",
  database: "bamazon"
});
// end of database connection details

// function to start the app
var start = function() {

	inquirer
    .prompt({
      name: "startMenu",
      type: "list",
      message: "What would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product","Exit"]
    })
    .then(function(answer) {

    	switch (answer.startMenu) {
		    case "View Products for Sale":
		        viewProducts();
		        break;
		    case "View Low Inventory":
		        lowInventory();
		        break;
		    case "Add to Inventory":
		    	addInventory();
		    	break;
		    case "Add New Product":
		    	addNewProduct();
		    	break;
		    case "Exit":
		    	connection.end();
		    	break;
		    default:
		        console.log("option not found")
		        break;
		}; // end of switch statement

	}); // end of inquirer prompt
};

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

// View products available for sale
var viewProducts = function () {

	// SQL query to get current inventory
	connection.query("SELECT * FROM products", function (error, inventory) {
	
		if (error) throw error;

		console.log("\nProducts for Sale\r\n");
		displayProductTable(inventory);

		start();
	});
}; // end of viewProducts function

// View Low Inventory
var lowInventory = function () {
	console.log("View Low Inventory");

	// SQL query to get current inventory
	connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (error, inventory) {
	
		if (error) throw error;

		console.log("\nLow Inventory\r\n");
		displayProductTable(inventory);

		start();
	});
}; // end of lowInventory function

// Add to Inventory
var addInventory = function () {

	console.log("\nAdd to Inventory\r\n");

	// SQL query to get current inventory
	connection.query("SELECT * FROM products", function (error, inventory) {
	
		if (error) throw error;

		console.log("\nProducts for Sale\r\n");
		displayProductTable(inventory);

		inquirer
	    .prompt(				
	    [{
		type: 'input',
		name: 'itemID',
		message: 'Enter the ID of the product you would like to restock: ',
		filter: function(val) {return parseInt(val);}
		},
		{
		type: 'input',
		name: 'quantity',
		message: 'How many items would you like to add to the inventory? ',
		filter: function(val) {return parseInt(val);}
		}]
		)
	    .then(function(answer) {

			// initialise variables
			var itemIdMatch = false;				// check if user item matches inventory
			var inventoryLength = inventory.length;	// number of products in the inventory

			// loop through inventory
			for (var i = 0; i < inventoryLength; i++) {

				// check if user item matches inventory item
				if (answer.itemID === inventory[i].item_id) {

					itemIdMatch = true;
				};
			};

			if (itemIdMatch) {
				var queryString =	"UPDATE products " +
									"SET stock_quantity = stock_quantity + " + answer.quantity +
									" WHERE item_id = " + answer.itemID;

				// SQL query to update inventory and display  message to user
				connection.query(queryString, function (error, inventory) {

					if (error) throw error;

			    	console.log("\nStock for item ID " + answer.itemID + " has been increased by " + answer.quantity +"\r\n");

			    	start();
				});
			}
			else {
				console.log("Sorry, that item ID was not found.")

				start();
			};
		});
	});
}; // end of addInventory function

// Add New Product
var addNewProduct = function () {
	console.log("Add New Product");

	start();
}; // end of newProduct function



// start the app
// connect to the database
connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId + "\n");

	// run the start function
	start();
});