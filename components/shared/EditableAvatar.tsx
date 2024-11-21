import { ColorPalette } from "@/constants/Colors";
import Avatar from "react-native-ui-lib/avatar";

const EditableAvatar = ({
  img,
  onPress,
}: {
  img: string;
  onPress: () => void;
}) => {
  const editIcon = require("@/assets/images/edit.webp");
  
  return (
    <Avatar
      source={img ? { uri: img } : require("@/assets/images/catbox.png")}
      onPress={onPress}
      animate
      size={120}
      containerStyle={{
        marginBottom: 20,
        shadowColor: ColorPalette.black,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 5,
      }}
      badgePosition="BOTTOM_RIGHT"
      badgeProps={{
        icon: editIcon,
        backgroundColor: ColorPalette.bluePalette,
        size: 30,
        iconStyle: {
          width: 20,
          height: 20,
          tintColor: ColorPalette.white,
        },
      }}
    />
  );
};

export default EditableAvatar;
