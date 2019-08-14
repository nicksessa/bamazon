create database bamazon;
use bamazon;

create table products (
	item_id int not null auto_increment primary key,
    product_name varchar(100) not null,
    department_name varchar(50),
    price decimal(10,4),
    stock_quantity int
);

insert into products (product_name, department_name, price, stock_quantity)
values ("The Brothers Karamazov", "books", 26.59, 400),
("The Divine Comedy", "books", 22.50, 500),
("The Crusades", "books", 28.67, 200),
("The Summa Theologica", "books", 187.38, 100),
("The Nicomachean Ethics", "books", 14.95, 150),
("History of the Second World War", "books", 44.99, 80),
("The Last Superstition", "books", 34.00, 100),
("The Lord of the Rings", "books", 35.99, 300),
("Columbus - The Four Voyages", "books", 13.95, 100),
("Against Heresies", "books", 22.95, 50),
("Dracula", "books", 17.95, 300),
("Frankenstein", "books", 12.95, 300),
("Robin Hood", "books", 17.95, 200),
("The Three Musketeers", "books", 20.00, 200),
("The Making of Europe", "books", 22.95, 50),
("Lego X-Wing", "toys & games", 59.95, 200),
("Lego Tie Fighter", "toys & games", 59.95, 200),
("Wings of Glory - WWII", "toys & games", 53.95, 30),
("Tiger Tank - Revelle", "toys & games", 22.50, 30),
("P51 Mustang - Revelle", "toys & games", 19.50, 50),
("P38 Lightning - Revelle", "toys & games", 22.50, 45),
("F4U Corsair - Revelle", "toys & games", 20.95, 30),
("P40 Warhawk - Testors", "toys & games", 14.25, 25);


select * from products;


select 
  b.department_id, 
  a.department_name, 
  b.over_head_costs, 
  sum(a.product_sales) as product_sales,
  sum(a.product_sales - b.over_head_costs) as total_profit
from
  products a
inner join departments b on a.department_name = b.department_name
group by a.department_name;


ALTER TABLE products
ADD product_sales decimal(10,4);

create table departments(
department_id int not null auto_increment primary key,
department_name varchar(40) not null,
over_head_costs decimal(10,4)
);

insert into departments(department_name, over_head_costs)
values("books", 1000),
("toys & games", 20000);


select * from departments;

update products set product_sales = 1000 where product_name = "The Divine Comedy";
-- update products set product_sales = 1000 where product_sales = null;
select * from products;

select * from products where product_name != "The Divine Comedy";
update products set product_sales = 1000 where product_name != "The Divine Comedy";
