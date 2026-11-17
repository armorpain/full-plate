import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
import Svg, { Circle, Path, Polygon } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { C, F } from './theme';
import { useApp } from './state';

const SIZES = { t: 30, s: 22, b: 17, n: 17, c: 15 };
const FONTS = { t: F.titulo, s: F.sub, b: F.corpo, n: F.negrito, c: F.corpo };

export function T({ v = 'b', style, children, ...rest }) {
  const { prefs } = useApp();
  const size = SIZES[v] * prefs.scale;
  return (
    <Text
      {...rest}
      accessibilityRole={v === 't' ? 'header' : undefined}
      style={[{ fontFamily: FONTS[v], fontSize: size, lineHeight: size * 1.3, color: C.carvao }, style]}
    >
      {children}
    </Text>
  );
}

export function Card({ style, children }) {
  const { prefs } = useApp();
  return (
    <View
      style={[
        {
          backgroundColor: C.branco,
          borderRadius: 20,
          padding: 16,
          borderWidth: prefs.contrast ? 2 : 1,
          borderColor: prefs.contrast ? C.carvao : C.borda,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Reveal({ delay = 0, children, style }) {
  const { reduce } = useApp();
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, {
      toValue: 1,
      duration: reduce ? 120 : 420,
      delay: reduce ? 0 : delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);
  const y = reduce ? 0 : a.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });
  return (
    <Animated.View style={[style, { opacity: a, transform: [{ translateY: y }] }]}>
      {children}
    </Animated.View>
  );
}

export function Btn({ label, onPress, variant = 'p', disabled, icon, style }) {
  const { reduce } = useApp();
  const s = useRef(new Animated.Value(1)).current;
  const to = (v) => {
    if (!reduce) Animated.spring(s, { toValue: v, speed: 40, useNativeDriver: true }).start();
  };
  const primary = variant === 'p';
  return (
    <Animated.View style={[{ transform: [{ scale: s }], opacity: disabled ? 0.45 : 1 }, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: !!disabled }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => to(0.96)}
        onPressOut={() => to(1)}
        style={{
          minHeight: 56,
          borderRadius: 28,
          paddingHorizontal: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          backgroundColor: primary ? C.laranja : 'transparent',
          borderWidth: primary ? 0 : 2,
          borderColor: C.verde,
        }}
      >
        {icon ? <Ionicons name={icon} size={22} color={primary ? C.carvao : C.verde} /> : null}
        <T v="n" style={{ color: primary ? C.carvao : C.verde }}>{label}</T>
      </Pressable>
    </Animated.View>
  );
}

export const IconBtn = ({ name, label, onPress }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    onPress={onPress}
    style={{ minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' }}
  >
    <Ionicons name={name} size={26} color={C.verde} />
  </Pressable>
);

const HEART = 'M50 68 C28 53 33 35 43 35 C47 35 50 38 50 41 C50 38 53 35 57 35 C67 35 72 53 50 68 Z';

export function Logo({ size = 120, spin }) {
  const rot = spin ? spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) : '0deg';
  return (
    <View accessible accessibilityRole="image" accessibilityLabel="Logo Full Plate" style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
        <Circle cx="50" cy="50" r="48" fill={C.verde} />
        <Path transform="translate(9 9.3) scale(.82)" d={HEART} fill={C.laranja} />
      </Svg>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate: rot }] }]}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Path d="M78.3 26.2 A37 37 0 1 1 37.3 15.2" fill="none" stroke={C.creme} strokeWidth="3.5" strokeLinecap="round" />
          <Polygon points="35.6,10.5 43.9,12.8 39,19.9" fill={C.creme} />
        </Svg>
      </Animated.View>
    </View>
  );
}

export function Counter({ to, suffix = '', style }) {
  const { reduce } = useApp();
  const [n, setN] = useState(reduce ? to : 0);
  useEffect(() => {
    if (reduce) {
      setN(to);
      return undefined;
    }
    const v = new Animated.Value(0);
    const id = v.addListener(({ value }) => setN(Math.round(value)));
    Animated.timing(v, { toValue: to, duration: 1200, useNativeDriver: false }).start();
    return () => v.removeListener(id);
  }, [to, reduce]);
  return <T v="t" style={style}>{n.toLocaleString('pt-BR')}{suffix}</T>;
}

export const ST = {
  oferta: ['Aguardando ONG', 'hourglass-outline', C.folha],
  aceita: ['Coleta agendada', 'calendar-outline', '#FDE8D3'],
  coletada: ['Em rota', 'car-outline', C.amarelo],
  entregue: ['Entregue, falta confirmar', 'cube-outline', '#FDE8D3'],
  concluida: ['Concluída', 'checkmark-circle-outline', C.folha],
};

