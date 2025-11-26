declare module "react-native-gesture-handler" {
  import { ViewProps } from "react-native";
  
  export interface GestureHandlerRootViewProps extends ViewProps {
    children: React.ReactNode;
  }
  
  export const GestureHandlerRootView: React.ComponentType<GestureHandlerRootViewProps>;
}

declare module "react-native-maps" {
  import { ComponentType } from "react";
  import { ViewProps } from "react-native";
  
  export const PROVIDER_GOOGLE: string;
  
  export interface MapViewProps extends ViewProps {
    provider?: string;
    region?: {
      latitude: number;
      longitude: number;
      latitudeDelta: number;
      longitudeDelta: number;
    };
    initialRegion?: {
      latitude: number;
      longitude: number;
      latitudeDelta: number;
      longitudeDelta: number;
    };
    showsUserLocation?: boolean;
    showsMyLocationButton?: boolean;
    showsCompass?: boolean;
    showsPointsOfInterest?: boolean;
    showsBuildings?: boolean;
    showsTraffic?: boolean;
    showsIndoors?: boolean;
    showsIndoorLevelPicker?: boolean;
    mapType?: string;
    onRegionChange?: (region: any) => void;
    onRegionChangeComplete?: (region: any) => void;
    onPress?: (event: any) => void;
    onPanDrag?: (event: any) => void;
    onMarkerPress?: (event: any) => void;
    ref?: React.Ref<any>;
  }
  
  // MapView is the default export
  const MapView: React.ComponentType<MapViewProps>;
  export default MapView;
  
  export interface MarkerProps extends ViewProps {
    coordinate: {
      latitude: number;
      longitude: number;
      latitudeDelta?: number;
      longitudeDelta?: number;
    };
    title?: string;
    description?: string;
    pinColor?: string;
    onPress?: (event: any) => void;
  }
  
  export const Marker: React.ComponentType<MarkerProps>;
  
  export interface PolylineProps extends ViewProps {
    coordinates: Array<{
      latitude: number;
      longitude: number;
    }>;
    strokeColor?: string;
    strokeWidth?: number;
    lineDashPattern?: number[];
  }
  
  export const Polyline: React.ComponentType<PolylineProps>;
}

declare module "react-native-reanimated" {
  import { ComponentType } from "react";
  import { ViewProps, TextProps } from "react-native";
  
  export interface AnimatedViewProps extends ViewProps {
    children?: React.ReactNode;
    entering?: any;
    exiting?: any;
  }
  
  export const View: ComponentType<AnimatedViewProps>;
  
  export interface AnimatedTextProps extends TextProps {
    children?: React.ReactNode;
    entering?: any;
    exiting?: any;
  }
  
  export const Text: ComponentType<AnimatedTextProps>;
  
  export const FadeIn: any;
  export const FadeInDown: any;
  export const FadeInUp: any;
  export const FadeOut: any;
  export const FadeOutDown: any;
  export const FadeOutUp: any;
  
  export function useSharedValue<T>(initialValue: T): { value: T };
  export function useAnimatedStyle<T>(worklet: () => T): T;
  export function withTiming<T>(toValue: T, options?: { duration?: number }): T;
  export function withSpring<T>(toValue: T, options?: { damping?: number; mass?: number; stiffness?: number }): T;
  
  export function createAnimatedComponent<T>(component: T): T;
  
  export const Animated: {
    View: ComponentType<AnimatedViewProps>;
    Text: ComponentType<AnimatedTextProps>;
  };
}