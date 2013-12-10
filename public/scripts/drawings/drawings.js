
Drawings = (function() {

  var Drawings = {};

  Drawings.buildEditorFor = function(canvasId, paintId, paintContent) {

    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext("2d");
    if(!context) { console.error("cannot render in 2D with canvas"); return; }

    // Register drawing events
    canvas.addEventListener("mousedown",   enableRenderCircle);
    canvas.addEventListener("mousemove",   renderCircle);
    canvas.addEventListener("mouseup",     function(evt) { disableRenderCircle(evt); saveImage(); } );
    //canvas.addEventListener("contextmenu", clearImage);
    canvas.addEventListener("keyup",       processKeyboardEvent);
    canvas.focus(); // request focus because of keyboard events


    var model = { paintId: paintId, paintContent: paintContent, renderCircleEnabled: false, hue: 0 };

    // Restore image
    restoreImage(context, paintContent);

    // Poll image updates
    pollForImageUpdates();

    function restoreImage() {
      var dataUrl = model.paintContent;
      var imageObj = new Image();
      imageObj.onload = function() { 
        context.drawImage(this, 0, 0); };
        imageObj.src = dataUrl;
    }

    function processKeyboardEvent(event) {
      if(String.fromCharCode(event.keyCode) == 'C') { clearImage(); };
      if(String.fromCharCode(event.keyCode) == 'R') { clearImage(); restoreImage() };
      if(String.fromCharCode(event.keyCode) == 'S') saveImage();
      console.log(event);
    } 

    var renderCircleEnabled = false;
    function enableRenderCircle()  { model.renderCircleEnabled = true; }
    function disableRenderCircle() { model.renderCircleEnabled = false; }
    function canRenderCircle()     { return model.renderCircleEnabled; }

    var hue = 0;
    function renderCircle(event)
    {
      if(!canRenderCircle()) return;

      var radius = Math.floor(Math.random() * 40);
      hue = hue + 10 * Math.random();
      context.fillStyle = 'hsl(' + hue + ', 50%, 50%)';
      context.fillRect(event.offsetX-radius/2, event.offsetY-radius/2,  radius, radius);
    }

    function clearImage()
    {        
      context.canvas.width = context.canvas.width;
      context.lineWidth = 2;
      context.strokeColor = "#550000";
      context.strokeRect(0, 0, context.canvas.width, context.canvas.height);
      event.preventDefault();
      return false;
    }

    function saveImage() {
      var dataUrl = context.canvas.toDataURL();
      console.log(dataUrl);
      
      var client = new XMLHttpRequest();
      client.open("POST", "/drawings/" + model.paintId + "/edit/saveImage");
      client.setRequestHeader("content-type", "application/webpaint+json");
      var jsonData = JSON.stringify({ paint: { id: model.paintId, content: dataUrl } });
      client.send(jsonData);
      client.onreadystatechange = function() {
        if(this.readyState == this.DONE) {
            var response = JSON.parse(this.responseText);
            if(response.success) {
              model.paintContent = dataUrl;
            }        
            else {
              // show error
              restoreImage();   
            }
        }
      }
    }

    function pollForImageUpdates() {
      var client = new XMLHttpRequest();
      client.onreadystatechange = function() {
        if(this.readyState == this.DONE) {
          var response = JSON.parse(this.responseText);
          model.paintContent = response.paint.content;
          console.log("restoring image from received data");
          restoreImage();
          setTimeout(send, 1000);
        }
      }

      setTimeout(send, 1000);

      function send() {
        console.log("pollForImageUpdates");
        client.open("GET", "/drawings/" + model.paintId + "/json");
        client.send();
      }
    }
  
  }


  return Drawings;

})();