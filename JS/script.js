document.addEventListener('DOMContentLoaded', function () {
    // Atualiza o ano no footer
    document.getElementById('ano-atual').textContent = new Date().getFullYear();

    // ==================== MAPEAMENTO DE LETRAS ====================
    const mapeamentoLetras = {
        linhas: {
            'S01': 'A', 'S03': 'B', 'S05': 'C', 'S08': 'D', 'S10': 'E',
            'S11': 'F', 'S12': 'G', 'S14': 'H', 'D11': 'K', 'D12': 'L',
            'A01': 'M', 'A02': 'T', 'A03': 'O', 'A04': 'P', 'A07': 'S',
            'A06': 'X', 'A08': 'Z'
        },
        meses: {
            1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E', 6: 'F',
            7: 'G', 8: 'H', 9: 'I', 10: 'J', 11: 'K', 12: 'L'
        },
        anos: {
            2021: 'E', 2022: 'F', 2023: 'G', 2024: 'H', 2025: 'I',
            2026: 'J', 2027: 'K', 2028: 'L', 2029: 'M', 2030: 'N',
            2031: 'O', 2032: 'P', 2033: 'Q', 2034: 'R', 2035: 'S'
        }
    };

    // ==================== NAVEGAÇÃO ====================
    function setupNavigation() {
        function updateActiveMenu() {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const scrollPosition = window.scrollY + 100;
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    if (history.pushState) history.pushState(null, null, this.getAttribute('href'));
                }
            });
        });

        window.addEventListener('scroll', updateActiveMenu);
        updateActiveMenu();
    }
    setupNavigation();

    // ==================== FUNÇÕES AUXILIARES ====================
    function validarNumero(valor, nome) {
        if (isNaN(valor) || valor < 0) throw new Error(`${nome} deve ser um número válido e não negativo.`);
    }

    function formatarNumero(num) {
        return num.toFixed(2).replace('.', ',');
    }

    function mostrarAlerta(tipo, titulo, mensagem) {
        const alertaDiv = document.createElement('div');
        alertaDiv.className = `alert alert-${tipo} mt-3`;
        alertaDiv.innerHTML = `
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
            <strong>${titulo}:</strong> ${mensagem}
        `;
        return alertaDiv;
    }

    function getDiasNoMes(ano, mes) {
        return new Date(ano, mes, 0).getDate();
    }

    // ==================== TARA ====================
    document.querySelectorAll('input[name="qtdAmostras"]').forEach(radio => {
        radio.addEventListener('change', function () {
            const show10 = this.id === '10amostras';
            document.getElementById('10amostrasFields').classList.toggle('d-none', !show10);
            for (let i = 6; i <= 10; i++) {
                const input = document.getElementById(`tara${i}`);
                input.required = show10;
                if (!show10) input.value = '';
            }
        });
    });

    const taraForm = document.getElementById('taraForm');
    if (taraForm) {
        taraForm.addEventListener('submit', function (e) {
            e.preventDefault();
            try {
                const use10 = document.getElementById('10amostras').checked;
                const numAmostras = use10 ? 10 : 5;
                const taraValues = [];

                for (let i = 1; i <= numAmostras; i++) {
                    const valor = parseFloat(document.getElementById(`tara${i}`).value);
                    validarNumero(valor, `Tara Amostra ${i}`);
                    taraValues.push(valor);
                }

                const somaTara = taraValues.reduce((a, b) => a + b, 0);
                const mediaTara = somaTara / numAmostras;
                const melhorTara = taraValues.reduce((prev, curr) =>
                    Math.abs(curr - mediaTara) < Math.abs(prev - mediaTara) ? curr : prev
                );
                const variancia = taraValues.reduce((acc, curr) => acc + Math.pow(curr - mediaTara, 2), 0) / numAmostras;
                const desvioPadrao = Math.sqrt(variancia);

                const resultadoDiv = document.getElementById('resultadoTara');
                const detailsDiv = document.getElementById('taraDetails');
                const recomendacaoDiv = document.getElementById('taraRecomendacao');

                detailsDiv.innerHTML = `
                    <div class="mb-3">
                        <strong>Número de Amostras:</strong> ${numAmostras}<br>
                        <strong>Desvio Padrão:</strong> ${formatarNumero(desvioPadrao)} kg
                    </div>
                    <table class="result-table">
                        <thead>
                            <tr>
                                <th>Amostra</th>
                                <th>Peso (kg)</th>
                                <th>Diferença da Média</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${taraValues.map((tara, index) => {
                    const diferenca = tara - mediaTara;
                    const isRecomendada = tara === melhorTara;
                    return `
                                    <tr ${isRecomendada ? 'class="table-success"' : ''}>
                                        <td>Tara ${index + 1}</td>
                                        <td>${formatarNumero(tara)}</td>
                                        <td>${diferenca >= 0 ? '+' : ''}${formatarNumero(diferenca)}</td>
                                        <td>${isRecomendada ? '<i class="fas fa-star text-warning"></i> Recomendada' : ''}</td>
                                    </tr>
                                `;
                }).join('')}
                            <tr class="table-active">
                                <td><strong>Total</strong></td>
                                <td><strong>${formatarNumero(somaTara)}</strong></td>
                                <td></td><td></td>
                            </tr>
                            <tr class="table-active">
                                <td><strong>Média</strong></td>
                                <td><strong>${formatarNumero(mediaTara)}</strong></td>
                                <td></td><td></td>
                            </tr>
                        </tbody>
                    </table>
                `;

                const indiceTara = taraValues.indexOf(melhorTara) + 1;
                const qualidade = desvioPadrao < 0.01 ? 'Excelente' : desvioPadrao < 0.03 ? 'Boa' : 'Precisa melhorar';
                recomendacaoDiv.innerHTML = `
                    <i class="fas fa-lightbulb me-2"></i>
                    <strong>Recomendação:</strong> Utilize a Tara ${indiceTara} (${formatarNumero(melhorTara)} kg) como referência.<br>
                    <strong>Qualidade das amostras:</strong> ${qualidade} (Desvio: ${formatarNumero(desvioPadrao)} kg)
                `;

                resultadoDiv.classList.remove('d-none');
                resultadoDiv.classList.add('fade-in');
                resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            } catch (error) {
                alert(`Erro: ${error.message}`);
            }
        });
    }

    // ==================== PESO ====================
    const pesoForm = document.getElementById('pesoForm');
    if (pesoForm) {
        pesoForm.addEventListener('submit', function (e) {
            e.preventDefault();
            try {
                const pesoValues = [];
                for (let i = 1; i <= 5; i++) {
                    const valor = parseFloat(document.getElementById(`peso${i}`).value);
                    validarNumero(valor, `Peso Amostra ${i}`);
                    pesoValues.push(valor);
                }

                const pesoPadrao = parseFloat(document.getElementById('pesoPadrao').value);
                validarNumero(pesoPadrao, 'Peso Padrão');

                const somaPeso = pesoValues.reduce((a, b) => a + b, 0);
                const mediaPeso = somaPeso / 5;
                const diferenca = mediaPeso - pesoPadrao;
                const margem = pesoPadrao * 0.01;
                const aprovado = Math.abs(diferenca) <= margem;
                const variancia = pesoValues.reduce((acc, curr) => acc + Math.pow(curr - mediaPeso, 2), 0) / 5;
                const desvioPadrao = Math.sqrt(variancia);

                const resultadoDiv = document.getElementById('resultadoPeso');
                const detailsDiv = document.getElementById('pesoDetails');
                const statusDiv = document.getElementById('pesoStatus');

                detailsDiv.innerHTML = `
                    <div class="mb-3">
                        <strong>Tolerância permitida:</strong> ±${formatarNumero(margem)} kg (1%)<br>
                        <strong>Desvio padrão das amostras:</strong> ${formatarNumero(desvioPadrao)} kg
                    </div>
                    <table class="result-table">
                        <thead>
                            <tr>
                                <th>Amostra</th>
                                <th>Peso (kg)</th>
                                <th>Diferença do Padrão</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pesoValues.map((peso, index) => {
                    const diff = peso - pesoPadrao;
                    const dentroMargem = Math.abs(diff) <= margem;
                    return `
                                    <tr class="${dentroMargem ? 'table-success' : 'table-warning'}">
                                        <td>Peso ${index + 1}</td>
                                        <td>${formatarNumero(peso)}</td>
                                        <td>${diff >= 0 ? '+' : ''}${formatarNumero(diff)}</td>
                                        <td>${dentroMargem ?
                            '<i class="fas fa-check text-success"></i> OK' :
                            '<i class="fas fa-exclamation-triangle text-warning"></i> Fora'
                        }</td>
                                    </tr>
                                `;
                }).join('')}
                            <tr class="table-active">
                                <td><strong>Média das Amostras</strong></td>
                                <td><strong>${formatarNumero(mediaPeso)}</strong></td>
                                <td></td><td></td>
                            </tr>
                            <tr class="table-active">
                                <td><strong>Padrão Esperado</strong></td>
                                <td><strong>${formatarNumero(pesoPadrao)}</strong></td>
                                <td></td><td></td>
                            </tr>
                            <tr class="${diferenca > 0 ? 'table-warning' : diferenca < 0 ? 'table-info' : 'table-success'}">
                                <td><strong>Diferença Total</strong></td>
                                <td colspan="3">
                                    <strong>${diferenca >= 0 ? '+' : ''}${formatarNumero(diferenca)} kg</strong>
                                    ${aprovado ? ' (Dentro da tolerância)' : ' (Fora da tolerância)'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                `;

                statusDiv.innerHTML = aprovado
                    ? '<span class="text-success"><i class="fas fa-check-circle me-2"></i>PESO APROVADO</span>'
                    : '<span class="text-danger"><i class="fas fa-times-circle me-2"></i>PESO REPROVADO</span>';
                resultadoDiv.style.borderLeft = aprovado ? '4px solid #1a7a3c' : '4px solid #c0392b';

                if (!aprovado) {
                    const recomendacao = diferenca > 0 ? 'Reduzir o peso na máquina de envase' : 'Aumentar o peso na máquina de envase';
                    const urgencia = Math.abs(diferenca) > (margem * 2) ? 'URGENTE' : 'ATENÇÃO';
                    detailsDiv.appendChild(mostrarAlerta('warning', `${urgencia} - OPERADOR`,
                        `Diferença de ${formatarNumero(Math.abs(diferenca))} kg detectada. ${recomendacao}.`));
                }

                resultadoDiv.classList.remove('d-none');
                resultadoDiv.classList.add('fade-in');
                resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            } catch (error) {
                alert(`Erro: ${error.message}`);
            }
        });
    }

    // ==================== VALIDADE ====================

    // Define o formato do código por grupo de linha
    function getFormatoLinha(linha) {
        const grupoS_semS10 = ['S01', 'S03', 'S05', 'S08', 'S11', 'S12', 'S14'];
        const grupoD = ['D11', 'D12'];
        const grupoA = ['A01', 'A02', 'A03', 'A04', 'A06', 'A07', 'A08'];

        if (grupoS_semS10.includes(linha)) return 'S';   // L VHE DD HHMM J \n V MM/AA
        if (linha === 'S10') return 'S10';  // V MM/AA LVEEДDHHMM J
        if (grupoD.includes(linha)) return 'D';    // V MM/AA L VHE DD HHMM J
        if (grupoA.includes(linha)) return 'A';    // F: MM/AA V: MM/AA \n L: VPE DD HHMM J
        return 'S';
    }

    // Gera o código de validade no formato certo para cada grupo
    function gerarCodigo(linha, diaProducao, mes, ano, hora, dataValidade, mapeamentoLetras) {
        const letraLinha = mapeamentoLetras.linhas[linha];
        const letraMes = mapeamentoLetras.meses[mes];
        const letraAno = mapeamentoLetras.anos[ano];
        const horaFmt = hora.replace(':', '');
        const diaFmt = diaProducao.toString().padStart(2, '0');

        const mesVal = (dataValidade.getMonth() + 1).toString().padStart(2, '0');
        const anoVal = dataValidade.getFullYear().toString().slice(-2);
        const mesFab = mes.toString().padStart(2, '0');
        const anoFab = ano.toString().slice(-2);

        const formato = getFormatoLinha(linha);

        if (formato === 'S') {
            // S01, S03, S05, S08, S11, S12, S14
            // Linha 1: L VHE DD HHMM J
            // Linha 2: V MM/AA
            return `L V${letraLinha}${letraMes} ${diaFmt} ${horaFmt} ${letraAno}\nV ${mesVal}/${anoVal}`;
        }
        if (formato === 'S10') {
            // S10: V MM/AA LVEEДDHHMM J (tudo junto)
            return `V ${mesVal}/${anoVal} LV${letraLinha}${letraMes}${diaFmt}${horaFmt} ${letraAno}`;
        }
        if (formato === 'D') {
            // D11, D12: V MM/AA L VHE DD HHMM J
            return `V ${mesVal}/${anoVal} L V${letraLinha}${letraMes} ${diaFmt} ${horaFmt} ${letraAno}`;
        }
        if (formato === 'A') {
            // A01–A08:
            // F: MM/AA V: MM/AA
            // L: VP + letraMes + letraAno + DD + HHMM + letraAno
            // Exemplo: F: 05/26 V: 05/28  /  L: VPE 23 0808 J
            return `F: ${mesFab}/${anoFab} V: ${mesVal}/${anoVal}\nL: V${letraLinha}${letraMes} ${diaFmt} ${horaFmt} ${letraAno}`;
        }
        return '';
    }

    const validadeForm = document.getElementById('validadeForm');
    if (validadeForm) {
        validadeForm.addEventListener('submit', function (e) {
            e.preventDefault();
            try {
                const linha = document.getElementById('linhaProduto').value;
                const mes = parseInt(document.getElementById('mesValidade').value);
                const ano = parseInt(document.getElementById('anoValidade').value);
                const tempoValidade = parseInt(document.getElementById('tempoValidade').value);
                const hora = document.getElementById('horaProducao').value;
                const diaInput = parseInt(document.getElementById('diaProducaoInput').value);

                if (!linha || !mes || !ano || !hora || isNaN(diaInput)) {
                    throw new Error('Todos os campos são obrigatórios.');
                }
                if (!mapeamentoLetras.linhas[linha]) throw new Error('Linha de produção inválida.');
                if (!mapeamentoLetras.meses[mes]) throw new Error('Mês inválido.');
                if (!mapeamentoLetras.anos[ano]) throw new Error('Ano não suportado pelo sistema.');

                const diasNoMesSelecionado = getDiasNoMes(ano, mes);
                const diaProducao = Math.min(diaInput, diasNoMesSelecionado);

                const dataProducao = new Date(ano, mes - 1, diaProducao);
                const hoje = new Date();

                if (dataProducao > hoje) throw new Error('A data de produção não pode ser futura.');

                const dataValidade = new Date(dataProducao);
                dataValidade.setMonth(dataValidade.getMonth() + tempoValidade);

                const diasNoMesValidade = getDiasNoMes(dataValidade.getFullYear(), dataValidade.getMonth() + 1);

                let infoAjuste = '';
                if (diaInput !== diaProducao) {
                    infoAjuste = `<div class="alert alert-info mt-2">
                        <i class="fas fa-info-circle me-2"></i>
                        <strong>Atenção:</strong> O dia foi ajustado de ${diaInput} para ${diaProducao}
                        porque ${mes}/${ano} tem apenas ${diasNoMesSelecionado} dias.
                    </div>`;
                }

                const infoMeses = `<div class="alert alert-light mt-2">
                    <i class="fas fa-calendar me-2"></i>
                    <strong>Mês de produção</strong> (${mes}/${ano}): ${diasNoMesSelecionado} dias. &nbsp;|&nbsp;
                    <strong>Mês de validade</strong> (${dataValidade.getMonth() + 1}/${dataValidade.getFullYear()}): ${diasNoMesValidade} dias.
                </div>`;

                const aprovado = dataValidade > hoje;
                const diasRestantes = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));

                const letraLinha = mapeamentoLetras.linhas[linha];
                const letraMes = mapeamentoLetras.meses[mes];
                const letraAno = mapeamentoLetras.anos[ano];

                const codigo = gerarCodigo(linha, diaProducao, mes, ano, hora, dataValidade, mapeamentoLetras);

                const formatDate = (date) => date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

                const resultadoDiv = document.getElementById('resultadoValidade');
                const detailsDiv = document.getElementById('validadeDetails');
                const statusDiv = document.getElementById('validadeStatus');
                const codigoDiv = document.getElementById('codigoValidade');

                detailsDiv.innerHTML = `
                    ${infoAjuste}
                    ${infoMeses}
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Data de Hoje:</strong> ${formatDate(hoje)}</p>
                            <p><strong>Data de Produção:</strong> ${formatDate(dataProducao)}</p>
                            <p><strong>Validade:</strong> ${tempoValidade} meses</p>
                            <p><strong>Data de Validade:</strong> ${formatDate(dataValidade)}</p>
                            <p><strong>Horário de Produção:</strong> ${hora}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Linha:</strong> ${linha} → (${letraLinha})</p>
                            <p><strong>Mês:</strong> ${mes} → (${letraMes})</p>
                            <p><strong>Ano:</strong> ${ano} → (${letraAno})</p>
                            <p><strong>Dia:</strong> ${diaProducao}</p>
                            <p><strong>Dias restantes:</strong> ${diasRestantes > 0 ? diasRestantes : '<span class="text-danger">VENCIDO</span>'}</p>
                        </div>
                    </div>
                `;

                if (aprovado) {
                    const textoStatus = diasRestantes > 30 ? 'PRODUTO APROVADO' : 'PRODUTO APROVADO (Próximo ao vencimento)';
                    statusDiv.innerHTML = `<span class="text-success"><i class="fas fa-check-circle me-2"></i>${textoStatus}</span>`;
                    resultadoDiv.style.borderLeft = '4px solid #1a7a3c';
                    if (diasRestantes <= 30) {
                        detailsDiv.appendChild(mostrarAlerta('warning', 'ATENÇÃO',
                            `Produto vence em ${diasRestantes} dias. Considere priorizar a comercialização.`));
                    }
                } else {
                    statusDiv.innerHTML = '<span class="text-danger"><i class="fas fa-times-circle me-2"></i>PRODUTO REPROVADO (CRQS/PQS)</span>';
                    resultadoDiv.style.borderLeft = '4px solid #c0392b';
                    detailsDiv.appendChild(mostrarAlerta('danger', 'PRODUTO VENCIDO',
                        'Este produto não pode ser comercializado. Destinação conforme procedimento CRQS.'));
                }

                // Exibe código — cada linha do código em uma linha separada visualmente
                const codigoLinhas = codigo.split('\n').map(l => `<div>${l}</div>`).join('');
                codigoDiv.innerHTML = `
                    <h6 class="mb-2"><i class="fas fa-barcode me-2"></i>Código de Validade:</h6>
                    <code class="fs-5" id="codigoTexto">${codigoLinhas}</code>
                    <button class="btn btn-sm btn-outline-primary ms-3 mt-2" id="btnCopiarCodigo">
                        <i class="fas fa-copy me-1"></i>Copiar
                    </button>
                `;

                // Botão copiar com addEventListener (sem onclick inline)
                const btnCopiar = document.getElementById('btnCopiarCodigo');
                if (btnCopiar) {
                    btnCopiar.addEventListener('click', function () {
                        navigator.clipboard.writeText(codigo).then(() => {
                            btnCopiar.innerHTML = '<i class="fas fa-check me-1"></i>Copiado!';
                            btnCopiar.classList.replace('btn-outline-primary', 'btn-success');
                            setTimeout(() => {
                                btnCopiar.innerHTML = '<i class="fas fa-copy me-1"></i>Copiar';
                                btnCopiar.classList.replace('btn-success', 'btn-outline-primary');
                            }, 2000);
                        }).catch(() => {
                            alert('Não foi possível copiar. Selecione o código manualmente.');
                        });
                    });
                }

                resultadoDiv.classList.remove('d-none');
                resultadoDiv.classList.add('fade-in');
                resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            } catch (error) {
                alert(`Erro: ${error.message}`);
            }
        });
    }

    // ==================== LIMPAR ====================
    document.getElementById('limparTara')?.addEventListener('click', function () {
        if (confirm('Deseja limpar todos os campos de tara?')) {
            for (let i = 1; i <= 10; i++) document.getElementById(`tara${i}`).value = '';
            document.getElementById('5amostras').checked = true;
            document.getElementById('10amostrasFields').classList.add('d-none');
            document.getElementById('resultadoTara').classList.add('d-none');
        }
    });

    document.getElementById('limparPeso')?.addEventListener('click', function () {
        if (confirm('Deseja limpar todos os campos de peso?')) {
            for (let i = 1; i <= 5; i++) document.getElementById(`peso${i}`).value = '';
            document.getElementById('pesoPadrao').value = '';
            document.getElementById('resultadoPeso').classList.add('d-none');
        }
    });

    document.getElementById('limparValidade')?.addEventListener('click', function () {
        if (confirm('Deseja limpar todos os campos de validade?')) {
            document.getElementById('validadeForm').reset();
            document.getElementById('resultadoValidade').classList.add('d-none');
        }
    });

    // ==================== FEEDBACK VISUAL ====================
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function () {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.add('loading');
                setTimeout(() => submitBtn.classList.remove('loading'), 1000);
            }
        });
    });

    console.log('SmartQuality 4.0 carregado com sucesso!');
});