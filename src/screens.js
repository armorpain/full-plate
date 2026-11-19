import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, Switch, TextInput, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from './theme';
import { useApp } from './state';
import { Btn, Card, Check, Chip, Counter, Done, DonationCard, Logo, Opt, ProgressBar, Reveal, ST, T, Timeline } from './ui';

export const Screen = ({ children }) => {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.creme }} contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 56 + insets.bottom }}>
      {children}
    </ScrollView>
  );
};

const find = (donations, route) => donations.find((x) => x.id === route.params.id);
const toggle = (arr, i, v) => arr.map((x, j) => (j === i ? v : x));
const ACTIVE = ['aceita', 'coletada', 'entregue'];

export function Splash({ navigation }) {
  const { reduce } = useApp();
  const spin = useRef(new Animated.Value(0)).current;
  const op = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(spin, { toValue: 1, duration: reduce ? 0 : 1400, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
      Animated.timing(op, { toValue: 1, duration: reduce ? 0 : 900, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(() => navigation.replace('Onboarding'), reduce ? 600 : 2200);
    return () => clearTimeout(t);
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: C.creme, alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <Logo size={140} spin={spin} />
      <Animated.View style={{ opacity: op, alignItems: 'center' }}>
        <T v="t" style={{ color: C.verde, fontSize: 40 }}>Full Plate</T>
        <T>Sobrou aqui, faz falta ali.</T>
      </Animated.View>
    </View>
  );
}

const PERFIS = [
  ['Empresa', 'Doar sobras e acompanhar o impacto', 'business-outline', 'EmpresaTabs'],
  ['ONG', 'Receber alimentos para quem precisa', 'heart-outline', 'OngTabs'],
  ['Motorista', 'Fazer coletas e entregas seguras', 'car-outline', 'MotoristaTabs'],
  ['Preciso de uma refeição', 'Encontrar cozinhas solidárias abertas', 'restaurant-outline', 'Cidadao'],
];

export function Perfil({ navigation }) {
  return (
    <Screen>
      <T v="t">Como você vai usar o Full Plate?</T>
      <T>Escolha seu perfil para começar.</T>
      {PERFIS.map(([nome, desc, icon, rota], k) => (
        <Reveal key={nome} delay={k * 120}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={nome + '. ' + desc}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: rota }] })}
          >
            <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 16, minHeight: 96 }}>
              <Ionicons name={icon} size={36} color={C.verde} />
              <View style={{ flex: 1 }}>
                <T v="s">{nome}</T>
                <T v="c">{desc}</T>
              </View>
              <Ionicons name="chevron-forward" size={26} color={C.carvao} />
            </Card>
          </Pressable>
        </Reveal>
      ))}
    </Screen>
  );
}

