# Expo Go Compatible Frontend Playbook

## 📋 Overview
This playbook contains all the configurations and patterns that made ROSAgo work perfectly with Expo Go. Follow these instructions exactly to ensure your new project is Expo Go compatible.

---

## 🎯 Critical Success Factors

### ✅ MUST DO
1. Use **Expo SDK 54** (managed workflow)
2. Use **React 19.1.0** (not React 18)
3. Use **React Native 0.81.5** (comes with Expo SDK 54)
4. Keep **NativeWind v4** (no Babel plugin needed)
5. Use **React Native Reanimated 4.1.x** (Babel plugin required)
6. Install **react-native-worklets 0.5.1** as peer dependency
7. Use **@types/react ~19.1.10** (matches React 19)

### ❌ NEVER DO
- Don't install custom native modules (breaks Expo Go)
- Don't add worklets to Babel plugins (deprecated in v4)
- Don't use React 18 with Expo SDK 54
- Don't use lucide-react-native (use @expo/vector-icons instead)
- Don't modify Metro config unless absolutely necessary

---

## 📦 Step 1: Package.json Configuration

Create `package.json` with these EXACT dependencies:

```json
{
  "name": "your-app-name",
  "version": "1.0.0",
  "main": "index.ts",
  "scripts": {
    "start": "expo start --clear",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "2.2.0",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "clsx": "^2.1.0",
    "expo": "~54.0.0",
    "expo-blur": "~15.0.7",
    "expo-dev-client": "~6.0.18",
    "expo-linear-gradient": "~15.0.7",
    "expo-status-bar": "~3.0.8",
    "nativewind": "^4.0.1",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-svg": "15.12.1",
    "react-native-web": "~0.21.2",
    "react-native-worklets": "0.5.1",
    "tailwind-merge": "^2.2.0",
    "tailwindcss": "^3.4.0",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~19.1.10",
    "typescript": "~5.9.2"
  },
  "private": true
}
```

**Optional additions** (if you need them):
- `"expo-camera": "~17.0.9"` - Camera access
- `"expo-location": "^19.0.8"` - Location services
- `"react-native-maps": "1.20.1"` - Maps
- `"socket.io-client": "^4.8.1"` - WebSocket
- `"axios": "^1.13.2"` - HTTP requests

---

## ⚙️ Step 2: App.json Configuration

Create `app.json`:

```json
{
  "expo": {
    "name": "your-app-name",
    "slug": "your-app-slug",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "scheme": "your-app-scheme",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.yourapp"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.yourapp"
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "output": "single"
    }
  }
}
```

**IMPORTANT**: The `"output": "single"` in web config is required for proper bundling.

---

## 🔧 Step 3: Babel Configuration

Create `babel.config.js`:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', {
        lazyImports: true
      }]
    ],
    plugins: [
      'react-native-reanimated/plugin'
    ]
  };
};
```

**Critical**: 
- Only include `react-native-reanimated/plugin` in plugins
- DO NOT add worklets plugin (deprecated in v4)
- `lazyImports: true` improves startup performance

---

## 🚇 Step 4: Metro Configuration

Create `metro.config.js`:

```javascript
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;
```

**Keep it simple** - Only customize if absolutely necessary.

---

## 🎨 Step 5: NativeWind Setup

### 5.1 Create `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Your custom colors here
      }
    }
  },
  plugins: []
};
```

### 5.2 Create `global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5.3 Create `nativewind-env.d.ts`:

```typescript
/// <reference types="nativewind/types" />
```

---

## 📝 Step 6: TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx"
  ]
}
```

---

## 📱 Step 7: Project Structure

```
your-project/
├── assets/
│   ├── icon.png (required - 1024x1024)
│   ├── adaptive-icon.png (required - 1024x1024)
│   ├── splash.png (required - 1284x2778)
│   └── favicon.png (required - 48x48)
├── src/
│   ├── components/
│   │   └── ui/         # Reusable UI components
│   ├── navigation/
│   │   └── RootNavigator.tsx
│   ├── screens/
│   │   ├── auth/       # Login, signup, etc.
│   │   ├── home/       # Home screens
│   │   └── settings/   # Settings screens
│   ├── state/          # Zustand stores
│   ├── theme/
│   │   └── colors.ts   # Color definitions
│   ├── types/
│   │   └── models.ts   # TypeScript types
│   └── utils/          # Helper functions
├── App.tsx
├── index.ts
├── app.json
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
├── global.css
├── nativewind-env.d.ts
├── tsconfig.json
└── package.json
```

**Asset Requirements:**
- All assets MUST exist in `./assets/` folder
- Use PNG format for icons
- Follow size requirements exactly

---

## 🚀 Step 8: Entry Point Files

### 8.1 Create `index.ts`:

```typescript
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
```

### 8.2 Create `App.tsx`:

```typescript
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
```

---

## 🧩 Step 9: Navigation Setup

Create `src/navigation/RootNavigator.tsx`:

```typescript
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  // Add your screens here
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* Add your screens */}
    </Stack.Navigator>
  );
}
```

---

## 🎨 Step 10: Design System Patterns

### Theme Colors (src/theme/colors.ts):

```typescript
export const colors = {
  primary: {
    blue: '#3B82F6',
  },
  neutral: {
    pureWhite: '#FFFFFF',
    creamWhite: '#FDFDFD',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
  },
  accent: {
    successGreen: '#10B981',
    sunsetOrange: '#F97316',
  },
  status: {
    dangerRed: '#EF4444',
    warningYellow: '#F59E0B',
  },
} as const;
```

### Liquid Glass Component Pattern:

```typescript
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export function LiquidGlassCard({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <BlurView intensity={20} tint="light" style={styles.blur}>
        <View style={styles.content}>
          {children}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  blur: {
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
});
```

---

## 🔄 Step 11: State Management with Zustand

Create `src/state/authStore.ts`:

```typescript
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));
```

---

## 🛠️ Step 12: Installation & Running

### Install dependencies:
```bash
cd your-project
npm install
```

### Start development server:
```bash
npm start
```

### Run on different platforms:
```bash
npm run android  # Android emulator
npm run ios      # iOS simulator
npm run web      # Web browser
```

### Test on physical device:
1. Install "Expo Go" app from App Store/Play Store
2. Scan QR code shown in terminal
3. App loads instantly!

---

## ⚠️ Common Issues & Solutions

### Issue 1: "expo not found"
```bash
# Solution:
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: Metro bundler cache issues
```bash
# Solution:
npm start -- --clear
```

