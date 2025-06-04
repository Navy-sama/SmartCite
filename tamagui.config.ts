import { config as tamaguiConfig } from '@tamagui/config/v2'
import { createTamagui } from 'tamagui'

const config = createTamagui(tamaguiConfig)

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
