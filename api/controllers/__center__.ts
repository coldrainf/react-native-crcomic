import { spreadArray } from '../util'

const generateCenter: GenerateCenter = (controllers = {}) => {
    return {
        async getFilter() {
            let dataArray = await Promise.all(Object.values(controllers).map(controller => controller.getFilter().catch(err => { console.log(err) })))
            let originData = Object.keys(controllers).map(name => ({ id: name, name: controllers[name].name }))
            return dataArray.map((data, index) => {
                if (!data) data = []
                data.unshift({
                    id: 'origin',
                    name: '漫源',
                    data: originData
                })
                return data
            })
        },
        async getSearch(props) {
            let dataArray = await Promise.all(Object.values(controllers).map(controller => controller.getSearch(props).catch(err => { console.log(err) })))
            let newData = dataArray.map((data, index) => {
                if (!data) return []
                let key = Object.keys(controllers)[index]
                return data.map(item => {
                    return {
                        ...item,
                        originId: key,
                        originName: controllers[key].name
                    }
                })
            })
            return spreadArray(newData).filter(Boolean)
        },
    }
}

export default generateCenter