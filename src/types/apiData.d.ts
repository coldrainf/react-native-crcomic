interface Res {
    code: number,
    data: ResData,
}
type ResData = Array<Array<BaseData>>
interface BaseData {
    id: string,
    name: string,
    default?: string,
    data?: Array<BaseData>
}