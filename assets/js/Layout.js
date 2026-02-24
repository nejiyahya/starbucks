var Layout = function(option,pContainer){
	this.pContainer = pContainer;
	this.option = {
		"layout":"",
		"element":""
	}

	$.extend(this.option,option);

	var self = this;

	self.option.element.addEventListener("click",function(evt){
		self.clicked();
	});
}

Layout.prototype.clicked = function() {
	var stage = document.getElementById("stage");
	var modalStage = document.getElementById("modalStage");
	stage.setAttribute("style", "-webkit-mask-image:url('"+this.option.layout+"/masking.png')");
	modalStage.setAttribute("style", "-webkit-mask-image:url('"+this.option.layout+"/masking_cup.png')");

	document.getElementsByClassName("layout")[0].src=this.option.layout+"/pola_cup.png";
	document.getElementsByClassName("dash_right")[0].src=this.option.layout+"/right.png";
	document.getElementsByClassName("dash_left")[0].src=this.option.layout+"/left.png";
	document.getElementsByClassName("cup")[0].src=this.option.layout+"/cup.png";

	properties.option.layout = this.option.layout;
};