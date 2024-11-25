import { View, Text, Button } from 'react-native-ui-lib'
import React from 'react'
import { Link } from 'expo-router'
import { Fonts } from '@/constants/Fonts'
import { ColorPalette } from '@/constants/Colors'

const AppointmentsNotFoundScreen = () => {
  return (
    <View flex center gap-20>
      <Text style={{ fontSize: 20 }}>There aren't any appointments yet.</Text>
      <Link asChild href={"/(app)/(user)"}>
        <Button
          label="Go to homepage"
          labelStyle={{ fontFamily: Fonts.PoppinsMedium }}
          backgroundColor={ColorPalette.bluePalette}
        />
      </Link>
    </View>
  )
}

export default AppointmentsNotFoundScreen