export function NovaDoacao({ navigation }) {
  const { add } = useApp();
  const [step, setStep] = useState(0);
  const [cat, setCat] = useState('Padaria');
  const [kgTxt, setKgTxt] = useState('20');
  const kg = Number(kgTxt) || 0;
  const mudarKg = (d) => setKgTxt(String(Math.max(0, kg + d)));
  const [chk, setChk] = useState([false, false, false]);
  const [janela, setJanela] = useState('Hoje, 18h às 20h');
  const itens = ['Temperatura abaixo de 5 graus', 'Embalagem fechada e íntegra', 'Dentro do prazo de validade'];
  const ok = chk.every(Boolean);
  const enviar = () => {
    const id = add({ item: cat, kg, janela });
    navigation.replace('Acompanhar', { id });
  };
  return (
    <Screen>
      <T v="n">Passo {step + 1} de 3</T>
      <ProgressBar value={(step + 1) / 3} />
      <Reveal key={step} style={{ gap: 16 }}>
        {step === 0 && (
          <>
            <T v="t">O que você vai doar?</T>
            {['Padaria', 'Hortifruti', 'Refeições prontas'].map((c) => (
              <Opt key={c} label={c} on={cat === c} onPress={() => setCat(c)} />
            ))}
            <Card style={{ gap: 12 }}>
              <T v="n">Quantidade em kg</T>
              <TextInput
                accessibilityLabel="Quantidade em quilos"
                keyboardType="numeric"
                value={kgTxt}
                onChangeText={(t) => setKgTxt(t.replace(/[^0-9]/g, ''))}
                style={{ borderWidth: 2, borderColor: C.verde, borderRadius: 12, minHeight: 64, fontSize: 28, textAlign: 'center', color: C.carvao }}
              />
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Btn style={{ flex: 1 }} variant="s" label="(-) Menos 5 kg" disabled={kg < 1} onPress={() => mudarKg(-5)} />
                <Btn style={{ flex: 1 }} variant="s" label="(+) Mais 5 kg" onPress={() => mudarKg(5)} />
              </View>
            </Card>
          </>
        )}
        {step === 1 && (
          <>
            <T v="t">Confirme a sobra limpa</T>
            <T>Só alimentos seguros seguem para doação.</T>
            <Card>
              {itens.map((t, i) => (
                <Check key={t} label={t} value={chk[i]} onChange={(v) => setChk(toggle(chk, i, v))} />
              ))}
            </Card>
          </>
        )}
        {step === 2 && (
          <>
            <T v="t">Revise e envie</T>
            <Card style={{ gap: 4 }}>
              <T v="n">{cat}, {kg} kg</T>
              <T v="c">Sobra limpa confirmada</T>
            </Card>
            <T v="s">Janela de retirada</T>
            {['Hoje, 18h às 20h', 'Amanhã, 8h às 10h'].map((j) => (
              <Opt key={j} label={j} on={janela === j} onPress={() => setJanela(j)} />
            ))}
            <T v="c">Se nenhuma ONG aceitar em 2 horas, a sobra segue para a próxima ONG ou para compostagem.</T>
          </>
        )}
      </Reveal>
      {step < 2 ? (
        <Btn label="Continuar" disabled={(step === 0 && kg < 1) || (step === 1 && !ok)} onPress={() => setStep(step + 1)} />
      ) : (
        <Btn label="Enviar doação" icon="paper-plane-outline" onPress={enviar} />
      )}
      {step > 0 && <Btn variant="s" label="Voltar" onPress={() => setStep(step - 1)} />}
    </Screen>
  );
}

export function Acompanhar({ route, navigation }) {
  const { donations } = useApp();
  const d = find(donations, route);
  return (
    <Screen>
      <T v="t">{d.item}, {d.kg} kg</T>
      <Chip s={d.status} />
      <Card style={{ gap: 12 }}>
        <T v="s">Andamento</T>
        <Timeline status={d.status} />
      </Card>
      <Card style={{ gap: 8 }}>
        <T v="s">Destino da sobra</T>
        <T>1. ONG parceira mais próxima</T>
        <T>2. Se ninguém aceitar em 2 horas, outra ONG</T>
        <T>3. Se não puder ser consumida, compostagem</T>
        <T v="c">Nada vai para o aterro.</T>
      </Card>
      <Card style={{ gap: 6 }}>
        <T v="s">Registro da doação</T>
        <T>Temperatura registrada: {d.temp || 4} graus</T>
        <T>Janela de retirada: {d.janela}</T>
      </Card>
      <Btn variant="s" label="Ver comprovante" icon="document-text-outline" onPress={() => navigation.navigate('Comprovante', { id: d.id })} />
    </Screen>
  );
}

export function Oferta({ route, navigation }) {
  const { donations, setStatus } = useApp();
  const d = find(donations, route);
  const [chk, setChk] = useState([false, false, false]);
  const [feito, setFeito] = useState(false);
  const entrega = d.status === 'entregue';
  const itens = entrega
    ? ['Quantidade conferida', 'Alimento em bom estado', 'Recebido por equipe capacitada']
    : ['Temperatura registrada adequada', 'Embalagem íntegra', 'Validade confere'];
  if (feito) {
    return (
      <Screen>
        <Done text={entrega ? 'Recebimento confirmado. Obrigado!' : 'Oferta aceita. Um motorista será acionado.'} />
        <Btn label="Voltar às ofertas" onPress={() => navigation.popToTop()} />
      </Screen>
    );
  }
  return (
    <Screen>
      <T v="t">{d.item}, {d.kg} kg</T>
      <T>Distância: 1,8 km. Retirada: {d.janela}</T>
      <T>Temperatura registrada: {d.temp || 4} graus. Contém glúten e leite.</T>
      <Card>
        <T v="s">{entrega ? 'Confirme o recebimento' : 'Avalie a oferta'}</T>
        {itens.map((t, i) => (
          <Check key={t} label={t} value={chk[i]} onChange={(v) => setChk(toggle(chk, i, v))} />
        ))}
      </Card>
      <Btn
        label={entrega ? 'Confirmar recebimento' : 'Aceitar oferta'}
        disabled={!chk.every(Boolean)}
        onPress={() => {
          setStatus(d.id, entrega ? 'concluida' : 'aceita');
          setFeito(true);
        }}
      />
      {!entrega && <Btn variant="s" label="Recusar oferta" onPress={() => navigation.goBack()} />}
    </Screen>
  );
}

