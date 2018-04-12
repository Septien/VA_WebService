from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template.loader import render_to_string
#import handlers.histogram as h
#from visAnalytics import handlers as h
from visAnalytics.handlers import histogram

# Create your views here.
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
    needHtml = bool(request.GET.get('needhtml'))

    # Por el momento, supondremos que la base de datos es un archivo
    
    # Compute the histogram
    hist = histogram.Histogram()
    hist.loadDataFromFile(dbName, axis)
    hist.computeHistogram()
    # Get the corresponding data
    frequencies = hist.getFrequencies()
    xAxisRange = hist.getXAxisRange()
    (numBins, binWidth, minFreq, maxFreq) = hist.getHistogramData()
    n = hist.getNumData()

    template = ""
    histogramid = "histogramplot" + str(axis)
    if needHtml:
        context = {
            "histogramid": histogramid,
            "minB": 1,
            "maxB": n,
            "numbins": numBins
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
        "histogramid": histogramid
    }

    return JsonResponse(json)

