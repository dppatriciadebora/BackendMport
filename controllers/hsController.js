const buscar = (req, res) => {
  res.json({ mensagem: 'buscar hs codes funcionando' });
};

const detalhe = (req, res) => {
  res.json({ mensagem: 'detalhe hs code funcionando' });
};

module.exports = { buscar, detalhe };