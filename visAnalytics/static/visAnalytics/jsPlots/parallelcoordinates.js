/* Class (object) for drawing the parallel coordinates graph. All event will
be handled here.*/

function ParallelCoordinates() {
    /* Object for handling the parallel coordinates plot. Data members:
        -scene, camera, renderer: For drawing on canvas.
        -graphName: The name of the graph.
        -data: All the data needed for the plot.
        -ranges: The range of each of the axis.
        -numAxes: The dimension of the data.
        -selector: The id of the element on the DOM.
        -labels: Labels for axes.
        -database: Name of the database to work with.
    */
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera( -0.1, 1.1, 1.1, -0.1, -0.1, 1.0 );
    this.renderer = new THREE.WebGLRenderer( { antialiase: false, preserveDrawingBuffer: false } );
    this.graphName = 'parallelcoordinates';
    this.data = [];
    this.ranges = [];
    this.numAxes = 0;
    this.selector = "";
    this.labels = "";
    this.database = "";

    /* Initialize the object */
    this.init = function( database ) {
        var needhtml = 1;
        this.setDatabase( database );
        this.initCanvas();
        this.getData( needhtml );
        this.Draw();
        this.bindEvents();
    };

    /* Initialize the canvas */
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

    /* Gets the data from the server.
        -needhtml: if the html is required from the server.
    */
    this.getData = function( needhtml ) {
        /* Data to send to the server:
            -db: name of database.
            -coor: Axes to be displayed.
            -needhtml: If the html of the element is needed.
        */
        var requestData = {
            "db": this.database,
            "coor": [],
            "needhtml": needhtml
        };

        // For storing the data
        var html = "";
        var ranges = [];
        var numAxes = 0;
        var pCoordId = 0;
        var labels = [];
        var incomingData = [];

        // Send request
        $.ajax({
            url: "http://127.0.0.1:8000/visAnalytics/pcoordinates",
            data: requestData,
            dataType: "json",
            async: false,
        // Process the response
        }).done( function( data ) {
            // Retrieve the recieved data
            ranges = data.ranges;
            numAxes = data.numAxes;
            pCoordId = data.pCoordId;
            labels = data.labels;
            incomingData = data.data;
            if ( data.html ) {
                html = data.html;
            }
        });

        // Set the data
        this.setData( incomingData );
        this.setRanges( ranges );
        this.setNumAxes( numAxes );
        this.setSelector( pCoordId );
        this.setLabels( labels );
        this.addToDOM( html );
    };

    /* Set the database to be used */
    this.setDatabase = function( database ) {
        this.database = database;
    };

    /* Set the data to work with */
    this.setData = function( data ) {
        this.data = data.slice(0);
    };

    /* Set the ranges of each axis */
    this.setRanges = function( ranges ) {
        this.ranges = ranges.slice(0);
    };

    /* Set the number of dimensions */
    this.setNumAxes = function( numAxes ) {
        this.numAxes = numAxes;
    };

    /* Set the id of the element corresponding to the graph */
    this.setSelector = function( selector ) {
        this.selector = "#" + selector;
    };

    /* Set the labels of the graph */
    this.setLabels = function( labels ) {
        this.labels = labels.slice(0);
    };

    /* Add the canvas to the DOM */
    this.addToDOM = function( html ) {
        if ( html === "") {
            return;
        }

        var mainBody = $( "#main" );
        // Append the canvas after the <legend> element
        var closeTag = "</legend>";
        var closeTagIndex = html.search( closeTag ) + closeTag.length;
        var splitHtml = html.substring( 0, closeTagIndex );
        closeTag = "</fieldset>";
        splitHtml = splitHtml.concat( closeTag );

        mainBody.append( splitHtml );
        // Get the container (aka fieldset) of the histogram. Supposed to be already inserted
        var container = $( this.selector );
        container.append( this.renderer.domElement );

        // Get the rest of the html
        splitHtml = html.substring( closeTagIndex, html.search( closeTag ) );
        container.append( splitHtml );

        // Change the size of the renderer based on the containing element size
        var canvas = $( this.selector );
        var width = canvas.width();
        var height = canvas.height();
        this.renderer.setSize( width, 0.9 * height );
    };

    this.Draw = function() {
        // Clear the scene
        this.scene.remove.apply( this.scene, this.scene.children );

        // Draw the graph
        this.DrawAxes();
        this.DrawLines();
        this.DrawBoundingBox();
        this.DrawLabels();

        this.renderer.clear();
        this.renderer.render( this.scene, this.camera );
    };

    /* Draw the axes of the plot */
    this.DrawAxes = function() {
        // The color of the lines
        var material = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
        // Calculate the spacing between || lines
        var spacing = 1.0 / ( this.numAxes - 1.0 );

        for (var i = 0; i < this.numAxes - 1; i++ ) {
            // Set the location of the lines
            var geometry = new THREE.Geometry();
            geometry.vertices.push( new THREE.Vector3( i * spacing, 0.0, 0.0 ) );
            geometry.vertices.push( new THREE.Vector3( i * spacing, 1.0, 0.0 ) );
            // The lines
            var axis = new THREE.Line( geometry, material );
            this.scene.add( axis );
        }
    };

    /* Draw the line of each data */
    this.DrawLines = function() {
        // The color
        var material = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1 } );
        // Space between each axis
        var spacing = 1.0 / ( this.numAxes - 1.0 );
        // Iterate over all data
        for ( var i = 0; i < this.data.length; i++ ) {
            var geometry = new THREE.Geometry();
            for (var j = 0; j < this.data[i].length; j++) {
                var coordNorm = Map( this.data[i][j], this.ranges[j] );
                geometry.vertices.push( new THREE.Vector3( j * spacing, coordNorm, 0.0 ) );
            }
            var line = new THREE.Line( geometry, material );
            this.scene.add( line );
        }
    };

    /* Draw a box surrounding the plot */
    this.DrawBoundingBox = function() {
        // The color
        var material = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
        // The position
        var geometry = new THREE.Geometry();
        geometry.vertices.push( new THREE.Vector3( 0.0, 0.0, 0.0 ) );
        geometry.vertices.push( new THREE.Vector3( 0.0, 1.0, 0.0 ) );
        geometry.vertices.push( new THREE.Vector3( 1.0, 1.0, 0.0 ) );
        geometry.vertices.push( new THREE.Vector3( 1.0, 0.0, 0.0 ) );
        geometry.vertices.push( new THREE.Vector3( 0.0, 0.0, 0.0 ) );
        // The lines
        var box = new THREE.Line( geometry, material );
        this.scene.add( box );
    };

    /* Draws the name of the axes */
    this.DrawLabels = function() {
        //
    };

    this.bindEvents = function() {
        //
    };
};

/* Maps the value in range [Range[0], Range[1]] to the range [0, 1] 
    -oRange: old range.
    -value: current value.
*/
function Map( value, oRange ) {
    var unitRange = [0.0, 1.0];

    var norm = ( ( value - oRange[0] ) * ( unitRange[1] - unitRange[0] ) / ( oRange[1] - oRange[0] ) ) + unitRange[0];

    return norm;
}