interface BaseData {
    id: string,
    name: string
}

interface ItemBaseData extends BaseData {
    cover: string,
    lastChapterId: string,
    lastChapterName: string
}

interface ItemBaseCenterData extends ItemBaseData {
    originId: string,
    originName: string,
}

interface ItemData extends BaseData {
    cover: string,
    author: string[],
    type: string[],
    area: string,
    status: string,
    updateTime: string,
    desc: string,
    chapters: {
        title: string,
        data: BaseData[]
    }[]
}

interface ItemChapterData extends BaseData {
    cover: string,
    chapterId: string,
    chapterName: string,
    images: string[],
    prev: string | null,
    next: string | null,
}

interface FilterData extends BaseData {
    data: BaseData[]
}

interface SearchProps {
    kw: string,
    page?: number
}

interface Controller {
    name: string,
    host: string,
    getFilter: () => Promise<FilterData[]>,
    getAll: ({ }: { type?: string, status?: string, area?: string, order?: string, page?: number }) => Promise<ItemBaseData[]>,
    getSearch: (props: SearchProps) => Promise<ItemBaseData[]>,
    getItem: ({ }: { id: string }) => Promise<ItemData>,
    getImage: ({ }: { id: string, chapterId: string }) => Promise<ItemChapterData>
}


interface CenterController {
    getFilter: () => Promise<FilterData[][]>,
    getSearch: (props: SearchProps) => Promise<ItemBaseCenterData[]>
}
interface GenerateCenter {
    (controllers: { [props: string]: Controller }): CenterController
}

