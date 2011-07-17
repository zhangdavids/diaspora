/*   Copyright (c) 2011, Diaspora Inc.  This file is
 *   licensed under the Affero General Public License version 3 or later.  See
 *   the COPYRIGHT file.
 */


jQuery.fn.center = (function() {
  var $window = $(window);
  return function () {
    this.css({
      position: "absolute",
      top: ($window.height() - this.height()) / 2 + $window.scrollTop() + "px",
      left:($window.width() - this.width()) / 2 + $window.scrollLeft() + "px"
    });
    return this;
  };
})();

(function() {
  var Lightbox = function() {
    var self = this;

    this.subscribe("widget/ready", function() {
      $.extend(self, {
        lightbox: $("#lightbox"),
        imageset: $("#lightbox-imageset"),
        backdrop: $("#lightbox-backdrop"),
        closelink: $("#lightbox-close-link"),
        image: $("#lightbox-image"),
        stream: $(".stream_container"),
        body: $(document.body),
        window: $(window)
      });
      
      self.stream.delegate("a.stream-photo-link", "click", self.lightboxImageClicked);
      self.imageset.delegate("img", "click", self.imagesetImageClicked);

      self.window.resize(function() {
        self.lightbox.css("max-height", (self.window.height() - 100) + "px");
      }).trigger("resize");

      self.closelink.click(function(evt){
        evt.preventDefault();
        self.resetLightbox();
      });

      self.body.keydown(function(evt) {

        var imageThumb = self.imageset.find("img.selected");

        switch(evt.keyCode) {
        case 27:
          self.resetLightbox();
          break;
        case 37:
          //left
          self.selectImage(self.prevImage(imageThumb));
          break;
        case 39:
          //right
          self.selectImage(self.nextImage(imageThumb));
          break;
        }
      });
    });

    this.nextImage = function(thumb){
      var next = thumb.next();
      if (next.length == 0) {
        next = self.imageset.find("img").first();
      }
      return(next);
    };

    this.prevImage = function(thumb){
      var prev = thumb.prev();
      if (prev.length == 0) {
        prev = self.imageset.find("img").last();
      }
      return(prev);
    };

    this.lightboxImageClicked = function(evt) {
      evt.preventDefault();
      
      var selectedImage = $(this).find("img.stream-photo"),
          imageUrl = selectedImage.attr("data-full-photo"),
          images = selectedImage.parents('.stream_element').find('img.stream-photo'),
          imageThumb;

      self.imageset.html("");
      images.each(function(index, image) {
        image = $(image);
        var thumb = $("<img/>", {
          src: image.attr("data-small-photo"),
          "data-full-photo": image.attr("data-full-photo")
        });
        
        if(image.attr("data-full-photo") == imageUrl) {
          imageThumb = thumb;
        };

        self.imageset.append(thumb);
      });

      self
        .selectImage(imageThumb)
        .revealLightbox();
    };

    this.imagesetImageClicked = function(evt) { 
      evt.preventDefault();
     

      self.selectImage($(this));
    };

    this.selectImage = function(imageThumb) {
      $(".selected", self.imageset).removeClass("selected");
      imageThumb.addClass("selected");
      self.image.attr("src", imageThumb.attr("data-full-photo"));

      return self;
    };

    this.revealLightbox = function() {
      self.body.addClass("lightboxed");
      self.lightbox
        .css("max-height", (self.window.height() - 100) + "px")
        .show();

      return self;
    };

    this.resetLightbox = function() {
      self.lightbox.hide();
      self.body.removeClass("lightboxed");
    };
  };

  Diaspora.widgets.add("lightbox", Lightbox);
})();
