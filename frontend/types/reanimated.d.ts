declare module "react-native-reanimated" {
  import { ComponentType, ReactNode } from "react";
  import { ViewProps, StyleProp, ViewStyle, TextStyle, ImageStyle } from "react-native";

  // Basic types
  export type SharedValue<T> = { value: T };
  export type AnimatedStyleProp<T> = StyleProp<T> | AnimatedNode<T> | ReadonlyArray<AnimatedStyleProp<T>>;
  
  // Animated Node
  export interface AnimatedNode<T> {
    __value: T;
  }

  // Main hooks
  export function useSharedValue<T>(initialValue: T): SharedValue<T>;
  export function useAnimatedStyle<T extends StyleProp<ViewStyle | TextStyle | ImageStyle>>(
    updater: () => T,
    dependencies?: any[]
  ): T;
  export function useAnimatedProps<T>(updater: () => Partial<T>, dependencies?: any[]): Partial<T>;
  export function useDerivedValue<T>(updater: () => T, dependencies?: any[]): SharedValue<T>;
  export function useAnimatedReaction<D>(
    prepare: () => D,
    react: (data: D, previous: D | null) => void,
    dependencies?: any[]
  ): void;

  // Animation functions
  export function withTiming<T extends number | string>(
    toValue: T,
    userConfig?: { duration?: number; easing?: (value: number) => number },
    callback?: (finished: boolean) => void
  ): T;
  export function withSpring<T extends number>(
    toValue: T,
    userConfig?: {
      damping?: number;
      mass?: number;
      stiffness?: number;
      overshootClamping?: boolean;
      restDisplacementThreshold?: number;
      restSpeedThreshold?: number;
    },
    callback?: (finished: boolean) => void
  ): T;
  export function withDecay(
    userConfig: {
      velocity: number;
      deceleration?: number;
      clamp?: [number, number];
    },
    callback?: (finished: boolean) => void
  ): number;
  export function cancelAnimation<T>(sharedValue: SharedValue<T>): void;
  export function delay<T>(delayMs: number, delayedAnimation: T): T;
  export function sequence<T>(...animations: T[]): T;
  export function repeat<T>(
    animation: T,
    numberOfRepetitions?: number,
    reverse?: boolean,
    callback?: (finished: boolean) => void
  ): T;

  // Worklets
  export function runOnUI<A extends any[], R>(fn: (...args: A) => R): (...args: A) => void;
  export function runOnJS<A extends any[], R>(fn: (...args: A) => R): (...args: A) => void;
  export function processColor(color: number | string): number;
  export function createWorklet<A extends any[], R>(fn: (...args: A) => R): (...args: A) => R;

  // Extended ViewProps to include layout animation props
  interface AnimatedViewProps extends ViewProps {
    style?: AnimatedStyleProp<ViewStyle>;
    entering?: any;
    exiting?: any;
  }

  // Components
  export const View: ComponentType<AnimatedViewProps>;
  export const Text: ComponentType<AnimatedViewProps & { style?: AnimatedStyleProp<TextStyle> }>;
  export const Image: ComponentType<AnimatedViewProps & { style?: AnimatedStyleProp<ImageStyle> }>;
  export const ScrollView: ComponentType<AnimatedViewProps & { style?: AnimatedStyleProp<ViewStyle> }>;
  
  // Helper function to create animated components
  export function createAnimatedComponent<T>(component: T): T;

  // Layout Animations - simplified declarations
  export const FadeIn: any;
  export const FadeOut: any;
  export const FadeInDown: any;
  export const FadeInUp: any;
  export const FadeInLeft: any;
  export const FadeInRight: any;
  export const FadeOutDown: any;
  export const FadeOutUp: any;
  export const FadeOutLeft: any;
  export const FadeOutRight: any;
  export const SlideInDown: any;
  export const SlideInUp: any;
  export const SlideInLeft: any;
  export const SlideInRight: any;
  export const SlideOutDown: any;
  export const SlideOutUp: any;
  export const SlideOutLeft: any;
  export const SlideOutRight: any;
  export const Layout: any;

  // Layout Animations Provider
  export const LayoutAnimationRepository: {
    register: (name: string, animation: any) => void;
    get: (name: string) => any;
  };

  // Default export
  const reanimated: {
    useSharedValue: typeof useSharedValue;
    useAnimatedStyle: typeof useAnimatedStyle;
    useAnimatedProps: typeof useAnimatedProps;
    useDerivedValue: typeof useDerivedValue;
    useAnimatedReaction: typeof useAnimatedReaction;
    withTiming: typeof withTiming;
    withSpring: typeof withSpring;
    withDecay: typeof withDecay;
    cancelAnimation: typeof cancelAnimation;
    delay: typeof delay;
    sequence: typeof sequence;
    repeat: typeof repeat;
    runOnUI: typeof runOnUI;
    runOnJS: typeof runOnJS;
    processColor: typeof processColor;
    createWorklet: typeof createWorklet;
    View: typeof View;
    Text: typeof Text;
    Image: typeof Image;
    ScrollView: typeof ScrollView;
    createAnimatedComponent: typeof createAnimatedComponent;
    FadeIn: typeof FadeIn;
    FadeOut: typeof FadeOut;
    FadeInDown: typeof FadeInDown;
    FadeInUp: typeof FadeInUp;
    FadeInLeft: typeof FadeInLeft;
    FadeInRight: typeof FadeInRight;
    FadeOutDown: typeof FadeOutDown;
    FadeOutUp: typeof FadeOutUp;
    FadeOutLeft: typeof FadeOutLeft;
    FadeOutRight: typeof FadeOutRight;
    SlideInDown: typeof SlideInDown;
    SlideInUp: typeof SlideInUp;
    SlideInLeft: typeof SlideInLeft;
    SlideInRight: typeof SlideInRight;
    SlideOutDown: typeof SlideOutDown;
    SlideOutUp: typeof SlideOutUp;
    SlideOutLeft: typeof SlideOutLeft;
    SlideOutRight: typeof SlideOutRight;
    Layout: typeof Layout;
    LayoutAnimationRepository: typeof LayoutAnimationRepository;
  };

  export default reanimated;
}