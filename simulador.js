/**
 * Simulador de Orçamento - NexaWeb
 * Atualiza totais em tempo real e gera link para WhatsApp.
 */

(function () {
    const BASE_SETUP = 349.99;
    const BASE_MENSAL = 39.99;
    const PAGINA_EXTRA_VALOR = 150;

    const ADICIONAIS = {
        blog: { label: 'Blog / Notícias', valor: 90 },
        galeria: { label: 'Galeria de Fotos / Portfólio', valor: 60 },
        faq: { label: 'FAQ', valor: 40 },
        depoimentos: { label: 'Depoimentos de Clientes', valor: 50 },
        erp: { label: 'Integração Área do Cliente (ERP)', valor: 120 },
        seo: { label: 'SEO Avançado', valor: 100 }
    };

    // Número WhatsApp (altere para o número real da NexaWeb)
    const WHATSAPP_NUMERO = '5511997983481';

    const totalSetupEl = document.getElementById('totalSetup');
    const totalMensalEl = document.getElementById('totalMensal');
    const totalSetupFixoEl = document.getElementById('totalSetupFixo');
    const totalMensalFixoEl = document.getElementById('totalMensalFixo');
    const btnWhatsApp = document.getElementById('btnWhatsApp');
    const btnWhatsAppFixo = document.getElementById('btnWhatsAppFixo');
    const paginasExtrasEl = document.getElementById('paginas-extras');

    function formatarMoeda(valor) {
        return 'R$ ' + valor.toFixed(2).replace('.', ',');
    }

    function obterSelecionados() {
        const selecionados = [];
        document.querySelectorAll('.simulador-option input[type="checkbox"]').forEach(function (cb) {
            if (cb.checked && cb.name && ADICIONAIS[cb.name]) {
                selecionados.push({ name: cb.name, label: ADICIONAIS[cb.name].label, valor: ADICIONAIS[cb.name].valor });
            }
        });
        return selecionados;
    }

    function calcularTotais() {
        let setup = BASE_SETUP;
        let mensal = BASE_MENSAL;

        document.querySelectorAll('.simulador-option input[type="checkbox"]').forEach(function (cb) {
            if (cb.checked && cb.dataset.setup) {
                setup += parseFloat(cb.dataset.setup) || 0;
            }
            if (cb.checked && cb.dataset.mensal) {
                mensal += parseFloat(cb.dataset.mensal) || 0;
            }
        });

        const paginasExtras = paginasExtrasEl ? (parseInt(paginasExtrasEl.value, 10) || 0) : 0;
        setup += paginasExtras * PAGINA_EXTRA_VALOR;

        return { setup, mensal };
    }

    function atualizarResumo() {
        const { setup, mensal } = calcularTotais();

        if (totalSetupEl) totalSetupEl.textContent = formatarMoeda(setup);
        if (totalMensalEl) totalMensalEl.textContent = formatarMoeda(mensal);
        if (totalSetupFixoEl) totalSetupFixoEl.textContent = formatarMoeda(setup);
        if (totalMensalFixoEl) totalMensalFixoEl.textContent = formatarMoeda(mensal);

        atualizarLinkWhatsApp(setup, mensal);
    }

    function montarMensagemWhatsApp(setup, mensal) {
        const selecionados = obterSelecionados();
        const paginasExtras = paginasExtrasEl ? (parseInt(paginasExtrasEl.value, 10) || 0) : 0;

        let texto = 'Olá! Fiz uma simulação no site e escolhi:\n\n';
        texto += '• Pacote Base (Estrutura Essencial)\n';
        selecionados.forEach(function (item) {
            texto += '• ' + item.label + '\n';
        });
        if (paginasExtras > 0) {
            texto += '• ' + paginasExtras + ' página(s) extra(s)\n';
        }
        texto += '\n';
        texto += 'Total de Setup: ' + formatarMoeda(setup) + '\n';
        texto += 'Total Mensal: ' + formatarMoeda(mensal) + '\n\n';
        texto += 'Gostaria de fechar o projeto!';

        return encodeURIComponent(texto);
    }

    function atualizarLinkWhatsApp(setup, mensal) {
        const url = 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + montarMensagemWhatsApp(setup, mensal);
        if (btnWhatsApp) btnWhatsApp.href = url;
        if (btnWhatsAppFixo) btnWhatsAppFixo.href = url;
    }

    function init() {
        document.querySelectorAll('.simulador-option input[type="checkbox"]').forEach(function (cb) {
            cb.addEventListener('change', atualizarResumo);
        });

        if (paginasExtrasEl) {
            paginasExtrasEl.addEventListener('input', atualizarResumo);
            paginasExtrasEl.addEventListener('change', atualizarResumo);
        }

        atualizarResumo();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
