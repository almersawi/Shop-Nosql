const Product = require('../models/products');
const Order = require('../models/order');
exports.indexPage = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render('shop/index', {
            products: products, 
            pageTitle: "Main Page",
            hasProducts: products.length > 0,
            path: 'shop'
             });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.cartPage = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
        const products = user.cart.items;
        res.render('shop/cart', {
            pageTitle: 'My Cart',
            path: 'cart',
            products: products,
            hasProducts: products.length > 0
        });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product => {
        req.user.addToCart(product)
        .then(results => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.ordersPage = (req, res, next) => {
    Order.find({"user.userId": req.user._id})
    .then(orders => {
        res.render('shop/orders', {
            pageTitle: 'My Orders',
            path: 'orders',
            orders: orders,
            hasOrders: orders.length > 0
            });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getProducts = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render('shop/products-list', {
            products: products, 
            pageTitle: "My shop",
            hasProducts: products.length > 0,
            path: 'products'});
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        res.render('shop/product-details',{
            product: product,
            pageTitle: product.title,
            path: 'products'});
    })
    .catch(err => {
        console.log(err);
    });
}

exports.deleteFromCart = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
        const items = user.cart.items;
        const prodId = req.body.productId;
        const updatedProducts = [...items]
        const productIndex = items.findIndex(cp => {
            return cp._id = prodId;
        });
        updatedProducts.splice(productIndex, 1);
        user.cart.items = updatedProducts;
        return user.save();
    })
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => {
        console.log(err);
    });
}


exports.createOrder = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
        const products = user.cart.items.map(i => {
            return {quantity: i.quantity, product: { ...i.productId._doc } };
        })
        console.log()
        const order = new Order({
            user: {
                email: req.user.email,
                userId: req.user
            },
            products: products
        });
       return order.save();
    })
    .then(()=> {
        return req.user.clearCart();
    })
    .then(()=> {
        res.redirect('/orders');
    })
    .catch(err => {
        console.log(err);
    })
  }