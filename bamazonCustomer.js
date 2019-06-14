// Then create a Node application called `bamazonCustomer.js`. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "gginsberg",
    database: "bamazon"
});

// run the start function after the connection is made to prompt the user
start();


// 6. The app should then prompt users with two messages.

//    * The first should ask them the ID of the product they would like to buy.




function start() {

    // connect to the mysql server and sql database
    connection.connect(function (err) {
        if (err) throw err;

        connection.query("SELECT * FROM products", function (err, result) {
            if (err) throw err;
            console.log(result);
        });

    });


    inquirer
        .prompt([{
                name: "item",
                type: "input",
                message: "What is the item you would like to select?"
            },
            {
                name: "stock",
                type: "input",
                message: "How many would you like to purchase?"
            }
        ])
        .then(function (answer) {

            var queryStr = 'SELECT * FROM products WHERE ?';

            connection.query(queryStr, {
                item_id: item
            }, function (err, data) {
                if (err) throw err;
            });

            console.log(data);

            var item = answer.item_id;
            var quantity = answer.stock_quantity;

            console.log(queryStr);

            var productData = queryStr;

            if (quantity <= productData.stock_quantity) {
                console.log('Congratulations, the product you requested is in stock! Placing order!');

                // Construct the updating query string
                var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
                // console.log('updateQueryStr = ' + updateQueryStr);

                // Update the inventory
                connection.query(updateQueryStr, function (err, productData) {
                    if (err) throw err;

                    console.log('Your oder has been placed! Your total is $' + productData.price * quantity);
                    console.log('Thank you for shopping with us!');
                    console.log("\n---------------------------------------------------------------------\n");

                    // End the database connection
                    connection.end();
                })


            }
        });
};




// 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

//    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.