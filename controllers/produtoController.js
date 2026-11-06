const Produto = require('../models/Produto');

const listarProdutos = async (req, res) => {

  try {

    const produtos = await Produto.findAll();

    return res.json(produtos);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      erro: 'Erro ao buscar produtos'
    });

  }

};

const buscarProduto = async (req, res) => {

  try {

    const produto = await Produto.findByPk(
      req.params.id
    );

    if (!produto) {

      return res.status(404).json({
        erro: 'Produto não encontrado'
      });

    }

    return res.json(produto);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      erro: 'Erro interno'
    });

  }

};

module.exports = {
  listarProdutos,
  buscarProduto
};