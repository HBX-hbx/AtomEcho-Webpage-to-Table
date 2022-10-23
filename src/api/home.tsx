import request from '../utils/network';
// 从 html 中导入表格
export function load_table_from_html(data: any) {
  // params example {
  //    data: '<HTML> string'
  //    table_name: 'string'
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
  //    data: '<HTML> string'
  // }
  return request.post('/api/filltable/submit_content_record', data);
}
