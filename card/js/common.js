// JavaScript Document


 // shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame ||
		  window.webkitRequestAnimationFrame ||
		  window.mozRequestAnimationFrame ||
		  window.oRequestAnimationFrame ||
		  window.msRequestAnimationFrame ||
		  function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element){
		  window.setTimeout(callback, 1000 / 60);
		};
})();

function getDis(x1,y1,x2,y2){
	return  Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
}

//命运石之门
var SteinsGate=function(info,type,game){
	if(!info){return "undefined";}
	var that=this;
		this.tag=info.tag;


	if(type=="dom"){//dom生成
		if(!document.getElementById(this.tag)){
			var cfg=document.createElement("div");
		}else{
			var cfg=document.getElementById(this.tag);
		}	
			// <!-- <div id="cfg" class="tou1"><div class="cfg-tou "></div></div> -->
			this.dom=cfg;
			this.data={"w":72,"h":97,"x":100,"y":298};

		    cfg.id=this.tag;
			cfg.className="cfgBody1 tou1";
			
			//cfg.innerHTML='<img src="images/cfg_tou.png" />'
			cfg.innerHTML='<div class="tou"><img src="'+info.img+'" /></div>';
			//cfg.style.left=this.data.l+"px";
			cfg.style.webKitTransform="translateX("+this.data.l+"px)";
			cfg.style.top=this.data.y+"px"; //298px;
		
			
			$("#game-box").append(cfg);	
			this.moving=false;
					

	}
	else{//canvas生成
		if(this.tag=="zidan"){
				this.img=new Image();
			    this.data={"w":10,"h":84,"x":0,"y":100};
				this.src=info.img;
				this.collide=false;
				this.animate=true;
				this.loadimg=function(){
					that.img.src=that.src;
					that.img.onload = function () {	
						game.ziDanList.push(that);
					}	
				}();
		}
		if(this.tag=="npc"){
				this.img=new Image();
			    this.data={"w":info.w,"h":info.h,"x":info.x,"y":info.y};
			    this.ren=info.ren;
			    this.speed=info.speed;
				this.src=info.img;
				this.collide=false;
				this.animate=true;
				this.loadimg=function(){
					that.img.src=that.src;
					that.img.onload = function () {	
							 
						game.npcList.push(that);
						
					}	
				}();
		}
		
	}
}



//游戏 构造函数
var	CollideGame=function(options){
	if(typeof options=="undefined"){options={};};
	this.default_options={"fps":60,"timeMax":5};
	this.option={};
	
	this.option.fps=options.fps||this.default_options.fps;
	this.option.timeMax=options.timeMax||this.default_options.timeMax;
	//静态常量
	 window.gameMoudle=this;

	 this.CanvasCon = document.getElementById("lovelive");
	 this.ctx = this.CanvasCon.getContext("2d");
	 this.gametimer=null; 
	 this.gg=false;
	 this.timeMax=this.option.timeMax;

	 this.ziDanList=[];
	 this.npcList=[];
	 this.cfg=null;	//火线姐
	 //清空画布
	 this.ctx.clearRect(0,0,this.CanvasCon.width, this.CanvasCon.height);


	 //ctrl 控制游戏
	 //this._ctrlRound1Game();
} 



