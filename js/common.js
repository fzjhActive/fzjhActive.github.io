
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
  	// console.log('ok');
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
	// console.log(lastversion);
	if (lastversion!=null && lastversion==newversion){

	}else {
		setCookie('version',newversion,365);
		if (confirm("检查到有新版本更新，是否查看更新日志？")){
			window.location.href="updatelog.html";
		}else{

		}
	}
}
function checkCookieNotice(newnotice,noticeContent,noticeLink)
{
	lastnotice=getCookie('notice');
	
	if (lastnotice!=null && lastnotice==newnotice){

	}else {
		setCookie('notice',newnotice,365);
		if (confirm(noticeContent)){
			window.location.href=noticeLink;
		}else{

		}
	}
}

function isBaned(ip)
{
	BAN_LIST=["2409:894c:2:5402:ed93:f4ba:7a0f:3ff4"];
	for(i=0;i<BAN_LIST.length;i++){
		if (BAN_LIST[i]==ip){
			return true;
		}
	}
	return false;
}
function MathCeil(number){
	var temp = parseInt(number);
	if (temp<number){
		temp = temp + 1;
	}
	return temp;
}

function MathFloor(number){
	var temp = parseInt(number);
	
	return temp;
}
function random(a,b){
	return (a+b)/2;
}
function calculations(){
	this.subList = new Array();
	this.subListCondition = new Array();
	this.needList = new Set();
	this.needListCN = new Set();
	var allNeedList = ["avgqiatk", "dssklv", "qiMax2","qimax","roleLv","neiliMax","currcon","currdex","currstr","currint","currCon","currDex","currStr","currInt","looks","CN","wdamage","zhengqi","weight","buff1Num", "buff2Num", "buff3Num", "buff4Num"];
	var allNeedListCN = ["平均气血攻击", "毒术等级", "初始气血上限","气血上限","人物等级","内力上限","根骨","身法","臂力","悟性","根骨","身法","臂力","悟性","颜值","神兵淬炼次数","武器伤害力","侠义值","武器重量","自己正面buff数量", "自己负面buff数量", "对方正面buff数量", "对方负面buff数量"];

	this.create = function(calString){
		if(typeof(calString)==="string"){

		}else{
			return;
		}
		console.log(calString);
		calString = calString.replace('  ', ' ');
		var reg = new RegExp("侠义" , "g" );
		calString = calString.replace(reg,"zhengqi");
		if (calString.indexOf("if")>-1){
			var conditions = calString.slice(calString.indexOf("if ")+3, calString.indexOf(" then "));
			this.subList.push(calString.slice(calString.indexOf("then return")+"then return".length, calString.indexOf("else ")));
			this.subList.push(calString.slice(calString.indexOf("else return")+"else return".length, calString.indexOf("end")));
			this.subListCondition.push(conditions);
		}else{
			this.subList.push(calString);
		}
		for (var i=0;i<this.subList.length;i++){
			for(var j=0;j<allNeedList.length;j++){
				var index = this.subList[i].indexOf(allNeedList[j]);
				if (index>-1){
					this.needList.add(allNeedList[j]);
					this.needListCN.add(allNeedListCN[j]);
				}
			}
		}
	}
	this.cal = function(results,cost){
		var needToCal = this.subList[0];
		if (this.subList.length>1){
			for(var j=0;j<allNeedList.length;j++){
				var reg = new RegExp( allNeedList[j] , "g" );
				this.subListCondition[0] = this.subListCondition[0].replace(reg,"results['"+allNeedList[j]+"']");
			}
			// console.log(this.subListCondition[0]);
			if (eval(this.subListCondition[0])){
				needToCal = this.subList[0];
			}else{
				needToCal = this.subList[1];
			}
		}
		for(var j=0;j<allNeedList.length;j++){
			var reg = new RegExp( allNeedList[j] , "g" );
			needToCal = needToCal.replace(reg,"results['"+allNeedList[j]+"']");
		}
		var reg = new RegExp('\\^' , "g" );
		needToCal = needToCal.replace(reg,"**");
		var indexOfMin =  needToCal.indexOf("min(");
		if(indexOfMin>-1){
			indexOfMin = indexOfMin + "min(".length;
			leftCount = 0;
			rightCount = 0;
			var subEnd = indexOfMin;
			var subMid = indexOfMin;
			for(var i=indexOfMin;i<needToCal.length;i++){
				if(needToCal[i]=="("){
					leftCount = leftCount + 1;
				}else if(needToCal[i]==")"){
					rightCount = rightCount + 1;
				}
				if(needToCal[i]==","){
					subMid = i;
				}
				if(rightCount>leftCount){
					subEnd = i;
					break;
				}
			}
			var sub1 = needToCal.slice(indexOfMin, subMid);
			var sub2 = needToCal.slice(subMid + 1, subEnd);
			var sub1result = eval(sub1);
			var sub2result = eval(sub2);
			var minSub = sub2result;
			if(sub1result<sub2result){
				minSub = sub1result;
			}
			needToCal = needToCal.slice(0,indexOfMin - "min(".length) + minSub + needToCal.slice(subEnd + 1,needToCal.length);
		}
		var result = eval(needToCal);
		if(result <0){
			return '-' + parseInt(-result)+'.'+parseInt(-result*100+parseInt(result)*100);
		}else{
			return parseInt(result)+'.'+parseInt(result*100-parseInt(result)*100);
		}
		 
		// console.log(result);
	}
}