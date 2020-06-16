import $ from 'jquery';
import { message } from 'antd';

export const requestUrl = {
  loginUrl: '/EmailRegister/loginUser',
  registerUrl: '/EmailRegister/register',
  boothLayoutUrl: '/boothLayout/json',
  detail: '/boothLayout/detail',
  getCategoryByExhibitorId: '/front/getCategoryByExhibitorId',
  listByCatIdAndExhibitorId: '/front/listByCatIdAndExhibitorId',
}

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
