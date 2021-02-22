export interface PostItem {
    id: number,
    title: string,
    content: string,
    is_pick: boolean, // （存疑）是否精华
    vids: string, // 腾讯视频vid号
    created_time: string,
    comments_counts: number,
    praise_counts: number,
    contribute: {
        idol_id: number,
        level: number
    },
    member: {
        nickname: string,
        headimg: string,
        head_frame: string,
        official_verify: number
    },
    idol_praise: [{
        idol_name: string,
        created_at: number
    }],
    topics: Array<string>
    tag: number
    is_top: boolean,
    status: number,
    created_at: number,
    comment_at: number,
    images: Array<string>,
    comments: [{
        id: number,
        content: string,
        comments_counts: number,
        praise_counts: number,
        member: {
            nickname: string,
            headimg: string,
            head_frame: string,
            official_verify: number
        },
        release_time: number,
        idol_praise: [{
            idol_name: string,
            created_at: number
        }],
        reply_list: [{
            id: number,
            content: string,
            created_at: number,
            fromUser: {
                headimg: string,
                nickname: string
            },
            toUser: {
                headimg: string,
                nickname: string
            },
        }]
    }]
}
