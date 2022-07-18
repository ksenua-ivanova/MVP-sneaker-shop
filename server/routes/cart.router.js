const router = require('express').Router();

const { Cart, SizesOfProduct, Product } = require('../db/models');

router.route('/')
// .get(async (req, res) => {
//   try {
//     const userOrders = await Cart.findAll({
//       where: { userId: Number(req.params.id), status: 'active' },
//       include: [Product, SizesOfProduct],
//     });
//     if (userOrders.length > 0) {
//       return res.json({ message: 'sucsess', userOrders });
//     } return res.json({ message: 'noOrders' });
//   } catch (error) {
//     return res.json({ message: 'error', error: error.message });
//   }
// })

  .post(async (req, res) => {
    try {
      const order = req.body.cartProducts;
      // const UserId = req.body.User.id;
      order.forEach(async (el) => {
        const needProduct = await SizesOfProduct.findOne({
          where:
          { sizeNumber: el.size, productId: el.product },
        });
        await needProduct.decrement('itemsLeft', { by: el.numberOfItems });
        await Cart.create({
          userId: 1,
          productId: el.product,
          sizeId: needProduct.id,
          numberOfItems: el.numberOfItems,
          status: 'activ',
        });
      });
      return res.status(202).json({ message: 'sucsess' });
    } catch (error) {
      return res.json({ message: 'error', error: error.message });
    }
  });

module.exports = router;
