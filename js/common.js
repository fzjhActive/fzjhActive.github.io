function setCookie(c_name,value,expiredays)
{
	var exdate=new Date()
	exdate.setDate(exdate.getDate()+expiredays)
	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}

function getCookie(c_name)
{

if (document.cookie.length>0)
  {
  	console.log('ok');
  c_start=document.cookie.indexOf(c_name + "=")
  if (c_start!=-1)
    { 
    c_start=c_start + c_name.length+1 
    c_end=document.cookie.indexOf(";",c_start)
    if (c_end==-1) c_end=document.cookie.length
    return unescape(document.cookie.substring(c_start,c_end))
    } 
  }
return ""
}

function checkCookie(newversion)
{
	lastversion=getCookie('version');
	console.log(lastversion);
	if (lastversion!=null && lastversion==newversion){

	}else {
		setCookie('version',newversion,365);
		if (confirm("检查到有新版本更新，是否查看更新日志？")){
			window.location.href="updatelog.html";
		}else{

		}
	}
}