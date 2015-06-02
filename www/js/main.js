/**
 * Created by Huseyin on 17.05.2015.
 */


/*
//Local storage kullanımı
window.localStorage['name'] = 'Huseyin';
var name = window.localStorage['name'] || 'you';
alert('Hello, ' + name);
*/


function loginKontrol()
{

    var durum=window.localStorage['login']||'0';
    return durum;
}


function base_url()
{
    return "http://app.kuaforx.com/";
}

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function custom_alert(title)
{

}