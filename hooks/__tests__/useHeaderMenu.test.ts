// import { router } from "expo-router";
// import * as errorHandler from "@/utils/errorHandler";
// import { renderHook } from "@testing-library/react-native";
// import { useHeaderMenu } from "../useHeaderMenu";

// jest.mock("expo-router", () => ({
//   router: { navigate: jest.fn() },
// }));

// const invalidateQueries = jest.fn();
// jest.mock("@tanstack/react-query", () => ({
//   useQueryClient: () => ({ invalidateQueries }),
// }));

// jest.mock("react-i18next", () => ({
//   useTranslation: () => ({
//     t: (key: string) => key,
//   }),
// }));

// describe("useHeaderMenu", () => {
//   const closeMenu = jest.fn();

//   beforeEach(() => {
//     invalidateQueries.mockClear();
//     (router.navigate as jest.Mock).mockClear();
//     closeMenu.mockClear();
//   });

//   it("should return 3 menu items", () => {
//     const { result } = renderHook(() => useHeaderMenu(closeMenu));
//     expect(result.current.length).toBe(3);
//   });

//   it("should call invalidateQueries if network is reachable", async () => {
//     jest.spyOn(require("@/hooks"), "useNetworkState").mockReturnValue({
//       isInternetReachable: true,
//     });

//     const { result } = renderHook(() => useHeaderMenu(closeMenu));
//     result.current[0].onPress();

//     expect(invalidateQueries).toHaveBeenCalled();
//     expect(closeMenu).toHaveBeenCalled();
//   });

//   it("should call showError if network is unreachable", async () => {
//     const showErrorSpy = jest
//       .spyOn(errorHandler, "showError")
//       .mockImplementation(() => {});
//     jest.spyOn(require("@/hooks"), "useNetworkState").mockReturnValue({
//       isInternetReachable: false,
//     });

//     const { result } = renderHook(() => useHeaderMenu(closeMenu));
//     result.current[0].onPress();

//     expect(showErrorSpy).toHaveBeenCalled();
//     expect(closeMenu).toHaveBeenCalled();
//   });

//   it("should navigate to setting and payment", () => {
//     const { result } = renderHook(() => useHeaderMenu(closeMenu));
//     result.current[1].onPress(); // setting
//     result.current[2].onPress(); // payment

//     expect(router.navigate).toHaveBeenCalledWith("/setting");
//     expect(router.navigate).toHaveBeenCalledWith("/payment");
//     expect(closeMenu).toHaveBeenCalledTimes(2);
//   });
// });
