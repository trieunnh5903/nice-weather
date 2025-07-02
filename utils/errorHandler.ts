import { Alert } from "react-native";

export const showError = (error: any) => {
  if (!error.response) {
    showErrorToast("Connection failed. Please check your network.");
  } else if (error.response.status >= 500) {
    showErrorToast("System error. Please try again later.");
  } else if (error.response.status === 401) {
    showErrorToast("Your session has expired. Please log in again.");
  } else {
    const message = error.response?.data?.message || "An error occurred.";
    showErrorToast(message);
  }

  console.log("Error detail:", error);
};

const showErrorToast = (message: string) => {
  Alert.alert("Notification", message);
};
