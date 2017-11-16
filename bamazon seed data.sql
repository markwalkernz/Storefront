USE bamazon;

INSERT INTO products (product_name, department_name,price,stock_quantity)
VALUES
	("Tickle Me Elmo","Toys",29.99,10),
    ("Hula Hoop","Toys",19.99,200),
    ("GoPro","Electronics",99.99,100),
    ("Turntable","Electronics",299.99,5),
    ("Headphones","Electronics",59.99,20),
    ("Rolex","Jewellery",1999.99,2),
    ("Diamond Ring","Jewellery",5999.99,2),
    ("George Foreman Grill","Appliances",59.99,200),
    ("Waffle Maker","Appliances",29.99,150),
    ("Rubiks Cube","Toys",9.99,2000)
    ;

SELECT * FROM products;