import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Categoria, Viagem } from '../types';
import { toast } from 'react-toastify';
import {
  Plus,
  Trash2,
  Edit2,
  Calculator,
  Calendar,
  MapPin,
  Navigation,
  AlertTriangle,
  Clock,
  DollarSign,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import crudImage from '../assets/crud.png';

const VALOR_BASE = 8;
const VALOR_POR_KM = 2.4;

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [corridasRealizadas] = useState(5);
  const [corridasEmAndamento, setCorridasEmAndamento] = useState(0);
  const [corridasCanceladas, setCorridasCanceladas] = useState(0);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [viagens, setViagens] = useState<Viagem[]>([]);

  const [novaDescricaoCat, setNovaDescricaoCat] = useState('');
  const [catEditId, setCatEditId] = useState<number | null>(null);

  const [cepOrigem, setCepOrigem] = useState('');
  const [cepDestino, setCepDestino] = useState('');
  const [numeroOrigem, setNumeroOrigem] = useState('');
  const [numeroDestino, setNumeroDestino] = useState('');
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [dataViagem, setDataViagem] = useState('');
  const [distanciaKm, setDistanciaKm] = useState('');
  const [velocidadeMediaKmh, setVelocidadeMediaKmh] = useState('');
  const [valor, setValor] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [viagemEditId, setViagemEditId] = useState<number | null>(null);

  const buscarEndereco = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) return null;

    try {
      const resposta = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

      const dados = await resposta.json();

      if (dados.erro) return null;

      return dados;
    } catch {
      return null;
    }
  };

  const buscarCoordenadas = async (cep: string, numero: string) => {
    const endereco = await buscarEndereco(cep);

    if (!endereco) return null;

    const enderecoCompleto = `${endereco.logradouro}, ${numero}, ${endereco.localidade}, ${endereco.uf}`;

    const resposta = await fetch(
      `https://api.openrouteservice.org/geocode/search?api_key=${
        import.meta.env.VITE_ORS_API_KEY
      }&text=${encodeURIComponent(enderecoCompleto)}`
    );

    const dados = await resposta.json();

    if (!dados.features?.length) return null;

    return dados.features[0].geometry.coordinates;
  };

  const preencherOrigemPorCep = async (cep: string, numero: string) => {
    const endereco = await buscarEndereco(cep);

    if (!endereco) return;

    setOrigem(
      `${endereco.logradouro}, nº ${numero} - ${endereco.bairro}, ${endereco.localidade}/${endereco.uf}`
    );
  };

  useEffect(() => {
    if (cepOrigem && numeroOrigem) {
      preencherOrigemPorCep(cepOrigem, numeroOrigem);
    }
  }, [numeroOrigem]);

  const preencherDestinoPorCep = async (cep: string, numero: string) => {
    const endereco = await buscarEndereco(cep);

    if (!endereco) return;

    setDestino(
      `${endereco.logradouro}, nº ${numero} - ${endereco.bairro}, ${endereco.localidade}/${endereco.uf}`
    );
  };

  useEffect(() => {
    if (cepDestino && numeroDestino) {
      preencherDestinoPorCep(cepDestino, numeroDestino);
    }
  }, [numeroDestino]);

  const calcularRota = async (
    cepOrigem: string,
    cepDestino: string
  ) => {
    try {
      const origemCoords = await buscarCoordenadas(cepOrigem, numeroOrigem);
      const destinoCoords = await buscarCoordenadas(cepDestino, numeroDestino);

      if (!origemCoords || !destinoCoords) {
        toast.error('Não foi possível localizar os CEPs');
        return;
      }

      const resposta = await fetch(
        'https://api.openrouteservice.org/v2/directions/driving-car',
        {
          method: 'POST',
          headers: {
            Authorization: import.meta.env.VITE_ORS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            coordinates: [
              origemCoords,
              destinoCoords,
            ],
          }),
        }
      );

      const dados = await resposta.json();

      const distancia =
        dados.routes[0].summary.distance / 1000;

      const duracaoHoras =
        dados.routes[0].summary.duration / 3600;

      const velocidade =
        distancia / duracaoHoras;

      setDistanciaKm(distancia.toFixed(2));

      setVelocidadeMediaKmh(
        velocidade.toFixed(2)
      );
    } catch {
      toast.error('Erro ao calcular rota');
    }
  };

  useEffect(() => {
    const cepValido = (cep: string) =>
      cep.replace(/\D/g, '').length === 8;

    if (
      cepValido(cepOrigem) &&
      cepValido(cepDestino) &&
      numeroOrigem &&
      numeroDestino
    ) {
      calcularRota(cepOrigem, cepDestino);
    }
  }, [cepOrigem, cepDestino, numeroOrigem, numeroDestino,]);