CollideGame.prototype= {

		//构建舞台
		_createStage:function(name){ //name:元素名

					// var ele = new zero([name,path+"bg2.jpg",320,554,0,0],"canvas");	
					//this.stage={"width":320,"height":554,img:document.getElementById("stage")};
					//this.timeOver={"width":217,"height":51,img:document.getElementById("timeOver")};
					
		},		
		//构建元素
		_createCavaseEle:function(name,ren,speed){ //name:元素名
					if(name=="cfg"){
						 var ele =new SteinsGate({"tag":name,"img":path+"cfg_tou.png"},"dom",this);
					}
					else if(name=="zidan"){
						 var ele =new SteinsGate({"tag":name,"img":path+"zidan.png"},"canvas",this);
					}
					else if(name=="npc"){
						 var ele =new SteinsGate({"tag":"npc","ren":ren,"speed":speed,"img":path+ren+".png","w":64,"h":72,"x":0,"y":100},"canvas",this);
					}	
					return ele;	
		},
		//控制游戏 
		_ctrlRound1Game:function(){
				this.gg=false;
			 	$(".shoot-btn").removeClass('hid');
			 	$(".round2-tips").addClass('hid');
				//控制火线姐
				this._ctrlRound1Cfg(this._createCavaseEle("cfg"));
				 //控制npc
				this._ctrlRound1Npc();
				 //控制时间轴
			    this._ctrlRound1Time();
				 //开启图像引擎
				this._ctrlCavansGui();
		},
		_ctrlRound2Game:function(lv){
				this.gg=false;
				//清理round1
				this._clearCavansGui();	
				$(".shoot-btn").addClass('hid');
				$(".round2-tips").removeClass('hid');

				this.timeMax=5;
				
				this._ctrlRound2Cfg(lv);
				this._ctrlRound2Npc();
				
				var that=this;
				setTimeout(function(){
					that._ctrlRound2NpcShoot();
					that._ctrlRound2Time();
				},2000)

				//开启图像引擎
				this._ctrlCavansGui();	
		},
		//控制时间 
		_ctrlRound1Time:function(){
			var that=this;
			
			this.timeLong=this.timeMax;
		
			feiris();
			
			function feiris(){
				if(that.gg){clearInterval(that.gametimer);return false;}
				that.timeLong--;
				that._cdRound1Event(that.timeLong);
				that.gametimer=setTimeout(function(){
					if(that.timeLong>0){ 					
						feiris();
					 }
					else{
						that.gg=true;
						clearInterval(that.gametimer);
						that._cdRound1Event(that.timeLong);	
						that._ggRound1Event(that);			
					}
				},1000);

			};
		},
		//控制时间 2
		_ctrlRound2Time:function(){
			var that=this;
			
			this.timeLong=this.timeMax;
		
			feiris();
			
			function feiris(){
				if(that.gg){clearInterval(that.gametimer);return false;}
				that.timeLong--;
				that._cdRound2Event(that.timeLong);
				that.gametimer=setTimeout(function(){
					if(that.timeLong>0){ 					
						feiris();
					 }
					else{
						that.gg=true;
						clearInterval(that.gametimer);
						that._unCtrlRound2Cfg();
						that._clearCavansGui();
						that._cdRound2Event(that.timeLong);	
						that._ggRound2Event(that,"win");						
					}
				},1000);

			};
		},
		
		//火线姐的线路
		_ctrlRound1Cfg:function(ele){ //ele:元素 
				var that=this;
			    this.cfg=ele;
			   	
			   	var vX=1;
			     function autoMove() {
						   if(that.cfg.data.x>320-that.cfg.data.w/2){vX=vX*-1};
						   if(that.cfg.data.x<0){vX=vX*-1};
						   that.cfg.data.x+=vX;
      			}

      			(function animloop(){
		         	 autoMove();
		         	 if(!that.gg){requestAnimFrame(animloop);}//elem没有用
		        })();
		},
		_ctrlRound2Cfg:function(lv){
			var touLv={
					1:{"w":100,"h":120,"x":-10,"y":436,"minX":-30,"maxX":320-20},
					2:{"w":110,"h":130,"x":-10,"y":436,"minX":-30,"maxX":320-20},
					3:{"w":120,"h":140,"x":-10,"y":436,"minX":-30,"maxX":320-20}
			}
			var tmp;
			tmp=this.cfg.data.x;
			this.cfg.data=touLv[lv];
			this.cfg.data.x=tmp;
			this.cfg.dom.className="cfgBody2 tou"+lv;
			this.cfg.dom.innerHTML='<div class="tou"><img src="'+path+'cfg_tou2.png" /></div>';
			this.cfg.dom.style.top=this.cfg.data.y+"px"; 

		   	this.CanvasCon.addEventListener("touchmove",this._canvas_touchmove,false);
		},
		_unCtrlRound2Cfg:function(){
		   	this.CanvasCon.removeEventListener("touchmove",this._canvas_touchmove,false);
		},

		//子弹的线路
		_ctrlRound1Zidan:function(ele,speed){ //ele:元素 
				var that=this;
			    var zidan=ele;
			   	var vY=speed;
			    function autoMove() {
						 if(zidan.animate){ 
						 	zidan.data.y+=vY;
						  	that._isCollideRound1(zidan);
						  	 if( zidan.data.y<=-zidan.data.h){ 
						 	 zidan.animate=false;
						 	 zidan.data.y=-zidan.data.h
						 	 that.ziDanList.shift();
							 ele=null;
						 	 }
						 }
      			}

      			(function animloop(){
		         	 autoMove();
		         	 if(!that.gg){requestAnimFrame(animloop);}//elem没有用
		        })();
		},
		_ctrlRound2Zidan:function(ele,speed,ren){ //ele:元素 
				var that=this;
			    var zidan=ele;
			   	var vY=speed;
			   	var tag=ren;
			    function autoMove() {		  
						 if(zidan.animate){ 
						 	zidan.data.y+=vY;
						  	that._isCollideRound2(zidan);
						  	 if( zidan.data.y>=that.CanvasCon.height-zidan.data.h ){ 
						  	 	 tag.shoot=false;
							 	 zidan.animate=false;
							 	 zidan.data.y=that.CanvasCon.height-zidan.data.h;
							 	 that.ziDanList.shift();
								 ele=null;
						 	 }
						 }
      			}

      			(function animloop(){
		         	 autoMove();
		         	 if(!that.gg){requestAnimFrame(animloop);}//elem没有用
		        })();
		},
		//npc的的线路
		_ctrlRound1Npc:function(){ 
				var that=this;
			   	
			   	var npc1=this._createCavaseEle("npc","panduola",2);
			   	var npc2=this._createCavaseEle("npc","daofeng",1);
			  	var npc3=this._createCavaseEle("npc","siwote",0.5);
			  	var npc4=this._createCavaseEle("npc","aomob",0.5);

			  	npc1.data.x=Math.floor((320-npc1.data.w)* Math.random());
			  	npc2.data.x=Math.floor((320-npc2.data.w)* Math.random());
			  	npc3.data.x=Math.floor((160-npc3.data.w)* Math.random());
			  	npc4.data.x=Math.floor((160-npc4.data.w)* Math.random())+160;
			  	
			  	npc1.data.y=60;
			  	npc2.data.y=110;
			  	npc3.data.y=160;
			  	npc4.data.y=210;
			  	
			  
			    function autoMove() {
			    			for(var i=0; i<that.npcList.length;i++){
			    				that.npcList[i].data.x+=that.npcList[i].speed;
			    				if(that.npcList[i].data.x>320-that.npcList[i].data.w){that.npcList[i].speed=that.npcList[i].speed*-1}
						   		if(that.npcList[i].data.x<0){that.npcList[i].speed=that.npcList[i].speed*-1}
			    			}
      			}

      			(function animloop(){
		         	 autoMove();
		         	 if(!that.gg){requestAnimFrame(animloop);}//elem没有用
		        })();
		},
		_ctrlRound2Npc:function(ele){ //ele:元素 
				var that=this;
			   	
			   	var npc1=this._createCavaseEle("npc","panduola",2);
			  	var npc2=this._createCavaseEle("npc","siwote",0.5);
				
				//潘多拉
			  	npc1.shootSpeed=300;
			  	npc2.shootSpeed=100;

			  	npc1.data.x=Math.floor((320-npc1.data.w)* Math.random());
			  	npc2.data.x=Math.floor((320-npc2.data.w)* Math.random());
			 	
			  	
			  	npc1.data.y=60;
			  	npc2.data.y=60;
			  
			  
			    function autoMove() {
			    			//alert(that.npcList.length);
			    			for(var i=0; i<that.npcList.length;i++){

			    				that.npcList[i].data.x+=that.npcList[i].speed;
			    				if(that.npcList[i].data.x>320-that.npcList[i].data.w){that.npcList[i].speed=that.npcList[i].speed*-1}
						   		if(that.npcList[i].data.x<0){that.npcList[i].speed=that.npcList[i].speed*-1}

			    			}
      			}

      			(function animloop(){
		         	 autoMove();
		         	 if(!that.gg){requestAnimFrame(animloop);}//elem没有用
		        })();
		},
		_ctrlRound2NpcShoot:function(){
				var that=this;
				 function autoShoot() {
					if(that.npcList.length>0){
						for(var i=0; i<that.npcList.length;i++){
							that._Round2NpcShootEvent(that.npcList[i]);
						}
					}
				}

      			(function animloop(){
		         	 autoShoot();
		         	 if(!that.gg){requestAnimFrame(animloop);}//elem没有用
		        })();
			
		},
		_Round2NpcShootEvent:function(ele){
			var that=this;
			if(!ele.shoot){
				 ele.shoot=true;	
				 var delay=Math.floor(300 * Math.random())+ele.shootSpeed;
				 setTimeout(function(){
				 	 var zidan=that._createCavaseEle("zidan");
							zidan.data.x=ele.data.x+zidan.data.w;
							zidan.data.y=ele.data.y+zidan.data.h/2;
							that._ctrlRound2Zidan(zidan,3,ele);

				 },delay);
			}

		},
		//控制显示界面
		_ctrlCavansGui:function(){ 
			
				var that=this;
				var cfg=this.cfg;		//火线姐
				var ziDan=this.ziDanList;

				 function canvasUpdate() {
				 		
				 		//console.log(that.ziDanList)
				 		//alert(that);
				 		that.ctx.clearRect(0,0,that.CanvasCon.width,that.CanvasCon.height);
				 		//console.log(ziDan.length)
				 		if(that.ziDanList.length>0){
				 				for (var i=0; i<that.ziDanList.length;i++){
				 					if(that.ziDanList[i].animate){ //是激活状态
				 						if(!that.ziDanList[i].collide){ //没有碰撞
				 							that.ctx.drawImage(that.ziDanList[i].img,that.ziDanList[i].data.x,that.ziDanList[i].data.y,that.ziDanList[i].data.w,that.ziDanList[i].data.h); 
				 						}
				 					}
				 				}
						 }


						 if(that.npcList.length>0){
				 				for (var i=0; i<that.npcList.length;i++){
				 					if(that.npcList[i].animate){ //是激活状态
				 						if(!that.npcList[i].collide){ //没有碰撞
				 							that.ctx.drawImage(that.npcList[i].img,that.npcList[i].data.x,that.npcList[i].data.y,that.npcList[i].data.w,that.npcList[i].data.h); 
				 						}
				 					}
				 				}
							 	
						 }
				 		//cfg.dom.style.left=cfg.data.x+"px";
					     cfg.dom.style.transform="translateX("+cfg.data.x+"px)";
					     cfg.dom.style.webkitTransform="translateX("+cfg.data.x+"px)";
      					
      			}

      			(function animloop(){
		            canvasUpdate();
		         	if(!that.gg){requestAnimFrame(animloop);}//elem没有用
		        })();

		},
		//清理显示界面
		_clearCavansGui:function(){ 
				this.npcList=[];
				this.ziDanList=[];
				this.ctx.clearRect(0,0,this.CanvasCon.width,this.CanvasCon.height);
		},
		_canvas_touchend:function(e){ //e:touch属性
				e.preventDefault();
					

		},
		_canvas_touchmove:function(e){ //e:touch属性

				e.preventDefault();
				var that=window.gameMoudle;
				that.cfg.moving=true;

				//s		                     320
				//e.touches[0].pageX	     414
			    var w=window.innerWidth;
				var h=window.innerHeight;
				var realX= e.touches[0].pageX*320/w; 
				var realY= e.touches[0].pageY*504/h;
				 
				var posX=realX-that.cfg.data.w/2;
				var posY=realY-that.cfg.data.h/2;


				//console.log(that.cfg.data.x);
				that.cfg.data.x=posX;
				//that.cfg.data.y=posY;
				if(posX<=that.cfg.data.minX){that.cfg.data.x=that.cfg.data.minX; }
				if(posX>=that.cfg.data.maxX){that.cfg.data.x=that.cfg.data.maxX }
				// if(posY<=0){that.cfg.data.y=0; }
				// if(posY>=504-that.cfg.data.h){posY=554-that.cfg.data.h; }
				
				//this._upDatePlayer(_this.farmer,posX,posY,"dom");//更新数据 
		},
		//碰撞检测
		_isCollideRound1:function(ele){
				//console.log(ele.data);
			var that=this;
			 this.ctx.beginPath();	//重置路径
			 this.ctx.rect(ele.data.x,ele.data.y,ele.data.w,ele.data.h); 
			 
			if(!ele.collide){
				skip:
				for(var n=0;n<that.npcList.length;n++){
					for(var i=0;i<that.npcList[n].data.w;i++){
					    if (this.ctx.isPointInPath(that.npcList[n].data.x+i,that.npcList[n].data.y+that.npcList[n].data.h*0.5)){
					    	ele.collide=true;
					    	that.npcList[n].collide=true;
					    	
					    	this._boomEvent(that.npcList[n].data.x,that.npcList[n].data.y);
					    	var niconico=that.npcList[n];
					    	that.npcList.splice(n,1);
					    	this._collide1Event(niconico,that);

					    	//console.log(that.npcList);
					    	break skip; 
					    }
					 }
				}
			}
		},
		//碰撞检测
		_isCollideRound2:function(ele){
				//console.log(ele.data);
			var that=this;
			 this.ctx.beginPath();	//重置路径
			 this.ctx.rect(ele.data.x,ele.data.y,ele.data.w,ele.data.h); 

			// this.ctx.fillStyle="red";
			//  this.ctx.fill();
			// this.ctx.rect(that.cfg.data.x-that.cfg.data.w*0.2,that.cfg.data.y-that.cfg.data.h*0.75,that.cfg.data.w,that.cfg.data.h); 
			 // this.ctx.fillStyle="blue";
			 //  this.ctx.fill();
			var cfgtouX=that.cfg.data.x-that.cfg.data.w*0.5+30;
			var cfgtouY=that.cfg.data.y-that.cfg.data.h*0.75;
			if(!ele.collide){
					skip: 
					for(var i=0;i<that.cfg.data.w;i++){

						    if (this.ctx.isPointInPath(cfgtouX+i,cfgtouY+i) ){
						    	ele.collide=true;
						    	cfg.collide=true;
					
						    	this._boomEvent(that.cfg.data.x+i-84,that.cfg.data.y-84);
						    	this.gg=true;
								clearInterval(this.gametimer);
								this._unCtrlRound2Cfg();
								this._clearCavansGui();
								this._cdRound2Event(this.timeLong);	
								this._ggRound2Event(this,"lose");								    	
						    	break skip; 

						    }
					 }

			}
		},
		//爆炸事件
		_boomEvent:function(x,y,ele){
			var boom=document.createElement("div");
			   		boom.className="boom";
			   		boom.style.left=x+"px";
			   		boom.style.top=y+"px";

			   		$(".game-box").append(boom);
			   		boomBgm.play();
			   		$(boom).one("webkitAnimationEnd",function(){
			   			$(this).remove();
			   		});
		},
		//射击事件
		_shootEvent:function(){
				if(this.gg){return false;}
				var zidan=this._createCavaseEle("zidan");
				zidan.data.x=this.cfg.data.x+zidan.data.w;
				zidan.data.y=this.cfg.data.y-zidan.data.h;
				this._ctrlRound1Zidan(zidan,-3);
		},
		//碰撞事件
		_collide1Event:window.collide1Event //调用外部方法	
		,					
		//gg事件
		_ggRound1Event:window.ggRound1Event //调用外部方法
		,
		_ggRound2Event:window.ggRound2Event //调用外部方法
		,
		//cd事件
		_cdRound1Event:window.cdRound1Event //调用外部方法
		,
		_cdRound2Event:window.cdRound2Event //调用外部方法
}
