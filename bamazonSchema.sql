DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
	item_id int not null auto_increment,
	product_name varchar(100),
    department_name varchar(100),
    price decimal(10,2),
    stock_quantity int,
    PRIMARY KEY (item_id)
);

SELECT * FROM products;