const [modalConfirmacao, setModalConfirmacao] = useState<{
    aberto: boolean;
    tipo: 'categoria' | 'viagem' | null;
    id: number | null;
  }>({ aberto: false, tipo: null, id: null });

  const calcularTempoTexto = (distancia: string, velocidade: string) => {
    const d = Number(distancia);
    const v = Number(velocidade);

    if (!d || !v || d <= 0 || v <= 0) return '';

    const horasTotal = d / v;
    const horas = Math.floor(horasTotal);
    const minutos = Math.round((horasTotal - horas) * 60);

    if (horas <= 0) return `${minutos} min`;
    if (minutos <= 0) return `${horas}h`;
    return `${horas}h ${minutos}min`;
  };

  const calcularValor = (distancia: string) => {
    const d = Number(distancia);
    if (!d || d <= 0) return '';
    return (VALOR_BASE + d * VALOR_POR_KM).toFixed(2);
  };

  const resultadoTempo = useMemo(
    () => calcularTempoTexto(distanciaKm, velocidadeMediaKmh),
    [distanciaKm, velocidadeMediaKmh],
  );

  const tempoViagemFormulario = useMemo(
    () => calcularTempoTexto(distanciaKm, velocidadeMediaKmh),
    [distanciaKm, velocidadeMediaKmh],
  );

  useEffect(() => {
    setValor(calcularValor(distanciaKm));
  }, [distanciaKm]);

  const carregarDados = async () => {
    try {
      const [resCat, resViagens] = await Promise.all([
        api.get('/categorias'),
        api.get('/viagens'),
      ]);

      setCategorias(resCat.data);
      setViagens(resViagens.data);
    } catch {
      toast.error('Erro ao ler dados do servidor.');
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const limparFormularioViagem = () => {
    setCepOrigem('');
    setCepDestino('');
    setNumeroOrigem('');
    setNumeroDestino('');
    setOrigem('');
    setDestino('');
    setDataViagem('');
    setDistanciaKm('');
    setVelocidadeMediaKmh('');
    setValor('');
    setCategoriaId('');
    setViagemEditId(null);
  };

  const handleSalvarCategoriaRapida = async () => {
    if (!novaDescricaoCat.trim()) {
      toast.warn('Digite o nome da categoria.');
      return;
    }

    try {
      if (catEditId) {
        await api.put('/categorias', {
          id: catEditId,
          descricao: novaDescricaoCat,
        });

        toast.success('Categoria atualizada!');
      } else {
        await api.post('/categorias', {
          descricao: novaDescricaoCat,
        });

        toast.success('Categoria cadastrada!');
      }

      setNovaDescricaoCat('');
      setCatEditId(null);
      carregarDados();
    } catch {
      toast.error('Erro na operação de categorias.');
    }
  };

  const confirmarDeletarCategoria = async (id: number) => {
    try {
      await api.delete(`/categorias/${id}`);
      toast.success('Categoria removida!');
      carregarDados();
    } catch {
      toast.error('Falha ao remover categoria.');
    }
  };

  const handleSalvarViagem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoriaId) return toast.warn('Selecione uma categoria.');

    if (!distanciaKm || !velocidadeMediaKmh) {
      return toast.warn('Informe distância e velocidade.');
    }

    let dataFormatadaBR = dataViagem;

    if (dataViagem.includes('-')) {
      const [ano, mes, dia] = dataViagem.split('-');
      dataFormatadaBR = `${dia}-${mes}-${ano}`;
    }

    const valorFinal = Number(calcularValor(distanciaKm)) || 0;

    const body = {
      origem,
      destino,
      dataViagem: dataFormatadaBR,
      distanciaKm: Number(distanciaKm) || 0,
      velocidadeMediaKmh: Number(velocidadeMediaKmh) || 0,
      valor: valorFinal,
      categoriaId: Number(categoriaId),
      usuarioId: Number(usuario?.id || 1),
    };

    try {
      if (viagemEditId) {
        const resposta = await api.put(`/viagens/${viagemEditId}`, body);

        setViagens((listaAtual) =>
          listaAtual.map((viagem) =>
            viagem.id === viagemEditId
              ? {
                  ...viagem,
                  ...body,
                  ...(resposta.data || {}),
                  categoria:
                    categorias.find((cat) => cat.id === Number(categoriaId)) ||
                    viagem.categoria,
                  usuario: viagem.usuario,
                }
              : viagem,
          ),
        );

        toast.success('Corrida atualizada!');
      } else {
        const resposta = await api.post('/viagens', body);

        setViagens((listaAtual) => [
          {
            ...(resposta.data || body),
            categoria:
              categorias.find((cat) => cat.id === Number(categoriaId)) ||
              undefined,
            usuario: usuario || undefined,
          },
          ...listaAtual,
        ] as Viagem[]);

        setCorridasEmAndamento(1);

        toast.success('Corrida publicada!');
      }

      limparFormularioViagem();
      await carregarDados();
    } catch (erro: any) {
      if (erro.response?.data?.message) {
        const msg = erro.response.data.message;
        toast.error(Array.isArray(msg) ? msg.join(' | ') : msg);
      } else {
        toast.error('Erro ao salvar corrida.');
      }
    }
  };

  const confirmarDeletarViagem = async (id: number) => {
    try {
      await api.delete(`/viagens/${id}`);

      setCorridasEmAndamento(0);
      setCorridasCanceladas(1);

      toast.success('Corrida removida.');
      carregarDados();
    } catch {
      toast.error('Erro ao remover corrida.');
    }
  };

  const handleConfirmarExclusaoModal = () => {
    if (modalConfirmacao.id && modalConfirmacao.tipo === 'categoria') {
      confirmarDeletarCategoria(modalConfirmacao.id);
    }

    if (modalConfirmacao.id && modalConfirmacao.tipo === 'viagem') {
      confirmarDeletarViagem(modalConfirmacao.id);
    }

    setModalConfirmacao({ aberto: false, tipo: null, id: null });
  };

  const preencherEdicaoViagem = (v: Viagem) => {
    let dataInput = String(v.dataViagem || '');

    if (dataInput.includes('-')) {
      const partes = dataInput.split('-');

      if (partes[2]?.length === 4) {
        dataInput = `${partes[2]}-${partes[1]}-${partes[0]}`;
      }
    }

    setViagemEditId(v.id);
    setOrigem(v.origem);
    setDestino(v.destino);
    setDataViagem(dataInput);
    setDistanciaKm(String(v.distanciaKm || ''));
    setVelocidadeMediaKmh(String(v.velocidadeMediaKmh || ''));
    setValor(calcularValor(String(v.distanciaKm || '')));
    setCategoriaId(String(v.categoria?.id || ''));
  };

  return (
    <div
      className="flex-1 relative overflow-hidden bg-[#F8F6F2]"
      style={{
        backgroundImage: `linear-gradient(rgba(248,246,242,0.88), rgba(248,246,242,0.88)), url(${crudImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="relative max-w-7xl mx-auto w-full p-6 space-y-8">
        <div className="mb-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-slate-200 shadow-sm text-sm font-bold text-slate-600 hover:bg-white hover:text-pet-rosa transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Home
          </button>
        </div>

        {modalConfirmacao.aberto && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-base font-extrabold text-slate-800">
                  Tem certeza que deseja apagar?
                </h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Esta ação não poderá ser desfeita.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() =>
                    setModalConfirmacao({
                      aberto: false,
                      tipo: null,
                      id: null,
                    })
                  }
                  className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleConfirmarExclusaoModal}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600"
                >
                  Sim, deletar
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="bg-white/85 backdrop-blur-md p-6 rounded-3xl shadow-md border border-white/70">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Painel de Corridas
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Gerenciamento de corridas e categorias
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="px-4 py-3 rounded-2xl bg-green-50 border border-green-100">
                <p className="text-[10px] uppercase font-black text-[#7DBE42]">
                  Corridas Realizadas
                </p>

                <p className="text-xl font-black text-slate-800">
                  {corridasRealizadas}
                </p>
              </div>

              <div className="px-4 py-3 rounded-2xl bg-yellow-100 border border-yellow-100">
                <p className="text-[10px] uppercase font-black text-yellow-600">
                  Corridas em Andamento
                </p>

                <p className="text-xl font-black text-slate-800">
                  {corridasEmAndamento}
                </p>
              </div>

              <div className="px-4 py-3 rounded-2xl bg-pink-50 border border-pink-100">
                <p className="text-[10px] uppercase font-black text-[#D63384]">
                  Corridas Canceladas
                </p>

                <p className="text-xl font-black text-slate-800">
                  {corridasCanceladas}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white/85 backdrop-blur-md p-6 rounded-3xl shadow-md border border-white/70">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="text-[#D63384] w-5 h-5" />
            <h3 className="text-lg font-bold text-slate-800">
              Método Especial Automático
            </h3>
          </div>

          <p className="text-sm text-slate-500 font-medium mb-5">
            O sistema calcula automaticamente o tempo estimado e o preço da
            corrida com base nos dados informados.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
              <p className="text-[10px] uppercase font-black text-[#4A90E2] flex items-center gap-1 mb-2">
                <Clock className="w-3.5 h-3.5" />
                Tempo estimado
              </p>

              <p className="text-2xl font-black text-slate-800">
                {tempoViagemFormulario || resultadoTempo || 'Automático'}
              </p>

              <p className="text-xs text-slate-500 mt-1 font-medium">
                Calculado automaticamente pela distância e velocidade da corrida.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-green-50 border border-green-100">
              <p className="text-[10px] uppercase font-black text-[#7DBE42] flex items-center gap-1 mb-2">
                <DollarSign className="w-3.5 h-3.5" />
                Preço estimado
              </p>

              <p className="text-2xl font-black text-slate-800">
                {valor ? `R$ ${valor}` : 'Automático'}
              </p>

              <p className="text-xs text-slate-500 mt-1 font-medium">
                Valor calculado automaticamente com base na distância informada.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white/85 backdrop-blur-md p-6 rounded-3xl shadow-md border border-white/70">
          <div className="mb-6">
            <h3 className="text-lg font-black text-slate-800">
              {viagemEditId
                ? '⚙️ Atualizar Corrida'
                : '🚗 Cadastrar Nova Corrida'}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Painel de controle de corridas
            </p>
          </div>

          <form onSubmit={handleSalvarViagem} className="space-y-5">
            <div className="p-4 rounded-2xl bg-white/70 border border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
                Categoria da Corrida
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                <input
                  type="text"
                  placeholder="Ex: Viagem de Longo Curso"
                  value={novaDescricaoCat}
                  onChange={(e) => setNovaDescricaoCat(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-[#D63384] outline-none"
                />

                <button
                  type="button"
                  onClick={handleSalvarCategoriaRapida}
                  className="px-4 py-2.5 bg-[#D63384] text-white rounded-xl hover:bg-[#4A90E2] font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {catEditId ? 'Salvar Categoria' : 'Adicionar'}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {categorias.map((cat) => (
                  <div
                    key={cat.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      String(cat.id) === categoriaId
                        ? 'bg-pink-50 border-[#D63384] text-[#D63384]'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-[#D63384]'
                    }`}
                    onClick={() => setCategoriaId(String(cat.id))}
                  >
                    <span>{cat.descricao}</span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCatEditId(cat.id);
                        setNovaDescricaoCat(cat.descricao);
                      }}
                      className="hover:text-[#4A90E2]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalConfirmacao({
                          aberto: true,
                          tipo: 'categoria',
                          id: cat.id,
                        });
                      }}
                      className="hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="CEP Origem"
                value={cepOrigem}
                onChange={(e) => setCepOrigem(e.target.value)}
                onBlur={() => preencherOrigemPorCep(cepOrigem, numeroOrigem)}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-sm"
              />

              <input
                type="text"
                placeholder="Número da Origem"
                value={numeroOrigem}
                onChange={(e) => setNumeroOrigem(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-sm"
              />

              <input
                type="text"
                placeholder="CEP Destino"
                value={cepDestino}
                onChange={(e) => setCepDestino(e.target.value)}
                onBlur={() => preencherDestinoPorCep(cepDestino, numeroDestino)}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-sm"
              />

              <input
                type="text"
                placeholder="Número do Destino"
                value={numeroDestino}
                onChange={(e) => setNumeroDestino(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-sm"
              />

             <div className="p-3 rounded-xl bg-slate-100 border text-sm">
              <strong>Origem:</strong>{' '}
              {origem || 'Aguardando CEP'}
            </div>

            <div className="p-3 rounded-xl bg-slate-100 border text-sm">
              <strong>Destino:</strong>{' '}
              {destino || 'Aguardando CEP'}
            </div>

              <input
                type="date"
                value={dataViagem}
                onChange={(e) => setDataViagem(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-[#D63384] outline-none"
                required
              />

              <div className="p-3 rounded-2xl bg-slate-100 border text-sm">
                <span className="font-black">
                  Distância:
                </span>{' '}
                {distanciaKm ? `${distanciaKm} km` : 'Calculando...'}
              </div>

              <div className="p-3 rounded-2xl bg-slate-100 border text-sm">
                <span className="font-black">
                  Velocidade média:
                </span>{' '}
                {velocidadeMediaKmh
                  ? `${velocidadeMediaKmh} km/h`
                  : 'Calculando...'}
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 text-sm">
                <span className="font-black text-[#4A90E2]">
                  Tempo calculado:
                </span>{' '}
                {tempoViagemFormulario || 'Automático'}
              </div>

              <div className="p-3 rounded-2xl bg-green-50 border border-green-100 text-sm">
                <span className="font-black text-[#7DBE42]">
                  Valor calculado:
                </span>{' '}
                {valor ? `R$ ${valor}` : 'Automático'}
              </div>

              <div className="p-3 rounded-2xl bg-pink-50 border border-pink-100 text-sm">
                <span className="font-black text-[#D63384]">Categoria:</span>{' '}
                {categorias.find((c) => String(c.id) === categoriaId)
                  ?.descricao || 'Selecione acima'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="submit"
                className="w-full py-3 bg-[#D63384] text-white font-bold text-sm rounded-xl hover:bg-[#4A90E2]"
              >
                {viagemEditId ? 'Salvar Alterações' : 'Confirmar e Publicar'}
              </button>

              {viagemEditId && (
                <button
                  type="button"
                  onClick={limparFormularioViagem}
                  className="w-full py-3 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200"
                >
                  Cancelar edição
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {viagens.map((v) => (
            <div
              key={v.id}
              className="bg-white/85 backdrop-blur-md p-5 rounded-3xl shadow-md border border-white/70 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-pink-50 text-[#D63384] rounded-md border border-pink-100">
                    {v.categoria?.descricao || 'Geral'}
                  </span>

                  <span className="text-sm font-extrabold text-[#7DBE42]">
                    R$ {Number(v.valor || 0).toFixed(2)}
                  </span>
                </div>

                <div className="space-y-1.5 text-sm text-slate-700 my-3">
                  <p className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-[#D63384]" />
                    <span className="text-xs text-slate-400">Origem:</span>
                    {v.origem}
                  </p>

                  <p className="flex items-center gap-1.5 font-medium">
                    <Navigation className="w-4 h-4 text-[#4A90E2]" />
                    <span className="text-xs text-slate-400">Destino:</span>
                    {v.destino}
                  </p>

                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(v.dataViagem).toLocaleDateString('pt-BR')}
                  </p>

                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {calcularTempoTexto(
                      String(v.distanciaKm),
                      String(v.velocidadeMediaKmh),
                    ) || 'Tempo automático'}
                  </p>
                </div>

                <div className="text-xs text-slate-400 border-t border-slate-100 pt-2 mt-2">
                  Corrida solicitada por:{' '}
                  <span className="font-semibold text-slate-600">
                    {v.usuario?.nome || 'Usuário'}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4 border-t border-slate-100/50 pt-3">
                <button
                  onClick={() => preencherEdicaoViagem(v)}
                  className="p-2 text-slate-500 hover:text-[#4A90E2] hover:bg-white/80 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() =>
                    setModalConfirmacao({
                      aberto: true,
                      tipo: 'viagem',
                      id: v.id,
                    })
                  }
                  className="p-2 text-slate-500 hover:text-red-500 hover:bg-white/80 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};