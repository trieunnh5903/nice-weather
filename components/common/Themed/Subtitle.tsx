import { PropsWithChildren } from "react";
import ThemedText from "./ThemedText";

export const Subtitle = ({ children }: PropsWithChildren) => {
  return (
    <ThemedText fontSize={13} style={{ textAlign: "center" }}>
      {children}
    </ThemedText>
  );
};
