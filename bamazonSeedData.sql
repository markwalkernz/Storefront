USE bamazon;

INSERT INTO products (product_name, department_name,price,stock_quantity)
VALUES
	("Tickle Me Elmo","Toys",29.99,10),
    ("Hula Hoop","Toys",19.99,10),
    ("GoPro","Electronics",99.99,10),
    ("Turntable","Electronics",299.99,10),
    ("Headphones","Electronics",59.99,10),
    ("Rolex","Jewellery",1999.99,10),
    ("Diamond Ring","Jewellery",5999.99,10),
    ("George Foreman Grill","Appliances",59.99,10),
    ("Waffle Maker","Appliances",29.99,10),
    ("Rubiks Cube","Toys",9.99,10)
    ;

SELECT * FROM products;