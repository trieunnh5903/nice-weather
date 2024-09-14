import weatherStore from "@/stores/weatherStore";
import { createContext, PropsWithChildren, useContext } from "react";

const MobxContext = createContext({
  currWeatherStore: weatherStore,
});

export const MobxStoreProvider = ({ children }: PropsWithChildren) => {
  return (
    <MobxContext.Provider value={{ currWeatherStore: weatherStore }}>
      {children}
    </MobxContext.Provider>
  );
};

export const useStores = () => useContext(MobxContext);
