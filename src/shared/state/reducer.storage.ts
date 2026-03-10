import { createReducer } from '@reduxjs/toolkit'

import type { AppName } from '../../config/apps.js'
import {
  changedPickerWindowBounds,
  readiedApp,
  receivedRendererStartupSignal,
  retrievedInstalledApps,
} from '../../main/state/actions.js'
import {
  clickedDonate,
  clickedMaybeLater,
} from '../../renderers/picker/state/actions.js'
import {
  confirmedReset,
  reorderedApp,
  toggledTrayVisibility,
  updatedHotCode,
  updatedRegexPatterns,
} from '../../renderers/prefs/state/actions.js'

type Storage = {
  apps: {
    name: AppName
    hotCode: string | null
    regexPatterns: string[]
    isInstalled: boolean
  }[]
  height: number
  isSetup: boolean
  showInTray: boolean
  supportMessage: number
}

const defaultStorage: Storage = {
  apps: [],
  height: 200,
  isSetup: false,
  showInTray: true,
  supportMessage: 0,
}

const storage = createReducer<Storage>(defaultStorage, (builder) =>
  builder
    .addCase(readiedApp, (state) => {
      state.isSetup = true
    })

    .addCase(confirmedReset, () => defaultStorage)

    .addCase(
      receivedRendererStartupSignal,
      (_, action) => action.payload.storage,
    )

    .addCase(retrievedInstalledApps, (state, action) => {
      const installedAppNames = action.payload

      for (const storedApp of state.apps) {
        storedApp.isInstalled = installedAppNames.includes(storedApp.name)
      }

      for (const installedAppName of installedAppNames) {
        const installedAppInStorage = state.apps.some(
          ({ name }) => name === installedAppName,
        )

        if (!installedAppInStorage) {
          state.apps.push({
            hotCode: null,
            isInstalled: true,
            name: installedAppName,
            regexPatterns: [],
          })
        }
      }
    })

    .addCase(updatedHotCode, (state, action) => {
      const hotCode = action.payload.value

      const appWithSameHotCodeIndex = state.apps.findIndex(
        (app) => app.hotCode === hotCode,
      )

      if (appWithSameHotCodeIndex !== -1) {
        state.apps[appWithSameHotCodeIndex].hotCode = null
      }

      const appIndex = state.apps.findIndex(
        (app) => app.name === action.payload.appName,
      )

      state.apps[appIndex].hotCode = hotCode
    })

    .addCase(clickedDonate, (state) => {
      state.supportMessage = -1
    })

    .addCase(clickedMaybeLater, (state) => {
      state.supportMessage = Date.now()
    })

    .addCase(changedPickerWindowBounds, (state, action) => {
      state.height = action.payload.height
    })

    .addCase(reorderedApp, (state, action) => {
      const sourceIndex = state.apps.findIndex(
        (app) => app.name === action.payload.sourceName,
      )

      const destinationIndex = state.apps.findIndex(
        (app) => app.name === action.payload.destinationName,
      )

      const [removed] = state.apps.splice(sourceIndex, 1)
      state.apps.splice(destinationIndex, 0, removed)
    })

    .addCase(updatedRegexPatterns, (state, action) => {
      const appIndex = state.apps.findIndex(
        (app) => app.name === action.payload.appName,
      )

      if (appIndex !== -1) {
        state.apps[appIndex].regexPatterns = action.payload.patterns
      }
    })

    .addCase(toggledTrayVisibility, (state, action) => {
      state.showInTray = action.payload
    }),
)

export { defaultStorage, Storage, storage }
