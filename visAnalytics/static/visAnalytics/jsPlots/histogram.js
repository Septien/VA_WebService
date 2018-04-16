/* The javascript code for drawing a histogram. Here will be handle all the events comming from
the user as well as from the server.*/

function Histogram() {
    // Necesary for using the three.js
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera( -0.1, 1.1, 1.1, -0.1, -0.1, 1.0 );
    this.renderer = new THREE.WebGLRenderer( { antialiase: false, preserveDrawingBuffer: false } );
    this.numBins = 5;
    this.maxBins = 10;
    this.rectWidth = 1.0 / this.numBins;
    this.frequencies = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.1, 0.9];
    this.minFreq = 0.1;
    this.maxFreq = 0.9;
    this.xRange = [0.0, 1.0];
    this.database = "";
    this.selector = "";

    /* Initialize the object.
        -database: The database with which the user is working with.
        -selector: The of the id of the container of the histogram
     */
    this.init = function( database ) {
        this.database = database;
        this.initCanvas();
        this.sendRequest(0, 0, 0)
        this.addToDOM();
        this.Draw();
        this.bindEvents();
    };

    /* Function to send the request to the server. 
        -needHtml: boolean that indicates if the html for the 
        graph is necessary.
        -axis: number indicating the axis number to be analysed. */
    this.sendRequest = function( axis, needHtml, bins ) {
        var requestData = {
            "db": this.database,
            "axis": axis,
            "bins": bins,
            "needhtml": needHtml
        };

        $.ajax({
            url: "http://127.0.0.1:8000/visAnalytics/histogram",
            data: requestData,
            dataType: "json",
            context: this
        }).done( function( data ) {
            // Retrieve the recieved data
            alert(data);
        });
    };

    /* Initialize the scene and renderer object. */
    this.initCanvas = function() {
        var canvasWidth, canvasHeight, canvasRatio;

        // Default width and height
        canvasWidth = 100;
        canvasHeight = 100;
        canvasRatio = canvasWidth / canvasHeight;

        var backgroundColor = new THREE.Color( 0.9, 0.9, 0.9 );
        // The scene
        this.scene.background = backgroundColor;    // Set a light gray as the background

        // Set default renderer configuration
        this.renderer.setClearColor( backgroundColor, 1 );
        this.renderer.autoClear = false;
        this.renderer.setSize( canvasWidth, canvasHeight );
    };

    // Adds the HTML base code for drawing the histogram
    this.addToDOM = function() {

        var mainBody = $( "#main" );

        var html = '<fieldset class="graph" name="hist" id="histogramplot">\
                    <legend class="graphLabel">Histogram</legend>\
                </fieldset>';
        mainBody.append( html );
        // Get the container (aka fieldset) of the histogram. Supposed to be already inserted
        var container = $( this.selector );
        container.append( this.renderer.domElement );

        html = '<div class="fit-distribution">\
                    <label for="prob-dist"><abbr title="Fit one of the following probability distributions in the histogram. Draws it on the plot.">Fit</abbr>\
                    probability distribution:</label>\
                    <select class="distribution" name="distribution-prob" id="prob-dist">\
                        <option value="none" selected="selected">&nbsp;</option>\
                        <option value="uniform">Uniform distribution</option>\
                        <option value="gaussian">Normal distribution</option>\
                    </select>\
                    <label for="nums">Number of bins:</label>\
                    <input type="number" name="Numbers" id="nums" min="0" max="10" step="1" value="5">\
                </div>';
        container.append( html );

        // Get the default number of bins
        var element = $( this.selector + " #nums" );
        var numBins = parseInt(element.attr( "value" ));
        this.setNumBins( numBins, true );
        
        // Change the size of the renderer based on the containing element size
        var canvas = $( this.selector );
        var width = canvas.width();
        var height = canvas.height();
        this.renderer.setSize(width, 0.9 * height);
    };

    /* Bind event handlers to the widgets on histogram */
    this.bindEvents = function() {
        // Get the DOM element
        var binsSelector = $( "#histogramplot #nums" );
        if ( binsSelector.length < 1 ) {
            return;
        }

        // Attach event
        binsSelector.on( "change", { hist: this }, this.onBinsChanged );
    };

    /* Handle the change of number of bins */
    this.onBinsChanged = function( event ) {
        // Get the histogram class
        var hist = event.data.hist;
        //  Update the number of bins
        var numBins = $( this ).val();
        // Update bins and frequency
        hist.setNumBins( numBins );
        // Redraw
        hist.Draw();
    };

    /* Set the number of bins in the histogram */
    this.setNumBins = function( numBins, withFrequencies ) {
        this.numBins = numBins;
        this.rectWidth = 1.0 / this.numBins;

        if ( !withFrequencies ) {
            this.setFrequencies();
        }
    };

    /* Set the database to work with */
    this.setDataBase = function( database ) {
        this.database = database;
    }

    /* Sends the request to the server for updating the frequencies */
    this.setFrequencies = function() {
        /* Send request */
    };

    this.Draw = function() {
        // Clear scene
        // https://stackoverflow.com/questions/30359830/how-do-i-clear-three-js-scene
        // https://github.com/mrdoob/three.js/issues/5175
        this.scene.remove.apply( this.scene, this.scene.children );
        // Draw
        this.DrawRects();
        this.DrawAxes(); 

        this.renderer.clear();
        this.renderer.render( this.scene, this.camera );
    };

    /* Draws the axes of the plot */
    this.DrawAxes = function() {
        // For the color of the lines
        var xAxisMaterial = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
        var yAxisMaterial = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );

        // The vertices of the lines
        var xGeometry = new THREE.Geometry();
        xGeometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        xGeometry.vertices.push( new THREE.Vector3( 1.05, 0, 0 ) );
        var yGeometry = new THREE.Geometry();
        yGeometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        yGeometry.vertices.push( new THREE.Vector3( 0, 1.05, 0 ) );

        // The lines
        var xAxis = new THREE.Line( xGeometry, xAxisMaterial );
        var yAxis = new THREE.Line( yGeometry, yAxisMaterial );

        this.scene.add( xAxis );
        this.scene.add( yAxis );
    };

    this.DrawRects = function() {
        if ( this.frequencies.length < 1 ) {
            return;
        }

        var initialX = this.rectWidth / 2.0;
        var lineMaterial = new THREE.LineBasicMaterial( { color: 0xFFFF00, linewidth: 1} );
        // Draw the rectangles and lines
        for (var i = 0; i < this.numBins; i++) {
            // The rectangle
            var rectMaterial = new THREE.MeshBasicMaterial( { color: Math.random() * 0xFFFFFF } );
            var rectGeometry = new THREE.BoxGeometry( this.rectWidth, this.frequencies[i], 0.1);
            var rectangle = new THREE.Mesh( rectGeometry, rectMaterial );
            rectangle.position.x = initialX + (i * this.rectWidth);
            rectangle.position.y = this.frequencies[i] / 2.0;
            rectangle.position.z = 0;
            // Add to the scene.
            this.scene.add( rectangle );
        }
    };
};
