var Element = function(option,pContainer){
	this.pContainer = pContainer;
	this.option = {
		"src":"",
		"sizeElement":100,
		"element":"",
		"isColorActive":false,
	}

	$.extend(this.option,option);
	
	var self = this;

	self.option.element.addEventListener("touchstart",function(evt){
		self.initial();
	});
	self.option.element.addEventListener("touchmove",function(evt){
		self.setMove(evt);
	});
}

Element.prototype.initial = function() {
	this.date = new Date();

	var temp = document.createElement("img");
	temp.src = this.option.src;

	console.log(this.option.isColorActive);
	if(this.option.isColorActive){
		temp.id = "e_"+this.date.getTime();
		this.convert(temp);
	}
	else{
		this.stgOrnament = temp;
		this.addToStage();
	}
};

Element.prototype.convert = function(img_convert){
	var $img = jQuery(img_convert);
	var imgID = $img.attr('id');
	var imgClass = $img.attr('class');
	var imgURL = $img.attr('src');
	var self = this;

	jQuery.get(imgURL, function(data) {
		// Get the SVG tag, ignore the rest
		$svg = jQuery(data).find('svg');

		// Add replaced image's ID to the new SVG
		if(typeof imgID !== 'undefined') {
			$svg = $svg.attr('id', imgID);
		}
		// Add replaced image's classes to the new SVG
		if(typeof imgClass !== 'undefined') {
			$svg = $svg.attr('class', imgClass+' replaced-svg');
		}

		// Remove any invalid XML tags as per http://validator.w3.org
		$svg.removeAttr('xmlns:a');

		// Replace image with new SVG
		$img.replaceWith($svg);

		self.stgOrnament = $svg;

		self.addToStage();
	}, 'xml');
}

Element.prototype.addToStage = function () {

	this.stgOrnament.id = "e_"+this.date.getTime();

	// set first position
	$(this.stgOrnament).attr('width',this.option.sizeElement);
	$(this.stgOrnament).attr('height',this.option.sizeElement);
	$(this.stgOrnament).attr('data-x', this.option.x);
	$(this.stgOrnament).attr('data-y', this.option.y);
	var transform = 'translate(' + this.option.x + 'px, ' + this.option.y + 'px)';
	$(this.stgOrnament).css({"transform":transform,"webkit-transform":transform});

	var stage = $("#container").find("#stage");
	stage.append(this.stgOrnament);
	this.pContainer.setCurrentElement(this.stgOrnament);

	$(this.stgOrnament).siblings().removeClass("active");
	$(this.stgOrnament).attr("class","active");

	// initialize interact
	interact("#container #"+this.stgOrnament.id)
	.inertia({
		zeroResumeDelta: true
	})
	.restrict({
		drag: '#container #stage',
		endOnly: true,
		elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
	})
	.draggable({
		max: Infinity,
		onmove: this.setAttribute,
	})
	.gesturable({
		onmove: this.setAttribute,
	});
}



// set element to move by mouse when object addded to stage
Element.prototype.setMove = function(evt) {
	var stage = $(".cup_wrapper").width();
	var x = evt.touches[0].clientX-((window.innerWidth)-(stage)+(this.option.sizeElement/2));
	var y = evt.touches[0].clientY-(this.option.sizeElement);

	$(this.stgOrnament).attr('data-x', x);
	$(this.stgOrnament).attr('data-y', y);
 	var transform = 'translate(' + x + 'px, ' + y + 'px)';
	$(this.stgOrnament).css({"transform":transform,"webkit-transform":transform});

};

Element.prototype.setAttribute = function(evt) {
	var target = evt.target,
    // moving
    x = (parseFloat(target.getAttribute('data-x')) || 0) + evt.dx,
    y = (parseFloat(target.getAttribute('data-y')) || 0) + evt.dy,
    scale = 1, rotate = 0;

	properties.property.setCurrentElement(target);

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

    // rotation
    if(evt.da !== undefined && target.getAttribute('data-rotate') !== null){
    	rotate = parseFloat(target.getAttribute('data-rotate'))+evt.da; 
    }
    else if(target.getAttribute('data-rotate') !== null){
    	rotate = parseFloat(target.getAttribute('data-rotate'));
    }
    else {
    	rotate = 0; 
    }

    var tansform = 'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ') rotate(' + rotate + 'deg)';

    target.style.webkitTransform =
    target.style.transform =
      tansform;

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    target.setAttribute('data-scale', scale);
    target.setAttribute('data-rotate', rotate);
};