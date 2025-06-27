import { PropsWithChildren } from "react";
import ThemedText from "./ThemedText";

export const Title = ({ children }: PropsWithChildren) => {
  return (
    <ThemedText fontSize={14} style={{ textAlign: "center" }}>
      {children}
    </ThemedText>
  );
};
