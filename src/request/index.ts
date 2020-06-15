import $ from 'jquery';
import { message } from 'antd';
const frontBaseUrl = 'https://fairsroom.com';
export function Post(url: string, data: {[key: string]: any}, successFn: any){
  $.ajax({
    cache : true,
    type : "POST",
    url : `${frontBaseUrl}${url}`,
    data : data,
    async : false,
    error : function(request) {
      // message.info(request);
    },
    success : function(data) {
      successFn(data)
    }
 });
}