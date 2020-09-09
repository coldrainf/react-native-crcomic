interface Res {
    code: number,
    data: any
}
interface ItemBaseData {
    id: string,
    name: string,
}

interface ListRes extends Res {
    data: Array<Array<BaseData>>
}
type ListData = Array<Array<BaseData>>
interface BaseData extends ItemBaseData {
    default?: string,
    cover?: string,
    lastChapterId?: string,
    lastChapterName?: string,
    originId?: string,
    originName?: string,
    data?: Array<BaseData>
}


interface ItemRes extends Res {
    data: ItemData
}
interface ItemData extends ItemBaseData {
    cover: string,
    originId: string,
    originName: string,
    author: Array<string>
    type: Array<string>
    area: string
    status: string,
    updateTime?: string,
    desc: string,
    chapters: Array<ChapterData> 
}

interface ChapterData {
    title: string,
    data: Array<ItemBaseData>
}