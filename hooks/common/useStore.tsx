import WeatherStore from "@/stores/weatherStore";
import { createContext, PropsWithChildren, useContext } from "react";

const weatherStore = new WeatherStore();
const MobxContext = createContext({
  weatherStore: weatherStore,
});

export const MobxStoreProvider = ({ children }: PropsWithChildren) => {
  return (
    <MobxContext.Provider value={{ weatherStore: weatherStore }}>
      {children}
    </MobxContext.Provider>
  );
};

export const useStores = () => useContext(MobxContext);
