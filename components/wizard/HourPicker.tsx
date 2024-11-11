import {
  DateTimePicker,
  TouchableOpacity,
} from "react-native-ui-lib";
import React from "react";
import { ColorPalette } from "@/constants/Colors";

const HourPicker = ({
  label,
  value,
  onChange,
  dateTimeFormatter,
}: {
  label?: string;
  value: Date;
  onChange: (value: Date) => void;
  dateTimeFormatter: (date: Date) => string;
}) => {
  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        borderColor: ColorPalette.medium,
        padding: 10,
        width: "100%",
      }}
    >
      <DateTimePicker
        label={label}
        placeholder="Selecciona la hora de inicio"
        placeholderTextColor={ColorPalette.medium}
        labelColor={ColorPalette.medium}
        value={value}
        onChange={onChange}
        mode="time"
        dateTimeFormatter={dateTimeFormatter}
      />
    </TouchableOpacity>
  );
};

export default HourPicker;
