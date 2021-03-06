from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template.loader import render_to_string
from visAnalytics.handlers import histogram, parallelcoordinates
from django.conf import settings

import os

def index( request ):
    """
    It is call when the client connects for the first time. Fullfils the template file
    with all the corresponding urls and data, and returns it.
    """
    print(settings.STATIC_URL)
    return render(request, 'base_template.html')

def getScript( request ):
    """
    The client send a request for the needed script (for the graphs).
    This function opens it, and then send it back to the client.
    """
    # Get the script name
    scriptName = request.GET.get('requestedScript')

    context = {
        "scriptName": scriptName
    }
    script = render_to_string("scriptTemplate.html", context)
    script = script.replace("\n", "")
    
    return JsonResponse( { "requestedScript": script } )


def HistogramHandler( request ):
    """
    The histogram handler on the server. This handler will be in charge of calculating the
    frequencies and all other data that the client requiers for displaying the histogram.
    The data are recieve via the query string. The parameters needed are:
        -The database (db) on which the analysis is being done.
        -The axis on which the histogram is to be calculated.
        -If the html template is requiered.
    The function will return to the client (in a JSON object), the following data:
        -HTML (if required).
        -Name of the fieldset of the html (if requiered).
        -X-axis range ([a, b]).
        -Minimum and maximum of the frequencies ([0, maxFreq]).
        -Name of the axis (if available).
        -Array of the frequencies.
        -Default number of classes (bins).
        -Width of each class.
    """
    #https://stackoverflow.com/questions/3711349/django-and-query-string-parameters
    # Get all the data
    dbName = request.GET.get('db')
    axis = int(request.GET.get('axis'))
    nbins = int(request.GET.get('bins'))
    needHtml = bool(int(request.GET.get('needhtml')))

    # Por el momento, supondremos que la base de datos es un archivo
    
    # Compute the histogram
    hist = histogram.Histogram()
    hist.loadDataFromFile(dbName, axis)
    hist.computeHistogram(nbins)
    # Get the corresponding data
    frequencies = hist.getFrequencies()
    xAxisRange = hist.getXAxisRange()
    (numBins, binWidth, minFreq, maxFreq) = hist.getHistogramData()
    n = hist.getNumData()
    numAxes = hist.getNumberOfAxes()

    template = ""
    histogramid = "histogramplot" + str(axis)
    if needHtml:
        axes = []
        for i in range(numAxes):
            axis = { "value": str(i + 1), "name": i + 1 }
            axes.append(axis)
        # Process template
        context = {
            "histogramid": histogramid,
            "minB": 1,
            "maxB": n,
            "numbins": numBins,
            "axes": axes
        }
        template = render_to_string("histogramTemplate.html", context)

    json = {
        "html": template,
        "xRange": xAxisRange,
        "minF": minFreq,
        "maxF": maxFreq,
        "freqs": frequencies,
        "binWidth": binWidth,
        "numbins": numBins,
        "histogramid": histogramid,
        "maxBins": n
    }

    return JsonResponse(json)

def parallelCoordinatesHandler( request ):
    """
    Handler for the parallel coordinates graph on the server. This handler calls the methods from 
    the class "parallelCoordinates", for the computation of all necessary data.
    The necessary parameters are recieved via the query string. Parameters are:
        -db: Name of the database.
        -coor: Coordinates to analyse.
        -needhtml: If the html is needed.
    The returned data is as follows:
        -html: The html code if needed.
        -data: The coordinates data.
        -numAxes: The dimension of the data.
        -ranges: The range of each axis.
        -labels: The name of each axis.
        -pCoordId: The id of the graph
    """
    # Get data from the query string
    dbName = request.GET.get('db')
    coord = request.GET.get('coor')
    needhtml = bool(int(request.GET.get('needhtml')))

    # Get ||-coord data
    pCoord = parallelcoordinates.ParallelCoordinates()
    pCoord.loadDataFromFile(dbName)

    data = pCoord.getData()
    ranges = pCoord.getRanges()
    labels = pCoord.getLabels()
    numAxes = pCoord.getNumberOfAxes()

    template = ""
    pCoordId = "parallelcoordinates1"
    if needhtml:
        template = render_to_string("pCoordinatesTemplate.html", context={ "plotid": pCoordId })

    json = {
        "html": template,
        "data": data,
        "ranges": ranges,
        "numAxes": numAxes,
        "pCoordId": pCoordId,
        "labels": labels
    }

    return JsonResponse(json)

