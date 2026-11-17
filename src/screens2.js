import React, { useState } from 'react';
import { Linking, Share, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from './theme';
import { useApp } from './state';
import { Btn, Card, Counter, Done, DonationCard, Opt, Reveal, Stepper, T } from './ui';
import { Screen } from './screens';

const brl = (n) => 'R$ ' + n.toLocaleString('pt-BR');
const ACTIVE = ['aceita', 'coletada', 'entregue'];
const concluidas = (l) => l.filter((d) => d.status === 'concluida');
const somaKg = (l) => l.reduce((a, d) => a + d.kg, 0);

const Row = ({ k, v }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, minHeight: 40 }}>
    <T style={{ flex: 1 }}>{k}</T>
    <T v="n" style={{ flexShrink: 1, textAlign: 'right' }}>{v}</T>
  </View>
);

const Stat = ({ label, to, suffix }) => (
  <Card style={{ gap: 4 }}>
    <T v="c">{label}</T>
    <Counter to={to} suffix={suffix} />
  </Card>
);

const PAGES = [
  ['leaf-outline', 'Comida boa não deve virar lixo', 'Todo dia empresas descartam alimentos próprios para o consumo, enquanto milhões de pessoas passam fome.'],
  ['swap-horizontal', 'O Full Plate liga quem sobra a quem precisa', 'Empresas contratam um plano, ONGs recebem os alimentos e motoristas certificados fazem o transporte seguro.'],
  ['shield-checkmark-outline', 'Tudo registrado e seguro', 'Checklist de sobra limpa, temperatura e comprovante em cada etapa.'],
];

