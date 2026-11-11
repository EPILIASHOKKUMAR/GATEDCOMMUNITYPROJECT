import React, { useCallback, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { colors, radii, spacing, typography } from '@/theme';

const slides = [
  {
    image: require('../../assets/images/home-banner-1.png'),
    tag: 'PROPERTY CARE, MADE SIMPLE',
    title: 'Your property. Our priority.',
    description: 'Explore monitoring, site visits and regular updates to help you care for your property.',
  },
  {
    image: require('../../assets/images/home-banner-2.png'),
    tag: 'CLARITY AT EVERY STEP',
    title: 'Make your next move with confidence.',
    description: 'Find guidance on legal documents and registration, from the first question to the next step.',
  },
  {
    image: require('../../assets/images/home-banner-3.png'),
    tag: 'PLAN FOR WHAT COMES NEXT',
    title: 'Build a brighter property future.',
    description: 'Explore loans and financing guidance to plan your property journey with greater clarity.',
  },
];

export function ServicesCarousel() {
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const current = useRef(0);
  const dragging = useRef(false);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index: number, animated = true) => {
    current.current = index;
    setActive(index);
    scroll.current?.scrollTo({ x: index * width, animated });
  }, [width]);

  useFocusEffect(useCallback(() => {
    if (!width) return;
    scroll.current?.scrollTo({ x: current.current * width, animated: false });
    if (paused) return;
    const timer = setInterval(() => {
      if (!dragging.current) goTo((current.current + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [goTo, paused, width]));

  return (
    <View style={s.section} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      <View style={s.frame}>
        {width > 0 && <ScrollView ref={scroll} horizontal pagingEnabled decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScrollBeginDrag={() => { dragging.current = true; }}
          onScrollEndDrag={() => { dragging.current = false; }}
          onMomentumScrollEnd={(event) => {
            const index = Math.max(0, Math.min(slides.length - 1, Math.round(event.nativeEvent.contentOffset.x / width)));
            current.current = index;
            setActive(index);
            dragging.current = false;
          }}>
          {slides.map((slide, index) => (
            <View key={slide.tag} style={[s.slide, { width }]}
              accessibilityElementsHidden={active !== index} importantForAccessibility={active === index ? 'auto' : 'no-hide-descendants'}>
              <Image source={slide.image} resizeMode="cover" style={s.backgroundImage} accessible={false} />
              <View style={s.overlay} />
              <View style={s.copy}>
                <View style={s.tag}><Text style={s.tagText}>{slide.tag}</Text></View>
                <Text accessibilityRole="header" style={s.title}>{slide.title}</Text>
                <Text style={s.description}>{slide.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>}
      </View>
      <View style={s.controls}>
        <View style={s.dots}>
          {slides.map((slide, index) => (
            <Pressable key={slide.tag} accessibilityRole="button" accessibilityLabel={`Show slide ${index + 1}: ${slide.title}`}
              accessibilityState={{ selected: active === index }} onPress={() => goTo(index)} style={s.dotTarget}>
              <View style={[s.dot, active === index && s.activeDot]} />
            </Pressable>
          ))}
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={paused ? 'Resume carousel' : 'Pause carousel'}
          onPress={() => setPaused((value) => !value)} style={s.pause}>
          <Text style={s.pauseText}>{paused ? 'Play slides' : 'Pause slides'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  section: { gap: spacing.xs },
  frame: { borderRadius: radii.xl, overflow: 'hidden', backgroundColor: colors.navy, minHeight: 340 },
  slide: { minHeight: 340, justifyContent: 'flex-end' },
  backgroundImage: { position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 },
  overlay: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: colors.black, opacity: 0.56 },
  copy: { padding: spacing.lg, gap: spacing.md, maxWidth: 640 },
  tag: { alignSelf: 'flex-start', backgroundColor: colors.primaryDark, borderRadius: radii.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  tagText: { ...typography.caption, fontWeight: '700', color: colors.white },
  title: { ...typography.hero, color: colors.white },
  description: { ...typography.body, color: colors.white },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dots: { flexDirection: 'row' },
  dotTarget: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  dot: { width: spacing.sm, height: spacing.sm, borderRadius: radii.pill, backgroundColor: colors.borderStrong },
  activeDot: { width: spacing.lg, backgroundColor: colors.primary },
  pause: { minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.sm },
  pauseText: { ...typography.caption, color: colors.primary, fontWeight: '600' },
});
