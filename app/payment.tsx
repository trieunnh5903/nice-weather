import { StyleSheet, Text } from "react-native";
import React from "react";
import { ThemedView } from "@/components/common/Themed";

const Payment = () => {
  return (
    <ThemedView style={styles.container}>
      <Text>Payment</Text>
    </ThemedView>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
