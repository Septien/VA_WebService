/* Hold the selected database */
var database = null;

/* Create functions for the event listeners for the widgets on the page*/

/* Function for the database dropdown list */
function addDatabase( event ) {
    // Get the selected object
    var selected = $( this );
    database = selected.val();

    // Prevent form's default submission
    event.preventDefault();
    // Do not propagete the event upwards
    event.stopPropagation();
};

/* Request the server the script to be added to the DOM*/
function getScript( script ) {
    // Script form the server
    var scriptS = "";

    $.ajax({
        url: "http://127.0.0.1:8000/visAnalytics/script",
        data: { requestedScript: script },
        dataType: "json",
        async: false
    }).done( function( data ) {
        scriptS = data.requestedScript;
    });

    return scriptS;
}

/*  Function for the graph dropdown list. Recieves the selected graph, and sends the request to the
    server, appends the corresponding element to the main part of the document, call the corresponding function for 
    drawing, and set the corresponding event listeners for the graph.
*/
function addGraph( event ) {
    var url, selected, graph, graphs = [], g;
    // Get the select object
    selected = $( this );
    // Get the selected graph
    graph = selected.val();

    // Prevent form's default submission
    event.preventDefault();
    // Do not propagete the event upwards
    event.stopPropagation();

    // Process the selected graph
    var removed = false;
    switch ( graph ) {
        case 'histogram':
            var scriptName = "histogram.js";
            var script = getScript( scriptName );
            var plotMainScript = $( ".plotMainScript" );
            console.log(script);
            plotMainScript.prepend( script );
            g = new Histogram();
            g.init( "processed.cleveland", 0 );
            // Add to the array of charts.
            graphs.push( g );
            break;
        default:
            break;
    }
};

/* Function for the data mining drop down list */
function addDMMethod( event ) {
    // Get the selected method
    var selected = $( this );

    // Prevent form's default submission
    event.preventDefault();
    // Do not propagete the event upwards
    event.stopPropagation();
}

/* The "main" function */
$(document).ready( function() {
    // Bind events
    $( "#databases" ).on( "click", addDatabase );
    $( "#graphs" ).on( "click", addGraph );
    $( "#methods" ).on( "click", addDMMethod );
});
