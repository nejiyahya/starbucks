var Properties = function(option){
	this.option = {
		"data":[],
		"layout":""
	}
	$.extend(this.option,option);

	var self = this;
	var date = new Date();
	this.userID = date.getTime();
	this.selector = document.createElement("ul");
	this.selector.id = "ListProperties";
	document.getElementById("properties").prepend(this.selector);

	// create submit button
	var submitBtn = document.createElement("input");
	submitBtn.type = "submit";
	submitBtn.id = "submitBtn";
	submitBtn.className+="btn btn-primary";
	submitBtn.value = "SUBMIT";
	this.selector.append(submitBtn);

	self.delete = document.getElementById("delete");
	self.delete.addEventListener("click",function (e) {
		e.preventDefault();
		console.log($("#stage").find(".active"));
		if($("#stage").find(".active").length>0){
			$("#stage").find(".active").remove();
		}
	});

	self.preview = document.getElementById("preview");
	self.preview.addEventListener("click",function (e) {
		e.preventDefault();
		$("#modalStage>div").html("");
		$("#modalStage>div").html($("#container").html())
		$("#modalPreview").show();
	});

	document.getElementById("stage").addEventListener("click",function (evt) {
		if(evt.target != "img"){
			$("#stage").find("img.active").removeClass("active");
		}
	});

	$(document).on('click','#modalPreview .btnClose',function(){
		$("#modalPreview").hide();
	});
	
	submitBtn.addEventListener("click",function (e) {
		$("#loading").show();
		e.preventDefault();
        for (var i=0;i<$(".cup_wrapper #stage")[0].children.length;i++){
            if($(".cup_wrapper #stage")[0].children[i].matches("svg")){
                var image = document.createElement('img');
                image.style.transform = image.style.webkitTransform = $(".cup_wrapper #stage")[0].children[i].style.transform;
                image.id = $(".cup_wrapper #stage")[0].children[i].id;

                $(".cup_wrapper #stage")[0].children[i].style.transform =
                    $(".cup_wrapper #stage")[0].children[i].style.webkitTransform = "";

                var svg = $(".cup_wrapper #stage")[0].children[i].outerHTML;
                var blob = new Blob([svg], {type: 'image/svg+xml'});
                var url = URL.createObjectURL(blob);

                image.addEventListener('load', () => URL.revokeObjectURL(url), {once: true});
                image.src = url;
                $(".cup_wrapper #stage").append(image);
                $(".cup_wrapper #stage")[0].children[i].style.display = "none";
            }
        }

		html2canvas($("#layoutStage"), {
			allowTaint: true,
			foreignObjectRendering:true,
            useCORS: true,
			onrendered: function(canvas) {
				var dataURL = canvas.toDataURL();
				self.dataArt = dataURL;
				self.send();
			}
		});

	})

	// initialize interact
	interact("#container")
	.inertia({
		zeroResumeDelta: true
	})
	.restrict({
		drag: '.main #container',
		endOnly: true,
		elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
	})
	.gesturable({
		onmove: this.setAttribute,
	});
}

Properties.prototype.setAttribute = function(evt) {
	var target = evt.target,
		scale = 1, rotate = 0;

	// scaling
	if(evt.ds !== undefined && target.getAttribute('data-scale') !== null){
		scale = parseFloat(target.getAttribute('data-scale')) * (1 + evt.ds);
	}
	else if(target.getAttribute('data-scale') !== null){
		scale = parseFloat(target.getAttribute('data-scale'));
	}
	else {
		scale = 1;
	}

	var tansform = 'scale(' + scale + ')';

	target.style.webkitTransform =
		target.style.transform =
			tansform;

	target.setAttribute('data-scale', scale);
};

Properties.prototype.send = function() {
	var self = this;

	if(this.dataArt!=undefined){
		$.ajax({
			url: 'saveImage.php',
			type: 'post',
			dataType: 'json',
			data: {
				"type":"art",
				imageArt: self.dataArt,
				layout:self.option.layout,
				"userID":self.userID
			},
			success: function(response) {
				window.location.href = "done.php?id="+self.userID+"&layout="+response.layout;
			}
		});
	}
};

Properties.prototype.init = function() {
	for (var i = 0; i < this.option.data.length; i++) {
		if(this.option.data[i].enabled){
			this.render(this.option.data[i],i);
		}
	}
};

Properties.prototype.render = function(data,index) {
	this.property = new Property({
		"properties":this.selector,
		"name"	:data.name,
		"icon"	:data.icon,
		"assets":data.assets,
		"functional":data.functional,
		"rows":data.rows,
		"column":data.column,
		"index"	:index,
		"list_color" : (typeof data.list_color != undefined)?data.list_color:[]
	},this);

	this.property.render();
};