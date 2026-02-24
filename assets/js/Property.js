var Property = function(option,pContainer) {
	this.pContainer = pContainer;
	this.option = {
		"properties":null,
		"index":0,
		"name":"",
		"icon":"",
		"assets":[],
		"rows":2,
		"column":4,
		"list_color": [],
		"functional":""
	}
	$.extend(this.option,option);
}

Property.prototype.render = function() {
	var self = this;

	// lets create box element for sticker, pettern, or etc
	this.element = document.createElement("li");
	this.element.setAttribute("index",this.option.index);
	this.option.properties.append(this.element);

	// add image to it's box
	this.icon = document.createElement("img");
	this.icon.src = this.option.icon;
	this.element.append(this.icon);

	// add name to the box like sticker, pettern, or etc
	this.name = document.createElement("span");
	this.name.innerText = this.option.name;
	this.element.append(this.name);

	// animation
	this.element.className += "animated bounceIn";
	var delay = 0.2*(self.option.index+1);
	this.element.style.animationDelay = delay+"s";

	// when click to the box
	this.element.addEventListener("click",function(evt){
		if(document.getElementById("listOrnament")){
			document.getElementById("listOrnament").remove();
		}

		// create list of it's element, ex: sticker list
		self.listOrnament = document.createElement("ul");
		self.listOrnament.id = "listOrnament";

		for (var i = 0; i < self.option.assets.length; i++) {
			
			// counting row for slider
			if(i%self.option.rows == 0){
				self.parentLi = document.createElement("li");
				self.block = document.createElement("ul");
				self.parentLi.append(self.block);
			}

			// button ornament
			var ornament = document.createElement("li");
			
			// create image
			var img = document.createElement("img");
			img.src = (self.option.assets[i].image != undefined)?self.option.assets[i].image:self.option.assets[i];
			ornament.append(img);

			// create label
			if(self.option.assets[i].label != undefined){
				self.listOrnament.className += " labelActive";
				var label = document.createElement("span");
				label.innerText = self.option.assets[i].label;
				label.className = "label";
				ornament.append(label);
			}

			self.block.append(ornament);

			// check functional
			if(typeof self.option.functional !== undefined){
				// if sticker
				if(self.option.functional == "sticker"){
					var element = new Element({
						"src":(self.option.assets[i].image != undefined)?self.option.assets[i].image:self.option.assets[i],
						"element":ornament,
						"isColorActive":(self.option.list_color.length>0)?true:false
					},self);
				}
				// if layout
				else if(self.option.functional == "change_layout"){
					var element = new Layout({
						"layout": self.option.assets[i].layout,
						"element": ornament
					});
				}
			}

			// set animated to each ornament
			ornament.className += "animated bounceIn";
			var delay = 0.05*(i+1);
			ornament.style.animationDelay = delay+"s";

			// append to list
			self.listOrnament.append(self.parentLi);
		}

		document.getElementById("properties").prepend(self.listOrnament);
		document.getElementById("container").parentElement.className += " openElement";

		// init slider
		$(self.listOrnament).slick({
			arrows: true,
			infinite:false,
			slidesToShow: 5,
			slidesToScroll: 5,
			responsive: [
			{
				breakpoint: 600,
				settings: {
					slidesToShow: self.option.column,
					slidesToScroll: self.option.column,
				}
			},
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 5,
					slidesToScroll: 5
				}
			}]
		});

		// create button close
		self.closeBtn = document.createElement("button");
		self.closeBtn.className = "btnClose";
		self.listOrnament.prepend(self.closeBtn);
		self.closeBtn.addEventListener("click",function(evt){
			document.getElementById("container").parentElement.classList.remove("openElement");
			self.listOrnament.remove();
		});

		if(self.option.list_color.length>0){
			self.listOrnament.className += " colorActive";
			var listColor = document.createElement("ul");

			var label = document.createElement("span");
			label.innerText = "color";
			listColor.append(label);

			listColor.id = "listColor";
			for (var i=0;i<self.option.list_color.length;i++){
				var list = document.createElement("li");
				list.style.backgroundColor = self.option.list_color[i];
				listColor.append(list);

				list.addEventListener("click",function (e) {
					$("#stage .active path,#stage .active rect,#stage .active polygon").css({"fill":e.target.style.backgroundColor});
				});
			}
			self.listOrnament.prepend(listColor);
		}
	});
};

Property.prototype.setCurrentElement = function(element){
	this.currentElement = element;
	$(this.currentElement).siblings().removeClass("active");
	$(this.currentElement).attr("class","active");
}