export function Rota({ route, navigation }) {
  const { donations, setStatus, update } = useApp();
  const [temp, setTemp] = useState('4');
  const d = find(donations, route);
  const [chk, setChk] = useState([false, false, false]);
  const itens = ['Baú higienizado', 'Temperatura do baú abaixo de 5 graus', 'Alimento embalado e identificado'];
  return (
    <Screen>
      <T v="t">{d.item}, {d.kg} kg</T>
      <Chip s={d.status} />
      <Card style={{ gap: 6 }}>
        <T v="n">Retirada: Mercado Bom Preço</T>
        <T>Rua das Flores, 120. {d.janela}</T>
        <T v="n" style={{ marginTop: 8 }}>Entrega: Cozinha Solidária Vila Nova</T>
        <T>Avenida Brasil, 800. A 1,8 km</T>
      </Card>
      <Card style={{ gap: 8 }}>
        <View accessible accessibilityLabel="Mapa simulado da retirada até a entrega, 1,8 quilômetro">
          <Svg width="100%" height={110} viewBox="0 0 300 110">
            <Polyline points="30,85 110,85 110,45 200,45 200,25 270,25" fill="none" stroke={C.verde} strokeWidth="5" strokeLinejoin="round" />
            <Circle cx="30" cy="85" r="10" fill={C.verde} />
            <Circle cx="270" cy="25" r="10" fill={C.laranja} />
          </Svg>
        </View>
        <T v="c">Verde: retirada. Laranja: entrega. Trajeto de 1,8 km.</T>
      </Card>
      <Card>
        <Timeline status={d.status} />
      </Card>
      {d.status === 'aceita' && (
        <>
          <Card>
            <T v="s">Antes de sair</T>
            <T v="c">Temperatura do baú, em graus</T>
            <TextInput
              accessibilityLabel="Temperatura do baú em graus"
              keyboardType="numeric"
              value={temp}
              onChangeText={setTemp}
              style={{ borderWidth: 2, borderColor: C.verde, borderRadius: 12, minHeight: 56, paddingHorizontal: 12, fontSize: 20, color: C.carvao }}
            />
            {itens.map((t, i) => (
              <Check key={t} label={t} value={chk[i]} onChange={(v) => setChk(toggle(chk, i, v))} />
            ))}
          </Card>
          <Btn label="Confirmar coleta" icon="cube-outline" disabled={!chk.every(Boolean)} onPress={() => { update(d.id, { temp: Number(temp) || 4 }); setStatus(d.id, 'coletada'); }} />
        </>
      )}
      {d.status === 'coletada' && (
        <Btn label="Confirmar entrega" icon="checkmark-outline" onPress={() => setStatus(d.id, 'entregue')} />
      )}
      {d.status === 'entregue' && <Done text="Entrega registrada. Falta a confirmação da ONG." />}
      {d.status === 'concluida' && <Done text="Entrega concluída." />}
      <Btn variant="s" label="Relatar ocorrência" icon="warning-outline" onPress={() => navigation.navigate('Ocorrencia')} />
    </Screen>
  );
}

export function Acess() {
  const { prefs, setPrefs } = useApp();
  const set = (p) => setPrefs({ ...prefs, ...p });
  const linha = (label, key) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 }}>
      <T style={{ flex: 1 }}>{label}</T>
      <Switch
        accessibilityLabel={label}
        value={prefs[key]}
        onValueChange={(v) => set({ [key]: v })}
        trackColor={{ true: C.verde }}
      />
    </View>
  );
  return (
    <Screen>
      <T v="t">Acessibilidade</T>
      <T v="s">Tamanho do texto</T>
      {[['Normal', 1], ['Grande', 1.2], ['Muito grande', 1.4]].map(([l, v]) => (
        <Opt key={l} label={l} on={prefs.scale === v} onPress={() => set({ scale: v })} />
      ))}
      <Card>
        {linha('Reduzir movimento', 'reduceMotion')}
        {linha('Alto contraste', 'contrast')}
      </Card>
    </Screen>
  );
}