### Issue 3: TypeScript errors everywhere
```bash
# Solution: Restart TypeScript server in VS Code
# Press Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Issue 4: React version mismatch
```bash
# Solution: Ensure @types/react matches React version
npm install --save-dev @types/react@~19.1.10
```

### Issue 5: Reanimated not working
```bash
# Solution: Ensure babel.config.js has reanimated plugin LAST
plugins: [
  'react-native-reanimated/plugin'  // MUST be last
]
```

---

## 📊 Version Compatibility Matrix

| Package | Version | Why This Version |
|---------|---------|------------------|
| Expo SDK | ~54.0.0 | Latest stable, best Expo Go support |
| React | 19.1.0 | Required by Expo SDK 54 |
| React Native | 0.81.5 | Bundled with Expo SDK 54 |
| React Navigation | ^6.x | Best for Expo Go |
| NativeWind | ^4.0.1 | No Babel plugin needed |
| Reanimated | ~4.1.1 | Latest with Expo Go support |
| Worklets | 0.5.1 | Required peer of Reanimated |
| @types/react | ~19.1.10 | Matches React 19 |

---

## ✅ Pre-Launch Checklist

Before testing in Expo Go:

- [ ] All dependencies installed (`npm install` completed)
- [ ] Assets folder exists with all required images
- [ ] `babel.config.js` has reanimated plugin last
- [ ] `app.json` has valid bundle identifiers
- [ ] `global.css` imported in `App.tsx`
- [ ] `nativewind-env.d.ts` exists
- [ ] No custom native modules installed
- [ ] TypeScript shows no errors
- [ ] Metro bundler starts without errors
- [ ] QR code displays in terminal

---

## 🎯 Success Indicators

You know it's working when:
1. ✅ `npm start` runs without errors
2. ✅ QR code displays in terminal
3. ✅ Expo Go can scan and load the app
4. ✅ No "incompatible module" errors
5. ✅ Hot reload works instantly
6. ✅ TypeScript autocomplete works
7. ✅ Animations are smooth

---

## 📚 Key Learnings from ROSAgo

1. **React 19 is Required**: Expo SDK 54 only works with React 19, not 18
2. **NativeWind v4 Just Works**: No Babel config needed, simpler setup
3. **Reanimated 4 Needs Plugin**: Must add to Babel, but NOT worklets
4. **Managed Workflow = Success**: Stay in managed workflow for Expo Go
5. **Asset Paths Matter**: Use `./assets/` not `/assets/`
6. **Cache Clearing is Key**: Always start with `--clear` flag
7. **Zustand Over Redux**: Simpler state management, better with RN

---

## 🎓 Additional Tips

### Performance
- Use `lazyImports: true` in Babel config
- Implement lazy loading for screens
- Optimize images before adding to assets

### Development
- Use TypeScript for type safety
- Keep components small and focused
- Use absolute imports with `@/*` paths
- Clear cache when switching branches

### Debugging
- Use React DevTools in browser
- Check Metro bundler output for warnings
- Use `console.log` sparingly (affects performance)
- Test on real device, not just simulator

---

## 📞 Quick Reference Commands

```bash
# Fresh install
rm -rf node_modules package-lock.json && npm install

# Start with clean cache
npm start -- --clear

# Check for TypeScript errors
npx tsc --noEmit

# Format Tailwind (if needed)
npx tailwindcss --watch

# Reset Expo cache completely
npx expo start --clear --reset-cache
```

---

## 🎉 Final Notes

This playbook represents **everything** that made ROSAgo work flawlessly with Expo Go. Follow it exactly, and your new project will have the same smooth experience.

**Key Success Factor**: Don't deviate from these versions and configurations. They're battle-tested and proven to work together.

Good luck with your new project! 🚀

---

**Created from**: ROSAgo Frontend (Expo SDK 54 + React 19 + NativeWind v4)  
**Last Updated**: December 2025  
**Status**: Production-ready and tested ✅
