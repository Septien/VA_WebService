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

    // Get url for the graph
    /*url = "/va/" + graph;*/
    mainBody = $( "#main" );
    switch ( graph ) {
        case 'histogram':
            var selector = "#histogramplot";
            var plot = $( selector );
            if ( plot.length > 0 ) {
                plot.remove();
                break;
            }
            g = new Histogram();
            g.init( "", selector);
            break;
        default:
            break;
    }

    /* Send the request*/
    /*$.ajax({
        url: url,
        type: "GET",
        data: {
            graph: graph,
            database: database,
        },
        dataType: "json",
    })
    .done( function( json ) {

    })
    .fail( function( xhr, status, errorThrown ) {
        alert( "Graph could not be loaded." );
        console.log( "Error: " + errorThrown );
        console.log( "Status: " + status );
        console.dir( xhr );

    })
    .always( function( xhr, status ) {

    });*/
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
