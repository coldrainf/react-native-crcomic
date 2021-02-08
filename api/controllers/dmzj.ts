import cheerio from 'cheerio'
import { ajax } from '../util'

const host = "https://m.dmzj.com",
    apiHost = "https://api.m.dmzj.com"

const controller: Controller = {
    name: '动漫之家',
    host,
    async getFilter() {
        const html = await ajax.text(`${host}/classify.html`),
            $ = cheerio.load(html),
            getData = (nth: number) => {
                return $(`#classCon ul:nth-child(${nth}) li`).get().map((li: Element, index) => {
                    return {
                        'id': String(index),
                        'name': $(li).children('a').text()
                    }
                })
            }

        return [
            {
                id: 'type',
                name: '题材',
                data: getData(1)
            },
            {
                id: 'status',
                name: '进度',
                data: getData(3)
            },
            {
                id: 'area',
                name: '地区',
                data: getData(4)
            },
            {
                id: 'order',
                name: '排序',
                data: $('.Sub_H2 a').get().map((a: Element) => {
                    const sortMatch = $(a).attr('onclick')?.match(/sortClickAction\((\d+),/)
                    return {
                        'id': sortMatch ? sortMatch[1] : '',
                        'name': $(a).text()
                    }
                })
            },
        ]
    },
    async getAll({ type = '0', status = '0', area = '0', order = '0', page = 1 }) {
        let url = `${apiHost}/classify/${type}-0-${status}-${area}-${order}-${page - 1}.json`,
            data = await ajax.json(url) as any[]
        return data.map(item => {
            return {
                id: item.id,
                name: item.name,
                cover: 'https://images.dmzj.com/' + item.cover,
                lastChapterId: item.last_update_chapter_id,
                lastChapterName: item.last_update_chapter_name,
            }
        })
    },
    async getSearch({ kw, page = 1 }) {
        if (page > 1) return []
        let data = await ajax.json(`${apiHost}/search/${encodeURIComponent(kw)}`) as any[]
        return data.map(item => {
            return {
                id: item.id,
                name: item.name,
                cover: 'https://images.dmzj.com/' + item.cover,
                lastChapterId: item.last_update_chapter_id,
                lastChapterName: item.last_update_chapter_name,
            }
        })
    },
    async getItem({ id }) {
        let data = await ajax.json(`${apiHost}/info/${id}.html`),
            comic = data.comic,
            date = new Date(comic.last_updatetime * 1000)
        return {
            id: id,
            name: comic.name,
            cover: comic.cover,
            author: comic.authors.split('/'),
            type: comic.types.split('/'),
            area: comic.zone,
            status: comic.status,
            updateTime: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
            desc: comic.introduction,
            chapters: JSON.parse(data.chapter_json).map((item: any) => {
                return {
                    title: item.title,
                    data: item.data.map((d: any) => {
                        return {
                            id: d.id,
                            name: d.chapter_name
                        }
                    })
                }
            })
        }
    },
    async getImage({ id, chapterId }) {
        let data = await ajax.json(`${apiHost}/comic/chapter/${id}/${chapterId}.html`),
            chapter = data.chapter
        return {
            id: id,
            name: data.comic_name,
            cover: 'https://images.dmzj.com/' + data.comic_cover,
            chapterId: chapterId,
            chapterName: chapter.chapter_name,
            images: chapter.page_url,
            prev: chapter.prev_chap_id,
            next: chapter.next_chap_id
        }
    }
}

export default controller