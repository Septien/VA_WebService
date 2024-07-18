"""
Class for handling the operations related to the compute of the histogram.
"""
import math as m
import os

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
        -numAxes: Number of dimensions of the class.
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
        self.numAxes = 0

    def loadDataFromFile(self, filename, axis=0):
        """
        Loads the data and computes the range of the axis
        """
        path = os.path.dirname(os.path.realpath(__file__))
        # Load
        file = path + '/../data/' + filename + ".data"
        with open(file) as dataFile:
            for line in dataFile:
                row = line.split(",")
                self.numAxes = len(row)
                d = row[axis]
                try:
                    self.data.append(float(d))
                except:
                    pass
        # Sort for further computation
        self.data.sort()
        # Get the range
        self.xAxisRange = [self.data[0], self.data[-1]]

    def computeNumClass(self):
        """
        Computes the number of classes (bins) and, its length, in the histogram using the 
        Freedman-Diaconis formula:
            C = 2(IQ)n^(-1/3)
        Where: IQ = interquatile range; n -> number of data
        """
        # Get the number of data
        n = len(self.data)
        # For IQR
        # First, compute the position of the first and third quartile
        fQPos = ( (n - 1) / 4 ) + 1
        tQPos = ( (3 * (n - 1)) / 4 ) + 1
        # Get the quartiles
        firstQ = 0.0
        thirdQ = 0.0
        if fQPos == round(fQPos):
            firstQ = self.data[int(fQPos)]
        else:
            up = round(fQPos)
            firstQ = self.data[up - 1] + ((self.data[up] - self.data[up - 1]) / 4.0)
        if tQPos == round(tQPos):
            thirdQ = self.data[int(tQPos)]
        else:
            up = round(tQPos)
            thirdQ = self.data[up - 1] + (3 * (self.data[up] - self.data[up - 1]) / 4.0)
        # Compute the IQR
        IQR = thirdQ - firstQ
        # Compute the number of classes and its length
        n = int(2 * IQR * m.pow(n, -1/3)) 
        self.numBins = n if n > 0 else 1
        self.computeBinWidth()


    def computeBinWidth(self):
        """
        Computes the width of each class based on the number of bins. It also fills
        the of frequencies with zeros, based on the number of classes.
        """
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
        x = self.data[0]
        for i in range(self.numBins):
            lower = x
            x = self.data[0] + (i + 1) * self.binWidth
            upper = x
            interval = [lower, upper]
            self.classesInterval.append(interval.copy())


    def computeFreq(self):
        """
        Compute the frequencies of the histogram and its maximum and minimum
        """
        for x in self.data:
            i = 0
            for interval in self.classesInterval:
                if interval[0] <= x <= interval[1]:
                    self.frequencies[i] += 1
                    break
                i += 1

        self.minFreq = self.frequencies[0]
        self.maxFreq = self.frequencies[0]
        for f in self.frequencies:
            if f < self.minFreq:
                self.minFreq = f
            elif f > self.maxFreq:
                self.maxFreq = f

    def computeHistogram(self, bins=0):
        """
        Compute the hisotogram of the axis. If the bins variable is zero, 
        compute the number of classes using the mentioned formula. Else, 
        use the value of it.
        """
        if not self.data:
            return False

        if bins != 0:
            self.numBins = bins
            self.computeBinWidth()
        else:
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

    def getNumberOfAxes(self):
        """
        Returns the number of axes on the database
        """
        return self.numAxes
