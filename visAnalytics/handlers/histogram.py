"""
Class for handling the operations related to the compute of the histogram.
"""
import math as m

class Histogram():
    """
    Handles all the operations necessary for the compute of the histogram.
    The members are:
        -data: contain the numbers on which the histogram is to be made.
        -frequencies: The frequencie of each class.
        -classesInterval: The interval that covers each class.
        -minFreq: The minimum of the frequencies.
        -maxFreq: The maximum of the frequencies
        -xAxisRange: The interval of the x axis.
        -binWdith: The width of each class.
        -numBins: The number of classes.
    """
    def __init__(self):
        self.data = []
        self.frequencies = []
        self.classesInterval = []
        self.minFreq = 0
        self.maxFreq = 0
        self.xAxisRange = []
        self.binWidth = 0
        self.numBins = 0

    def loadDataFromFile(self, filename):
        """
        Loads the data and computes the range of the column
        """
        # Load
        with open(dbName) as dataFile:
            for line in dataFile:
                row = line.split(",")
                d = row[i]
                if (d != '?'):
                    data.append(data)
        # Sort for further computation
        data.sort()
        # Get the range
        self.xAxisRange = [data[0], data[-1]]

    def computeNumClass(self):
        """
        Computes the number of classes (bins) and, its length, in the histogram using the 
        Freedman-Diaconis formula:
            C = 2(IQ)n^(-1/3)
        Where: IQ = interquatile range; n -> number of data
        """
        # Get the number of data
        n = data.length()
        # For IQR
        # First, compute the position of the first and third quartile
        fQPos = ( (n - 1) / 4 ) + 1
        tQPos = ( (3 * (n - 1)) / 4 ) + 1
        # Get the quartile
        firstQ = data[fQPos]
        thirdQ 0 data[tQPos]
        # Compute the IQR
        IQR = thirdQ - firstQ
        # Compute the number of classes and its length
        self.numBins = 2 * IQR * m.pow(n, -1/3)
        self.binWidth = (self.data[-1] - self.data[0]) / self.numBins
        # Fill the frequencies array with zero
        for i in range(self.numBins):
            self.frequencies.append(0)

    def ComputeClassesIntervals(self):
        """
        Computes the intervals of each class based on the number of bins and the class width
        """
        lower = 0
        upper = 0
        x = data[0]
        for i in range(1, self.numBins):
            lower = x
            x = data[0] + i * self.binWidth
            upper = x
            self.classesInterval.push([lower, upper])

    def computeFreq(self):
        """
        Compute the frequencies of the histogram and its maximum and minimum
        """
        for x in self.data:
            for interval in self.classesInterval:
                if interval[0] <= x <= interval[1]:
                    self.frequencies[i] += 1
                    break

        self.minFreq = frequencies[0]
        self.maxFreq = frequencies[1]
        for f in frequencies:
            if f < self.minFreq:
                self.minFreq = f
            elif f > self.maxFreq:
                self.maxFreq = f

    def computeHistogram(self):
        """
        """
        if not self.data:
            return False

        self.computeNumClass()
        self.ComputeClassesIntervals()
        self.computeFreq()

    def getFrequencies(self):
        """
        """
        return self.frequencies.copy()

    def getXAxisRange(self):
        """
        """
        return self.xAxisRange.copy()

    def getHistogramData(self):
        """
        Returns the number and width of the classes, and the maximum and minimum of the frequencies
        """
        return (self.numBins, self.binWidth, self.minFreq, self.maxFreq)

    def getNumData(self):
        """
        Returns the number of data in the row
        """
        return len(self.data)

