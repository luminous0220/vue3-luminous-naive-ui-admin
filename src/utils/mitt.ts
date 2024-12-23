import mitt from 'mitt'

type Events = {
  openThemeDrawer: void
}

export const mitter = mitt<Events>()
