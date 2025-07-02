import React, { Component, ReactNode } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { ThemedText, ThemedView } from "../Themed";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ThemedView style={styles.container}>
          <ThemedText style={styles.title}>An error occurred!</ThemedText>
          <ThemedText style={styles.error}>
            {this.state.error?.message}
          </ThemedText>
          <Button title="Retry" onPress={this.handleReload} />
        </ThemedView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    color: "red",
  },
  error: {
    fontSize: 14,
    marginBottom: 20,
    color: "black",
  },
});
