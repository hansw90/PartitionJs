var iframe = document.getElementsByTagName('iframe')[0];
var url ;
var i=0;
var getData = function (data) {
	console.log("1 =="+ i++);
    if (data && data.query && data.query.results && data.query.results.resources && data.query.results.resources.content && data.query.results.resources.status == 200) loadHTML(data.query.results.resources.content);
    else if (data && data.error && data.error.description) loadHTML(data.error.description);
    else loadHTML('Error: Cannot load ' + url);
};
var loadURL = function (src) {
	console.log("2 =="+i++);
    url = src;
    var script = document.createElement('script');
    script.src = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.headers%20where%20url%3D%22' + encodeURIComponent(url) + '%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=getData';
    document.body.appendChild(script);
};
var loadHTML = function (html) {
	console.log("3 =="+i++);
	init = true;
    iframe.src = 'about:blank';
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(html.replace(/<head>/i, '<head><base href="' + url + '"><scr' + 'ipt>document.addEventListener("click", function(e) { if(e.target && e.target.nodeName == "A") { e.preventDefault(); parent.loadURL(e.target.href); } });</scr' + 'ipt>'));
    iframe.contentWindow.document.close();
}

var conc = false; // 제대로 불러왔는가 아닌가 크로스 도메인일떈 이값을 제대로 못불러옴 주소로드 에러는 캐치 불가,?? 
var ifContainer = {
	id:"",
	src:"",
	conc:false
}
var init = false;
/* global $ */
$(document).ready(function(){
   $(document).on("keydown",".urll",function(e){
		if (e.which == 13){
			var src = $(this).val(); ifContainer.src = $(this).val();
			
			/*
			var iframeString = "<iframse src="+$(this).val()+">"*/
            
			/*var iframe2 = document.getElementById('if'+$(this).attr("txti")+$(this).attr("txtj"));*/
			var iframe2 =document.createElement("iframe");
			iframe2.id = "if"+$(this).attr("txti")+$(this).attr("txtj")
			ifContainer.id = "if"+$(this).attr("txti")+$(this).attr("txtj")
			
			console.log("4 =="+i++);
		
			if(src.indexOf("https") != -1){
				iframe2.src = src;
			}else if(src.indexOf("http") != -1){
				iframe2.src = src.replace('http','https');
			}else{
				iframe2.src = "https://" + $(this).val();
			}
			console.log("5 =="+i++);
			/*
			*/
			$('[panel_parent='+$(this).attr("txti")+']').eq($(this).attr("txtj")).children(".iframeCont").html("");
			$(iframe2).appendTo($('[panel_parent='+$(this).attr("txti")+']').eq($(this).attr("txtj")).children(".iframeCont"))
			console.log("6 =="+i++);
			
			iframe2.onload = function() { 
				console.log("load init=!! "+init +" !! and conc = !!"+conc );
				if(init == true){
					init=false;
					conc=false;
				}else{
					conc= true,
					ifContainer.conc= true 
				}
				
			}; // loaded 를 하면 true로 만든다
			
			
			iframe2.onerror = function() { console.log('error!'); };
		
		
			setTimeout(function(){
				if(conc == true){
					return conc= false;
				}
			    iframe = document.getElementById(ifContainer.id);
			    console.log(iframe);		//그냥 네이버는 이걸 안사용한다.
				return loadURL(iframe2.src);
			},3000);
			
		}
        
	});
});