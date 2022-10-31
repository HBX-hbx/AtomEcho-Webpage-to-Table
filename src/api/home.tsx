import request from '../utils/network';
// 从 html 中导入表格
export function load_table_from_html(data: any) {
  // params example {
  //    data: '<HTML> string'
  //    table_name: 'string'
  //    url: 'string'
  // }
  return request.post('/api/filltable/load_table_from_html', data);
}
//
export function get_all_table_data(data: any) {
  return request.post('/api/filltable/get_all_table_uid', data);
}

export function submit_content_record(data: any) {
  // params example {
  //    table_uid: ''
  //    name: ''
  //    source: 'html'
  //    data: '<HTML> string'
  // }
  return request.post('/api/filltable/submit_content_record', data);
}
// 为某个表格设置对 url 前缀的监听
export function set_listened_urls(data: any) {
  // param example {
  //     table_uid: '',
  //     listened: true,
  //     data: [
  //         'https://t.qcc.com/',
  //         'https://baike.baidu.com/item/%E5%B0%8F%E8%A1%8C%E6%98%9F/68902',
  //     ]
  // }
  return request.post('/api/filltable/set_listened_urls', data);
}