export function Chip({ s }) {
  const [label, icon, bg] = ST[s];
  return (
    <View
      accessible
      accessibilityLabel={'Status: ' + label}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: bg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start' }}
    >
      <Ionicons name={icon} size={18} color={C.carvao} />
      <T v="c" style={{ fontFamily: F.negrito }}>{label}</T>
    </View>
  );
}

export function DonationCard({ d, onPress, extra }) {
  return (
    <Reveal>
      <Pressable accessibilityRole="button" accessibilityLabel={d.item + ', ' + d.kg + ' quilos. ' + ST[d.status][0]} onPress={onPress}>
        <Card style={{ gap: 8 }}>
          <T v="n">{d.item}</T>
          <T v="c">{d.kg} kg{extra ? ', ' + extra : ''}</T>
          <Chip s={d.status} />
        </Card>
      </Pressable>
    </Reveal>
  );
}

export function Check({ label, value, onChange }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      onPress={() => onChange(!value)}
      style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12 }}
    >
      <Ionicons name={value ? 'checkbox' : 'square-outline'} size={30} color={C.verde} />
      <T style={{ flex: 1 }}>{label}</T>
    </Pressable>
  );
}

export function Opt({ label, on, onPress }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: on }}
      accessibilityLabel={label}
      onPress={onPress}
      style={{ minHeight: 56, borderRadius: 16, borderWidth: 2, borderColor: C.verde, backgroundColor: on ? C.verde : C.branco, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16 }}
    >
      <Ionicons name={on ? 'radio-button-on' : 'radio-button-off'} size={24} color={on ? C.creme : C.verde} />
      <T v="n" style={{ color: on ? C.creme : C.carvao }}>{label}</T>
    </Pressable>
  );
}

const STEPS = ['Doação registrada', 'ONG aceitou', 'Alimento coletado', 'Entregue e confirmado'];
const DONE = { oferta: 1, aceita: 2, coletada: 3, entregue: 3, concluida: 4 };

export function Stepper({ steps, done }) {
  const { reduce } = useApp();
  const p = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduce) return undefined;
    const loop = Animated.loop(
      Animated.timing(p, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: false })
    );
    loop.start();
    return () => loop.stop();
  }, [reduce]);
  const fill = reduce ? '50%' : p.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  return (
    <View>
      {steps.map((s, i) => {
        const feito = i < done;
        const atual = i === done;
        const ultimo = i === steps.length - 1;
        const andando = i === done - 1;
        const estado = feito ? s.sub || 'Concluído' : atual ? 'Em andamento' : 'Pendente';
        return (
          <View key={s.t} accessible accessibilityLabel={s.t + '. ' + estado} style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ alignItems: 'center', width: 28 }}>
              <Ionicons
                name={feito ? 'checkmark-circle' : atual ? 'radio-button-on' : 'ellipse-outline'}
                size={28}
                color={feito || atual ? C.verde : C.carvao}
              />
              {!ultimo && (
                <View style={{ width: 6, flex: 1, minHeight: 28, marginVertical: 4, borderRadius: 3, backgroundColor: C.folha, overflow: 'hidden' }}>
                  {feito && !andando && <View style={{ flex: 1, backgroundColor: C.verde }} />}
                  {andando && <Animated.View style={{ width: 6, height: fill, backgroundColor: C.verde }} />}
                </View>
              )}
            </View>
            <View style={{ flex: 1, paddingBottom: ultimo ? 0 : 12 }}>
              <T v={feito || atual ? 'n' : 'b'}>{s.t}</T>
              <T v="c">{estado}</T>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function Timeline({ status }) {
  return <Stepper steps={STEPS.map((t) => ({ t }))} done={DONE[status]} />;
}

export function ProgressBar({ value }) {
  const { reduce } = useApp();
  const w = useRef(new Animated.Value(value)).current;
  useEffect(() => {
    Animated.timing(w, { toValue: value, duration: reduce ? 0 : 450, useNativeDriver: false }).start();
  }, [value]);
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={{ height: 10, borderRadius: 5, backgroundColor: C.folha, overflow: 'hidden' }}
    >
      <Animated.View style={{ height: 10, backgroundColor: C.verde, width: w.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }} />
    </View>
  );
}

export function Done({ text }) {
  const { reduce } = useApp();
  const s = useRef(new Animated.Value(reduce ? 1 : 0)).current;
  useEffect(() => {
    Vibration.vibrate(40);
    if (!reduce) Animated.spring(s, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, []);
  return (
    <View accessible accessibilityLiveRegion="polite" style={{ alignItems: 'center', gap: 12, paddingVertical: 24 }}>
      <Animated.View style={{ transform: [{ scale: s }] }}>
        <Ionicons name="checkmark-circle" size={96} color={C.verde} />
      </Animated.View>
      <T v="s" style={{ textAlign: 'center' }}>{text}</T>
    </View>
  );
}
