interface Action {
    type?: string
    value?: string,
}

const themes = require('../../../config/theme')
export const theme = (state: string = themes[0], actions: Action = {}) => {
    switch(actions.type) {
        case 'change':
            return actions.value
        default:
            return state
    }
}