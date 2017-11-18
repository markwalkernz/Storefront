# Storefront
Coding Boot Camp Week 12 homework. MySQL database with a Node.js user interface.

The application uses a MySQL database to hold an inventory of stock. A customer can query the inventory, then place an order. The inventory is reduced by the number of items that the customer orders.

The application requires the following node packages:

- 'mysql' for connection to My SQL database
- 'inquirer' for user prompts
- 'easy-table' for table formatting in the command line interface 


Run 'node bamazon.js' to use the app.


The database is in MySQL and is created using bamazonSchema.sql. There is seed data stored in bamazonSeedData.sql.

bamazon.js provides the entry point to the application via inquirer prompts. If the user wants to place an order, a new customer object is created based on the constructor script in bamazonCustomer.js.


Customer Functions

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

Manager Functions

bamazonManager.js provides the following features;

- connection to the MySQL database
- a start menu using inquirer
- displayProductTable function which uses easy table to display the inventory and the current order in table format
- functions which allow the manager to
	- view all products in inventory
	- view products that are low in stock
	- add stock to exisitng products
	- add a new product
