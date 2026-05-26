import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Categoria, Viagem } from '../types';
import { toast } from 'react-toastify';
import { Plus, Trash2, Edit2, Calculator, Calendar, MapPin, Navigation, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const { usuario } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [viagens, setViagens] = useState<Viagem[]>([]);
  
  // Funcionalidade Especial (Cálculo de Tempo de Viagem) 
  const [distanciaCalc, setDistanciaCalc] = useState('');
  const [velocidadeCalc, setVelocidadeCalc] = useState('');
  const [resultadoTempo, setResultadoTempo] = useState('');

  // Estados dos Formulários 
  const [novaDescricaoCat, setNovaDescricaoCat] = useState('');
  const [catEditId, setCatEditId] = useState<number | null>(null);

  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [dataViagem, setDataViagem] = useState('');
  const [distanciaKm, setDistanciaKm] = useState('');
  const [velocidadeMediaKmh, setVelocidadeMediaKmh] = useState('');
  const [valor, setValor] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [viagemEditId, setViagemEditId] = useState<number | null>(null);

  // Estado para o Alerta Customizado de Confirmação
  const [modalConfirmacao, setModalConfirmacao] = useState<{
    aberto: boolean;
    tipo: 'categoria' | 'viagem' | null;
    id: number | null;
  }>({ aberto: false, tipo: null, id: null });

  const carregarDados = async () => {
    try {
      const [resCat, resViagens] = await Promise.all([
        api.get('/categorias'),
        api.get('/viagens')
      ]);
      setCategorias(resCat.data);
      setViagens(resViagens.data);
    } catch {
      toast.error('Erro ao ler dados do servidor.');
    }
  };

  useEffect(() => { carregarDados(); }, []);

  // Gerenciamento de Categorias (Temas)
  const handleSalvarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (catEditId) {
        await api.put('/categorias', { id: catEditId, descricao: novaDescricaoCat });
        toast.success('Categoria atualizada!');
      } else {
        await api.post('/categorias', { descricao: novaDescricaoCat });
        toast.success('Categoria cadastrada!');
      }
      setNovaDescricaoCat('');
      setCatEditId(null);
      carregarDados();
    } catch { toast.error('Erro na operação de categorias.'); }
  };

  const confirmarDeletarCategoria = async (id: number) => {
    try {
      await api.delete(`/categorias/${id}`);
      toast.success('Categoria removida!');
      carregarDados();
    } catch { toast.error('Falha ao remover categoria.'); }
  };

  // Gerenciamento de Viagens (Produtos)
  const handleSalvarViagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoriaId) return toast.warn('Selecione uma categoria.');
    
    let dataFormatadaBR = dataViagem;
    if (dataViagem.includes('-')) {
      const [ano, mes, dia] = dataViagem.split('-');
      dataFormatadaBR = `${dia}-${mes}-${ano}`;
    }

    const body = {
      origem, 
      destino, 
      dataViagem: dataFormatadaBR, 
      distanciaKm: Number(distanciaKm) || 0,
      velocidadeMediaKmh: Number(velocidadeMediaKmh) || 0,
      valor: Number(valor) || 0,
      categoriaId: Number(categoriaId),
      usuarioId: Number(usuario?.id || 1)
    };

    try {
      if (viagemEditId) {
        await api.put(`/viagens/${viagemEditId}`, body);
        toast.success('Viagem atualizada!');
      } else {
        await api.post('/viagens', body);
        toast.success('Viagem aceita!');
      }
      setOrigem(''); 
      setDestino(''); 
      setDataViagem(''); 
      setDistanciaKm(''); 
      setVelocidadeMediaKmh(''); 
      setValor(''); 
      setCategoriaId('');
      setViagemEditId(null);
      carregarDados();
    } catch (erro: any) { 
      console.error('--- DETALHES CRÍTICOS DO ERRO NESTJS ---');
      if (erro.response && erro.response.data) {
        const servidorMensagem = erro.response.data.message;
        if (Array.isArray(servidorMensagem)) {
          toast.error(`Validação: ${servidorMensagem.join(' | ')}`);
        } else {
          toast.error(`Erro: ${servidorMensagem || 'Falha nas validações.'}`);
        }
      } else {
        toast.error('Erro ao salvar viagem. Verifique as validações.');
      }
    }
  };

  const confirmarDeletarViagem = async (id: number) => {
    try {
      await api.delete(`/viagens/${id}`);
      toast.success('Viagem removida com sucesso.');
      carregarDados();
    } catch { toast.error('Erro ao remover viagem.'); }
  };

  // Executa a deleção correta dependendo do contexto do modal aberto
  const handleConfirmarExclusaoModal = () => {
    if (modalConfirmacao.id && modalConfirmacao.tipo === 'categoria') {
      confirmarDeletarCategoria(modalConfirmacao.id);
    } else if (modalConfirmacao.id && modalConfirmacao.tipo === 'viagem') {
      confirmarDeletarViagem(modalConfirmacao.id);
    }
    setModalConfirmacao({ aberto: false, tipo: null, id: null });
  };

  // Consumo do cálculo dinâmico do Back-end 
  const handleCalcularTempo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.get(`/viagens/calcular/tempo?distancia=${distanciaCalc}&velocidade=${velocidadeCalc}`);
      setResultadoTempo(response.data.tempoEstimado);
    } catch {
      toast.error('Verifique os valores informados para o cálculo.');
    }
  };

  return (
    <div className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full relative">
      
      {/* ALERTA CUSTOMIZADO (MODAL DE CONFIRMAÇÃO) */}
      {modalConfirmacao.aberto && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-[100] p-4 transition-all duration-300 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-800">Tem certeza que deseja apagar?</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">Esta ação não poderá ser desfeita no sistema.</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setModalConfirmacao({ aberto: false, tipo: null, id: null })}
                className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmarExclusaoModal}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors duration-200 shadow-sm"
              >
                Sim, Deletar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CARD DA FUNCIONALIDADE ESPECIAL */}
      <section className="glass-card p-6 rounded-2xl shadow-md border border-pink-200/40">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="text-[#D63384] w-5 h-5" />
          <h3 className="text-lg font-bold text-slate-800">Cálculo de Tempo de Viagem</h3>
        </div>
        <form onSubmit={handleCalcularTempo} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Distância da Carona (Km)</label>
            <input type="number" value={distanciaCalc} onChange={e => setDistanciaCalc(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-[#D63384] outline-none" required />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Velocidade Estimada (Km/h)</label>
            <input type="number" value={velocidadeCalc} onChange={e => setVelocidadeCalc(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-[#D63384] outline-none" required />
          </div>
          <button type="submit" className="py-2.5 px-4 bg-[#D63384] text-white rounded-xl font-bold text-sm hover:bg-[#4A90E2] transition-all duration-300 ease-in-out shadow-xs">
            Calcular Tempo
          </button>
        </form>
        {resultadoTempo && (
          <div className="mt-4 p-3 bg-pink-50 rounded-xl border border-pink-100 text-[#D63384] font-medium text-sm">
            O tempo de viagem estimado é de <span className="font-bold">{resultadoTempo}</span>
          </div>
        )}
      </section>

      {/* LAYOUT RESPONSIVO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* BLOCO CATEGORIA (TEMA)  */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4">{catEditId ? 'Editar Categoria/Tema' : 'Nova Categoria'}</h3>
            <form onSubmit={handleSalvarCategoria} className="flex gap-2">
              <input type="text" placeholder="Ex: Viagem de Longo Curso" value={novaDescricaoCat} onChange={e => setNovaDescricaoCat(e.target.value)} className="flex-1 p-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-[#D63384] outline-none" required />
              <button type="submit" className="p-2.5 bg-[#D63384] text-white rounded-xl hover:bg-[#4A90E2] transition-all duration-300 ease-in-out"><Plus className="w-5 h-5" /></button>
            </form>
            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
              {categorias.map(cat => (
                <div key={cat.id} className="flex justify-between items-center p-3 bg-white/60 rounded-xl border border-slate-100 text-sm shadow-xs">
                  <span className="text-slate-700 font-medium">{cat.descricao}</span>
                  <div className="flex gap-1">
                    <button onClick={() => { setCatEditId(cat.id); setNovaDescricaoCat(cat.descricao); }} className="p-1 text-slate-500 hover:text-[#4A90E2] transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => setModalConfirmacao({ aberto: true, tipo: 'categoria', id: cat.id })} className="p-1 text-slate-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BLOCO VIAGEM (PRODUTO)  */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4">{viagemEditId ? '⚙️ Atualizar Dados do Produto/Carona' : '🚗 Cadastrar Nova Corrida '}</h3>
            <form onSubmit={handleSalvarViagem} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Cidade Origem" value={origem} onChange={e => setOrigem(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-[#D63384] outline-none" required />
              <input type="text" placeholder="Cidade Destino" value={destino} onChange={e => setDestino(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-[#D63384] outline-none" required />
              
              <input type="date" value={dataViagem} onChange={e => setDataViagem(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-[#D63384] outline-none" required />
              
              <input type="number" placeholder="Distância Total (Km)" value={distanciaKm} onChange={e => setDistanciaKm(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-[#D63384] outline-none" required />
              <input type="number" placeholder="Velocidade Média (Km/h)" value={velocidadeMediaKmh} onChange={e => setVelocidadeMediaKmh(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-[#D63384] outline-none" required />
              <input type="number" placeholder="Valor Cobrado (R$)" value={valor} onChange={e => setValor(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-[#D63384] outline-none" required />
              <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-sm col-span-1 sm:col-span-2 focus:ring-2 focus:ring-[#D63384] outline-none">
                <option value="">Vincular a uma Categoria</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.descricao}</option>)}
              </select>
              <button type="submit" className="w-full py-3 bg-[#D63384] text-white font-bold text-sm rounded-xl shadow-xs col-span-1 sm:col-span-2 hover:bg-[#4A90E2] transition-all duration-300 ease-in-out">
                {viagemEditId ? 'Salvar Alterações' : 'Confirmar e Publicar'}
              </button>
            </form>
          </div>

          {/* LISTA GERAL EM GRID RESPONSIVO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {viagens.map(v => (
              <div key={v.id} className="glass-card p-5 rounded-2xl shadow-sm border border-white/40 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-pink-50 text-[#D63384] rounded-md border border-pink-100">{v.categoria?.descricao || 'Geral'}</span>
                    {/* TROCA DA COR DO VALOR: De cinza/preto para o verde institucional do projeto */}
                    <span className="text-sm font-extrabold text-[#7DBE42]">R$ {v.valor}</span>
                  </div>
                  <div className="space-y-1.5 text-sm text-slate-700 my-3">
                    <p className="flex items-center gap-1.5 font-medium"><MapPin className="w-4 h-4 text-[#D63384]" /> <span className="text-xs text-slate-400">Origem:</span> {v.origem}</p>
                    <p className="flex items-center gap-1.5 font-medium"><Navigation className="w-4 h-4 text-[#4A90E2]" /> <span className="text-xs text-slate-400">Destino:</span> {v.destino}</p>
                    <p className="flex items-center gap-1.5 text-xs text-slate-500"><Calendar className="w-3.5 h-3.5" /> {String(v.dataViagem)}</p>
                  </div>
                  <div className="text-xs text-slate-400 border-t border-slate-100 pt-2 mt-2">
                     Ofertado por: <span className="font-semibold text-slate-600">{v.usuario?.nome || 'Motorista'}</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4 border-t border-slate-100/50 pt-3">
                  <button onClick={() => {
                    let dataInput = v.dataViagem;
                    if (v.dataViagem && v.dataViagem.includes('-')) {
                      const partes = v.dataViagem.split('-');
                      if(partes[2].length === 4) {
                        dataInput = `${partes[2]}-${partes[1]}-${partes[0]}`;
                      }
                    }
                    setViagemEditId(v.id); setOrigem(v.origem); setDestino(v.destino); setDistanciaKm(String(v.distanciaKm)); setVelocidadeMediaKmh(String(v.velocidadeMediaKmh)); setValor(String(v.valor)); setCategoriaId(String(v.categoria?.id || '')); setDataViagem(dataInput);
                  }} className="p-2 text-slate-500 hover:text-[#4A90E2] hover:bg-white/80 rounded-lg transition-colors duration-200"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => setModalConfirmacao({ aberto: true, tipo: 'viagem', id: v.id })} className="p-2 text-slate-500 hover:text-red-500 hover:bg-white/80 rounded-lg transition-colors duration-200"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};