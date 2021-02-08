import generateCenter from './controllers/__center__'
import dmzj from './controllers/dmzj'

const controllers = {
    dmzj,
}

export default {
    ...controllers,
    center: generateCenter(controllers),

}