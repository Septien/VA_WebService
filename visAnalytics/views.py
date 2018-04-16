from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template.loader import render_to_string
from visAnalytics.handlers import histogram
from django.conf import settings

def index( request ):
    """
    It is call when the client connects for the first time. Fullfils the template file
    with all the corresponding urls and data, and returns it.
    """
    print(settings.STATIC_URL)
    return render(request, 'base_template.html')

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

