import { KeyboardAvoidingView, ScrollView, Platform } from "react-native";

// KeyboardAvoidWrapper Component
const KeyBoardAvoidWrapper = ({ children, contentContainerStyle, scrollEnabled }) => {
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : null}
      style={{flex : 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        bounces={false}
        scrollEnabled={scrollEnabled}
        contentContainerStyle={contentContainerStyle}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeyBoardAvoidWrapper;