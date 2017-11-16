# Storefront
Coding Boot Camp Week 12 homework. MySQL database with a Node.js user interface.

The application requires the following node packages:

- mysql				connection to My SQL database
- inquirer			user prompts
- easy-table		table formatting in the command line interface 


Run bamazon.js to use the app.


The database is in MySQL and is created using bamazonSchema.sql. There is seed data stored in bamazonSeedData.sql.

bamazon.js provides the entry point to the application via inquirer prompts. If the user wants to place an order, a  new customer object is created based on the constructor script in bamazonCustomer.js.

bamazonCustomer.js provides a Customer construct with the following features;

- connection to the MySQL database
- an object called currentOrder which holds the order details for the customer
- displayProductTable and displayCurrentOrder functions which use easy table to display the inventory and the current order in table format
- the placeOrder function, which
	- queries the MySQL database to get the current inventory
	- uses inquirer to prompt the user for an item and quantity to order
	- checks that the item exists and is in stock, displaying a message to the user if not
	- updates the MySQL database by reducing stock quantity by the amount ordered
	- adds the ordered items to the customer.currentOrder object
	- if the user would like to place another order, uses recursion to call the placeOrder function again 

