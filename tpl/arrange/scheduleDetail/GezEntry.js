/** 
 * 前台跨系统调用统一入口
 */
var GezEntry = function(patternID, patternParams, secInfo, targetWindow) {
	/** 
	 * 模式ID 
	 */
	this.patternID = patternID;
	/** 
	 * 参数列表 
	 * 支持格式：
	 * 		"param1=value1&param2=value2&...&paramN=valueN"
	 * 		{param1:value1, param2:value2, ..., paramN:valueN} 
	 * 		{"param1":"value1", "param2":"value2", ..., "paramN":"valueN"}
	 * 		"{\"param1\":\"value1\", \"param2\":\"value2\", ..., \"paramN\":\"valueN\"}"
	 */
	this.patternParams = patternParams;
	/**
	 * 安全校验信息，后台生成
	 */
	this.secInfo = secInfo;
	/** 
	 * 目标窗口 
	 */
	this.targetWindow = targetWindow;
	
	/**
	 * 进入入口：
	 * 		创建临时表单，请求后台模式入口
	 */
	this.enter = function(){
		//校验参数：
		if(!this.validateParams())	return;
		//生成表单并提交：
		this.form = this.createForm();
		this.form.submit();
		//销毁form：
		this.destory();
	};
	
	/**
	 * 验证构造参数
	 */
	this.validateParams = function(){
		//模式ID为必须参数
		if(typeof(this.patternID) == "undefined" || this.patternID == null || this.patternID == ""){
			return false;
		}
		
		//模式参数列表为非必须参数。如果有值，需要满足特定格式
		if(typeof(this.patternParams) == "undefined" || this.patternParams == null || this.patternParams == ""){
			this.patternParams = new Object();
		}else{
			if(typeof(this.patternParams) == "string" || this.patternParams.constructor == String){
				//参数为字符串类型
				try{
					//尝试解析为json
					this.patternParams = eval("(" + this.patternParams + ")");
				} catch(e) {
					//如果不是json格式，则只能是"param1=value1&param2=value2&...&paramN=valueN"格式
					//将这种格式转为json格式
					this.patternParams = str2JSON(this.patternParams);
				}
			}
		}
		
		//secInfo为必须参数
		if(typeof(this.secInfo) == "undefined" || this.secInfo == null || this.secInfo == ""){
			return false;
		}
		
		//校验目标窗口参数
		if(typeof(this.targetWindow) == "undefined" || this.targetWindow == null || this.targetWindow == ''){
			this.targetWindow = "";
		}
		
		return true;
	};
	
	/**
	 * 创建表单对象
	 */
	this.createForm = function() {
		var urlPath = window.document.location.pathname;
		var contextPath = urlPath.substring(0, urlPath.substr(1).indexOf('/') + 1);
		var form = document.createElement("form");
		form.setAttribute("action", "http://202.205.112.30:8800/reportmis/gezEntry.url");
		form.setAttribute("method", "post");
		form.setAttribute("target", this.targetWindow);
		// 模式ID：
		var patternIDInput = document.createElement("input");
		patternIDInput.setAttribute("type", "hidden");
		patternIDInput.setAttribute("name", "patternID");
		patternIDInput.setAttribute("value", this.patternID);
		form.appendChild(patternIDInput);
		// 安全校验信息
		var secInfoInput = document.createElement("input");
		secInfoInput.setAttribute("type", "hidden");
		secInfoInput.setAttribute("name", "secInfo");
		secInfoInput.setAttribute("value", this.secInfo);
		form.appendChild(secInfoInput);
		
		//其余参数：     
		for(var p in this.patternParams){
			var paramInput = document.createElement("input");
			paramInput.setAttribute("type", "hidden");
			paramInput.setAttribute("name", p);
			paramInput.setAttribute("value", this.patternParams[p]);
			form.appendChild(paramInput);
		}
		
		document.body.appendChild(form);
		return form;
	};
	
	/**
	 * 销毁表单对象
	 */
	this.destory = function(){
		document.body.removeChild(this.form);
		this.form = null;
	};
	/**
	 * 校验用户名密码
	 */
//	this.check = function(username,password,url,callback){
//		
//		$.ajax({   
//	        url:url+'/check.url?callback='+callback,   
//	        dataType:'jsonp',   
//	        data:{username:username,password:password},
//	        success:function(data) { 
//	        	
//	        } 
//	    });  
//	}
	
	
};

/**
 * 参数串转为object对象
 * @param str "param1=value1&param2=value2&...&paramN=valueN"
 */
function str2JSON (str) {
	var obj = new Object();
	
	if(typeof(str) == 'string' || str.constructor == String){
		var paramArr = str.split("&");
		for(var i=0; i<paramArr.length; i++){
			var kv = paramArr[i].split("=");
			obj[kv[0]] = kv[1];
		}
	}
	
	return obj;
}
