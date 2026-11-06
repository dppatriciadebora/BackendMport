const CodigoConvite = require('../models/CodigoConvite');
const Produto = require('../models/Produto');
const Pedido = require('../models/Pedido');
const sequelize = require('../db/database');
const { QueryTypes } = require('sequelize');

// Ativar conta de importador com código de convite
exports.ativarImportador = async (req, res) => {
  try {
    const { codigo } = req.body;
    const userId = req.user.id;

    const convite = await CodigoConvite.findOne({
      where: { codigo, usado: false }
    });

    if (!convite) {
      return res.status(400).json({ erro: 'Código inválido ou já utilizado' });
    }

    await convite.update({ usado: true, usado_por: userId });

    await sequelize.query(
      `UPDATE users SET role = 'importador' WHERE id = :userId`,
      { replacements: { userId }, type: QueryTypes.UPDATE }
    );

    return res.json({ mensagem: 'Conta de importador ativada com sucesso!' });

  } catch (err) {
    console.error('ERRO ativarImportador:', err);
    return res.status(500).json({ erro: 'Erro interno' });
  }
};

// Listar produtos do importador logado
exports.meusProdutos = async (req, res) => {
  try {
    const produtos = await sequelize.query(
      `SELECT * FROM produtos WHERE importador_id = :id ORDER BY id DESC`,
      { replacements: { id: req.user.id }, type: QueryTypes.SELECT }
    );
    return res.json(produtos);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao buscar produtos' });
  }
};

// Cadastrar produto
exports.cadastrarProduto = async (req, res) => {
  try {
    const {
      nome, marca, modelo, versao, tipo,
      ano, origem, fca_usd, fob_usd, preco_usd,
      descricao, foto_url
    } = req.body;

    await sequelize.query(
      `INSERT INTO produtos 
        (nome, marca, modelo, versao, tipo, ano, origem, fca_usd, fob_usd, preco_usd, descricao, foto_url, importador_id)
       VALUES 
        (:nome, :marca, :modelo, :versao, :tipo, :ano, :origem, :fca_usd, :fob_usd, :preco_usd, :descricao, :foto_url, :importador_id)`,
      {
        replacements: {
          nome, marca, modelo, versao, tipo, ano, origem,
          fca_usd, fob_usd, preco_usd, descricao, foto_url,
          importador_id: req.user.id
        },
        type: QueryTypes.INSERT
      }
    );

    return res.json({ mensagem: 'Produto cadastrado com sucesso!' });
  } catch (err) {
    console.error('ERRO cadastrarProduto:', err);
    return res.status(500).json({ erro: 'Erro ao cadastrar produto' });
  }
};

// Deletar produto
exports.deletarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    await sequelize.query(
      `DELETE FROM produtos WHERE id = :id AND importador_id = :importador_id`,
      { replacements: { id, importador_id: req.user.id }, type: QueryTypes.DELETE }
    );
    return res.json({ mensagem: 'Produto removido com sucesso!' });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao deletar produto' });
  }
};

// Listar pedidos recebidos pelo importador
exports.meusPedidos = async (req, res) => {
  try {
    const pedidos = await sequelize.query(
      `SELECT p.*, pr.nome as produto_nome, u.name as cliente_nome, u.email as cliente_email
       FROM pedidos p
       JOIN produtos pr ON p.produto_id = pr.id
       JOIN users u ON p.cliente_id = u.id
       WHERE p.importador_id = :id
       ORDER BY p.id DESC`,
      { replacements: { id: req.user.id }, type: QueryTypes.SELECT }
    );
    return res.json(pedidos);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao buscar pedidos' });
  }
};

// Atualizar status do pedido
exports.atualizarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await sequelize.query(
      `UPDATE pedidos SET status = :status WHERE id = :id AND importador_id = :importador_id`,
      { replacements: { status, id, importador_id: req.user.id }, type: QueryTypes.UPDATE }
    );
    return res.json({ mensagem: 'Pedido atualizado!' });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao atualizar pedido' });
  }
};