interface Res {
    code: number,
    data: any
}
interface FilterRes extends Res {
    data: FilterData
}
interface ListRes extends Res {
    data: ListData
}
type ListData = Array<ItemBaseData>

interface ItemRes extends Res {
    data: ItemData
}

interface ChapterData {
    title: string,
    data: Array<BaseData>
}

interface ImageRes extends Res {
    data: ImageData
}
interface ImageData extends BaseData {
    cover: string,
    originId: string,
    originName: string,
    chapterId: string,
    chapterName: string,
    images: Array<string>,
    prev: BaseData | null,
    next: BaseData | null,
}
