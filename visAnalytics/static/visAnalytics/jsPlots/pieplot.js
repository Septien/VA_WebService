/* The class (object) for the pieplot. */

function Pieplot() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera( -0.1, 1.1, 1.1, -0.1, -0.1, 1.0 );
    this.renderer = new THREE.WebGLRenderer( { antialiase: true, preserveDrawingBuffer: true } );
    this.frequencies = [];
    this.labels = [];

    // Initialize all necessary events and objects
    this.init = function() {
        this.initCanvas();
        this.addToDOM();
    };

    /* Initialize the camera, renderer and scene */
    this.initCanvas = function() {
        var canvasWidth, canvasHeight;

        // Default canvas size
        canvasWidth = 100;
        canvasHeight = 100;

        // The scene
        this.scene.background = new THREE.Color(0.9, 0.9, 0.9);     // Set a light gray as the background

        // The renderer
        this.setClearColor( 0xe6e6e6, 1 );
        this.renderer.setSize( canvasWidth, canvasHeight );
    }

    /* Add the renderer to the DOM */
    this.addToDOM = function() {
        var mainBody = $( "#main" );

        var html = '<!-- Pieplot ________________________________________________________________________________________________________________-->\
            <fieldset class="graph" name="pieplot" id="piept">\
                <legend class="graphLabel">Pieplot</legend>\
            </fieldset>';
        mainBody.append( html );

        var container = $( "#piept" );
        container.append( this.renderer.domElement );

        // Change the size of the renderer
        var canvas = $( "#piept" );
        var width = canvas.width();
        var height = canvas.height();
        this.renderer.setSize( width, 0.9 * height );
    };

    /* Main draw function */
    this.Draw = function() {
        this.DrawPie();
    };

    /* Draw the pie using filled arcs */
    this.DrawPie = function() {
        var xCenter, yCenter, radius, arcAngle, startAngle;
        var curve, points, geometry, material, arc;
        var numPoints;

        // Center of the pie
        xCenter = 0.5;
        yCenter = 0.5;
        radius = 0.5;
        startAngle = 0.0;
        // Number of points on the curve
        numPoints = 100;

        for ( var i = 0; i < frequencies.length; i++ ) {
            arcAngle = frequencies[i] * 360.0;
            curve = new THREE.EllipseCurve( xCenter, yCenter, radius, radius, startAngle, arcAngle, false, 0);
            points = curve.getPoints( numPoints );
            geometry = new THREE.BufferGeometry().setFromPoints( points );
            material = new THREE.LineBasicMaterial( { color: Math.random() * 0xFFFFFF } );
            arc = new THREE.Line( geometry, material );
        }
    };
}