export function Onboarding({ navigation }) {
  const insets = useSafeAreaInsets();
  const [i, setI] = useState(0);
  const [icon, titulo, texto] = PAGES[i];
  const ir = () => (i < 2 ? setI(i + 1) : navigation.replace('Perfil'));
  return (
    <View style={{ flex: 1, backgroundColor: C.creme, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 28, paddingHorizontal: 24 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <Reveal key={i} style={{ gap: 20, alignItems: 'center' }}>
          <Ionicons name={icon} size={112} color={C.verde} />
          <T v="t" style={{ textAlign: 'center' }}>{titulo}</T>
          <T style={{ textAlign: 'center' }}>{texto}</T>
        </Reveal>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {PAGES.map((p, k) => (
            <View key={p[1]} style={{ width: k === i ? 28 : 10, height: 10, borderRadius: 5, backgroundColor: k === i ? C.verde : C.borda }} />
          ))}
        </View>
        <T v="c">{i + 1} de 3</T>
      </View>
      <View style={{ gap: 12 }}>
        <Btn label={i < 2 ? 'Continuar' : 'Começar'} onPress={ir} />
        {i < 2 ? <Btn variant="s" label="Pular" onPress={() => navigation.replace('Perfil')} /> : <View style={{ minHeight: 56 }} />}
      </View>
    </View>
  );
}

export function EmpresaInicio({ navigation }) {
  const { donations } = useApp();
  const kg = somaKg(concluidas(donations));
  const proxima = donations.find((d) => d.status === 'aceita');
  const espera = donations.filter((d) => d.status === 'oferta').length;
  return (
    <Screen>
      <T v="t">Olá, Mercado Bom Preço</T>
      <Reveal>
        <Card style={{ gap: 8, backgroundColor: C.verde }}>
          <T v="c" style={{ color: C.creme }}>Impacto confirmado</T>
          <Counter to={kg} suffix=" kg" style={{ color: C.amarelo }} />
          <T style={{ color: C.creme }}>desviados do aterro, cerca de {Math.round(kg * 2.5)} refeições servidas</T>
        </Card>
      </Reveal>
      {espera > 0 && (
        <Card style={{ flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: '#FDE8D3' }}>
          <Ionicons name="alert-circle-outline" size={28} color={C.carvao} />
          <T style={{ flex: 1 }}>{espera} {espera === 1 ? 'doação aguarda' : 'doações aguardam'} uma ONG aceitar.</T>
        </Card>
      )}
      {proxima && (
        <Card style={{ gap: 8 }}>
          <T v="s">Próxima coleta</T>
          <T>{proxima.item}, {proxima.kg} kg. {proxima.janela}</T>
          <Btn variant="s" label="Ver detalhes" onPress={() => navigation.navigate('Acompanhar', { id: proxima.id })} />
        </Card>
      )}
      <Btn label="Nova doação" icon="add-circle-outline" onPress={() => navigation.navigate('NovaDoacao')} />
    </Screen>
  );
}

const FILTROS = ['Em andamento', 'Concluídas', 'Todas'];

export function EmpresaDoacoes({ navigation }) {
  const { donations } = useApp();
  const [f, setF] = useState('Todas');
  const lista = donations.filter((d) => f === 'Todas' || (f === 'Concluídas' ? d.status === 'concluida' : d.status !== 'concluida'));
  return (
    <Screen>
      <T v="t">Suas doações</T>
      {FILTROS.map((x) => (
        <Opt key={x} label={x} on={f === x} onPress={() => setF(x)} />
      ))}
      {lista.length === 0 && <T>Nenhuma doação neste filtro.</T>}
      {lista.map((d) => (
        <DonationCard key={d.id} d={d} onPress={() => navigation.navigate('Acompanhar', { id: d.id })} />
      ))}
    </Screen>
  );
}

const PLANOS = [
  ['Essencial', 'Até 200 kg por mês', 250],
  ['Crescimento', 'Até 500 kg por mês', 600],
  ['Rede', 'Até 1.000 kg por mês', 1100],
];

export function Plano() {
  const { plano, setPlano } = useApp();
  const [kgTxt, setKgTxt] = useState('300');
  const kg = Number(kgTxt) || 0;
  const mudarKg = (d) => setKgTxt(String(Math.max(0, kg + d)));
  const aterro = Math.round(kg * 1.8);
  const ind = kg <= 200 ? 0 : kg <= 500 ? 1 : 2;
  const dif = aterro - PLANOS[ind][2];
  return (
    <Screen>
      <T v="t">Planos mensais</T>
      {PLANOS.map(([nome, desc, preco], i) => (
        <Reveal key={nome} delay={i * 100}>
          <Card style={{ gap: 6 }}>
            <T v="s">{nome}</T>
            <T>{desc}</T>
            <T v="n">{brl(preco)} por mês</T>
            <Btn label={plano === i ? 'Plano atual' : 'Contratar ' + nome} variant={plano === i ? 's' : 'p'} disabled={plano === i} onPress={() => setPlano(i)} />
          </Card>
        </Reveal>
      ))}
      <Card style={{ gap: 10 }}>
        <T v="s">Calculadora de custo</T>
        <T>Quanto você descarta por mês?</T>
        <TextInput
          accessibilityLabel="Quantidade descartada por mês, em quilos"
          keyboardType="numeric"
          value={kgTxt}
          onChangeText={(t) => setKgTxt(t.replace(/[^0-9]/g, ''))}
          style={{ borderWidth: 2, borderColor: C.verde, borderRadius: 12, minHeight: 64, fontSize: 28, textAlign: 'center', color: C.carvao }}
        />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Btn style={{ flex: 1 }} variant="s" label="Menos 50 kg" disabled={kg < 1} onPress={() => mudarKg(-50)} />
          <Btn style={{ flex: 1 }} variant="s" label="Mais 50 kg" onPress={() => mudarKg(50)} />
        </View>
        <Row k="Custo estimado no aterro" v={brl(aterro)} />
        <Row k="Plano indicado" v={PLANOS[ind][0]} />
        <Row k="Valor do plano" v={brl(PLANOS[ind][2])} />
        <Row k={dif >= 0 ? 'Economia por mês' : 'Diferença por mês'} v={brl(Math.abs(dif))} />
        {kg > 1000 && <T v="c">Acima de 1.000 kg, fale com a nossa equipe para um plano sob medida.</T>}
        <T v="c">Valores simulados para demonstração, com aterro a R$ 1,80 por kg.</T>
      </Card>
    </Screen>
  );
}

export function Impacto() {
  const { donations } = useApp();
  const kg = somaKg(concluidas(donations));
  const refeicoes = Math.round(kg * 2.5);
  const co2 = Math.round(kg * 2);
  const compartilhar = () =>
    Share.share({ message: 'Full Plate. Impacto do Mercado Bom Preço: ' + kg + ' kg desviados do aterro, ' + refeicoes + ' refeições servidas e cerca de ' + co2 + ' kg de CO2 evitados.' });
  return (
    <Screen>
      <T v="t">Relatório ESG</T>
      <Stat label="Alimentos desviados do aterro" to={kg} suffix=" kg" />
      <Stat label="Refeições servidas" to={refeicoes} />
      <Stat label="CO2 evitado (estimativa)" to={co2} suffix=" kg" />
      <Card style={{ backgroundColor: C.amarelo, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <Ionicons name="ribbon-outline" size={40} color={C.carvao} />
        <View style={{ flex: 1 }}>
          <T v="n">Empresa parceira, Zero aterro</T>
          <T v="c">Selo válido enquanto o plano estiver ativo</T>
        </View>
      </Card>
      <Btn label="Compartilhar relatório" icon="share-outline" onPress={compartilhar} />
    </Screen>
  );
}

const PASSOS = [
  ['Doação registrada', 'Mercado Bom Preço', '14h05'],
  ['Oferta aceita', 'Cozinha Solidária Vila Nova', '14h40'],
  ['Coleta feita', 'Carlos Mendes', '16h10'],
  ['Entrega feita', 'Carlos Mendes', '16h45'],
  ['Recebimento confirmado', 'Cozinha Solidária Vila Nova', '17h00'],
];
const FEITOS = { oferta: 1, aceita: 2, coletada: 3, entregue: 4, concluida: 5 };

export function Comprovante({ route }) {
  const { donations } = useApp();
  const d = donations.find((x) => x.id === route.params.id);
  const n = FEITOS[d.status];
  const compartilhar = () =>
    Share.share({ message: 'Comprovante Full Plate: ' + d.item + ', ' + d.kg + ' kg. Etapas concluídas: ' + n + ' de 5. Temperatura na coleta: ' + (d.temp || 4) + ' graus.' });
  return (
    <Screen>
      <T v="t">Comprovante</T>
      <T>{d.item}, {d.kg} kg</T>
      <Card style={{ gap: 12 }}>
        <T v="s">Cadeia de custódia</T>
        <Stepper steps={PASSOS.map(([t, quem, hora]) => ({ t, sub: quem + ', ' + hora }))} done={n} />
      </Card>
      <Card>
        <Row k="Temperatura na coleta" v={(d.temp || 4) + ' graus'} />
        <Row k="Janela de retirada" v={d.janela} />
      </Card>
      <Btn label="Compartilhar comprovante" icon="share-outline" onPress={compartilhar} />
    </Screen>
  );
}

const TIPOS = ['Todos', 'Padaria', 'Hortifruti', 'Refeições prontas'];

export function OngOfertas({ navigation }) {
  const { donations } = useApp();
  const [t, setT] = useState('Todos');
  const novas = donations.filter((d) => d.status === 'oferta' && (t === 'Todos' || d.item === t));
  return (
    <Screen>
      <T v="t">Ofertas perto de você</T>
      {TIPOS.map((x) => (
        <Opt key={x} label={x} on={t === x} onPress={() => setT(x)} />
      ))}
      {novas.length === 0 && <T>Nenhuma oferta com esse filtro.</T>}
      {novas.map((d) => (
        <DonationCard key={d.id} d={d} extra="1,8 km" onPress={() => navigation.navigate('Oferta', { id: d.id })} />
      ))}
    </Screen>
  );
}

export function OngChegadas({ navigation }) {
  const { donations } = useApp();
  const lista = donations.filter((d) => ACTIVE.includes(d.status));
  return (
    <Screen>
      <T v="t">Chegadas do dia</T>
      {lista.length === 0 && <T>Nenhuma chegada prevista.</T>}
      {lista.map((d) => (
        <DonationCard key={d.id} d={d} onPress={() => navigation.navigate(d.status === 'entregue' ? 'Oferta' : 'Acompanhar', { id: d.id })} />
      ))}
    </Screen>
  );
}

export function OngEstoque() {
  const { donations, servidas, setServidas } = useApp();
  const [qtd, setQtd] = useState('10');
  const [msg, setMsg] = useState('');
  const n = Number(qtd) || 0;
  const mudar = (d) => setQtd(String(Math.max(0, n + d)));
  const registrar = () => {
    setServidas(servidas + n);
    setMsg('Registradas ' + n + ' refeições.');
  };
  const itens = concluidas(donations);
  return (
    <Screen>
      <T v="t">Estoque e refeições</T>
      <Stat label="Refeições servidas" to={servidas} />
      <Card style={{ gap: 12 }}>
        <T v="s">Registrar refeições servidas</T>
        <T v="c">Digite a quantidade ou use os botões.</T>
        <TextInput
          accessibilityLabel="Quantidade de refeições servidas"
          keyboardType="numeric"
          value={qtd}
          onChangeText={(t) => setQtd(t.replace(/[^0-9]/g, ''))}
          style={{ borderWidth: 2, borderColor: C.verde, borderRadius: 12, minHeight: 64, fontSize: 28, textAlign: 'center', color: C.carvao }}
        />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Btn style={{ flex: 1 }} variant="s" label="Menos 10" disabled={n < 1} onPress={() => mudar(-10)} />
          <Btn style={{ flex: 1 }} variant="s" label="Mais 10" onPress={() => mudar(10)} />
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Btn style={{ flex: 1 }} variant="s" label="Menos 1" disabled={n < 1} onPress={() => mudar(-1)} />
          <Btn style={{ flex: 1 }} variant="s" label="Mais 1" onPress={() => mudar(1)} />
        </View>
        <Btn label="Registrar" icon="restaurant-outline" disabled={n < 1} onPress={registrar} />
        {msg ? <T v="n" accessibilityLiveRegion="polite">{msg}</T> : null}
      </Card>
      <T v="s">Em estoque</T>
      <Card style={{ flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: '#FDE8D3' }}>
        <Ionicons name="alert-circle-outline" size={28} color={C.carvao} />
        <T style={{ flex: 1 }}>Use primeiro o que vence antes.</T>
      </Card>
      <Card>
        {itens.length === 0 && <T>Nenhum item em estoque.</T>}
        {itens.map((d) => (
          <Row key={d.id} k={d.item} v={d.kg + ' kg, validade em 2 dias'} />
        ))}
      </Card>
    </Screen>
  );
}

export function OngPerfil() {
  const { donations } = useApp();
  const itens = concluidas(donations);
  return (
    <Screen>
      <T v="t">Cozinha Solidária Vila Nova</T>
      <Card>
        <Row k="Capacidade de recebimento" v="300 kg" />
        <Row k="Câmara fria" v="Sim" />
        <Row k="Horário de recebimento" v="8h às 18h" />
        <Row k="Pessoas atendidas por dia" v="180" />
      </Card>
      <T v="s">Histórico de recebimentos</T>
      <Card>
        {itens.length === 0 && <T>Nenhum recebimento ainda.</T>}
        {itens.map((d) => (
          <Row key={d.id} k={d.item} v={d.kg + ' kg'} />
        ))}
      </Card>
    </Screen>
  );
}

export function MotoristaRotas({ navigation }) {
  const { donations } = useApp();
  const rotas = donations.filter((d) => ACTIVE.includes(d.status));
  return (
    <Screen>
      <T v="t">Rotas de hoje</T>
      <Card style={{ gap: 4, backgroundColor: C.folha }}>
        <Row k="Paradas" v={String(rotas.length)} />
        <Row k="Distância total" v={(rotas.length * 1.8).toFixed(1).replace('.', ',') + ' km'} />
      </Card>
      {rotas.length === 0 && <T>Nenhuma rota agora. Novas coletas aparecem aqui.</T>}
      {rotas.map((d) => (
        <DonationCard key={d.id} d={d} extra="1,8 km" onPress={() => navigation.navigate('Rota', { id: d.id })} />
      ))}
    </Screen>
  );
}

export function MotoristaHistorico() {
  const { donations } = useApp();
  const feitas = concluidas(donations);
  return (
    <Screen>
      <T v="t">Seu histórico</T>
      <Stat label="Coletas concluídas" to={feitas.length} />
      <Stat label="Alimentos transportados" to={somaKg(feitas)} suffix=" kg" />
      <Stat label="Ganhos estimados no mês" to={feitas.length * 45} suffix=" reais" />
      <T v="c">Valor simulado de R$ 45 por coleta.</T>
      <Card>
        {feitas.map((d) => (
          <Row key={d.id} k={d.item} v={d.kg + ' kg'} />
        ))}
      </Card>
    </Screen>
  );
}

const DOCS = [
  ['Certificação sanitária do veículo', 'Válida até 12/03/2027', true],
  ['Curso de manipulação de alimentos', 'Válido até 20/12/2026', false],
  ['CNH categoria B', 'Válida até 05/2029', true],
];

export function MotoristaDocs() {
  return (
    <Screen>
      <T v="t">Documentos</T>
      {DOCS.map(([nome, validade, ok]) => (
        <Card key={nome} style={{ gap: 6, backgroundColor: ok ? C.branco : '#FDE8D3' }}>
          <T v="n">{nome}</T>
          <T>{validade}</T>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name={ok ? 'checkmark-circle' : 'alert-circle'} size={22} color={ok ? C.verde : C.carvao} />
            <T v="n">{ok ? 'Em dia' : 'Vence em breve, renove'}</T>
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const MOTIVOS = ['Trânsito intenso', 'Alimento fora do padrão', 'ONG fechada'];

export function Ocorrencia({ navigation }) {
  const { ocorrencias, setOcorrencias } = useApp();
  const [m, setM] = useState(MOTIVOS[0]);
  const [ok, setOk] = useState(false);
  if (ok) {
    return (
      <Screen>
        <Done text="Ocorrência enviada. A equipe foi avisada." />
        <Btn label="Voltar" onPress={() => navigation.goBack()} />
      </Screen>
    );
  }
  return (
    <Screen>
      <T v="t">Relatar ocorrência</T>
      {MOTIVOS.map((x) => (
        <Opt key={x} label={x} on={m === x} onPress={() => setM(x)} />
      ))}
      <Btn label="Enviar ocorrência" onPress={() => { setOcorrencias([...ocorrencias, m]); setOk(true); }} />
    </Screen>
  );
}

const COZ = [
  ['Cozinha Solidária Vila Nova', 'Avenida Brasil, 800', '11h às 14h', true, 'Arroz, feijão, frango assado e salada'],
  ['Banco de Alimentos Esperança', 'Rua das Acácias, 45', '9h às 12h', true, 'Cestas de alimentos e sopa'],
  ['Refeitório Comunitário Sol Nascente', 'Rua do Sol, 310', '17h às 20h', false, 'Macarronada e legumes'],
  ['Casa de Apoio Maria Luz', 'Praça Central, 12', '12h às 15h', true, 'Prato feito e frutas'],
];

export function Cidadao({ navigation }) {
  const [so, setSo] = useState(false);
  const lista = COZ.map((c, i) => [c, i]).filter(([c]) => !so || c[3]);
  return (
    <Screen>
      <T v="t">Onde comer hoje</T>
      <T>Cozinhas solidárias perto de você.</T>
      <Opt label="Mostrar só as abertas agora" on={so} onPress={() => setSo(!so)} />
      {lista.map(([c, i]) => (
        <Reveal key={c[0]}>
          <Card style={{ gap: 6 }}>
            <T v="s">{c[0]}</T>
            <T>{c[1]}. {c[2]}</T>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name={c[3] ? 'time-outline' : 'moon-outline'} size={22} color={C.verde} />
              <T v="n">{c[3] ? 'Aberta agora' : 'Fechada agora'}</T>
            </View>
            <Btn variant="s" label="Ver detalhes" onPress={() => navigation.navigate('Cozinha', { i })} />
          </Card>
        </Reveal>
      ))}
    </Screen>
  );
}

export function Cozinha({ route }) {
  const [nome, end, hor, aberta, cardapio] = COZ[route.params.i];
  return (
    <Screen>
      <T v="t">{nome}</T>
      <Card style={{ gap: 4 }}>
        <Row k="Endereço" v={end} />
        <Row k="Horário" v={hor} />
        <Row k="Agora" v={aberta ? 'Aberta' : 'Fechada'} />
        <Row k="Cadastro" v="Não precisa" />
      </Card>
      <Card style={{ gap: 6 }}>
        <T v="s">Cardápio de hoje</T>
        <T>{cardapio}</T>
      </Card>
      <Btn label="Como chegar" icon="navigate-outline" onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(end))} />
    </Screen>
  );
}

const MSG = {
  oferta: ['Doação aguardando ONG', 'hourglass-outline'],
  aceita: ['ONG aceitou. Coleta agendada', 'calendar-outline'],
  coletada: ['Motorista a caminho da ONG', 'car-outline'],
  entregue: ['Entrega feita. Falta a confirmação da ONG', 'cube-outline'],
  concluida: ['Doação confirmada. Obrigado!', 'checkmark-circle-outline'],
};

export function Notificacoes() {
  const { donations } = useApp();
  return (
    <Screen>
      <T v="t">Notificações</T>
      {donations.map((d) => (
        <Card key={d.id} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Ionicons name={MSG[d.status][1]} size={30} color={C.verde} />
          <View style={{ flex: 1 }}>
            <T v="n">{MSG[d.status][0]}</T>
            <T v="c">{d.item}, {d.kg} kg</T>
          </View>
        </Card>
      ))}
    </Screen>
  );
}
