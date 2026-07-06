import { SafeAreaProvider } from "react-native-safe-area-context";

import { LoginPage } from "./component/login-page/login-page";

export default function App() {
  return (
    <SafeAreaProvider>
      <LoginPage />
    </SafeAreaProvider>
  );
}
