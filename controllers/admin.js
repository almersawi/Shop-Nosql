const Product = require('../models/products');

exports.getAddProduct = (req, res, next) => {
    const isLoggedin = req.session.isLoggedIn;
    const editMode = false;
    res.render('admin/edit-product', { pageTitle: 'Add product', path: 'admin/add-product', editing: editMode, isAuthenticated: isLoggedin});
};


exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });
    product.save()
    .then(results => {
        console.log('Saved!');
        res.redirect('/admin/products')
    })
    .catch(err => {
        console.log(err);
    });
};

exports.adminEditProducts = (req, res, next) => {
    const isLoggedin = req.session.isLoggedIn;
    const editMode = true;
    const productId = req.params.prodId;
    Product.findById(productId)
    .then(product => {
        const pageTitleContent = 'Edit Product | ' + product.title; 
        res.render('admin/edit-product', { pageTitle: pageTitleContent,editing: editMode, path: 'admin/edit-product', product: product,});
    })
    .catch(err => {
        console.log(err);
    });
}

exports.editProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const id = req.body.prodId;
    Product.findById(id)
    .then(product => {
        product.title = title;
        product.imageUrl = imageUrl;
        product.price = price;
        product.description = description;
        return product.save();
    })
    .then(result => {
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });
}

exports.adminProducts = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render('admin/products', {
            products: products,
            pageTitle: "Admin Products",
            hasProducts: products.length > 0,
            path: 'admin/products'
        });
    })
}

exports.deleteProduct = (req, res, next) => {
    const productId = req.body.prodId;
    Product.deleteOne({id: productId})
    .then(result => {
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });
}

