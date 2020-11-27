interface Res {
    code: number,
    data: any
}
interface ItemBaseData {
    id: string,
    name: string,
}

interface FilterRes extends Res {
    data: FilterData
}
type FilterData = Array<Array<BaseData>>
interface ListRes extends Res {
    data: ListData
}
type ListData = Array<BaseData>

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

interface ImageRes extends Res {
    data: ImageData
}
interface ImageData extends ItemBaseData {
    cover: string,
    originId: string,
    originName: string,
    chapterId: string,
    chapterName: string,
    images: Array<string>,
    prev: ItemBaseData | null,
    next: ItemBaseData | null,
}
