$(document).ready(function(){
	/*global $*/

	var cover = $('.coverXPanel');	
	var gate = $(window),
	item = $('#module'),
	bay = $('.panel'),
	snap = $('.handle'),
	inner = $('.axial'),
	mark = snap.outerHeight(),
	yaw = 'mousemove.area touchmove.area',
	ken = [{},{},{},{},{}], hit = {},  /*ken변화*/
	room, ambit, duct, ere ;
	
	//축
	var 
	x_bay= $('.x_panel'),
	x_snap = $('.x_handle'),
	x_mark =x_snap.outerWidth(),
	x_hit = {},
	x_room=[0,0,0,0] , x_ambit , x_duct, x_ere;
	var x_ken = new Array();
	x_ken = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
	var x_quota=[[]];
	//각 행마다 의 렬 의 개수 저장하는 부분
	var line = 3;
	
	//시작 부분 몇개 고를지
	
	var initMouseOver = (function (){
		var row = [];
		
		return {
			forRoop : function (){
				row = [];
				$('.coverXPanel').css("background","#fff");
				for(var i=0; i<=$(this).parent().attr('coverPanel'); i++){
					row.push(Number($(this).attr('coverXPanel'))+1);
					for(var j=0; j<=$(this).attr('coverXPanel'); j++){
						$('[coverPanel='+i+']').children('.coverXPanel').eq(j).css("background","#4267b2");
					}
				}
			},
			initClick : function (){
				console.log(1);
				$('.init').css("display","none");
				return initialization(row);
			},
			value: function() {
		      return row;
		    }
		}
	})();
	
	cover.on('mouseover',initMouseOver.forRoop);
	cover.on('click',initMouseOver.initClick);

	

	
	function initialization(rowNo){
		var noRow = rowNo;
		for(var i=0; i<noRow.length; i++){
			if(noRow[i]==0) break;
			$('<section class="panel new" style="height: calc((100% - '+(noRow.length-1)*5+'px) / '+(noRow.length)+'"><div class="axial spill panel-no'+i+'" panel-no='+i+'></div></section>').appendTo("#module");
			if(noRow[i+1]!=0 & i<noRow.length-1) {
				$('<div class="handle"  handle_no='+ i +' ></div>').appendTo('#module');
			}
			x_room[i] = item.width()-(noRow[i]-1)*5;
			for(var j=0; j<noRow[i]; j++){
				var string = '<section id="cover" value='+i+''+j+' class="x_panel" panel_parent='+i+' x_panel_id='+j+' style="width: calc((100% - '+(noRow[i]-1)*5+'px) / '+noRow[i]+')">'+
							'<div id="iframeBox" class="iframeBox " value='+i+''+j+'>' +
							'<div value='+i+''+j+' class="option_hover exep optionClose" id="option_hover"  >'+
							'<div class="optionicon exep"><img class="exep" src="icon.png"></div>'+
							'</div>'+
							'<div id="op'+i+''+j+'" class="exep x_axial x_spill">'+
							'<div class="option">'+
							'<div class="exep option_box">'+
							'<div class="exep cycle fleft">'+
							'<span class="cycle_min">1</span>'+
							'<span class="cycle_min">3</span>'+
							'<span class="cycle_min">5</span>'+
							'</div>'+
							'<div class="exep url fleft">'+
							'<input id="loadUrl'+i+''+j+'" txti='+i+' txtj='+j+' type="text" class="exep urll" placeholder="URL"></div>'+
							'<div class="clearfix"></div></div></div></div></div>'+
							'<div value='+i+''+j+' class="iframeCont"></div>'+
							'</section>';			
				$(string).appendTo($('.panel-no'+i+''));
				if(j<noRow[i]-1) $('<div id="x_handle" class="x_handle fleft" parent_no='+i+' handle_no='+j+'></div>').appendTo('.panel-no'+i+'');
			}
		}
		
		
		$(".option_hover").on("click",function(){
			if($(this).hasClass("optionClose")){
				$(this).addClass("optionOpen");
				$(this).removeClass("optionClose");
				$("#op"+$(this).attr("value")).stop().slideDown("slow");
			}else if($(this).hasClass("optionOpen")){
				$(this).removeClass("optionOpen");
				$(this).addClass("optionClose");
				$(".x_axial").slideUp("slow");
			}
		});
		$("html").on("click",function(e){
			if(!$(e.target).hasClass("exep") && $(".option_hover").hasClass("optionOpen")) { 
				$(".option_hover").removeClass("optionOpen");
				$(".option_hover").addClass("optionClose");
				$(".x_axial").slideUp("slow");
			}
		});
		renewVariable();
		pulseMuzzle(); // 이건 왜 있는건지 잘 모르겠다.
		assayField();
		
	
		gate.on('mouseleave touchcancel', function(e) {
			!(e.type == 'mouseleave' && e.relatedTarget) && lotRelieve();
		})
		.on('load',scopeData,x_scopeData).resize($.restrain(100, checkPlot));
	
		
		/// y축 드래그 
		snap.addClass('drag').on('mousedown touchstart', function(e) {
			$('iframe').hide();  //hide 를 쓰면 iframe창이 맨위로 올라간다. 따른 방법이 없을까?
			
			tagPoints(this, e); //hitStart에 값을 넣어주려고
			
			/*$(this).index('.handle') 몇번째 핸들인지 알기위함 맨위는 0 그아래는 1 */ 
			/*!$(this).index('.handle') 느낌표를 붙여서 0은 반대로 true가 되고 1은 false가 된다*/
			var above = $(this).attr('handle_no'); 
			var unit ;
			if(above == 0) {
				unit = 0; 
			}else{
				unit = mark*above;
			}
			var space = room+unit,
			last = hit.start;
			
			gate.one('mouseup' , function(e) {
				$('iframe').show();
			})
			
			gate.one('mouseup touchend', lotRelieve).on(yaw, function(e) {
				hubTrace(e);
			})
			.on(yaw, $.restrain(30, function() { /*$.restrain(400, function() 숫자를 통해 함수 작동시간을 조절 가능하다.*/
				var target = Math.max(unit, Math.min(hit.aim, space)), //머리를 꼭대기 까지 박기전까진 Math.min(hit.aim, space 이 더큼
				// 머리 땅끝까지 박기전까진 hit.aim가더 작음 그러므로 target은 왠만하면 hit.aim를 선택한다는것 
				up = hit.now < last,
				extent = space-target; //3개 떄에 extent 는 room+unit-target값이다 room 은 body-핸들들의 값을 뺸것,unit은 핸들값들의 곱(대신 유동적),tartget은 hit.aim
				last = hit.now;
				if (above==0) {
					bay.eq(0).height(target); // 위쪽 핸들을 이용해 움직일때 맨위 패널의 크기를 결정한다.
					if (ken[1].range || up){
						bay.eq(1).height(extent-ken[2].range-ken[3].range-ken[4].range);
					}else if(ken[2].range || up){
						bay.eq(2).height(extent-ken[3].range-ken[4].range);
					}else if(ken[3].range || up){
						bay.eq(3).height(extent-ken[4].range);
					}else if(ken[4].range || up){
						bay.eq(4).height(extent);
					}
					
				}else if(above==1){
					bay.eq(1).height(target-unit-ken[0].range);
					if (ken[2].range || up){
						bay.eq(2).height(extent-ken[3].range-ken[4].range);
					}else if(ken[3].range || up){
						bay.eq(3).height(extent-ken[4].range);
					}else if(ken[4].range || up){
						bay.eq(4).height(extent);
					}
					if((ken[1].range == !+up)){
						bay.eq(0).height(target-unit);
					}
				}else if(above==2){
					if(up){
						if(ken[2].range){
							bay.eq(2).height(target-ken[1].range-ken[0].range);
						}else if(ken[1].range){
							bay.eq(1).height(target-ken[0].range);
						}else{
							bay.eq(0).height(target);
						}
						bay.eq(3).height(extent-ken[4].range);
					}else{
						if(ken[3].range){
							bay.eq(3).height(extent-ken[4].range);
						}else{
							bay.eq(4).height(extent);
						}
						bay.eq(2).height(target-ken[1].range-ken[0].range);
					}
					
					
				}else if(above==3){
					bay.eq(4).height(extent);
					if(ken[3].range || !up){
						bay.eq(3).height(target-unit-mark-ken[0].range-ken[1].range-ken[2].range);
					}else if(ken[2].range ||!up){
						bay.eq(2).height(target-mark-ken[0].range-ken[1].range);
					}else if(ken[1].range ||!up){
						bay.eq(1).height(target-mark-ken[0].range);
					}else{
						bay.eq(0).height(target);
					}
				}
				if (ere) driftStrip();
				//위가 어떻게 변하는지에 대한 내용이다.뽀인트
				
				scopeData();
			}));
		
			e.preventDefault();
		});
		
		///// x축 
		x_snap.addClass('drag').on('mousedown touchstart', function(e) {
		
		
			$('iframe').hide();  //hide 를 쓰면 iframe창이 맨위로 올라간다. 따른 방법이 없을까?
			
			
			x_tagPoints(this, e); //hitStart에 값을 넣어주려고
			var parent_point = $(this).attr('parent_no');
			var above = $(this).attr('handle_no'); 
			var unit ;
			if(above == 0) {
				unit = 0; 
			}else{
				unit = x_mark*above;
			}
			var space = x_room[parent_point]+unit,
			x_last = x_hit.start;
			gate.one('mouseup' , function(e) {
				$('iframe').show();
			})
			
			gate.one('mouseup touchend', lotRelieve).on(yaw, function(e) {
				x_hubTrace(e);
			})
			.on(yaw, $.restrain(50, function() {
				var target = Math.max(unit, Math.min(x_hit.aim, space));
				var left = $('[parent_no='+parent_point+']').eq(above).offset().left>x_hit.aim,
				right = $('[parent_no='+parent_point+']').eq(above).offset().left<x_hit.aim,
				extent = space-target; 
				
				
				if (above==0) {
					// attach detach을 만들어라
					$('[panel_parent='+parent_point+']').eq(0).width(target);
					if (x_ken[parent_point][1] || left) 
					{
						$('[panel_parent='+parent_point+']').eq(1).width(extent-x_ken[parent_point][2]-x_ken[parent_point][3]-x_ken[parent_point][4]);
					}else if(x_ken[parent_point][2] || left){
						$('[panel_parent='+parent_point+']').eq(2).width(extent-x_ken[parent_point][3]-x_ken[parent_point][4]);
					}else if(x_ken[parent_point][3] || left){
						$('[panel_parent='+parent_point+']').eq(3).width(extent-x_ken[parent_point][4]);
					}else if(x_ken[parent_point][4] || left){
						$('[panel_parent='+parent_point+']').eq(4).width(extent);
					}
					
				}
				
				
				else if(above==1){
					$('[panel_parent='+parent_point+']').eq(1).width(target-unit-x_ken[parent_point][0]);
					if (x_ken[parent_point][2] || left){
						$('[panel_parent='+parent_point+']').eq(2).width(extent-x_ken[parent_point][3]-x_ken[parent_point][4]);
					}else if(x_ken[parent_point][3] || left){
						$('[panel_parent='+parent_point+']').eq(3).width(extent-x_ken[parent_point][4]);
						
					}else if(x_ken[parent_point][4] || left){
						$('[panel_parent='+parent_point+']').eq(4).width(extent);
					}
					if((x_ken[parent_point][1] == !+left)){
						$('[panel_parent='+parent_point+']').eq(0).width(target-unit);
					}
					
				}
				
				else if(above==2){
					if(left){
						if (x_ken[parent_point][2]){$('[panel_parent='+parent_point+']').eq(2).width(target-unit-x_ken[parent_point][1]-x_ken[parent_point][0]);}
						else if(x_ken[parent_point][1] && x_ken[parent_point][0]){
							$('[panel_parent='+parent_point+']').eq(1).width(target-unit-x_ken[parent_point][0]);
						}else{
							$('[panel_parent='+parent_point+']').eq(0).width(target-unit);
						}
						$('[panel_parent='+parent_point+']').eq(3).width(extent-x_ken[parent_point][4]);
					}else{
						if(x_ken[parent_point][3]){
							$('[panel_parent='+parent_point+']').eq(3).width(extent-x_ken[parent_point][4]);
						}else{
							$('[panel_parent='+parent_point+']').eq(4).width(extent);
						}
						$('[panel_parent='+parent_point+']').eq(2).width(target-unit-x_ken[parent_point][1]-x_ken[parent_point][0]);
						
					}
					
				}else if(above==3){
					$('[panel_parent='+parent_point+']').eq(4).width(extent);
					if(x_ken[parent_point][3] || right){
						$('[panel_parent='+parent_point+']').eq(3).width(target-unit-x_ken[parent_point][2]-x_ken[parent_point][1]-x_ken[parent_point][0]);
					}else if(x_ken[parent_point][2] || right){
						$('[panel_parent='+parent_point+']').eq(2).width(target-unit-x_ken[parent_point][1]-x_ken[parent_point][0]);
					}else if(x_ken[parent_point][1] || right){
						$('[panel_parent='+parent_point+']').eq(1).width(target-unit-x_ken[parent_point][0]);
					}else if(x_ken[parent_point][0] || right){
						$('[panel_parent='+parent_point+']').eq(0).width(target-unit);
					}
					
				}
				
				if (ere) driftStrip();
				
				x_scopeData();
			}));
		});
	
	}
	
	
	
	function renewVariable(){
		gate = $(window),
		item = $('#module'),
		bay = $('.panel'),
		snap = $('.handle'),
		inner = $('.axial'),
		mark = snap.outerHeight(),
		yaw = 'mousemove.area touchmove.area',
		ken = [{},{},{},{},{}], hit = {},  /*ken변화*/
		room, ambit, duct, ere;
		
		
		
		//축
		x_bay= $('.x_panel'),
		x_snap = $('.x_handle'),
		x_innner =$('x_axial'),
		x_mark =x_snap.outerWidth(),
		x_hit = {},
		x_ambit, x_duct, x_ere;
		x_ken = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
	}
	
	
	function checkPlot() {		//웹창이 변화될때 나오는 이벤트 다시 재조정
		room = item.height()-line*mark;
		for(var i=0; i<initMouseOver.value().length; i++){
			if(initMouseOver.value()[i]==0) break;
			x_room[i] = item.width()-(initMouseOver.value()[i]-1)*5
		}
		
	
		console.log(x_quota);	
		
		ambit = bay.width();
	
		bay.each(function(i) {
			$(this).height(room*ken[i].quota);
		});
		x_bay.each(function(i){
			$(this).width(x_room[$(this).parent().attr('panel-no')]* x_quota[i]);
		});
		if (ere) driftStrip();
		scopeData();
		x_scopeData();
	
		
	}
	
	function tagPoints(mean, act) { 
		//mean은 handle , act는 mouse를 움직일떄 handle의 이벤트, 처음 시작하고 맨꼭대기 
	    //맨아래 박기전에 다시 시작 안한다
		/*console.log($(mean).position().top); // <div class="handle">  그자체
		console.log(act.pageY); */
		
		/*$(mean).position().top 와 act.pageY 차이는? 9~13px정도 차이가 이씀 */
		var tap = act.originalEvent.touches; // 처음엔 undefined 가 나옴
		hit.start = tap ? tap[0].pageY : act.pageY; //undefined 가 나오니깐 act.pageY가 저장
		hit.onset = $(mean).position().top; // postion은 부모 요소의 값에 따라 상대적인 위치를 나타낸다
		// offset 은 절대값
		
	}
	
	function x_tagPoints(mean,act){
		var tap = act.originalEvent.touches;
		x_hit.start = tap ? tap[0].pageX : act.pageX;
		x_hit.onset = $(mean).position().left;
		
	}
	
	function hubTrace(task) {
		var rub = task.originalEvent.touches;
		hit.now = rub ? rub[0].pageY : task.pageY;
		hit.aim = hit.onset+hit.now-hit.start;
		
	}
	function x_hubTrace(task){
		var rub = task.originalEvent.touches;
		x_hit.now = rub ? rub[0].pageX : task.pageX;
		x_hit.aim = x_hit.onset+x_hit.now-x_hit.start
	
	}
	
	
	function lotRelieve() {
		gate.off(yaw);
	}
	
	function driftStrip() {			//가로크기.. 각 패널들의 크기를 조정해주는 역할
		inner.each(function(i) {
			duct = this.getBoundingClientRect().width-$('.hint').eq(i).width();
			if (duct || ere) {
				$(this).width(ambit+duct); //여기서 완전히 변한게 아니고 한번 더 변하는듯
			}
		});
	}
	
	//세로크기
	function scopeData() {
		/*bay.each(function(i) {
			var own = ken[i],
			summit = $(this).height(); // ken과 submit에 ".panel"의 높이를 넣음
			own.range = summit;
			own.quota = summit/room;
		});*/
		for(var i=0; i<5; i++){
			var own = ken[i],
			summit = bay.eq(i).height(); // ken과 submit에 ".panel"의 높이를 넣음
			if(summit==undefined) summit =0;
			own.range = summit;
			own.quota = summit/room;
		}
	}
	
	function x_scopeData(){
		var saveParent=0;
		var x_own = [[]];
		
		x_bay.each(function(i){
			x_own = x_ken[$(this).parent().attr('panel-no')][$(this).attr('x_panel_id')] = $(this).width();
			var x_summit = $(this).width();
			x_range = x_summit;
			x_quota[i] = x_summit/x_room[$(this).parent().attr('panel-no')];
		});
		
	}
	
	function assayField() {
		room = item.height()-(initMouseOver.value().length-1)*mark; //가로줄이 추가가 되면 mark 곱이 추가되어야한다.
		ambit = bay.width();
		inner.append('<div class="hint"></div>');
		driftStrip();
		scopeData();
		x_scopeData();
		inner.removeClass('spill');
		if (duct) ere = true; // 여기서 ere를 true로 만듬
	}
	
	function pulseMuzzle() {
		
		$.restrain = function(delay, callback) {
			
			
			var executed = 0, debounce,
			throttle = function() {
			var elapsed = Math.min(delay, Date.now()-executed),
			remain = delay-elapsed;
			debounce && clearTimeout(debounce);
			elapsed == delay && runIt();
			if (remain) debounce = setTimeout(runIt, remain);
	
			function runIt() {
			executed = Date.now();
			callback.apply(this, arguments);
			}
			}
			return throttle;
		}
	}

});