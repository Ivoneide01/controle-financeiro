// Classe para gerenciar o controle financeiro
class ControleFinanceiro {
    constructor() {
        this.transacoes = this.carregarDados();
        this.inicializar();
    }

    // Inicializa os event listeners
    inicializar() {
        // Formulário de receita
        document.getElementById('form-receita').addEventListener('submit', (e) => {
            e.preventDefault();
            this.adicionarReceita();
        });

        // Formulário de despesa
        document.getElementById('form-despesa').addEventListener('submit', (e) => {
            e.preventDefault();
            this.adicionarDespesa();
        });

        // Botão limpar dados
        document.getElementById('limpar-dados').addEventListener('click', () => {
            this.limparDados();
        });

        // Definir data atual nos campos de data
        this.definirDataAtual();

        // Atualizar interface
        this.atualizarInterface();
    }

    // Define a data atual nos campos de data
    definirDataAtual() {
        const hoje = new Date().toISOString().split('T')[0];
        document.getElementById('data-receita').value = hoje;
        document.getElementById('data-despesa').value = hoje;
    }

    // Adiciona uma receita
    adicionarReceita() {
        const descricao = document.getElementById('desc-receita').value;
        const valor = parseFloat(document.getElementById('valor-receita').value);
        const data = document.getElementById('data-receita').value;

        if (descricao && valor > 0 && data) {
            const transacao = {
                id: Date.now(),
                tipo: 'receita',
                descricao: descricao,
                valor: valor,
                data: data
            };

            this.transacoes.push(transacao);
            this.salvarDados();
            this.atualizarInterface();
            this.limparFormulario('form-receita');
            this.definirDataAtual();
        }
    }

    // Adiciona uma despesa
    adicionarDespesa() {
        const descricao = document.getElementById('desc-despesa').value;
        const valor = parseFloat(document.getElementById('valor-despesa').value);
        const data = document.getElementById('data-despesa').value;

        if (descricao && valor > 0 && data) {
            const transacao = {
                id: Date.now(),
                tipo: 'despesa',
                descricao: descricao,
                valor: valor,
                data: data
            };

            this.transacoes.push(transacao);
            this.salvarDados();
            this.atualizarInterface();
            this.limparFormulario('form-despesa');
            this.definirDataAtual();
        }
    }

    // Limpa um formulário
    limparFormulario(formId) {
        document.getElementById(formId).reset();
    }

    // Calcula o total de receitas
    calcularTotalReceitas() {
        return this.transacoes
            .filter(t => t.tipo === 'receita')
            .reduce((total, t) => total + t.valor, 0);
    }

    // Calcula o total de despesas
    calcularTotalDespesas() {
        return this.transacoes
            .filter(t => t.tipo === 'despesa')
            .reduce((total, t) => total + t.valor, 0);
    }

    // Calcula o saldo total
    calcularSaldoTotal() {
        return this.calcularTotalReceitas() - this.calcularTotalDespesas();
    }

    // Formata valor para moeda brasileira
    formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    // Formata data para exibição
    formatarData(data) {
        return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
    }

    // Atualiza a interface com os dados atuais
    atualizarInterface() {
        this.atualizarResumo();
        this.atualizarListaTransacoes();
    }

    // Atualiza o resumo financeiro
    atualizarResumo() {
        const totalReceitas = this.calcularTotalReceitas();
        const totalDespesas = this.calcularTotalDespesas();
        const saldoTotal = this.calcularSaldoTotal();

        document.getElementById('receitas-total').textContent = this.formatarMoeda(totalReceitas);
        document.getElementById('despesas-total').textContent = this.formatarMoeda(totalDespesas);
        document.getElementById('saldo-total').textContent = this.formatarMoeda(saldoTotal);

        // Alterar cor do saldo baseado no valor
        const saldoElement = document.getElementById('saldo-total');
        const cardSaldo = saldoElement.closest('.card');
        
        if (saldoTotal >= 0) {
            cardSaldo.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        } else {
            cardSaldo.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
        }
    }

    // Atualiza a lista de transações
    atualizarListaTransacoes() {
        const lista = document.getElementById('lista-transacoes');
        
        if (this.transacoes.length === 0) {
            lista.innerHTML = '<p class="sem-transacoes">Nenhuma transação registrada ainda.</p>';
            return;
        }

        // Ordenar transações por data (mais recente primeiro)
        const transacoesOrdenadas = [...this.transacoes].sort((a, b) => {
            return new Date(b.data) - new Date(a.data);
        });

        lista.innerHTML = transacoesOrdenadas.map(transacao => {
            const tipoClass = transacao.tipo === 'receita' ? 'transacao-receita' : 'transacao-despesa';
            const valorClass = transacao.tipo === 'receita' ? 'valor-positivo' : 'valor-negativo';
            const sinal = transacao.tipo === 'receita' ? '+' : '-';
            
            return `
                <div class="transacao-item ${tipoClass}">
                    <div class="transacao-info">
                        <div class="transacao-desc">${transacao.descricao}</div>
                        <div class="transacao-data">${this.formatarData(transacao.data)}</div>
                    </div>
                    <div class="transacao-valor ${valorClass}">
                        ${sinal} ${this.formatarMoeda(transacao.valor)}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Limpa todos os dados
    limparDados() {
        if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
            this.transacoes = [];
            this.salvarDados();
            this.atualizarInterface();
        }
    }

    // Salva dados no localStorage
    salvarDados() {
        localStorage.setItem('controle-financeiro', JSON.stringify(this.transacoes));
    }

    // Carrega dados do localStorage
    carregarDados() {
        const dados = localStorage.getItem('controle-financeiro');
        return dados ? JSON.parse(dados) : [];
    }
}

// Inicializar a aplicação quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new ControleFinanceiro();
});

