const HsCode = require('../models/HsCode');
const Calculo = require('../models/Calculo');
const sequelize = require('../db/database');
const { QueryTypes } = require('sequelize');

const calcularImportacao = async (req, res) => {

  try {

    const {
      valorMercadoria,
      frete,
      seguro,
      incoterm,
      hsCodigo,
      qtd,
      taxaCambio
    } = req.body;

    if (
      valorMercadoria == null ||
      isNaN(valorMercadoria) ||
      Number(valorMercadoria) <= 0
    ) {
      return res.status(400).json({ erro: 'Valor da mercadoria inválido' });
    }

    if (frete == null || isNaN(frete) || Number(frete) < 0) {
      return res.status(400).json({ erro: 'Frete inválido' });
    }

    if (seguro == null || isNaN(seguro) || Number(seguro) < 0) {
      return res.status(400).json({ erro: 'Seguro inválido' });
    }

    if (qtd == null || isNaN(qtd) || Number(qtd) <= 0) {
      return res.status(400).json({ erro: 'Quantidade inválida' });
    }

    if (taxaCambio == null || isNaN(taxaCambio) || Number(taxaCambio) <= 0) {
      return res.status(400).json({ erro: 'Taxa de câmbio inválida' });
    }

    const incotermsValidos = ['FOB', 'CIF', 'EXW'];
    if (!incotermsValidos.includes(incoterm)) {
      return res.status(400).json({ erro: 'Incoterm inválido' });
    }

    let baseCalculo;
    if (incoterm === 'CIF') {
      baseCalculo = Number(valorMercadoria);
    } else {
      baseCalculo = Number(valorMercadoria) + Number(frete) + Number(seguro);
    }

    let gaRate = 0.10;
    let iceRate = 0;

    if (hsCodigo && hsCodigo.trim() !== '') {
      const hsData = await HsCode.findOne({ where: { code: hsCodigo } });
      if (hsData) {
        gaRate = hsData.ga_rate / 100;
        iceRate = hsData.ice_rate / 100;
      }
    }

    const ga = baseCalculo * gaRate;
    const baseIva = baseCalculo + ga;
    const iva = baseIva * 0.1494;
    const ice = baseCalculo * iceRate;
    const taxaServico = baseCalculo * 0.005;

    const totalUSD = Number((baseCalculo + ga + iva + ice + taxaServico).toFixed(2));
    const totalBOB = Number((totalUSD * taxaCambio).toFixed(2));

    try {
      await Calculo.create({
        user_id: req.user.id,
        hs_code: hsCodigo || null,
        incoterm,
        valor_mercadoria: valorMercadoria,
        frete,
        seguro,
        total_usd: totalUSD,
        total_bob: totalBOB,
        taxa_cambio: taxaCambio,
      });
    } catch (err) {
      console.error('ERRO AO SALVAR:', err.message);
      return res.status(500).json({ erro: err.message });
    }

    return res.json({
      baseCalculo,
      ga: { valor: ga, aliquota: gaRate * 100 },
      iva: { valor: iva, aliquota: 1494 },
      ice: { valor: ice, aliquota: iceRate * 100 },
      taxaServico,
      totalUSD,
      totalBOB,
      custoUnitarioUSD: totalUSD / qtd,
      custoUnitarioBOB: totalBOB / qtd,
    });

  } catch (err) {
    console.error('ERRO INTERNO:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }

};

// Listar apenas os cálculos do usuário logado
const listarCalculos = async (req, res) => {
  try {
    const calculos = await sequelize.query(
      `SELECT *, TO_CHAR(created_at, 'DD/MM/YYYY') as data_formatada 
       FROM calculos 
       WHERE user_id = :userId 
       ORDER BY id DESC`,
      { replacements: { userId: req.user.id }, type: QueryTypes.SELECT }
    );
    return res.json(calculos);
  } catch (err) {
    console.error('ERRO AO BUSCAR CÁLCULOS:', err);
    return res.status(500).json({ erro: 'Erro ao buscar histórico' });
  }
};

// Excluir cálculo
const deletarCalculo = async (req, res) => {
  try {
    const calculo = await Calculo.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!calculo) {
      return res.status(404).json({ erro: 'Cálculo não encontrado' });
    }

    await calculo.destroy();
    return res.json({ mensagem: 'Cálculo excluído com sucesso' });

  } catch (err) {
    console.error('ERRO AO DELETAR:', err);
    return res.status(500).json({ erro: 'Erro ao excluir cálculo' });
  }
};

module.exports = {
  calcularImportacao,
  listarCalculos,
  deletarCalculo
};