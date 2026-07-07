import { Text, TextInput } from "react-native";

export const displayFontFamily = "Spectral_600SemiBold";
export const uiFontFamily = "InstrumentSans_400Regular";
export const uiFontFamilyMedium = "InstrumentSans_500Medium";
export const uiFontFamilySemiBold = "InstrumentSans_600SemiBold";

export const appFontFamily = uiFontFamily;

type ComponentWithDefaults = {
  defaultProps?: {
    style?: unknown;
  };
};

let typographyConfigured = false;

export function configureTypographyDefaults() {
  if (typographyConfigured) {
    return;
  }

  const text = Text as unknown as ComponentWithDefaults;
  const textInput = TextInput as unknown as ComponentWithDefaults;

  text.defaultProps = {
    ...text.defaultProps,
    style: [{ fontFamily: uiFontFamily }, text.defaultProps?.style],
  };
  textInput.defaultProps = {
    ...textInput.defaultProps,
    style: [{ fontFamily: uiFontFamily }, textInput.defaultProps?.style],
  };
  typographyConfigured = true;
}
